import { expect, test } from "./fixtures";
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
  await page.goto("/test/collapsible");
});

test("no axe violations, closed and open", async ({ page }) => {
  await expectNoAxeViolations(page);
  await page.getByRole("button", { name: "Show order details" }).click();
  await expectNoAxeViolations(page);
});
test("no axe violations on the docs page", async ({ page }) => {
  await page.goto("/docs/collapsible");
  await expectNoAxeViolations(page);
});

test("Enter and Space toggle it; aria-expanded follows; focus ring visible", async ({ page }) => {
  const t = page.getByRole("button", { name: "Show order details" });
  await t.focus();
  await page.keyboard.press("Enter");
  await expect(t).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText("1 × Notebook, $12")).toBeVisible();
  await expectVisibleFocusRing(page);
  await page.keyboard.press("Space");
  await expect(t).toHaveAttribute("aria-expanded", "false");
});

test("the trigger is 44px and the focus ring appears immediately", async ({ page }) => {
  await expectMinTargetSize([page.getByRole("button", { name: "Show order details" })], 44);
  await expectNoAnimatedOutline(page.locator("main"));
});

test.describe("reduced motion", () => {
  test("no motion with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.getByRole("button", { name: "Show order details" }).click();
    await expectNoMotion(page, page.locator("main"));
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/collapsible", "/docs/collapsible"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
