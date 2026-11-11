import { expect, test } from "./fixtures";
import { expectNoAnimatedOutline, expectNoAxeViolations, expectNoHorizontalScroll, expectNoMotion, expectVisibleFocusRing, REFLOW_VIEWPORT } from "./helpers/a11y";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/link");
});

test.describe("axe", () => {
  test("no violations on the test page", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/link");
    await expectNoAxeViolations(page);
  });
});

test.describe("name", () => {
  test("a new-tab link says so in its name", async ({ page }) => {
    const link = page.getByRole("link", { name: /^Base UI\s*\(opens in a new tab\)$/ });
    await expect(link).toHaveAttribute("target", "_blank");
  });
});

test.describe("keyboard", () => {
  test("Tab reaches the links; each shows a focus ring with at least 3:1 contrast", async ({ page }) => {
    const notes = page.getByRole("link", { name: "accessibility notes" });
    await notes.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(notes).toBeFocused();
    await expectVisibleFocusRing(page);
    await page.keyboard.press("Tab");
    await expectVisibleFocusRing(page);
  });
});

test.describe("visual accessibility", () => {
  test("links are underlined, not shown by color alone", async ({ page }) => {
    for (const link of await page.locator('[data-slot="link"]').all()) {
      expect(await link.evaluate((el) => getComputedStyle(el).textDecorationLine)).toContain("underline");
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
  for (const path of ["/test/link", "/docs/link"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
