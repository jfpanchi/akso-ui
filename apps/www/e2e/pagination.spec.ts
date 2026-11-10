import { expect, test, type Page } from "./fixtures";
import { contrastRatio, WCAG_AA } from "akso-ui/tokens";
import { expectMinTargetSize, expectNoAnimatedOutline, expectNoAxeViolations, expectNoHorizontalScroll, expectVisibleFocusRing, REFLOW_VIEWPORT } from "./helpers/a11y";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/pagination");
});

const nav = (page: Page) => page.getByRole("navigation", { name: "Pagination" });

test.describe("axe", () => {
  test("no violations", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
  test("no violations on the last page", async ({ page }) => {
    await nav(page).getByRole("link", { name: "Page 12" }).click();
    await expect(nav(page).getByRole("link", { name: "Next" })).toHaveCount(0);
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/pagination");
    await expectNoAxeViolations(page);
  });
});

test.describe("keyboard", () => {
  test("Tab reaches every control with a visible focus ring; the current page is skipped", async ({ page }) => {
    await nav(page).getByRole("link", { name: "Previous" }).focus();
    await page.keyboard.press("Shift+Tab");
    const labels: string[] = [];
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("Tab");
      labels.push((await expectVisibleFocusRing(page)).label);
    }
    expect(labels).toEqual(["Previous", "Page 1", "Page 4", "Page 6", "Page 12", "Next"]);
  });
  test("Enter on Next moves to the next page and the new page is announced", async ({ page }) => {
    await nav(page).getByRole("link", { name: "Next" }).focus();
    await page.keyboard.press("Enter");
    await expect(nav(page).locator('[aria-current="page"]')).toContainText("Page 6"); // hidden "Page 6" + visible "6"
    await expect(page.getByRole("status")).toHaveText("Page 6 of 12.");
  });
});

test.describe("visual accessibility", () => {
  test("the current page is filled, bold and has a thicker border, with readable text", async ({ page }) => {
    const s = await nav(page).locator('[aria-current="page"]').evaluate((el) => {
      const c = getComputedStyle(el);
      return { weight: Number(c.fontWeight), border: Number.parseFloat(c.borderTopWidth), color: c.color, bg: c.backgroundColor };
    });
    expect(s.weight).toBeGreaterThanOrEqual(700);
    expect(s.border).toBeGreaterThanOrEqual(2);
    expect(contrastRatio(s.color, s.bg)).toBeGreaterThanOrEqual(WCAG_AA.text);
  });
  test("every control is at least 44×44px", async ({ page }) => {
    await expectMinTargetSize(await nav(page).getByRole("link").all(), 44);
  });
  test("the focus ring appears immediately", async ({ page }) => {
    await expectNoAnimatedOutline(page.locator("main"));
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/pagination", "/docs/pagination"]) {
    test(`${path} has no horizontal scroll; the list wraps`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
