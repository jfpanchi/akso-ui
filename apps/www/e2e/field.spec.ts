import { expect, test, type Page } from "./fixtures";
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
  await page.goto("/test/field");
});

const email = (page: Page) => page.getByRole("textbox", { name: "Email" });

test.describe("axe", () => {
  test("no violations on the test page", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
  test("no violations with an error shown", async ({ page }) => {
    await email(page).fill("nope");
    await page.keyboard.press("Tab");
    await expect(page.getByText("Enter an email like name@example.com.")).toBeVisible();
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/field");
    await expectNoAxeViolations(page);
  });
});

test.describe("keyboard and announcements", () => {
  test("leaving an invalid field shows the error, links it and announces it with the field name", async ({ page }) => {
    await email(page).focus();
    await page.keyboard.type("nope");
    await page.keyboard.press("Tab");
    await expect(email(page)).toHaveAttribute("aria-invalid", "true");
    await expect(email(page)).toHaveAccessibleDescription(/Enter an email like name@example.com\./);
    await expect(page.locator("#akso-announcer")).toHaveText("Email: Enter an email like name@example.com.");
    await expect(page.getByRole("textbox", { name: "Nickname" })).toBeFocused();
  });

  test("clicking the label focuses the control", async ({ page }) => {
    await page.locator('[data-slot="field-label"]').first().click();
    await expect(email(page)).toBeFocused();
  });
});

test.describe("visual accessibility", () => {
  test("the input has a visible focus ring with at least 3:1 contrast", async ({ page }) => {
    await page.keyboard.press("Tab"); // skip link
    await email(page).focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(email(page)).toBeFocused();
    await expectVisibleFocusRing(page);
  });

  test("the error has an icon and text, and the border changes thickness, not only color", async ({ page }) => {
    const before = await email(page).evaluate((el) => getComputedStyle(el).borderTopWidth);
    await email(page).fill("nope");
    await page.keyboard.press("Tab");
    const error = page.locator('[data-slot="field-error"]');
    await expect(error).toHaveText("Enter an email like name@example.com.");
    await expect(error.locator("svg")).toBeVisible();
    const after = await email(page).evaluate((el) => getComputedStyle(el).borderTopWidth);
    expect(Number.parseFloat(after)).toBeGreaterThan(Number.parseFloat(before));
  });

  test("the required text is visible", async ({ page }) => {
    await expect(page.getByText("(required)")).toBeVisible();
  });

  test("the focus ring appears immediately and controls are at least 24px", async ({ page }) => {
    await expectNoAnimatedOutline(page.locator("main"));
    await expectMinTargetSize(await page.getByRole("textbox").all());
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
  for (const path of ["/test/field", "/docs/field"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
  test("a long error message wraps instead of overflowing", async ({ page }) => {
    await email(page).fill("nope");
    await page.keyboard.press("Tab");
    await expect(page.locator('[data-slot="field-error"]')).toBeVisible();
    await expectNoHorizontalScroll(page);
  });
});
