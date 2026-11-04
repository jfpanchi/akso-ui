import { expect, test, type Page } from "./fixtures";
import { expectMinTargetSize, expectNoAxeViolations, expectNoHorizontalScroll, expectNoMotion, REFLOW_VIEWPORT } from "./helpers/a11y";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/autocomplete");
});

const input = (page: Page) => page.getByRole("combobox", { name: "City" });

test("no axe violations, closed and open", async ({ page }) => {
  await expectNoAxeViolations(page);
  await input(page).fill("qu");
  await expect(page.getByRole("listbox")).toBeVisible();
  // While open, Base UI hides the rest of the page with aria-hidden (see Combobox in ACCESSIBILITY.md).
  await expectNoAxeViolations(page, { disableRules: ["aria-hidden-focus"] });
});

test("no axe violations on the docs page", async ({ page }) => {
  await page.goto("/docs/autocomplete");
  await expectNoAxeViolations(page);
});

test("typing filters suggestions and announces how many; free text is kept", async ({ page }) => {
  await input(page).fill("gu");
  await expect(page.getByRole("option")).toHaveCount(1);
  await expect(page.locator('[data-slot="autocomplete-status"]')).toHaveText("1 suggestion");
  await input(page).fill("Ambato");
  await expect(page.getByText("No suggestions.")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(input(page)).toHaveValue("Ambato");
});

test("keyboard: arrows and Enter fill the field; focus stays", async ({ page }) => {
  await input(page).focus();
  await page.keyboard.type("quit");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(input(page)).toHaveValue("Quito");
  await expect(input(page)).toBeFocused();
});

test("suggestions are 44px tall", async ({ page }) => {
  await input(page).fill("a");
  await expect(page.getByRole("listbox")).toBeVisible();
  await expectMinTargetSize(await page.getByRole("option").all(), 44);
});

test("no motion with prefers-reduced-motion: reduce", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await input(page).fill("a");
  await expectNoMotion(page, page.locator('[data-slot="autocomplete-content"]'));
});

test.describe("320px wide", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/autocomplete", "/docs/autocomplete"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
