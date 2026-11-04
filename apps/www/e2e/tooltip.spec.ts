import { expect, test, type Page } from "./fixtures";
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
  await page.goto("/test/tooltip");
});

const tip = (page: Page) => page.locator('[data-slot="tooltip-content"]');

test("no axe violations, closed and open", async ({ page }) => {
  await expectNoAxeViolations(page);
  await page.getByRole("button", { name: "Bold" }).focus();
  await expect(tip(page)).toBeVisible();
  await expectNoAxeViolations(page);
});
test("no axe violations on the docs page", async ({ page }) => {
  await page.goto("/docs/tooltip");
  await expectNoAxeViolations(page);
});

test("icon buttons are named by the tooltip text; a text button keeps its text", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Bold" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Italic" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Save", exact: true })).not.toHaveAttribute("aria-label");
});

test("appears on keyboard focus; Escape hides it and focus stays", async ({ page }) => {
  await page.getByRole("button", { name: "Bold" }).focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await expect(tip(page)).toHaveText("Bold");
  await page.keyboard.press("Escape");
  await expect(tip(page)).toBeHidden();
  await expect(page.getByRole("button", { name: "Bold" })).toBeFocused();
});

test("stays open while the pointer moves onto it (WCAG 1.4.13)", async ({ page }) => {
  await page.getByRole("button", { name: "Bold" }).hover();
  await expect(tip(page)).toBeVisible();
  const box = (await tip(page).boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 5 });
  await page.waitForTimeout(400);
  await expect(tip(page)).toBeVisible();
});

test("triggers are at least 24px and the focus ring is visible", async ({ page }) => {
  await expectMinTargetSize(await page.getByRole("toolbar").getByRole("button").all());
  await page.getByRole("button", { name: "Bold" }).focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await expectVisibleFocusRing(page);
  await expectNoAnimatedOutline(page.locator("main"));
});

test.describe("reduced motion", () => {
  test("no motion with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.getByRole("button", { name: "Bold" }).focus();
    await expectNoMotion(page, page.locator("main"));
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/tooltip", "/docs/tooltip"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
