import { contrastRatio, WCAG_AA } from "akso-ui/tokens";
import { expect, test, type Page } from "./fixtures";
import {
  expectNoAnimatedOutline,
  expectNoAxeViolations,
  expectNoHorizontalScroll,
  expectNoMotion,
  expectVisibleFocusRing,
  REFLOW_VIEWPORT,
} from "./helpers/a11y";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/scroll-area");
});

const notes = (page: Page) => page.getByRole("region", { name: "Release notes" });
const visits = (page: Page) => page.getByRole("region", { name: "Monthly visits" });

/** Skip link, then Tab: the first scroll area is the first stop in the main content. */
async function tabToNotes(page: Page) {
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
}

test.describe("axe", () => {
  test("no violations on the test page", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/scroll-area");
    await expectNoAxeViolations(page);
  });
});

test.describe("keyboard", () => {
  test("Tab reaches each scrolling region, named; the arrow keys and End scroll it", async ({ page }) => {
    await tabToNotes(page);
    await expect(notes(page)).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await expect.poll(() => notes(page).evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
    await page.keyboard.press("End");
    await expect.poll(() => notes(page).evaluate((el) => Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight)).toBe(true);
    await page.keyboard.press("Tab");
    await expect(visits(page)).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await expect.poll(() => visits(page).evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
  });
  test("a region with nothing to scroll is not in the Tab order", async ({ page }) => {
    await expect(page.getByRole("region", { name: "Short note" })).toHaveAttribute("tabindex", "-1");
  });
});

test.describe("visual accessibility", () => {
  test("the focused region shows a focus ring with at least 3:1 contrast", async ({ page }) => {
    await tabToNotes(page);
    await expectVisibleFocusRing(page);
  });
  test("scrollbars are visible without hovering, with a thumb at least 3:1 against its track", async ({ page }) => {
    const bar = page.locator('[data-slot="scroll-area-scrollbar"]').first();
    await expect(bar).toBeVisible();
    const { opacity, thumb, track } = await bar.evaluate((el) => ({
      opacity: getComputedStyle(el).opacity,
      track: getComputedStyle(el).backgroundColor,
      thumb: getComputedStyle(el.querySelector('[data-slot="scroll-area-thumb"]')!).backgroundColor,
    }));
    expect(opacity).toBe("1");
    expect(contrastRatio(thumb, track)).toBeGreaterThanOrEqual(WCAG_AA.nonText);
  });
  test("the focus ring appears immediately", async ({ page }) => {
    await expectNoAnimatedOutline(page.locator("main"));
  });
});

test.describe("reduced motion", () => {
  test("no motion with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expectNoMotion(page, page.locator("main"));
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/scroll-area", "/docs/scroll-area"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
