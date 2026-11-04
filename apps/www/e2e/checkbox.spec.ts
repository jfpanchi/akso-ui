import { expect, test } from "./fixtures";
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
  await page.goto("/test/checkbox");
});

test.describe("axe", () => {
  test("no violations (unchecked, checked, partly checked, disabled)", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/checkbox");
    await expectNoAxeViolations(page);
  });
});

test.describe("keyboard and state", () => {
  test("Space toggles; the parent checkbox becomes mixed, then checked", async ({ page }) => {
    const parent = page.getByRole("checkbox", { name: "Select all items" });
    await expect(parent).toHaveAttribute("aria-checked", "mixed");
    await page.getByRole("checkbox", { name: "Bread" }).focus();
    await page.keyboard.press("Space");
    await expect(parent).toHaveAttribute("aria-checked", "true");
    await parent.focus();
    await page.keyboard.press("Space");
    await expect(page.getByRole("checkbox", { name: "Milk" })).toHaveAttribute("aria-checked", "false");
  });

  test("clicking the text toggles the box", async ({ page }) => {
    const remember = page.getByRole("checkbox", { name: "Remember me on this device" });
    await page.getByText("Remember me on this device").click();
    await expect(remember).toHaveAttribute("aria-checked", "false");
  });

  test("the disabled checkbox is skipped by Tab", async ({ page }) => {
    await page.getByRole("checkbox", { name: "Bread" }).focus();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("checkbox", { name: "Not available right now" })).not.toBeFocused();
  });
});

test.describe("visual accessibility", () => {
  test("every checkbox has a visible focus ring with at least 3:1 contrast", async ({ page }) => {
    await page.getByRole("checkbox", { name: "Remember me on this device" }).focus();
    await page.keyboard.press("Shift+Tab");
    expect(await expectVisibleFocusRingsWhileTabbing(page, 4)).toHaveLength(4);
  });

  test("checked and mixed show different icons, not only a color", async ({ page }) => {
    const visibleIcon = (name: string) =>
      page.getByRole("checkbox", { name }).locator("svg").evaluateAll((svgs) => svgs.filter((s) => getComputedStyle(s).display !== "none").map((s) => s.innerHTML));
    const checked = await visibleIcon("Remember me on this device");
    const mixed = await visibleIcon("Select all items");
    expect(checked).toHaveLength(1);
    expect(mixed).toHaveLength(1);
    expect(checked[0]).not.toBe(mixed[0]);
  });

  test("each row (box + text) is at least 24px; in fact 44px", async ({ page }) => {
    await expectMinTargetSize(await page.locator('[data-slot="checkbox-label"]').all(), 44);
  });

  test("the focus ring appears immediately", async ({ page }) => {
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
  for (const path of ["/test/checkbox", "/docs/checkbox"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
