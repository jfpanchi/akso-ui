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
  await page.goto("/test/date-picker");
});

const input = (page: Page) => page.getByRole("textbox", { name: "Appointment date" });
const trigger = (page: Page) => page.getByRole("button", { name: "Choose date" });
const grid = (page: Page) => page.getByRole("grid");

test.describe("axe", () => {
  // At 720px tall there is no room below the field, so the calendar flips above it and covers part
  // of this test page's long link list; axe then reports those half-covered links as small targets.
  // Give it room to open below, as on a typical form. (Documented in ACCESSIBILITY.md.)
  test.use({ viewport: { width: 1280, height: 1000 } });
  test("no violations closed and with the calendar open", async ({ page }) => {
    await expectNoAxeViolations(page);
    await trigger(page).click();
    await expect(grid(page)).toBeVisible();
    await expectNoAxeViolations(page);
  });
  test("no violations with an error shown", async ({ page }) => {
    await input(page).fill("13/45/2026");
    await input(page).blur();
    await expect(page.getByText("Enter a real date, like 03/25/2026.")).toBeVisible();
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/date-picker");
    await expectNoAxeViolations(page);
  });
});

test.describe("keyboard", () => {
  test("type a date: it is kept as YYYY-MM-DD", async ({ page }) => {
    await input(page).fill("04/07/2026");
    await input(page).blur();
    await expect(page.getByTestId("chosen-date")).toHaveText("2026-04-07");
  });
  test("calendar: opens on the chosen day; arrows and Page Down move; Enter picks; focus returns", async ({ page }) => {
    await trigger(page).focus();
    await page.keyboard.press("Enter");
    await expect(grid(page)).toBeVisible();
    await expect(page.getByRole("button", { name: "Thursday, March 5, 2026" })).toBeFocused();
    await expectVisibleFocusRing(page);
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("PageDown");
    await expect(page.getByRole("button", { name: "Monday, April 6, 2026" })).toBeFocused();
    await expect(page.getByRole("heading", { name: "April 2026" })).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(grid(page)).toBeHidden();
    await expect(trigger(page)).toBeFocused();
    await expect(input(page)).toHaveValue("04/06/2026");
    await expect(page.getByTestId("chosen-date")).toHaveText("2026-04-06");
  });
  test("Escape closes the calendar and focus returns to the button", async ({ page }) => {
    await trigger(page).click();
    await expect(grid(page)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(grid(page)).toBeHidden();
    await expect(trigger(page)).toBeFocused();
  });
  test("the birthday field has no calendar and uses autocomplete=bday", async ({ page }) => {
    const birthday = page.getByRole("textbox", { name: "Date of birth" });
    await expect(birthday).toHaveAttribute("autocomplete", "bday");
    await expect(page.getByRole("button", { name: "Choose date" })).toHaveCount(1);
  });
});

test.describe("visual accessibility", () => {
  test("input and calendar button are 44px; days are at least 24px", async ({ page }) => {
    await expectMinTargetSize([input(page), trigger(page)], 44);
    await trigger(page).click();
    await expectMinTargetSize(await grid(page).getByRole("button").all(), 24);
  });
  test("the focus ring appears immediately", async ({ page }) => {
    await expectNoAnimatedOutline(page.locator("main"));
  });
});

test.describe("reduced motion", () => {
  test("no motion with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await trigger(page).click();
    await expect(grid(page)).toBeVisible();
    await expectNoMotion(page, page.locator('[data-slot="date-picker-calendar"]'));
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  test("the open calendar fits the screen", async ({ page }) => {
    await trigger(page).click();
    await expect(grid(page)).toBeVisible();
    await expectNoHorizontalScroll(page);
    const box = await page.locator('[data-slot="date-picker-calendar"]').boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(REFLOW_VIEWPORT.width);
  });
  test("the docs page has no horizontal scroll", async ({ page }) => {
    await page.goto("/docs/date-picker");
    await expectNoHorizontalScroll(page);
  });
});
