import { expect, test, type Page } from "@playwright/test";
import { expectMinTargetSize, expectNoAxeViolations, expectNoHorizontalScroll, expectNoMotion, focusIsInside, REFLOW_VIEWPORT, waitForAnimations } from "./helpers/a11y";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/drawer");
});

async function open(page: Page, name = "Show filters") {
  const trigger = page.getByRole("button", { name });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  return { trigger, dialog };
}

test("no axe violations, closed and open", async ({ page }) => {
  await expectNoAxeViolations(page);
  await open(page);
  await expectNoAxeViolations(page);
});
test("no axe violations on the docs page", async ({ page }) => {
  await page.goto("/docs/drawer");
  await expectNoAxeViolations(page);
});

test("named dialog; focus trapped; Escape closes and returns focus", async ({ page }) => {
  const { trigger, dialog } = await open(page);
  await expect(dialog).toHaveAccessibleName("Filters");
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab");
    expect(await focusIsInside(page, '[role="dialog"]')).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("there is always a close button (no swipe needed), on the side and on the bottom drawer", async ({ page }) => {
  for (const name of ["Show filters", "Share"]) {
    const { trigger, dialog } = await open(page, name);
    const close = dialog.getByRole("button", { name: "Close" });
    await expectMinTargetSize([close], 44);
    await close.click();
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  }
});

test("the drawer does not slide with prefers-reduced-motion: reduce", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const { dialog } = await open(page);
  await expectNoMotion(page, dialog);
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/drawer", "/docs/drawer"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
  test("the open drawer fits", async ({ page }) => {
    const { dialog } = await open(page);
    await waitForAnimations(page); // measure after the slide-in
    const box = (await dialog.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(REFLOW_VIEWPORT.width + 1);
  });
});
