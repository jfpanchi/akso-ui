import { expect, test } from "./fixtures";
import {
  expectMinTargetSize,
  expectNoAnimatedOutline,
  expectNoAxeViolations,
  expectNoHorizontalScroll,
  expectNoMotion,
  expectVisibleFocusRing,
  expectVisibleFocusRingsWhileTabbing,
  REFLOW_VIEWPORT,
} from "./helpers/a11y";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/button");
});

test.describe("axe", () => {
  test("no violations on the test page", async ({ page }) => {
    await expectNoAxeViolations(page);
  });

  test("no violations while loading", async ({ page }) => {
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByRole("button", { name: "Saving" })).toBeVisible();
    await expectNoAxeViolations(page);
  });

  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/button");
    await expectNoAxeViolations(page);
  });
});

test.describe("keyboard and loading", () => {
  test("loading keeps focus on the same button, renames it, then announces the result", async ({ page }) => {
    const button = page.getByRole("button", { name: "Save changes" });
    await button.focus();
    await page.keyboard.press("Enter");
    const loading = page.getByRole("button", { name: "Saving" });
    await expect(loading).toBeFocused();
    await expect(loading).toHaveAttribute("aria-disabled", "true");
    await expect(page.getByRole("button", { name: "Save changes" })).toBeFocused();
    await expect(page.getByRole("status")).toHaveText("Changes saved.");
  });

  test("Tab skips disabled buttons", async ({ page }) => {
    await page.getByRole("button", { name: "Settings" }).focus();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Save changes" })).toBeFocused();
  });
});

test.describe("visual accessibility", () => {
  test("every variant and size has a visible focus ring with at least 3:1 contrast", async ({ page }) => {
    await page.getByRole("button", { name: "Primary" }).focus();
    await page.keyboard.press("Shift+Tab");
    const labels = await expectVisibleFocusRingsWhileTabbing(page, 7);
    expect(labels).toEqual(["Primary", "Secondary", "Delete", "Ghost", "Small", "Settings", "Save changes"]);
  });

  test("the loading button keeps a visible focus ring", async ({ page }) => {
    await page.getByRole("button", { name: "Save changes" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: "Saving" })).toBeFocused();
    await expectVisibleFocusRing(page);
  });

  test("the focus ring appears immediately", async ({ page }) => {
    await expectNoAnimatedOutline(page.locator("main"));
  });

  test("every button is at least 24×24px", async ({ page }) => {
    await expectMinTargetSize(await page.locator('[data-slot="button"]').all());
  });
});

test.describe("reduced motion", () => {
  test("the loading spinner does not spin with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.getByRole("button", { name: "Save changes" }).click();
    await expectNoMotion(page, page.getByRole("button", { name: "Saving" }));
  });

  test("control: the spinner spins without the preference", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.getByRole("button", { name: "Save changes" }).click();
    const name = await page.getByRole("button", { name: "Saving" }).locator("svg").evaluate((el) => getComputedStyle(el).animationName);
    expect(name).not.toBe("none");
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });

  for (const path of ["/test/button", "/docs/button"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
