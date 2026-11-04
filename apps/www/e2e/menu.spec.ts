import { expect, test, type Page } from "./fixtures";
import {
  expectMinTargetSize,
  expectNoAxeViolations,
  expectNoHorizontalScroll,
  expectNoMotion,
  expectVisibleFocusRing,
  REFLOW_VIEWPORT,
} from "./helpers/a11y";
import { contrastRatio, WCAG_AA } from "akso-ui/tokens";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/menu");
});

async function open(page: Page) {
  const trigger = page.getByRole("button", { name: "File actions" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const menu = page.getByRole("menu");
  await expect(menu).toBeVisible();
  return { trigger, menu };
}

test("no axe violations, closed and open", async ({ page }) => {
  await expectNoAxeViolations(page);
  await open(page);
  await expectNoAxeViolations(page);
});
test("no axe violations on the docs page", async ({ page }) => {
  await page.goto("/docs/menu");
  await expectNoAxeViolations(page);
});

test("keyboard: arrows, Enter runs an item, focus returns to the trigger", async ({ page }) => {
  const { trigger, menu } = await open(page);
  await expect(page.getByRole("menuitem", { name: "Rename" })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.getByRole("status")).toHaveText("Duplicate chosen.");
});

test("Escape closes and returns focus", async ({ page }) => {
  const { trigger, menu } = await open(page);
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("the highlighted item has a 2px ring with at least 3:1 contrast", async ({ page }) => {
  await open(page);
  const item = page.locator('[data-slot="menu-item"][data-highlighted]');
  await expect(item).toHaveCount(1);
  const s = await item.evaluate(async (el) => {
    await Promise.all(el.getAnimations().map((a) => a.finished.catch(() => undefined)));
    const c = getComputedStyle(el);
    return { ring: c.outlineColor, width: Number.parseFloat(c.outlineWidth), bg: getComputedStyle(el.closest('[data-slot="menu-content"]') as HTMLElement).backgroundColor };
  });
  expect(s.width).toBeGreaterThanOrEqual(2);
  expect(contrastRatio(s.ring, s.bg)).toBeGreaterThanOrEqual(WCAG_AA.nonText);
});

test("items are 44px tall; trigger has a visible focus ring", async ({ page }) => {
  await page.getByRole("button", { name: "File actions" }).focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await expectVisibleFocusRing(page);
  await open(page);
  await expectMinTargetSize(await page.locator('[data-slot="menu-item"], [data-slot="menu-checkbox-item"], [data-slot="menu-radio-item"]').all(), 44);
});

test.describe("320px: the open menu fits", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  test("fits the screen", async ({ page }) => {
    const { menu } = await open(page);
    const box = await menu.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(REFLOW_VIEWPORT.width);
  });
});

test.describe("reduced motion", () => {
  test("no motion with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.getByRole("button", { name: "File actions" }).click();
    await expectNoMotion(page, page.locator('[data-slot="menu-content"]'));
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/menu", "/docs/menu"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
