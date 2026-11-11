import { expect, test, type Page } from "./fixtures";
import { expectNoAxeViolations, expectNoHorizontalScroll, expectNoMotion, REFLOW_VIEWPORT } from "./helpers/a11y";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/skeleton");
});

const container = (page: Page) => page.locator('[data-slot="skeleton-container"]');

test.describe("axe", () => {
  test("no violations while loading and when loaded", async ({ page }) => {
    await expect(container(page)).toHaveAttribute("aria-busy", "true");
    await expectNoAxeViolations(page);
    await expect(page.getByText("Order 1042 · Laura Torres")).toBeVisible({ timeout: 5000 });
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/skeleton");
    await expectNoAxeViolations(page);
  });
});

test.describe("announcements", () => {
  test("a slow load is announced, and so is its end", async ({ page }) => {
    const announcer = page.locator('[data-slot="announcer"]');
    await expect(announcer).toHaveText("Loading orders", { timeout: 2500 });
    await expect(announcer).toHaveText("Orders loaded", { timeout: 5000 });
    await expect(container(page)).not.toHaveAttribute("aria-busy");
  });
});

test.describe("keyboard", () => {
  test("Reload brings the skeleton back; focus stays on the button", async ({ page }) => {
    await expect(page.getByText("Order 1042 · Laura Torres")).toBeVisible({ timeout: 5000 });
    const reload = page.getByRole("button", { name: "Reload" });
    await reload.focus();
    await page.keyboard.press("Enter");
    await expect(container(page)).toHaveAttribute("aria-busy", "true");
    await expect(reload).toBeFocused();
  });
});

test.describe("visual accessibility", () => {
  test("shapes stay visible in forced colors", async ({ page }) => {
    await page.emulateMedia({ forcedColors: "active" });
    const width = await page.locator('[data-slot="skeleton"]').first().evaluate((el) => Number.parseFloat(getComputedStyle(el).borderTopWidth));
    expect(width).toBeGreaterThanOrEqual(1);
  });
});

test.describe("reduced motion", () => {
  test("no pulse with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(container(page)).toHaveAttribute("aria-busy", "true");
    await expectNoMotion(page, page.locator("main"));
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/skeleton", "/docs/skeleton"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
