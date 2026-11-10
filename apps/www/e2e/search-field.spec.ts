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
  await page.goto("/test/search-field");
});

const box = (page: Page) => page.getByRole("searchbox", { name: "Search components" });

test.describe("axe", () => {
  test("no violations, empty and with text", async ({ page }) => {
    await expectNoAxeViolations(page);
    await box(page).fill("ta");
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/search-field");
    await expectNoAxeViolations(page);
  });
});

test.describe("keyboard", () => {
  test("typing filters and the count is announced; Clear empties and refocuses", async ({ page }) => {
    await expect(page.getByRole("search")).toBeVisible();
    await box(page).focus();
    await page.keyboard.type("tab");
    await expect(page.getByRole("list", { name: "Components" }).getByRole("listitem")).toHaveCount(2);
    await expect(page.locator('[data-slot="announcer"]')).toHaveText("2 results");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Clear search" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(box(page)).toHaveValue("");
    await expect(box(page)).toBeFocused();
  });
  test("no results is said in text and announced", async ({ page }) => {
    await box(page).fill("zzz");
    await expect(page.getByText("No components match “zzz”.")).toBeVisible();
    await expect(page.locator('[data-slot="announcer"]')).toHaveText("No results");
  });
});

test.describe("visual accessibility", () => {
  test("field and Clear button: 44px tall, focus rings of at least 3:1", async ({ page }) => {
    await box(page).fill("a");
    await box(page).focus();
    await expectVisibleFocusRing(page);
    await page.keyboard.press("Tab");
    await expectVisibleFocusRing(page);
    await expectMinTargetSize([box(page), page.getByRole("button", { name: "Clear search" })], 44);
  });
  test("the focus ring appears immediately", async ({ page }) => {
    await expectNoAnimatedOutline(page.locator("main"));
  });
});

test.describe("reduced motion", () => {
  test("no motion with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await box(page).fill("a");
    await expectNoMotion(page, page.locator("main"));
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/search-field", "/docs/search-field"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await page.getByRole("searchbox").first().fill("a");
      await expectNoHorizontalScroll(page);
    });
  }
});
