import { expect, test, type Page } from "./fixtures";
import { expectNoAnimatedOutline, expectNoAxeViolations, expectNoHorizontalScroll, expectVisibleFocusRing, expectMinTargetSize, REFLOW_VIEWPORT } from "./helpers/a11y";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/table");
});

const table = (page: Page) => page.getByRole("table", { name: "Recent orders" });
const sortButton = (page: Page, name: string) => table(page).getByRole("button", { name });
const firstCustomer = (page: Page) => table(page).locator("tbody tr").first().locator("td").first();

test.describe("axe", () => {
  test("no violations", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
  test("no violations after sorting", async ({ page }) => {
    await sortButton(page, "Customer").click();
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/table");
    await expectNoAxeViolations(page);
  });
});

test.describe("keyboard", () => {
  test("Enter on a header sorts the column, sets aria-sort and announces it", async ({ page }) => {
    await sortButton(page, "Customer").focus();
    await page.keyboard.press("Enter");
    await expect(table(page).getByRole("columnheader", { name: "Customer" })).toHaveAttribute("aria-sort", "ascending");
    await expect(table(page).getByRole("columnheader", { name: "Date" })).not.toHaveAttribute("aria-sort");
    await expect(firstCustomer(page)).toHaveText("Ana Silva");
    await expect(page.locator('[data-slot="announcer"]')).toHaveText("Sorted by Customer, ascending");
    await page.keyboard.press("Enter");
    await expect(table(page).getByRole("columnheader", { name: "Customer" })).toHaveAttribute("aria-sort", "descending");
    await expect(firstCustomer(page)).toHaveText("Mateo Quispe");
  });
  test("every sort button has a visible focus ring", async ({ page }) => {
    await sortButton(page, "Customer").focus();
    await page.keyboard.press("Shift+Tab");
    const labels: string[] = [];
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press("Tab");
      labels.push((await expectVisibleFocusRing(page)).label);
    }
    expect(labels).toEqual(["Customer", "Date", "Total"]);
  });
});

test.describe("visual accessibility", () => {
  test("sort buttons are at least 44px tall", async ({ page }) => {
    await expectMinTargetSize(await table(page).getByRole("button").all(), 44);
  });
  test("the focus ring appears immediately", async ({ page }) => {
    await expectNoAnimatedOutline(page.locator("main"));
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  test("the page does not scroll sideways; the table scrolls in a named, focusable region", async ({ page }) => {
    await expectNoHorizontalScroll(page);
    const region = page.getByRole("region", { name: "Recent orders" });
    await expect(region).toHaveAttribute("tabindex", "0");
    await region.focus();
    await expectVisibleFocusRing(page);
    const before = await region.evaluate((el) => el.scrollLeft);
    await page.keyboard.press("ArrowRight");
    await expect.poll(() => region.evaluate((el) => el.scrollLeft)).toBeGreaterThan(before);
  });
  test("the docs page has no horizontal scroll", async ({ page }) => {
    await page.goto("/docs/table");
    await expectNoHorizontalScroll(page);
  });
});

test.describe("wide screen", () => {
  test("when the table fits, the container is not an extra Tab stop", async ({ page }) => {
    await expect(page.locator('[data-slot="table-container"]').first()).not.toHaveAttribute("tabindex");
  });
});

test.describe("row selection", () => {
  const team = (page: Page) => page.getByRole("table", { name: "Team members" });
  const all = (page: Page) => team(page).getByRole("checkbox", { name: "Select all rows" });

  test("no axe violations with some rows selected", async ({ page }) => {
    await team(page).getByRole("checkbox", { name: "Select Mateo Ruiz" }).click();
    await expectNoAxeViolations(page);
  });
  test("Space selects a row; select all becomes mixed, then all; the count is announced", async ({ page }) => {
    const mateo = team(page).getByRole("checkbox", { name: "Select Mateo Ruiz" });
    await mateo.focus();
    await page.keyboard.press("Space");
    await expect(mateo).toHaveAttribute("aria-checked", "true");
    await expect(all(page)).toHaveAttribute("aria-checked", "mixed");
    await expect(page.locator('[data-slot="announcer"]')).toHaveText("1 row selected");
    await all(page).focus();
    await page.keyboard.press("Space");
    await expect(all(page)).toHaveAttribute("aria-checked", "true");
    await expect(page.getByTestId("selected-count")).toHaveText("3 of 3 selected");
    await expect(page.locator('[data-slot="announcer"]')).toHaveText("3 rows selected");
  });
  test("checkboxes are 44×44px with a visible focus ring", async ({ page }) => {
    await expectMinTargetSize(await team(page).getByRole("checkbox").all(), 44);
    await team(page).getByRole("checkbox", { name: "Select Laura Torres" }).focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expectVisibleFocusRing(page);
  });
});
