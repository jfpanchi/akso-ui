import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { contrastRatio, WCAG_AA } from "akso-ui/tokens";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

/** Waits for running transitions so axe measures final colors, not a frame mid-fade. */
async function waitForAnimations(page: Page) {
  await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
}

async function expectNoAxeViolations(page: Page) {
  await waitForAnimations(page);
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  const summary = results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(" ")).join(", ")})`);
  expect(summary, "axe violations").toEqual([]);
}

async function openWithKeyboard(page: Page) {
  const trigger = page.getByRole("button", { name: "Edit profile" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Edit profile" });
  await expect(dialog).toBeVisible();
  return { trigger, dialog };
}

/** Is focus inside the open dialog? Waits for focus-guard redirects. */
async function focusIsInsideDialog(page: Page) {
  return page.evaluate(
    () =>
      new Promise<boolean>((resolve) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(() => resolve(!!document.activeElement?.closest('[role="dialog"]'))),
        ),
      ),
  );
}

test.beforeEach(async ({ page }) => {
  await page.goto("/test/dialog");
});

test.describe("axe", () => {
  test("no violations with the dialog closed", async ({ page }) => {
    await expectNoAxeViolations(page);
  });

  test("no violations with the dialog open", async ({ page }) => {
    await openWithKeyboard(page);
    await expectNoAxeViolations(page);
  });

  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/dialog");
    await expectNoAxeViolations(page);
  });
});

test.describe("keyboard", () => {
  test("Escape closes the dialog and focus returns to the trigger", async ({ page }) => {
    const { trigger, dialog } = await openWithKeyboard(page);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("focus moves into the dialog on open", async ({ page }) => {
    await openWithKeyboard(page);
    await expect(page.getByLabel("Name")).toBeFocused();
  });

  test("Tab and Shift+Tab keep focus inside the dialog", async ({ page }) => {
    await openWithKeyboard(page);
    for (const key of ["Tab", "Shift+Tab"]) {
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press(key);
        expect(await focusIsInsideDialog(page), `${key} press ${i + 1}`).toBe(true);
      }
    }
  });

  test("focus returns to the trigger after Cancel, × and Save", async ({ page }) => {
    for (const name of ["Cancel", "Close", "Save"]) {
      const { trigger, dialog } = await openWithKeyboard(page);
      await dialog.getByRole("button", { name, exact: true }).click();
      await expect(dialog).toBeHidden();
      await expect(trigger, `after ${name}`).toBeFocused();
    }
  });

  test("saving announces a status message", async ({ page }) => {
    const { dialog } = await openWithKeyboard(page);
    await page.getByLabel("Name").fill("Grace Hopper");
    await page.keyboard.press("Enter");
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("status")).toHaveText("Profile saved.");
  });
});

test.describe("visual accessibility", () => {
  test("focus ring is visible with at least 3:1 contrast against what is behind it", async ({ page }) => {
    await openWithKeyboard(page);
    // Visit every element in the dialog with the keyboard so :focus-visible applies.
    const seen = new Set<string>();
    for (let i = 0; i < 6; i++) {
      const ring = await page.evaluate(async () => {
        const el = document.activeElement as HTMLElement;
        // Measure the final state, not a frame in the middle of a hover/color transition.
        await Promise.all(el.getAnimations().map((a) => a.finished));
        const style = getComputedStyle(el);
        let bg = "rgba(0, 0, 0, 0)";
        for (let node: HTMLElement | null = el.parentElement; node; node = node.parentElement) {
          const color = getComputedStyle(node).backgroundColor;
          if (color !== "rgba(0, 0, 0, 0)" && color !== "transparent") {
            bg = color;
            break;
          }
        }
        return {
          label: el.getAttribute("aria-label") ?? el.textContent?.trim() ?? el.tagName,
          focusVisible: el.matches(":focus-visible"),
          outlineStyle: style.outlineStyle,
          outlineWidth: Number.parseFloat(style.outlineWidth),
          outlineColor: style.outlineColor,
          background: bg,
        };
      });
      seen.add(ring.label);
      expect(ring.focusVisible, ring.label).toBe(true);
      expect(ring.outlineStyle, ring.label).not.toBe("none");
      expect(ring.outlineWidth, ring.label).toBeGreaterThanOrEqual(2);
      const ratio = contrastRatio(ring.outlineColor, ring.background);
      expect(ratio, `${ring.label}: ${ring.outlineColor} on ${ring.background}`).toBeGreaterThanOrEqual(WCAG_AA.nonText);
      await page.keyboard.press("Tab");
    }
    expect([...seen]).toEqual(expect.arrayContaining(["Cancel", "Save", "Close"]));
  });

  test("the trigger's focus ring has at least 3:1 contrast against the page", async ({ page }) => {
    await page.getByRole("button", { name: "Button before the dialog" }).focus();
    await page.keyboard.press("Tab");
    const trigger = page.getByRole("button", { name: "Edit profile" });
    await expect(trigger).toBeFocused();
    const { outline, background } = await trigger.evaluate((el) => ({
      outline: getComputedStyle(el).outlineColor,
      background: getComputedStyle(document.documentElement).backgroundColor,
    }));
    expect(contrastRatio(outline, background)).toBeGreaterThanOrEqual(WCAG_AA.nonText);
  });

  test("ring appears immediately: outline-color is never transitioned", async ({ page }) => {
    const { dialog } = await openWithKeyboard(page);
    const animated = await dialog.evaluate((popup) =>
      [...popup.querySelectorAll("button, input")].flatMap((el) => {
        const style = getComputedStyle(el);
        const props = style.transitionProperty.split(",").map((p) => p.trim());
        const durations = style.transitionDuration.split(",").map((d) => Number.parseFloat(d));
        // CSS repeats the duration list when it is shorter than the property list.
        return props.filter((_, i) => (durations[i % durations.length] ?? 0) > 0);
      }),
    );
    expect(animated.length, "control: some colors do transition").toBeGreaterThan(0);
    for (const prop of animated) expect(prop).not.toMatch(/outline|^all$/);
  });

  test("buttons are at least 24×24px", async ({ page }) => {
    const { dialog } = await openWithKeyboard(page);
    // While the dialog is open the trigger is hidden from assistive technology, so find it by its slot.
    const trigger = page.locator('[data-slot="dialog-trigger"]');
    const buttons = [trigger, ...(await dialog.getByRole("button").all())];
    expect(buttons.length).toBeGreaterThanOrEqual(4);
    for (const button of buttons) {
      const box = await button.boundingBox();
      const name = (await button.getAttribute("aria-label")) ?? (await button.textContent());
      expect(box, `${name}`).not.toBeNull();
      expect(box!.width, `${name} width`).toBeGreaterThanOrEqual(24);
      expect(box!.height, `${name} height`).toBeGreaterThanOrEqual(24);
    }
  });
});

test.describe("reduced motion", () => {
  test("no transitions or animations with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const { dialog } = await openWithKeyboard(page);
    const motion = await dialog.evaluate((popup) => {
      const backdrop = document.querySelector('[data-slot="dialog-backdrop"]')!;
      const durations = [popup, backdrop, ...popup.querySelectorAll("*")].map((el) => {
        const style = getComputedStyle(el);
        return { transition: style.transitionDuration, animation: style.animationName };
      });
      return { durations, running: document.getAnimations().length };
    });
    for (const { transition, animation } of motion.durations) {
      expect(transition.split(",").every((d) => Number.parseFloat(d) === 0)).toBe(true);
      expect(animation).toBe("none");
    }
    expect(motion.running).toBe(0);
  });

  test("control: the dialog does animate without the preference", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const { dialog } = await openWithKeyboard(page);
    const duration = await dialog.evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(Number.parseFloat(duration)).toBeGreaterThan(0);
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: { width: 320, height: 568 } });

  for (const path of ["/test/dialog", "/docs/dialog", "/"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test("the open dialog fits the width and all its content can be reached", async ({ page }) => {
    const { dialog } = await openWithKeyboard(page);
    const box = await dialog.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(320);
    const overflow = await page.evaluate(() => {
      const viewport = document.querySelector('[data-slot="dialog-viewport"]')!;
      return {
        page: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        viewport: viewport.scrollWidth - viewport.clientWidth,
      };
    });
    expect(overflow.page).toBeLessThanOrEqual(0);
    expect(overflow.viewport).toBeLessThanOrEqual(0);
    for (const name of ["Cancel", "Save", "Close"]) {
      const button = dialog.getByRole("button", { name, exact: true });
      await button.scrollIntoViewIfNeeded();
      await expect(button).toBeInViewport();
    }
  });

  test("a dialog taller than the screen scrolls vertically instead of being cut off", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 240 });
    const { dialog } = await openWithKeyboard(page);
    const title = dialog.getByRole("heading", { name: "Edit profile" });
    await title.scrollIntoViewIfNeeded();
    await expect(title).toBeInViewport();
    const save = dialog.getByRole("button", { name: "Save" });
    await save.scrollIntoViewIfNeeded();
    await expect(save).toBeInViewport();
  });
});
