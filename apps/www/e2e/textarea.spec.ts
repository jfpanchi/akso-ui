import { expect, test, type Page } from "@playwright/test";
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
  await page.goto("/test/textarea");
});

const textarea = (page: Page) => page.getByRole("textbox", { name: "Your feedback" });

test.describe("axe", () => {
  test("no violations on the test page", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
  test("no violations with an error shown", async ({ page }) => {
    await textarea(page).fill("x");
    await textarea(page).fill("");
    await page.keyboard.press("Tab");
    await expect(page.getByText("Write your feedback.")).toBeVisible();
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/textarea");
    await expectNoAxeViolations(page);
  });
});

test.describe("keyboard and announcements", () => {
  test("Enter adds a new line", async ({ page }) => {
    await textarea(page).focus();
    await page.keyboard.type("Hello");
    await page.keyboard.press("Enter");
    await page.keyboard.type("world");
    await expect(textarea(page)).toHaveValue("Hello\nworld");
  });

  test("passing through without typing shows no error yet", async ({ page }) => {
    await textarea(page).focus();
    await page.keyboard.press("Tab");
    await expect(page.getByText("Write your feedback.")).toHaveCount(0);
  });

  test("deleting what was typed shows and announces the error", async ({ page }) => {
    await textarea(page).focus();
    await page.keyboard.type("x");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Tab");
    await expect(textarea(page)).toHaveAccessibleDescription(/Write your feedback\./);
    await expect(page.locator("#akso-announcer")).toHaveText("Your feedback: Write your feedback.");
  });
});

test.describe("visual accessibility", () => {
  test("visible focus ring with at least 3:1 contrast", async ({ page }) => {
    await textarea(page).focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expectVisibleFocusRing(page);
  });

  test("is tall enough and the focus ring appears immediately", async ({ page }) => {
    await expectMinTargetSize([textarea(page)], 44);
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
  for (const path of ["/test/textarea", "/docs/textarea"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
