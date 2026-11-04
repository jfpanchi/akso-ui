import { expect, test } from "@playwright/test";
import {
  expectMinTargetSize,
  expectNoAnimatedOutline,
  expectNoAxeViolations,
  expectNoHorizontalScroll,
  expectNoMotion,
  expectVisibleFocusRing,
  REFLOW_VIEWPORT,
} from "./helpers/a11y";
import { contrastRatio, WCAG_AA } from "akso-ui/tokens";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/tabs");
});

test("no axe violations", async ({ page }) => {
  await expectNoAxeViolations(page);
});
test("no axe violations on the docs page", async ({ page }) => {
  await page.goto("/docs/tabs");
  await expectNoAxeViolations(page);
});

test("arrows move focus, Enter activates, Tab goes to the panel", async ({ page }) => {
  await page.getByRole("tab", { name: "Profile" }).focus();
  await page.keyboard.press("ArrowRight");
  const password = page.getByRole("tab", { name: "Password" });
  await expect(password).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(password).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("tabpanel", { name: "Password" })).toBeFocused();
  await expectVisibleFocusRing(page);
});

test("selected tab: visible focus ring, thick underline with 3:1 contrast and bold text", async ({ page }) => {
  await page.getByRole("tab", { name: "Profile" }).focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowLeft");
  await expectVisibleFocusRing(page);
  const s = await page.getByRole("tab", { name: "Profile" }).evaluate((el) => {
    const c = getComputedStyle(el);
    return { width: Number.parseFloat(c.borderBottomWidth), color: c.borderBottomColor, weight: Number(c.fontWeight), bg: getComputedStyle(document.documentElement).backgroundColor };
  });
  expect(s.width).toBeGreaterThanOrEqual(3);
  expect(s.weight).toBeGreaterThanOrEqual(600);
  expect(contrastRatio(s.color, s.bg)).toBeGreaterThanOrEqual(WCAG_AA.nonText);
});

test("tabs are 44px tall and the focus ring appears immediately", async ({ page }) => {
  await expectMinTargetSize(await page.getByRole("tab").all(), 44);
  await expectNoAnimatedOutline(page.locator("main"));
});

test.describe("reduced motion", () => {
  test("no motion with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    
    await expectNoMotion(page, page.locator("main"));
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/tabs", "/docs/tabs"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
