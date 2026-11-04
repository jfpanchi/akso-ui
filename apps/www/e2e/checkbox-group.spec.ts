import { expect, test } from "./fixtures";
import {
  expectMinTargetSize,
  expectNoAnimatedOutline,
  expectNoAxeViolations,
  expectNoHorizontalScroll,
  expectNoMotion,
  expectVisibleFocusRingsWhileTabbing,
  REFLOW_VIEWPORT,
} from "./helpers/a11y";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/checkbox-group");
});

test.describe("axe", () => {
  test("no violations on the test page", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/checkbox-group");
    await expectNoAxeViolations(page);
  });
});

test.describe("keyboard", () => {
  test("the group is named by its legend; each checkbox is a Tab stop; Space toggles", async ({ page }) => {
    await expect(page.getByRole("group", { name: "How should we contact you?" })).toBeVisible();
    await page.getByRole("checkbox", { name: "Email" }).focus();
    await page.keyboard.press("Tab");
    const sms = page.getByRole("checkbox", { name: "Text message" });
    await expect(sms).toBeFocused();
    await page.keyboard.press("Space");
    await expect(sms).toHaveAttribute("aria-checked", "true");
  });
});

test.describe("visual accessibility", () => {
  test("every checkbox has a visible focus ring with at least 3:1 contrast", async ({ page }) => {
    await page.getByRole("checkbox", { name: "Email" }).focus();
    await page.keyboard.press("Shift+Tab");
    expect(await expectVisibleFocusRingsWhileTabbing(page, 3)).toHaveLength(3);
  });
  test("rows are 44px and the focus ring appears immediately", async ({ page }) => {
    await expectMinTargetSize(await page.locator('[data-slot="checkbox-label"]').all(), 44);
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
  for (const path of ["/test/checkbox-group", "/docs/checkbox-group"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
