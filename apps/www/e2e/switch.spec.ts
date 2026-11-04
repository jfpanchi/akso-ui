import { expect, test, type Page } from "@playwright/test";
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
  await page.goto("/test/switch");
});

const emailSwitch = (page: Page) => page.getByRole("switch", { name: "Email notifications" });

test.describe("axe", () => {
  test("no violations (off, on, disabled)", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/switch");
    await expectNoAxeViolations(page);
  });
});

test.describe("keyboard", () => {
  test("Space and Enter toggle it, and the result is announced", async ({ page }) => {
    await emailSwitch(page).focus();
    await page.keyboard.press("Space");
    await expect(emailSwitch(page)).toHaveAttribute("aria-checked", "true");
    await expect(page.getByRole("status")).toHaveText("Email notifications on.");
    await page.keyboard.press("Enter");
    await expect(emailSwitch(page)).toHaveAttribute("aria-checked", "false");
  });
});

test.describe("visual accessibility", () => {
  test("every switch has a visible focus ring with at least 3:1 contrast", async ({ page }) => {
    await emailSwitch(page).focus();
    await page.keyboard.press("Shift+Tab");
    expect(await expectVisibleFocusRingsWhileTabbing(page, 2)).toHaveLength(2);
  });

  test("on is shown by position and a check mark, not only color", async ({ page }) => {
    const thumbX = () => emailSwitch(page).locator('[data-slot="switch-thumb"]').evaluate((el) => el.getBoundingClientRect().x);
    const offX = await thumbX();
    await expect(emailSwitch(page).locator("svg")).toBeHidden();
    await emailSwitch(page).click();
    await expect(emailSwitch(page).locator("svg")).toBeVisible();
    await expect.poll(thumbX).toBeGreaterThan(offX + 10);
  });

  test("the track is at least 24px tall and 44px wide", async ({ page }) => {
    const box = await emailSwitch(page).boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(24);
    expect(box!.width).toBeGreaterThanOrEqual(44);
    await expectMinTargetSize(await page.locator('[data-slot="switch-label"]').all(), 44);
  });

  test("the focus ring appears immediately", async ({ page }) => {
    await expectNoAnimatedOutline(page.locator("main"));
  });
});

test.describe("reduced motion", () => {
  test("the thumb does not slide with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await emailSwitch(page).click();
    await expectNoMotion(page, page.locator("main"));
  });
  test("control: it slides without the preference", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const duration = await emailSwitch(page).locator('[data-slot="switch-thumb"]').evaluate((el) => getComputedStyle(el).transitionDuration);
    expect(Number.parseFloat(duration)).toBeGreaterThan(0);
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/switch", "/docs/switch"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
