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
  await page.goto("/test/otp-field");
});

const group = (page: Page) => page.getByRole("group", { name: "Verification code" });
const boxes = (page: Page) => group(page).getByRole("textbox");
const value = (page: Page) => page.getByTestId("otp-value");

/** Pastes text into the focused box, the way the browser does (works in every engine, no clipboard permission). */
async function paste(page: Page, text: string) {
  await page.evaluate((t) => {
    const data = new DataTransfer();
    data.setData("text/plain", t);
    document.activeElement?.dispatchEvent(new ClipboardEvent("paste", { clipboardData: data, bubbles: true, cancelable: true }));
  }, text);
}

test.describe("axe", () => {
  test("no violations", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
  test("no violations with an error shown", async ({ page }) => {
    await boxes(page).first().focus();
    await page.keyboard.type("123");
    await page.keyboard.press("Tab");
    await expect(page.getByText("Enter all 6 digits.")).toBeVisible();
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/otp-field");
    await expectNoAxeViolations(page);
  });
});

test.describe("name and description", () => {
  test("the group and the first box use the label; the other boxes say which digit they are", async ({ page }) => {
    await expect(group(page)).toHaveAccessibleDescription(/Enter the 6-digit code we sent to your email\./);
    await expect(boxes(page)).toHaveCount(6);
    await expect(boxes(page).first()).toHaveAccessibleName("Verification code");
    await expect(boxes(page).first()).toHaveAttribute("autocomplete", "one-time-code");
    await expect(boxes(page).nth(3)).toHaveAccessibleName("Digit 4 of 6");
    await expect(page.getByRole("textbox", { name: "Character 8 of 8" })).toBeVisible();
  });
});

test.describe("keyboard", () => {
  test("Tab reaches the field once; typing fills the boxes; Tab leaves the field", async ({ page }) => {
    await boxes(page).first().focus();
    await page.keyboard.type("123456");
    await expect(value(page)).toHaveText("123456");
    await expect(boxes(page).last()).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("textbox", { name: "Backup code" })).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(boxes(page).last()).toBeFocused();
  });
  test("arrows, Home, End and Backspace", async ({ page }) => {
    await boxes(page).first().focus();
    await page.keyboard.type("123");
    await page.keyboard.press("Home");
    await expect(boxes(page).first()).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(boxes(page).nth(1)).toBeFocused();
    await page.keyboard.press("End");
    await expect(boxes(page).nth(3)).toBeFocused();
    await page.keyboard.press("Backspace");
    await expect(boxes(page).nth(2)).toBeFocused();
    await expect(value(page)).toHaveText("12");
  });
  test("pasting the code fills every box", async ({ page }) => {
    await boxes(page).first().focus();
    await paste(page, "987654");
    await expect(value(page)).toHaveText("987654");
    await expect(boxes(page).last()).toHaveValue("4");
  });
  test("a letter is rejected and announced", async ({ page }) => {
    await boxes(page).first().focus();
    await page.keyboard.type("a");
    await expect(boxes(page).first()).toHaveValue("");
    await expect(page.locator('[data-slot="announcer"]')).toHaveText("Only numbers are allowed.");
  });
  test("the error is linked to the field", async ({ page }) => {
    await boxes(page).first().focus();
    await page.keyboard.type("12");
    await page.keyboard.press("Tab");
    await expect(boxes(page).first()).toHaveAttribute("aria-invalid", "true");
    await expect(group(page)).toHaveAccessibleDescription(/Enter all 6 digits\./);
  });
});

test.describe("visual accessibility", () => {
  test("every box shows a focus ring with at least 3:1 contrast", async ({ page }) => {
    await boxes(page).first().focus();
    await page.keyboard.type("12345");
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press(i === 0 ? "Home" : "ArrowRight");
      await expectVisibleFocusRing(page);
    }
  });
  test("boxes are 44px tall and at least 24px wide", async ({ page }) => {
    const all = await page.locator('[data-slot="otp-field-input"]').all();
    await expectMinTargetSize(all, 24);
    for (const box of all) expect((await box.boundingBox())!.height).toBeGreaterThanOrEqual(44 - 0.01);
  });
  test("the focus ring appears immediately", async ({ page }) => {
    await expectNoAnimatedOutline(page.locator("main"));
  });
});

test.describe("reduced motion", () => {
  test("no motion with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await boxes(page).first().focus();
    await page.keyboard.type("12");
    await expectNoMotion(page, page.locator("main"));
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/otp-field", "/docs/otp-field"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
  test("the boxes are still at least 24px wide", async ({ page }) => {
    await expectMinTargetSize(await page.locator('[data-slot="otp-field-input"]').all(), 24);
  });
});
