import { expect, test } from "./fixtures";
import { expectNoAxeViolations, expectNoHorizontalScroll, expectVisibleFocusRing, REFLOW_VIEWPORT } from "./helpers/a11y";

test("home page has no axe violations", async ({ page }) => {
  await page.goto("/");
  await expectNoAxeViolations(page);
});

test("the skip link is the first tab stop, is visible on focus and moves focus to the main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to main content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await expectVisibleFocusRing(page);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
});

test.describe("320px wide", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  test("home page has no horizontal scroll", async ({ page }) => {
    await page.goto("/");
    await expectNoHorizontalScroll(page);
  });
});
