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
  await page.goto("/test/password-field");
});

const input = (page: Page) => page.getByLabel("Password", { exact: false }).first();
const toggle = (page: Page, name: "Show password" | "Hide password") => page.getByRole("button", { name });

test.describe("axe", () => {
  test("no violations, hidden, shown and with an error", async ({ page }) => {
    await expectNoAxeViolations(page);
    await toggle(page, "Show password").click();
    await expectNoAxeViolations(page);
    await input(page).fill("short");
    await input(page).blur();
    await expect(page.getByText("Use at least 8 characters.")).toBeVisible();
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/password-field");
    await expectNoAxeViolations(page);
  });
});

test.describe("keyboard", () => {
  test("type, Tab to Show, Enter shows the password; the change is announced", async ({ page }) => {
    await input(page).focus();
    await page.keyboard.type("correct horse");
    await page.keyboard.press("Tab");
    await expect(toggle(page, "Show password")).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(input(page)).toHaveAttribute("type", "text");
    await expect(toggle(page, "Hide password")).toBeFocused();
    await expect(page.locator('[data-slot="announcer"]')).toHaveText("Your password is shown");
    await page.keyboard.press("Space");
    await expect(input(page)).toHaveAttribute("type", "password");
    await expect(page.locator('[data-slot="announcer"]')).toHaveText("Your password is hidden");
  });
  test("the password is hidden again after submitting", async ({ page }) => {
    await input(page).fill("correct horse");
    await toggle(page, "Show password").click();
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page.getByRole("status").filter({ hasText: "Account created." })).toBeVisible();
    await expect(input(page)).toHaveAttribute("type", "password");
  });
  test("the error is linked to the field", async ({ page }) => {
    await input(page).fill("short");
    await input(page).blur();
    await expect(input(page)).toHaveAttribute("aria-invalid", "true");
    await expect(input(page)).toHaveAccessibleDescription(/Use at least 8 characters\./);
  });
});

test.describe("visual accessibility", () => {
  test("input and button: focus rings with at least 3:1 contrast, 44px tall", async ({ page }) => {
    await input(page).focus();
    await expectVisibleFocusRing(page);
    await page.keyboard.press("Tab");
    await expectVisibleFocusRing(page);
    await expectMinTargetSize([input(page), toggle(page, "Show password")], 44);
  });
  test("the focus ring appears immediately", async ({ page }) => {
    await expectNoAnimatedOutline(page.locator("main"));
  });
});

test.describe("reduced motion", () => {
  test("no motion with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await toggle(page, "Show password").click();
    await expectNoMotion(page, page.locator("main"));
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/password-field", "/docs/password-field"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
