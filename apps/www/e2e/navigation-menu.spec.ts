import { expect, test } from "@playwright/test";
import { expectMinTargetSize, expectNoAxeViolations, expectNoHorizontalScroll, expectNoMotion, expectVisibleFocusRing, REFLOW_VIEWPORT } from "./helpers/a11y";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/navigation-menu");
});

test("no axe violations, closed and open", async ({ page }) => {
  await expectNoAxeViolations(page);
  await page.getByRole("button", { name: "Products" }).click();
  await expect(page.getByRole("link", { name: "Phones" })).toBeVisible();
  // Base UI focus guards are excluded by the shared helper (see helpers/a11y.ts).
  await expectNoAxeViolations(page);
});
test("no axe violations on the docs page", async ({ page }) => {
  await page.goto("/docs/navigation-menu");
  await expectNoAxeViolations(page);
});

test("named navigation with real links; current page marked", async ({ page }) => {
  await expect(page.getByRole("navigation", { name: "Store" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Offers" })).toHaveAttribute("aria-current", "page");
});

test("keyboard: Enter opens, Tab reaches the links, Escape closes and returns focus", async ({ page }) => {
  const trigger = page.getByRole("button", { name: "Products" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Phones" })).toBeFocused();
  await expectVisibleFocusRing(page);
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
});

test("items are 44px tall", async ({ page }) => {
  await expectMinTargetSize(await page.locator('[data-slot="navigation-menu-trigger"], [data-slot="navigation-menu-link"]').all(), 44);
});

test("no motion with prefers-reduced-motion: reduce", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Products" }).click();
  await expectNoMotion(page, page.locator('[data-slot="navigation-menu-popup"]'));
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/navigation-menu", "/docs/navigation-menu"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
  test("the open panel fits", async ({ page }) => {
    await page.getByRole("button", { name: "Products" }).click();
    const box = (await page.locator('[data-slot="navigation-menu-popup"]').boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(REFLOW_VIEWPORT.width);
  });
});
