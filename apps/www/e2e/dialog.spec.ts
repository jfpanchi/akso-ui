import { expect, test, type Page } from "@playwright/test";
import {
  expectMinTargetSize,
  expectNoAnimatedOutline,
  expectNoAxeViolations,
  expectNoHorizontalScroll,
  expectNoMotion,
  expectVisibleFocusRing,
  expectVisibleFocusRingsWhileTabbing,
  focusIsInside,
  REFLOW_VIEWPORT,
} from "./helpers/a11y";

async function openWithKeyboard(page: Page) {
  const trigger = page.getByRole("button", { name: "Edit profile" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Edit profile" });
  await expect(dialog).toBeVisible();
  return { trigger, dialog };
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
        expect(await focusIsInside(page, '[role="dialog"]'), `${key} press ${i + 1}`).toBe(true);
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
  test("every element in the dialog has a visible focus ring with at least 3:1 contrast", async ({ page }) => {
    await openWithKeyboard(page);
    await expectVisibleFocusRing(page); // the name field, focused on open
    const labels = await expectVisibleFocusRingsWhileTabbing(page, 4);
    expect(labels).toEqual(expect.arrayContaining(["Cancel", "Save", "Close"]));
  });

  test("the trigger's focus ring has at least 3:1 contrast against the page", async ({ page }) => {
    await page.getByRole("button", { name: "Button before the dialog" }).focus();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Edit profile" })).toBeFocused();
    await expectVisibleFocusRing(page);
  });

  test("the focus ring appears immediately (outline is never transitioned)", async ({ page }) => {
    const { dialog } = await openWithKeyboard(page);
    await expectNoAnimatedOutline(dialog);
  });

  test("buttons are at least 24×24px", async ({ page }) => {
    const { dialog } = await openWithKeyboard(page);
    // While the dialog is open the trigger is hidden from assistive technology, so find it by its slot.
    const trigger = page.locator('[data-slot="dialog-trigger"]');
    await expectMinTargetSize([trigger, ...(await dialog.getByRole("button").all())]);
  });
});

test.describe("reduced motion", () => {
  test("no transitions or animations with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const { dialog } = await openWithKeyboard(page);
    await expectNoMotion(page, dialog);
    await expectNoMotion(page, page.locator('[data-slot="dialog-backdrop"]'));
  });

  test("control: the dialog does animate without the preference", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const { dialog } = await openWithKeyboard(page);
    const duration = await dialog.evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(Number.parseFloat(duration)).toBeGreaterThan(0);
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });

  for (const path of ["/test/dialog", "/docs/dialog"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }

  test("the open dialog fits the width and all its content can be reached", async ({ page }) => {
    const { dialog } = await openWithKeyboard(page);
    const box = await dialog.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(REFLOW_VIEWPORT.width);
    await expectNoHorizontalScroll(page, page.locator('[data-slot="dialog-viewport"]'));
    for (const name of ["Cancel", "Save", "Close"]) {
      const button = dialog.getByRole("button", { name, exact: true });
      await button.scrollIntoViewIfNeeded();
      await expect(button).toBeInViewport();
    }
  });

  test("a dialog taller than the screen scrolls vertically instead of being cut off", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 240 });
    const { dialog } = await openWithKeyboard(page);
    for (const target of [dialog.getByRole("heading", { name: "Edit profile" }), dialog.getByRole("button", { name: "Save" })]) {
      await target.scrollIntoViewIfNeeded();
      await expect(target).toBeInViewport();
    }
  });
});
