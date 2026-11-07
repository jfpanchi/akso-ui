import { expect, test, type Page } from "./fixtures";
import { contrastRatio, WCAG_AA } from "akso-ui/tokens";
import { expectMinTargetSize, expectNoAnimatedOutline, expectNoAxeViolations, expectNoHorizontalScroll, expectVisibleFocusRing, REFLOW_VIEWPORT } from "./helpers/a11y";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/breadcrumb");
});

const nav = (page: Page) => page.getByRole("navigation", { name: "Breadcrumb" });

test.describe("axe", () => {
  test("no violations", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/breadcrumb");
    await expectNoAxeViolations(page);
  });
});

test.describe("name, role and state", () => {
  test("a named navigation with a list of 4 levels; the last one is the current page", async ({ page }) => {
    await expect(nav(page).getByRole("listitem")).toHaveCount(4);
    await expect(nav(page).locator('[aria-current="page"]')).toHaveText(/Phone with a very long product name/);
    await expect(nav(page).getByRole("link")).toHaveCount(3);
  });
});

test.describe("keyboard", () => {
  test("Tab goes through the three links with a visible focus ring; the current page is skipped", async ({ page }) => {
    await nav(page).getByRole("link", { name: "Home" }).focus();
    await page.keyboard.press("Shift+Tab");
    const labels: string[] = [];
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press("Tab");
      labels.push((await expectVisibleFocusRing(page)).label);
    }
    expect(labels).toEqual(["Home", "Store", "Phones"]);
    await page.keyboard.press("Tab");
    await expect(page.locator('[aria-current="page"]')).not.toBeFocused();
  });
});

test.describe("visual accessibility", () => {
  test("links are underlined and have at least 4.5:1 contrast; separators are hidden from assistive technology", async ({ page }) => {
    const link = nav(page).getByRole("link", { name: "Store" });
    const s = await link.evaluate((el) => {
      const c = getComputedStyle(el);
      let bg = getComputedStyle(document.documentElement).backgroundColor;
      for (let n = el.parentElement; n; n = n.parentElement) {
        const b = getComputedStyle(n).backgroundColor;
        if (b !== "rgba(0, 0, 0, 0)" && b !== "transparent") {
          bg = b;
          break;
        }
      }
      return { line: c.textDecorationLine, color: c.color, bg };
    });
    expect(s.line).toContain("underline");
    expect(contrastRatio(s.color, s.bg)).toBeGreaterThanOrEqual(WCAG_AA.text);
    await expect(nav(page).locator('svg[aria-hidden="true"]:visible')).toHaveCount(3);
  });
  test("links are at least 44px tall and 24px wide", async ({ page }) => {
    await expectMinTargetSize(await nav(page).getByRole("link").all(), 24);
    for (const link of await nav(page).getByRole("link").all()) expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44 - 0.01);
  });
  test("the focus ring appears immediately", async ({ page }) => {
    await expectNoAnimatedOutline(page.locator("main"));
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/breadcrumb", "/docs/breadcrumb"]) {
    test(`${path} has no horizontal scroll; long names wrap`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
