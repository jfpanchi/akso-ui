import { expect, test } from "@playwright/test";
import {
  expectMinTargetSize,
  expectNoAnimatedOutline,
  expectNoAxeViolations,
  expectNoHorizontalScroll,
  expectNoMotion,
  expectVisibleFocusRingsWhileTabbing,
  REFLOW_VIEWPORT,
} from "./helpers/a11y";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/input");
});

test.describe("axe", () => {
  test("no violations on the test page (default, invalid and disabled inputs)", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/input");
    await expectNoAxeViolations(page);
  });
});

test.describe("keyboard", () => {
  test("Tab visits the enabled inputs and skips the disabled one", async ({ page }) => {
    await page.getByRole("textbox", { name: "Phone number" }).focus();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("textbox", { name: "Discount code" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("textbox", { name: "Account number" })).not.toBeFocused();
  });

  test("the invalid input exposes its state and its error", async ({ page }) => {
    const code = page.getByRole("textbox", { name: "Discount code" });
    await expect(code).toHaveAttribute("aria-invalid", "true");
    await expect(code).toHaveAccessibleDescription("This code has expired.");
  });
});

test.describe("visual accessibility", () => {
  test("every enabled input has a visible focus ring with at least 3:1 contrast", async ({ page }) => {
    await page.getByRole("textbox", { name: "Phone number" }).focus();
    await page.keyboard.press("Shift+Tab");
    const labels = await expectVisibleFocusRingsWhileTabbing(page, 2);
    expect(labels).toHaveLength(2);
  });

  test("inputs are 44px tall, at least the 24px minimum", async ({ page }) => {
    const inputs = await page.getByRole("textbox").all();
    await expectMinTargetSize(inputs, 44);
  });

  test("the invalid input has a thicker border than a valid one, and an icon + text message", async ({ page }) => {
    const width = (name: string) => page.getByRole("textbox", { name }).evaluate((el) => Number.parseFloat(getComputedStyle(el).borderTopWidth));
    expect(await width("Discount code")).toBeGreaterThan(await width("Phone number"));
    await expect(page.locator('[data-slot="field-error"] svg')).toBeVisible();
  });

  test("text is 16px, so iOS does not zoom in on focus", async ({ page }) => {
    const size = await page.getByRole("textbox", { name: "Phone number" }).evaluate((el) => getComputedStyle(el).fontSize);
    expect(Number.parseFloat(size)).toBeGreaterThanOrEqual(16);
  });

  test("the focus ring appears immediately", async ({ page }) => {
    await expectNoAnimatedOutline(page.locator("main"));
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
  for (const path of ["/test/input", "/docs/input"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
