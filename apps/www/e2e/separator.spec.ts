import { contrastRatio, WCAG_AA } from "akso-ui/tokens";
import { expect, test } from "./fixtures";
import { expectNoAxeViolations, expectNoHorizontalScroll, expectNoMotion, REFLOW_VIEWPORT } from "./helpers/a11y";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/separator");
});

test.describe("axe", () => {
  test("no violations on the test page", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/separator");
    await expectNoAxeViolations(page);
  });
});

test.describe("roles", () => {
  test("one separator is announced; the decorative ones are hidden", async ({ page }) => {
    await expect(page.getByRole("main").getByRole("separator")).toHaveCount(1);
    await expect(page.locator('[data-slot="separator"][aria-hidden="true"]')).toHaveCount(2);
  });
});

test.describe("keyboard", () => {
  test("Tab goes from link to link, never to a separator", async ({ page }) => {
    await page.getByRole("link", { name: "Help" }).focus();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Privacy" })).toBeFocused();
  });
});

test.describe("visual accessibility", () => {
  test("lines are visible: at least 1px and 3:1 against the background", async ({ page }) => {
    for (const line of await page.locator('[data-slot="separator"]').all()) {
      const { color, width, background } = await line.evaluate((el) => {
        const s = getComputedStyle(el);
        const vertical = el.getAttribute("data-orientation") === "vertical";
        let bg = "rgb(255, 255, 255)";
        for (let n = el.parentElement; n; n = n.parentElement) {
          const c = getComputedStyle(n).backgroundColor;
          if (c !== "rgba(0, 0, 0, 0)" && c !== "transparent") {
            bg = c;
            break;
          }
        }
        return {
          color: vertical ? s.borderLeftColor : s.borderTopColor,
          width: Number.parseFloat(vertical ? s.borderLeftWidth : s.borderTopWidth),
          background: bg,
        };
      });
      expect(width).toBeGreaterThanOrEqual(1);
      expect(contrastRatio(color, background)).toBeGreaterThanOrEqual(WCAG_AA.nonText);
    }
  });
  test("lines stay visible in forced colors", async ({ page }) => {
    await page.emulateMedia({ forcedColors: "active" });
    const width = await page.locator('[data-slot="separator"]').first().evaluate((el) => Number.parseFloat(getComputedStyle(el).borderTopWidth));
    expect(width).toBeGreaterThanOrEqual(1);
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
  for (const path of ["/test/separator", "/docs/separator"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
