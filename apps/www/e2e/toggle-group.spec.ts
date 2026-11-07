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
  await page.goto("/test/toggle-group");
});

const alignment = (page: Page) => page.getByRole("group", { name: "Text alignment" });
const item = (page: Page, name: string) => page.getByRole("button", { name, exact: true });

test.describe("axe", () => {
  test("no violations (single and multiple)", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/toggle-group");
    await expectNoAxeViolations(page);
  });
});

test.describe("name, role and state", () => {
  test("each group is named by its visible heading", async ({ page }) => {
    await expect(alignment(page)).toBeVisible();
    await expect(page.getByRole("group", { name: "Text style" })).toBeVisible();
    await expect(item(page, "Left")).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("keyboard", () => {
  test("Tab enters on one button, arrows move, Space presses, Tab leaves", async ({ page }) => {
    await item(page, "Left").focus();
    await page.keyboard.press("ArrowRight");
    await expect(item(page, "Center")).toBeFocused();
    await page.keyboard.press("Space");
    await expect(item(page, "Center")).toHaveAttribute("aria-pressed", "true");
    await expect(item(page, "Left")).toHaveAttribute("aria-pressed", "false");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("group", { name: "Text style" }).getByRole("button").first()).toBeFocused();
  });

  test("Home and End move to the first and last button", async ({ page }) => {
    await item(page, "Left").focus();
    await page.keyboard.press("End");
    await expect(item(page, "Right")).toBeFocused();
    await page.keyboard.press("Home");
    await expect(item(page, "Left")).toBeFocused();
  });

  test("in a multiple group, several stay pressed", async ({ page }) => {
    await item(page, "Italic").click();
    await expect(item(page, "Bold")).toHaveAttribute("aria-pressed", "true");
    await expect(item(page, "Italic")).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("visual accessibility", () => {
  test("a visible focus ring with at least 3:1 contrast on each group's button", async ({ page }) => {
    await item(page, "Left").focus();
    await page.keyboard.press("Shift+Tab");
    expect(await expectVisibleFocusRingsWhileTabbing(page, 2)).toEqual(["Left", "Bold"]);
  });
  test("targets are at least 44×44px", async ({ page }) => {
    await expectMinTargetSize(await page.locator('[data-slot="toggle-group-item"]').all(), 44);
  });
  test("the focus ring appears immediately", async ({ page }) => {
    await expectNoAnimatedOutline(page.locator("main"));
  });
});

test.describe("reduced motion", () => {
  test("no motion with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await item(page, "Center").click();
    await expectNoMotion(page, page.locator("main"));
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/toggle-group", "/docs/toggle-group"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
