import { test } from "./fixtures";
import { expectNoAxeViolations, expectNoHorizontalScroll, REFLOW_VIEWPORT } from "./helpers/a11y";

test("language docs page has no axe violations", async ({ page }) => {
  await page.goto("/docs/language");
  await expectNoAxeViolations(page);
});

test.describe("320px", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  test("language docs page has no horizontal scroll", async ({ page }) => {
    await page.goto("/docs/language");
    await expectNoHorizontalScroll(page);
  });
});
