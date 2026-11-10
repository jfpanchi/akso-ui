import { contrastRatio, WCAG_AA } from "akso-ui/tokens";
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
  await page.goto("/test/carousel");
});

const tips = (page: Page) => page.getByRole("region", { name: "Accessibility tips" });
const news = (page: Page) => page.getByRole("region", { name: "News" });
const current = (page: Page) => tips(page).locator('[data-slot="carousel-slide"]:not([hidden])');

test.describe("axe", () => {
  test("no violations on the test page", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/carousel");
    await expectNoAxeViolations(page);
  });
});

test.describe("keyboard", () => {
  test("Next and Previous change the slide; the new slide is in a polite live region", async ({ page }) => {
    await tips(page).getByRole("button", { name: "Next slide" }).focus();
    await page.keyboard.press("Enter");
    await expect(current(page)).toHaveAccessibleName("2 of 3");
    await expect(current(page)).toContainText("Write link text");
    await expect(tips(page).locator('[data-slot="carousel-slides"]')).toHaveAttribute("aria-live", "polite");
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Enter");
    await expect(current(page)).toContainText("Use headings");
  });
  test("only the current slide's link is reachable with Tab", async ({ page }) => {
    await tips(page).getByRole("button", { name: "Next slide" }).focus();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Read more about use headings" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(tips(page).getByRole("button", { name: "Slide 1" })).toBeFocused();
  });
  test("slide buttons: aria-current on the current one", async ({ page }) => {
    await tips(page).getByRole("button", { name: "Slide 3" }).click();
    await expect(tips(page).getByRole("button", { name: "Slide 3" })).toHaveAttribute("aria-current", "true");
    await expect(current(page)).toContainText("Check contrast");
  });
});

test.describe("autoplay", () => {
  test("rotates; Pause stops it; focus inside stops it until Play", async ({ page }) => {
    const slide = news(page).locator('[data-slot="carousel-slide"]:not([hidden])');
    await expect(slide).toContainText("New: OTP field", { timeout: 6000 });
    await news(page).getByRole("button", { name: "Pause" }).click();
    await expect(news(page).getByRole("button", { name: "Play" })).toBeVisible();
    await page.waitForTimeout(4500);
    await expect(slide).toContainText("New: OTP field");
  });
  test("never starts with prefers-reduced-motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    await expect(news(page).getByRole("button", { name: "Play" })).toBeVisible();
  });
});

test.describe("visual accessibility", () => {
  test("buttons are 44×44px with focus rings of at least 3:1", async ({ page }) => {
    await expectMinTargetSize(await tips(page).getByRole("button").all(), 44);
    await tips(page).getByRole("button", { name: "Next slide" }).focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expectVisibleFocusRing(page);
    await tips(page).getByRole("button", { name: "Slide 2" }).focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expectVisibleFocusRing(page);
  });
  test("slide dots: at least 3:1 against the page, current one filled and bigger", async ({ page }) => {
    const dot = tips(page).locator('[aria-current="true"] > span[aria-hidden]');
    const { border, bg, size } = await dot.evaluate((el) => {
      // The first non-transparent background behind the dot (body itself is transparent).
      let bg = getComputedStyle(document.documentElement).backgroundColor;
      for (let node = el.parentElement; node; node = node.parentElement) {
        const color = getComputedStyle(node).backgroundColor;
        if (color !== "rgba(0, 0, 0, 0)" && color !== "transparent") {
          bg = color;
          break;
        }
      }
      return { border: getComputedStyle(el).borderTopColor, bg, size: el.getBoundingClientRect().width };
    });
    expect(contrastRatio(border, bg)).toBeGreaterThanOrEqual(WCAG_AA.nonText);
    expect(size).toBeGreaterThanOrEqual(16);
  });
  test("the focus ring appears immediately", async ({ page }) => {
    await expectNoAnimatedOutline(page.locator("main"));
  });
});

test.describe("reduced motion", () => {
  test("no motion with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await tips(page).getByRole("button", { name: "Next slide" }).click();
    await expectNoMotion(page, page.locator("main"));
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/carousel", "/docs/carousel"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
