import { expect, test, type Page } from "./fixtures";
import {
  expectMinTargetSize,
  expectNoAnimatedOutline,
  expectNoAxeViolations,
  expectNoHorizontalScroll,
  expectNoMotion,
  REFLOW_VIEWPORT,
} from "./helpers/a11y";
import { contrastRatio, WCAG_AA } from "akso-ui/tokens";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/number-field");
});

const guests = (page: Page) => page.getByRole("textbox", { name: "Guests" });

test.describe("axe", () => {
  test("no violations", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
  test("no violations with an error shown", async ({ page }) => {
    await guests(page).fill("");
    await guests(page).blur();
    await expect(page.getByText("Enter the number of guests.")).toBeVisible();
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/number-field");
    await expectNoAxeViolations(page);
  });
});

test.describe("keyboard", () => {
  test("arrows step, Shift+arrow is a big step, Home and End go to min and max", async ({ page }) => {
    await guests(page).focus();
    await page.keyboard.press("ArrowUp");
    await expect(guests(page)).toHaveValue("3");
    await page.keyboard.press("End");
    await expect(guests(page)).toHaveValue("8");
    await page.keyboard.press("Home");
    await expect(guests(page)).toHaveValue("1");
    const price = page.getByRole("textbox", { name: "Price per night" });
    await price.focus();
    await page.keyboard.press("Shift+ArrowUp");
    await expect(price).not.toHaveValue("$80");
  });
  test("Tab goes from field to field, skipping the − and + buttons", async ({ page }) => {
    await guests(page).focus();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("textbox", { name: "Price per night" })).toBeFocused();
  });
  test("the error is linked to the field", async ({ page }) => {
    await guests(page).fill("");
    await guests(page).blur();
    await expect(guests(page)).toHaveAttribute("aria-invalid", "true");
    await expect(guests(page)).toHaveAccessibleDescription(/Enter the number of guests\./);
  });
});

test.describe("visual accessibility", () => {
  test("the whole field shows a focus ring with at least 3:1 contrast", async ({ page }) => {
    await guests(page).focus();
    const group = page.locator('[data-slot="number-field-group"]').first();
    const ring = await group.evaluate((el) => {
      const s = getComputedStyle(el);
      return { style: s.outlineStyle, width: Number.parseFloat(s.outlineWidth), color: s.outlineColor, page: getComputedStyle(document.body).backgroundColor };
    });
    expect(ring.style).not.toBe("none");
    expect(ring.width).toBeGreaterThanOrEqual(2);
    expect(contrastRatio(ring.color, ring.page)).toBeGreaterThanOrEqual(WCAG_AA.nonText);
  });
  test("the field and the − and + buttons are at least 44×44px", async ({ page }) => {
    await expectMinTargetSize(
      [page.locator('[data-slot="number-field-group"]').first(), page.getByRole("button", { name: "Decrease" }).first(), page.getByRole("button", { name: "Increase" }).first()],
      44,
    );
  });
  test("the focus ring appears immediately", async ({ page }) => {
    await expectNoAnimatedOutline(page.locator("main"));
  });
});

test.describe("reduced motion", () => {
  test("no motion with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.getByRole("button", { name: "Increase" }).first().click();
    await expectNoMotion(page, page.locator("main"));
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/number-field", "/docs/number-field"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
