import { expect, test, type Page } from "./fixtures";
import {
  expectNoAnimatedOutline,
  expectNoAxeViolations,
  expectNoHorizontalScroll,
  expectNoMotion,
  expectVisibleFocusRing,
  REFLOW_VIEWPORT,
  waitForAnimations,
} from "./helpers/a11y";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/preview-card");
});

const link = (page: Page) => page.getByRole("link", { name: "Base UI" });
const card = (page: Page) => page.locator('[data-slot="preview-card-content"]');

test.describe("axe", () => {
  test("no violations, closed", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
  test("no violations, open", async ({ page }) => {
    await link(page).hover();
    await expect(card(page)).toBeVisible();
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/preview-card");
    await expectNoAxeViolations(page);
  });
});

test.describe("keyboard", () => {
  test("focus opens the preview; Escape closes it and focus stays on the link", async ({ page }) => {
    await link(page).focus();
    await expect(card(page)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(card(page)).toBeHidden();
    await expect(link(page)).toBeFocused();
  });
  test("Tab goes to the next link, not into the preview, and the preview closes", async ({ page }) => {
    await link(page).focus();
    await expect(card(page)).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "shadcn registry" })).toBeFocused();
    await expect(card(page)).toBeHidden();
  });
});

test.describe("content on hover (WCAG 1.4.13)", () => {
  test("the pointer can move onto the preview without it closing", async ({ page }) => {
    await link(page).hover();
    await expect(card(page)).toBeVisible();
    await waitForAnimations(page);
    await card(page).hover();
    await page.waitForTimeout(500);
    await expect(card(page)).toBeVisible();
  });
});

test.describe("visual accessibility", () => {
  test("the link has a focus ring with at least 3:1 contrast", async ({ page }) => {
    await link(page).focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(link(page)).toBeFocused();
    await expectVisibleFocusRing(page);
  });
  test("the focus ring appears immediately", async ({ page }) => {
    await expectNoAnimatedOutline(page.locator("main"));
  });
});

test.describe("reduced motion", () => {
  test("no motion with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await link(page).hover();
    await expect(card(page)).toBeVisible();
    await expectNoMotion(page, page.locator("body"));
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/preview-card", "/docs/preview-card"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
  test("the open preview fits", async ({ page }) => {
    await link(page).hover();
    await expect(card(page)).toBeVisible();
    await waitForAnimations(page);
    const box = (await card(page).boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(REFLOW_VIEWPORT.width);
  });
});
