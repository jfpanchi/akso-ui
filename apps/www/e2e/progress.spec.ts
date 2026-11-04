import { expect, test } from "@playwright/test";
import { contrastRatio, WCAG_AA } from "akso-ui/tokens";
import { expectNoAxeViolations, expectNoHorizontalScroll, expectNoMotion, REFLOW_VIEWPORT } from "./helpers/a11y";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/progress");
});

test.describe("axe", () => {
  test("no violations (value, steps, unknown)", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/progress");
    await expectNoAxeViolations(page);
  });
});

test.describe("name, role and state", () => {
  test("progress bars are named and expose their value", async ({ page }) => {
    const upload = page.getByRole("progressbar", { name: "Uploading photo" });
    await expect(upload).toHaveAttribute("aria-valuenow", /\d+/);
    await expect(page.getByRole("progressbar", { name: "Step 2 of 4" })).toHaveAttribute("aria-valuetext", "Step 2 of 4");
    await expect(page.getByRole("progressbar", { name: "Preparing your download" })).not.toHaveAttribute("aria-valuenow");
  });
  test("the bar has at least 3:1 contrast against its track", async ({ page }) => {
    const { bar, track } = await page.locator('[data-slot="progress-indicator"]').first().evaluate((el) => ({
      bar: getComputedStyle(el).backgroundColor,
      track: getComputedStyle(el.parentElement as HTMLElement).backgroundColor,
    }));
    expect(contrastRatio(bar, track)).toBeGreaterThanOrEqual(WCAG_AA.nonText);
  });
});

test.describe("reduced motion", () => {
  test("the unknown-amount bar does not pulse with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expectNoMotion(page, page.locator('[data-slot="progress"]').last());
  });
  test("control: it pulses without the preference", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const name = await page.locator('[data-slot="progress-indicator"]').last().evaluate((el) => getComputedStyle(el).animationName);
    expect(name).not.toBe("none");
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/progress", "/docs/progress"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
