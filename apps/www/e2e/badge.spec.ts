import { contrastRatio, WCAG_AA } from "akso-ui/tokens";
import { expect, test } from "./fixtures";
import { expectNoAxeViolations, expectNoHorizontalScroll, expectNoMotion, REFLOW_VIEWPORT } from "./helpers/a11y";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/badge");
});

test.describe("axe", () => {
  test("no violations on the test page", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/badge");
    await expectNoAxeViolations(page);
  });
});

test.describe("name", () => {
  test("each order is read with its status as text", async ({ page }) => {
    await expect(page.getByRole("list", { name: "Orders" }).getByRole("listitem").first()).toHaveText("Order 1042 Shipped");
  });
});

test.describe("keyboard", () => {
  test("badges are not focusable", async ({ page }) => {
    const focusable = await page.locator('[data-slot="badge"]').evaluateAll((els) => els.filter((el) => el.matches("[tabindex], a, button")).length);
    expect(focusable).toBe(0);
  });
});

test.describe("visual accessibility", () => {
  test("status borders are at least 3:1 against the badge and the page", async ({ page }) => {
    for (const badge of await page.locator('[data-slot="badge"][data-status]').all()) {
      const { border, fill } = await badge.evaluate((el) => ({ border: getComputedStyle(el).borderTopColor, fill: getComputedStyle(el).backgroundColor }));
      expect(contrastRatio(border, fill)).toBeGreaterThanOrEqual(WCAG_AA.nonText);
    }
  });
  test("borders stay visible in forced colors", async ({ page }) => {
    await page.emulateMedia({ forcedColors: "active" });
    const width = await page.locator('[data-slot="badge"]').first().evaluate((el) => Number.parseFloat(getComputedStyle(el).borderTopWidth));
    expect(width).toBeGreaterThanOrEqual(1);
  });
});

test.describe("reduced motion", () => {
  test("no motion with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expectNoMotion(page, page.locator("main"));
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/badge", "/docs/badge"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
