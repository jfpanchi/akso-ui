/**
 * Reusable accessibility checks for Playwright.
 * Every component spec should use these, so all components meet the same bar.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, type Locator, type Page } from "@playwright/test";
import { contrastRatio, WCAG_AA } from "akso-ui/tokens";

export const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

/**
 * Waits for running transitions/animations, so checks measure final colors, not a frame mid-fade.
 * Infinite animations (spinners) are ignored, and cancelled ones (element removed) are tolerated.
 */
export async function waitForAnimations(page: Page, scope?: Locator) {
  const wait = (root: Element | Document) => {
    const animations = (root instanceof Document ? root.getAnimations() : root.getAnimations({ subtree: true })).filter(
      (a) => a.effect?.getComputedTiming().endTime !== Infinity,
    );
    return Promise.all(animations.map((a) => a.finished.catch(() => undefined))).then(() => undefined);
  };
  if (scope) await scope.evaluate(wait);
  else await page.evaluate(wait, await page.evaluateHandle(() => document));
}

/** Runs axe (WCAG 2.0–2.2 A/AA) on the page, or on `include` only. Lists every violation on failure. */
export async function expectNoAxeViolations(page: Page, { include, disableRules = [] }: { include?: string; disableRules?: string[] } = {}) {
  await waitForAnimations(page);
  let builder = new AxeBuilder({ page }).withTags(WCAG_TAGS);
  if (include) builder = builder.include(include);
  if (disableRules.length) builder = builder.disableRules(disableRules);
  const results = await builder.analyze();
  const summary = results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(" ")).join(", ")})`);
  expect(summary, "axe violations").toEqual([]);
}

export interface FocusRing {
  label: string;
  focusVisible: boolean;
  outlineStyle: string;
  outlineWidth: number;
  outlineColor: string;
  /** First non-transparent background behind the element (where the outline is drawn). */
  background: string;
}

/** Reads the focus ring of the focused element, after any transition has finished. */
export async function readFocusRing(page: Page): Promise<FocusRing> {
  return page.evaluate(async () => {
    const el = document.activeElement as HTMLElement;
    const finite = el.getAnimations().filter((a) => a.effect?.getComputedTiming().endTime !== Infinity);
    await Promise.all(finite.map((a) => a.finished.catch(() => undefined)));
    const style = getComputedStyle(el);
    let background = getComputedStyle(document.documentElement).backgroundColor;
    for (let node = el.parentElement; node; node = node.parentElement) {
      const color = getComputedStyle(node).backgroundColor;
      if (color !== "rgba(0, 0, 0, 0)" && color !== "transparent") {
        background = color;
        break;
      }
    }
    return {
      label: el.getAttribute("aria-label") ?? el.textContent?.trim() ?? el.tagName,
      focusVisible: el.matches(":focus-visible"),
      outlineStyle: style.outlineStyle,
      outlineWidth: Number.parseFloat(style.outlineWidth),
      outlineColor: style.outlineColor,
      background,
    };
  });
}

/**
 * Asserts the focused element shows a :focus-visible outline at least 2px wide
 * with at least 3:1 contrast against what is behind it (WCAG 2.4.7, 1.4.11).
 * Focus the element with the keyboard first, so :focus-visible applies.
 */
export async function expectVisibleFocusRing(page: Page): Promise<FocusRing> {
  const ring = await readFocusRing(page);
  expect(ring.focusVisible, `${ring.label}: :focus-visible`).toBe(true);
  expect(ring.outlineStyle, `${ring.label}: outline-style`).not.toBe("none");
  expect(ring.outlineWidth, `${ring.label}: outline-width`).toBeGreaterThanOrEqual(2);
  const ratio = contrastRatio(ring.outlineColor, ring.background);
  expect(ratio, `${ring.label}: ${ring.outlineColor} on ${ring.background} = ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(WCAG_AA.nonText);
  return ring;
}

/**
 * Presses Tab `presses` times and checks the focus ring of every element reached.
 * Returns the labels visited.
 */
export async function expectVisibleFocusRingsWhileTabbing(page: Page, presses: number): Promise<string[]> {
  // Opening animations (scale/opacity) can still be running, e.g. on slower CI machines.
  await waitForAnimations(page);
  const labels: string[] = [];
  for (let i = 0; i < presses; i++) {
    await page.keyboard.press("Tab");
    labels.push((await expectVisibleFocusRing(page)).label);
  }
  return labels;
}

/** The focus ring must appear at once: outline-color is never transitioned. */
export async function expectNoAnimatedOutline(scope: Locator) {
  const animated = await scope.evaluate((root) =>
    [root, ...root.querySelectorAll("*")]
      .filter((el) => el.matches("a, button, input, select, textarea, [tabindex]"))
      .flatMap((el) => {
        const style = getComputedStyle(el);
        const props = style.transitionProperty.split(",").map((p) => p.trim());
        const durations = style.transitionDuration.split(",").map((d) => Number.parseFloat(d));
        return props.filter((_, i) => (durations[i % durations.length] ?? 0) > 0);
      }),
  );
  for (const prop of animated) expect(prop, "transitioned property on a focusable element").not.toMatch(/outline|^all$/);
}

/** Every element inside `scope` has no transition and no animation (use with emulateMedia({ reducedMotion: "reduce" })). */
export async function expectNoMotion(page: Page, scope: Locator) {
  const motion = await scope.evaluate((root) => {
    const offenders = [root, ...root.querySelectorAll("*")].flatMap((el) => {
      const style = getComputedStyle(el);
      const transition = style.transitionDuration.split(",").some((d) => Number.parseFloat(d) > 0);
      const animation = style.animationName !== "none" && Number.parseFloat(style.animationDuration) > 0;
      return transition || animation ? [`${el.tagName.toLowerCase()}.${el.getAttribute("class") ?? ""}`.slice(0, 120)] : [];
    });
    return offenders;
  });
  expect(motion, "elements with motion under prefers-reduced-motion").toEqual([]);
  const running = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running").length);
  expect(running, "running animations").toBe(0);
}

/** No horizontal scroll on the page (or inside `scroller`), as required by WCAG 1.4.10 Reflow at 320px. */
export async function expectNoHorizontalScroll(page: Page, scroller?: Locator) {
  const pageOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(pageOverflow, "page horizontal overflow (px)").toBeLessThanOrEqual(0);
  if (scroller) {
    const overflow = await scroller.evaluate((el) => el.scrollWidth - el.clientWidth);
    expect(overflow, "container horizontal overflow (px)").toBeLessThanOrEqual(0);
  }
}

/** Each target is at least `min`×`min` CSS px (WCAG 2.5.8 Target Size (Minimum) = 24). */
export async function expectMinTargetSize(targets: Locator[], min = 24) {
  expect(targets.length, "number of targets").toBeGreaterThan(0);
  // Measure the final size, not a frame of an opening animation (popups scale from 95%).
  await waitForAnimations(targets[0]!.page());
  for (const target of targets) {
    const box = await target.boundingBox();
    const name = (await target.getAttribute("aria-label")) ?? (await target.textContent())?.trim() ?? "target";
    expect(box, `${name}: visible`).not.toBeNull();
    expect(box!.width, `${name}: width`).toBeGreaterThanOrEqual(min);
    expect(box!.height, `${name}: height`).toBeGreaterThanOrEqual(min);
  }
}

/** Is focus inside `selector`? Waits two frames for focus-guard redirects (used by focus traps). */
export async function focusIsInside(page: Page, selector: string) {
  return page.evaluate(
    (sel) =>
      new Promise<boolean>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve(!!document.activeElement?.closest(sel)))),
      ),
    selector,
  );
}

/** Viewport equivalent to 400% zoom on a 1280px-wide screen. */
export const REFLOW_VIEWPORT = { width: 320, height: 568 };
