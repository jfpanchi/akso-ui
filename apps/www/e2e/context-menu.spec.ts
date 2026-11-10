import { expect, test, type Page } from "./fixtures";
import { expectMinTargetSize, expectNoAnimatedOutline, expectNoAxeViolations, expectNoHorizontalScroll, expectNoMotion, REFLOW_VIEWPORT } from "./helpers/a11y";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/context-menu");
});

const fileLink = (page: Page) => page.getByRole("link", { name: "Annual report.pdf" });
const menu = (page: Page) => page.getByRole("menu");

test.describe("axe", () => {
  test("no violations closed and open", async ({ page }) => {
    await expectNoAxeViolations(page);
    await fileLink(page).click({ button: "right" });
    await expect(menu(page)).toBeVisible();
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/context-menu");
    await expectNoAxeViolations(page);
  });
});

test.describe("keyboard", () => {
  test("Shift+F10 on the focused link opens the menu; arrows and Enter choose an item", async ({ page }) => {
    await fileLink(page).focus();
    await page.keyboard.press("Shift+F10");
    await expect(menu(page)).toBeVisible();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("menuitem", { name: "Rename" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(menu(page)).toBeHidden();
    await expect(page.getByRole("status")).toHaveText("Rename chosen.");
  });
  test("Escape closes it", async ({ page }) => {
    await fileLink(page).click({ button: "right" });
    await expect(menu(page)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu(page)).toBeHidden();
  });
  test("the same actions are reachable with a visible button", async ({ page }) => {
    await page.getByRole("button", { name: "Actions for Annual report.pdf" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("menuitem", { name: "Rename" })).toBeVisible();
  });
});

test.describe("visual accessibility", () => {
  test("items are at least 44px tall", async ({ page }) => {
    await fileLink(page).click({ button: "right" });
    await expectMinTargetSize(await page.getByRole("menuitem").all(), 44);
  });
  test("the focus ring appears immediately", async ({ page }) => {
    await expectNoAnimatedOutline(page.locator("main"));
  });
});

test.describe("reduced motion", () => {
  test("no motion with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await fileLink(page).click({ button: "right" });
    await expect(menu(page)).toBeVisible();
    await expectNoMotion(page, menu(page));
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/context-menu", "/docs/context-menu"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
