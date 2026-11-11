import { contrastRatio, WCAG_AA } from "akso-ui/tokens";
import { expect, test } from "./fixtures";
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
  await page.goto("/test/stepper");
});

test.describe("axe", () => {
  test("no violations on the test page", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/stepper");
    await expectNoAxeViolations(page);
  });
});

// Browsers put a space before the hidden ", Step 1 of 4" text (it is positioned absolutely);
// screen readers read it as a short pause, so names are matched with optional spaces.
test.describe("name and state", () => {
  test("a named navigation; steps say their number and state", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Checkout steps" });
    await expect(nav.getByRole("listitem")).toHaveCount(4);
    await expect(nav.getByRole("link", { name: /^Cart\s*, Step 1 of 4, completed$/ })).toBeVisible();
    await expect(nav.locator('[aria-current="step"]')).toContainText("Payment");
  });
});

test.describe("keyboard", () => {
  test("Continue moves to the next step and focus goes to its heading", async ({ page }) => {
    await page.getByRole("button", { name: "Continue" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { name: "Review" })).toBeFocused();
    await expect(page.locator('[aria-current="step"]')).toContainText("Review");
    await expect(page.getByRole("link", { name: /^Payment\s*, Step 3 of 4, completed$/ })).toBeVisible();
  });
});

test.describe("visual accessibility", () => {
  test("step links have a focus ring with at least 3:1 contrast and are 44px tall", async ({ page }) => {
    const link = page.getByRole("link", { name: /^Cart/ });
    await link.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(link).toBeFocused();
    await expectVisibleFocusRing(page);
    await expectMinTargetSize([link, page.getByRole("link", { name: /^Shipping/ })], 44);
  });
  test("markers: at least 3:1 against the page", async ({ page }) => {
    for (const marker of await page.locator('[data-slot="stepper-marker"]').all()) {
      const { border, fill, page: bg } = await marker.evaluate((el) => {
        const s = getComputedStyle(el);
        return { border: s.borderTopColor, fill: s.backgroundColor, page: getComputedStyle(document.body).backgroundColor };
      });
      const color = fill !== "rgba(0, 0, 0, 0)" ? fill : border;
      expect(contrastRatio(color, bg)).toBeGreaterThanOrEqual(WCAG_AA.nonText);
    }
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
  for (const path of ["/test/stepper", "/docs/stepper"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
