import { expect, test, type Page } from "./fixtures";
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
  await page.goto("/test/form");
});

const box = (page: Page, name: string) => page.getByRole("textbox", { name });
const submit = (page: Page) => page.getByRole("button", { name: "Send message" });

test.describe("axe", () => {
  test("no violations before submitting", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
  test("no violations after a submit with errors", async ({ page }) => {
    await submit(page).click();
    await expect(page.getByText("Enter your name.")).toBeVisible();
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/form");
    await expectNoAxeViolations(page);
  });
});

test.describe("keyboard and announcements", () => {
  test("submit with errors: focus goes to the first invalid field and the count is announced", async ({ page }) => {
    await submit(page).focus();
    await page.keyboard.press("Enter");
    await expect(box(page, "Name")).toBeFocused();
    await expect(box(page, "Name")).toHaveAccessibleDescription("Enter your name.");
    await expect(page.locator("#akso-announcer")).toHaveText("3 fields need attention.");
  });

  test("focus goes to the first invalid field in page order, even if earlier ones are valid", async ({ page }) => {
    await box(page, "Name").fill("Ada");
    await box(page, "Email").fill("ada@example.com");
    await submit(page).click();
    await expect(box(page, "Message")).toBeFocused();
    await expect(page.locator("#akso-announcer")).toHaveText("1 field needs attention.");
  });

  test("a server error appears on the right field and focus moves there", async ({ page }) => {
    await box(page, "Name").fill("Ada");
    await box(page, "Email").fill("ada@example.org");
    await box(page, "Message").fill("Hello");
    await submit(page).click();
    await expect(box(page, "Email")).toBeFocused({ timeout: 5000 });
    await expect(box(page, "Email")).toHaveAccessibleDescription(/We cannot reply to example\.org addresses/);
  });

  test("a valid submit keeps focus on the button while sending, then shows a status message", async ({ page }) => {
    await box(page, "Name").fill("Ada");
    await box(page, "Email").fill("ada@example.com");
    await box(page, "Message").fill("Hello");
    await submit(page).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: "Sending" })).toBeFocused();
    await expect(page.getByRole("status").filter({ hasText: "Message sent" })).toBeVisible();
    await expect(submit(page)).toBeFocused();
  });
});

test.describe("visual accessibility", () => {
  test("every control has a visible focus ring with at least 3:1 contrast", async ({ page }) => {
    await box(page, "Name").focus();
    await page.keyboard.press("Shift+Tab");
    const labels = await expectVisibleFocusRingsWhileTabbing(page, 4);
    expect(labels.at(-1)).toBe("Send message");
  });
  test("controls are at least 24px and the focus ring appears immediately", async ({ page }) => {
    await expectMinTargetSize([...(await page.getByRole("textbox").all()), submit(page)]);
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
  for (const path of ["/test/form", "/docs/form"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
  test("with every error shown, nothing overflows", async ({ page }) => {
    await submit(page).click();
    await expect(page.getByText("Write a message.")).toBeVisible();
    await expectNoHorizontalScroll(page);
  });
});

test.describe("error summary", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test/form-summary");
  });

  test("submit with errors: focus moves to a summary with a link per field; no axe violations", async ({ page }) => {
    await page.getByRole("button", { name: "Send message" }).click();
    const summary = page.getByRole("group", { name: "There is a problem" });
    await expect(summary).toBeFocused();
    await expect(summary.getByRole("link")).toHaveCount(3);
    await expectNoAxeViolations(page);
  });

  test("Enter on a link moves focus to its field", async ({ page }) => {
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("group", { name: "There is a problem" })).toBeFocused();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await expect(box(page, "Email")).toBeFocused();
  });

  test.describe("320px", () => {
    test.use({ viewport: REFLOW_VIEWPORT });
    test("the summary fits without horizontal scroll", async ({ page }) => {
      await page.getByRole("button", { name: "Send message" }).click();
      await expect(page.getByRole("group", { name: "There is a problem" })).toBeVisible();
      await expectNoHorizontalScroll(page);
    });
  });
});
