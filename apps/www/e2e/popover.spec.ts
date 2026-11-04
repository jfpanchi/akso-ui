import { expect, test, type Page } from "./fixtures";
import {
  expectMinTargetSize,
  expectNoAnimatedOutline,
  expectNoAxeViolations,
  expectNoHorizontalScroll,
  expectNoMotion,
  expectVisibleFocusRing,
  REFLOW_VIEWPORT,
} from "./helpers/a11y";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/popover");
});

const trigger = (page: Page) => page.getByRole("button", { name: "About delivery times" });

test("no axe violations, closed and open", async ({ page }) => {
  await expectNoAxeViolations(page);
  await trigger(page).click();
  await expect(page.getByRole("dialog", { name: "Delivery times" })).toBeVisible();
  await expectNoAxeViolations(page);
});
test("no axe violations on the docs page", async ({ page }) => {
  await page.goto("/docs/popover");
  await expectNoAxeViolations(page);
});

test("keyboard: Enter opens and moves focus inside; Escape closes and returns focus", async ({ page }) => {
  await trigger(page).focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Delivery times" });
  await expect(dialog).toBeVisible();
  await expect.poll(() => page.evaluate(() => !!document.activeElement?.closest('[data-slot="popover-content"]'))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger(page)).toBeFocused();
});

test("it also opens on hover (infotip pattern)", async ({ page }) => {
  await trigger(page).hover();
  await expect(page.getByRole("dialog", { name: "Delivery times" })).toBeVisible();
});

test("trigger: visible focus ring, at least 24px", async ({ page }) => {
  await trigger(page).focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await expectVisibleFocusRing(page);
  await expectMinTargetSize([trigger(page)], 44);
  await expectNoAnimatedOutline(page.locator("main"));
});

test.describe("320px: the open popover fits", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  test("fits the screen", async ({ page }) => {
    await trigger(page).click();
    const box = await page.getByRole("dialog").boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(REFLOW_VIEWPORT.width);
  });
});

test.describe("reduced motion", () => {
  test("no motion with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await trigger(page).click();
    await expectNoMotion(page, page.locator('[data-slot="popover-content"]'));
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/popover", "/docs/popover"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
