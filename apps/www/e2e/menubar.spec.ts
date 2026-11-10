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
  await page.goto("/test/menubar");
});

const bar = (page: Page) => page.getByRole("menubar", { name: "Editor" });
const top = (page: Page, name: string) => bar(page).getByRole("menuitem", { name, exact: true });

test.describe("axe", () => {
  test("no violations closed and with a menu open", async ({ page }) => {
    await expectNoAxeViolations(page);
    await top(page, "View").click();
    await expect(page.getByRole("menu")).toBeVisible();
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/menubar");
    await expectNoAxeViolations(page);
  });
});

test.describe("keyboard", () => {
  test("one Tab stop; ← / → move between menus with a visible focus ring", async ({ page }) => {
    await top(page, "File").focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    expect((await expectVisibleFocusRing(page)).label).toBe("File");
    await page.keyboard.press("ArrowRight");
    expect((await expectVisibleFocusRing(page)).label).toBe("Edit");
    await page.keyboard.press("ArrowRight");
    expect((await expectVisibleFocusRing(page)).label).toBe("View");
  });
  test("↓ opens a menu; → while open moves to the next menu; Enter runs an item and is announced", async ({ page }) => {
    await top(page, "Edit").focus();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("menuitem", { name: "Undo (nothing to undo)" })).toBeVisible();
    await page.keyboard.press("ArrowLeft");
    await expect(top(page, "File")).toHaveAttribute("aria-expanded", "true");
    await top(page, "Edit").focus();
    // Wait for each state before the next key: Firefox can still be closing File when ↓ arrives.
    await expect(top(page, "File")).toHaveAttribute("aria-expanded", "false");
    await page.keyboard.press("ArrowDown");
    await expect(top(page, "Edit")).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("menuitem", { name: "Undo (nothing to undo)" })).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("menuitem", { name: "Copy" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("menu")).toBeHidden();
    await expect(page.getByRole("status")).toHaveText("Copy chosen.");
  });
  test("submenu: → opens Export; Enter runs PDF", async ({ page }) => {
    await top(page, "File").focus();
    await page.keyboard.press("ArrowDown");
    const exportItem = page.getByRole("menuitem", { name: "Export" });
    await exportItem.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("menuitem", { name: "PDF" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("status")).toHaveText("Export as PDF chosen.");
  });
});

test.describe("visual accessibility", () => {
  test("triggers and items are at least 44px tall", async ({ page }) => {
    await expectMinTargetSize(await bar(page).getByRole("menuitem").all(), 44);
    await top(page, "View").click();
    await expectMinTargetSize(await page.getByRole("menu").getByRole("menuitemradio").all(), 44);
  });
  test("the focus ring appears immediately", async ({ page }) => {
    await expectNoAnimatedOutline(page.locator("main"));
  });
});

test.describe("reduced motion", () => {
  test("no motion with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await top(page, "File").click();
    await expect(page.getByRole("menu")).toBeVisible();
    await expectNoMotion(page, page.getByRole("menu"));
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/menubar", "/docs/menubar"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
