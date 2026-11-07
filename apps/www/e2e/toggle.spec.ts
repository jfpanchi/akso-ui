import { expect, test, type Page } from "./fixtures";
import { contrastRatio, WCAG_AA } from "akso-ui/tokens";
import {
  expectMinTargetSize,
  expectNoAnimatedOutline,
  expectNoAxeViolations,
  expectNoHorizontalScroll,
  expectNoMotion,
  expectVisibleFocusRingsWhileTabbing,
  REFLOW_VIEWPORT,
  waitForAnimations,
} from "./helpers/a11y";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/toggle");
});

const mute = (page: Page) => page.getByRole("button", { name: "Mute notifications" });

test.describe("axe", () => {
  test("no violations (off, pressed, icon-only, disabled)", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
  test("no violations after pressing it", async ({ page }) => {
    await mute(page).click();
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/toggle");
    await expectNoAxeViolations(page);
  });
});

test.describe("keyboard", () => {
  test("Space and Enter press and release it; the name stays the same", async ({ page }) => {
    await mute(page).focus();
    await page.keyboard.press("Space");
    await expect(mute(page)).toHaveAttribute("aria-pressed", "true");
    await page.keyboard.press("Enter");
    await expect(mute(page)).toHaveAttribute("aria-pressed", "false");
  });
  test("the disabled toggle is skipped by Tab", async ({ page }) => {
    await page.getByRole("button", { name: "Bold" }).focus();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Autoplay (not available)" })).not.toBeFocused();
  });
});

test.describe("visual accessibility", () => {
  test("every toggle has a visible focus ring with at least 3:1 contrast, off and pressed", async ({ page }) => {
    await mute(page).focus();
    await page.keyboard.press("Shift+Tab");
    expect(await expectVisibleFocusRingsWhileTabbing(page, 2)).toEqual(["Mute notifications", "Bold"]);
  });

  test("pressed is shown with a fill and a bar, not only color", async ({ page }) => {
    const bar = () => mute(page).evaluate((el) => getComputedStyle(el, "::after").height);
    expect(await bar()).toMatch(/^(auto|0px)$/);
    await mute(page).click();
    await waitForAnimations(page);
    expect(Number.parseFloat(await bar())).toBeGreaterThanOrEqual(2);
    const { fill, page: bg } = await mute(page).evaluate((el) => ({
      fill: getComputedStyle(el).backgroundColor,
      page: getComputedStyle(document.documentElement).backgroundColor,
    }));
    expect(contrastRatio(fill, bg), "pressed fill against the page").toBeGreaterThanOrEqual(WCAG_AA.nonText);
  });

  test("targets are at least 44×44px", async ({ page }) => {
    await expectMinTargetSize(await page.locator('[data-slot="toggle"]').all(), 44);
  });

  test("the focus ring appears immediately", async ({ page }) => {
    await expectNoAnimatedOutline(page.locator("main"));
  });
});

test.describe("reduced motion", () => {
  test("no motion with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await mute(page).click();
    await expectNoMotion(page, page.locator("main"));
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/toggle", "/docs/toggle"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
