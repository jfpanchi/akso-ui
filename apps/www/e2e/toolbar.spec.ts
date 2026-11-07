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
  await page.goto("/test/toolbar");
});

const toolbar = (page: Page) => page.getByRole("toolbar", { name: "Text formatting" });
const button = (page: Page, name: string) => toolbar(page).getByRole("button", { name, exact: true });

test.describe("axe", () => {
  test("no violations", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
  test("no violations after pressing toggles", async ({ page }) => {
    await button(page, "Bold").click();
    await button(page, "Center").click();
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/toolbar");
    await expectNoAxeViolations(page);
  });
});

test.describe("keyboard", () => {
  test("one Tab stop; arrows move through every control with a visible focus ring", async ({ page }) => {
    // Enter the toolbar with Tab, so :focus-visible applies.
    await button(page, "Bold").focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    const visited: string[] = [];
    for (let i = 0; i < 7; i++) {
      if (i > 0) await page.keyboard.press("ArrowRight");
      visited.push((await expectVisibleFocusRing(page)).label);
    }
    expect(visited).toEqual(["Bold", "Italic", "Left", "Center", "Undo", "Redo", "Help"]);
    await page.keyboard.press("ArrowRight");
    await expect(button(page, "Bold")).toBeFocused();
  });
  test("Space presses a toggle; the disabled Undo is focusable but does nothing", async ({ page }) => {
    await button(page, "Bold").focus();
    await page.keyboard.press("Space");
    await expect(button(page, "Bold")).toHaveAttribute("aria-pressed", "true");
    await button(page, "Undo").focus();
    await expect(button(page, "Undo")).toBeFocused();
    await expect(button(page, "Undo")).toHaveAttribute("aria-disabled", "true");
  });
});

test.describe("visual accessibility", () => {
  test("every control is at least 44×44px", async ({ page }) => {
    await expectMinTargetSize([...(await toolbar(page).getByRole("button").all()), toolbar(page).getByRole("link")], 44);
  });
  test("the focus ring appears immediately", async ({ page }) => {
    await expectNoAnimatedOutline(page.locator("main"));
  });
});

test.describe("reduced motion", () => {
  test("no motion with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await button(page, "Italic").click();
    await expectNoMotion(page, page.locator("main"));
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/toolbar", "/docs/toolbar"]) {
    test(`${path} has no horizontal scroll; the toolbar wraps`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
