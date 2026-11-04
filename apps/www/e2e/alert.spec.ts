import { expect, test } from "./fixtures";
import { expectNoAxeViolations, expectNoHorizontalScroll, expectNoMotion, REFLOW_VIEWPORT } from "./helpers/a11y";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/alert");
});

test.describe("axe", () => {
  test("no violations in every status (includes color contrast)", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/alert");
    await expectNoAxeViolations(page);
  });
});

test.describe("name, role and state", () => {
  test("each status has a different visible icon and a status word for screen readers", async ({ page }) => {
    const shapes = await page.locator("svg[data-status-icon]").evaluateAll((svgs) => svgs.map((s) => s.innerHTML));
    expect(new Set(shapes).size).toBe(4);
    await expect(page.locator('[data-status="warning"] [data-slot="alert-title"]')).toHaveText("Warning: Your session ends in 5 minutes");
  });
  test("static alerts are not live regions", async ({ page }) => {
    // Scoped to <main>: Next.js adds its own route announcer (role=alert) to every page.
    await expect(page.locator("main").getByRole("alert")).toHaveCount(0);
    await expect(page.locator("main").getByRole("status")).toHaveCount(0);
  });
});

test.describe("reduced motion", () => {
  test("no motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expectNoMotion(page, page.locator("main"));
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/alert", "/docs/alert"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
