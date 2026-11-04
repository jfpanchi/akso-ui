import { expect, test } from "./fixtures";
import { expectNoAxeViolations, expectNoHorizontalScroll, expectNoMotion, REFLOW_VIEWPORT } from "./helpers/a11y";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/meter");
});

test("no axe violations", async ({ page }) => {
  await expectNoAxeViolations(page);
});

test("no axe violations on the docs page", async ({ page }) => {
  await page.goto("/docs/meter");
  await expectNoAxeViolations(page);
});

test("meters are named, expose their value and show it as text", async ({ page }) => {
  const storage = page.getByRole("meter", { name: "Storage used" });
  await expect(storage).toHaveAttribute("aria-valuenow", "30");
  await expect(storage).toHaveAttribute("aria-valuetext", "3 GB of 10 GB");
  await expect(page.getByText("80%")).toBeVisible();
});

test("no motion with prefers-reduced-motion: reduce", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expectNoMotion(page, page.locator("main"));
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/meter", "/docs/meter"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
