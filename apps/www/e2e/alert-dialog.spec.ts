import { expect, test, type Page } from "@playwright/test";
import {
  expectMinTargetSize,
  expectNoAnimatedOutline,
  expectNoAxeViolations,
  expectNoHorizontalScroll,
  expectNoMotion,
  expectVisibleFocusRingsWhileTabbing,
  focusIsInside,
  REFLOW_VIEWPORT,
} from "./helpers/a11y";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/alert-dialog");
});

async function open(page: Page) {
  const trigger = page.getByRole("button", { name: "Delete account" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("alertdialog", { name: "Delete your account?" });
  await expect(dialog).toBeVisible();
  return { trigger, dialog };
}

test.describe("axe", () => {
  test("no violations closed", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
  test("no violations open", async ({ page }) => {
    await open(page);
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/alert-dialog");
    await expectNoAxeViolations(page);
  });
});

test.describe("keyboard", () => {
  test("focus starts on the safe choice", async ({ page }) => {
    await open(page);
    await expect(page.getByRole("button", { name: "Keep my account" })).toBeFocused();
  });
  test("focus is trapped", async ({ page }) => {
    await open(page);
    for (const key of ["Tab", "Shift+Tab"]) {
      for (let i = 0; i < 6; i++) {
        await page.keyboard.press(key);
        expect(await focusIsInside(page, '[role="alertdialog"]')).toBe(true);
      }
    }
  });
  test("Escape cancels and focus returns to the trigger", async ({ page }) => {
    const { trigger, dialog } = await open(page);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });
  test("clicking the backdrop does not close it", async ({ page }) => {
    const { dialog } = await open(page);
    await page.mouse.click(5, 5);
    await expect(dialog).toBeVisible();
  });
  test("confirming runs the action, closes and returns focus", async ({ page }) => {
    const { trigger, dialog } = await open(page);
    await dialog.getByRole("button", { name: "Delete account" }).click();
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(page.getByRole("status")).toHaveText("Account deleted.");
  });
});

test.describe("visual accessibility", () => {
  test("both buttons have a visible focus ring with at least 3:1 contrast", async ({ page }) => {
    await open(page);
    await page.keyboard.press("Shift+Tab");
    const labels = await expectVisibleFocusRingsWhileTabbing(page, 2);
    expect(labels).toEqual(expect.arrayContaining(["Keep my account", "Delete account"]));
  });
  test("buttons are 44px and the focus ring appears immediately", async ({ page }) => {
    const { dialog } = await open(page);
    await expectMinTargetSize(await dialog.getByRole("button").all(), 44);
    await expectNoAnimatedOutline(dialog);
  });
});

test.describe("reduced motion", () => {
  test("no motion with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const { dialog } = await open(page);
    await expectNoMotion(page, dialog);
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/alert-dialog", "/docs/alert-dialog"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
  test("the open dialog fits", async ({ page }) => {
    const { dialog } = await open(page);
    const box = await dialog.boundingBox();
    expect(box!.x + box!.width).toBeLessThanOrEqual(REFLOW_VIEWPORT.width);
    await expectNoHorizontalScroll(page, page.locator('[data-slot="alert-dialog-viewport"]'));
  });
});
