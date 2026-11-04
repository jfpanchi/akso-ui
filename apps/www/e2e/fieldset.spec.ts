import { expect, test } from "@playwright/test";
import {
  expectNoAnimatedOutline,
  expectNoAxeViolations,
  expectNoHorizontalScroll,
  expectNoMotion,
  expectVisibleFocusRingsWhileTabbing,
  REFLOW_VIEWPORT,
} from "./helpers/a11y";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/fieldset");
});

test.describe("axe", () => {
  test("no violations on the test page", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/fieldset");
    await expectNoAxeViolations(page);
  });
});

test.describe("keyboard", () => {
  test("the group is named by its legend and Tab moves through its fields in order", async ({ page }) => {
    const group = page.getByRole("group", { name: "Delivery address" });
    await expect(group).toBeVisible();
    await page.getByRole("textbox", { name: "Street and number" }).focus();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("textbox", { name: "City" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("textbox", { name: "Postal code" })).toBeFocused();
  });
});

test.describe("visual accessibility", () => {
  test("every field in the group has a visible focus ring with at least 3:1 contrast", async ({ page }) => {
    await page.getByRole("textbox", { name: "Street and number" }).focus();
    await page.keyboard.press("Shift+Tab");
    expect(await expectVisibleFocusRingsWhileTabbing(page, 3)).toHaveLength(3);
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
  for (const path of ["/test/fieldset", "/docs/fieldset"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
