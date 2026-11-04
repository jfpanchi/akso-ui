import { expect, test } from "@playwright/test";
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
  await page.goto("/test/radio-group");
});

const standard = "Standard: 3 to 5 days, free";
const express = "Express: 1 to 2 days, $5";

test.describe("axe", () => {
  test("no violations on the test page", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
  test("no violations after a submit without a choice", async ({ page }) => {
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Choose a delivery speed.")).toBeVisible();
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/radio-group");
    await expectNoAxeViolations(page);
  });
});

test.describe("keyboard", () => {
  test("one Tab stop; arrows move and choose; disabled option skipped", async ({ page }) => {
    await expect(page.getByRole("radiogroup", { name: "Delivery speed" })).toBeVisible();
    await page.getByRole("radio", { name: standard }).focus();
    await page.keyboard.press("ArrowDown");
    const ex = page.getByRole("radio", { name: express });
    await expect(ex).toBeFocused();
    await expect(ex).toHaveAttribute("aria-checked", "true");
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("radio", { name: standard })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Continue" })).toBeFocused();
  });

  test("submit without a choice moves focus into the group and announces the count", async ({ page }) => {
    await page.getByRole("button", { name: "Continue" }).click();
    await expect.poll(() => page.evaluate(() => !!document.activeElement?.closest('[role="radiogroup"]'))).toBe(true);
    await expect(page.locator("#akso-announcer")).toHaveText("1 field needs attention.");
  });
});

test.describe("visual accessibility", () => {
  test("the focused radio has a visible focus ring with at least 3:1 contrast", async ({ page }) => {
    await page.getByRole("radio", { name: standard }).focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expectVisibleFocusRing(page);
  });

  test("the chosen option shows a dot (a shape), not only a color", async ({ page }) => {
    await page.getByText(express).click();
    const dot = page.getByRole("radio", { name: express }).locator('[data-slot="radio-indicator"]');
    await expect(dot).toBeVisible();
    expect((await dot.boundingBox())!.width).toBeGreaterThanOrEqual(8);
  });

  test("rows are 44px and the focus ring appears immediately", async ({ page }) => {
    await expectMinTargetSize(await page.locator('[data-slot="radio-label"]').all(), 44);
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
  for (const path of ["/test/radio-group", "/docs/radio-group"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
