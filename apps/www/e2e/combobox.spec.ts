import { expect, test, type Page } from "./fixtures";
import { contrastRatio, WCAG_AA } from "akso-ui/tokens";
import { expectMinTargetSize, expectNoAxeViolations, expectNoHorizontalScroll, expectNoMotion, expectVisibleFocusRing, REFLOW_VIEWPORT, waitForAnimations } from "./helpers/a11y";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/combobox");
});

const input = (page: Page) => page.getByRole("combobox", { name: "Country" });

test("no axe violations, closed and open", async ({ page }) => {
  await expectNoAxeViolations(page);
  await input(page).fill("col");
  await expect(page.getByRole("listbox")).toBeVisible();
  // While the list is open, Base UI hides the rest of the page from assistive technology
  // (aria-hidden, so the virtual cursor stays in the combobox) without making it inert.
  // That is Base UI's design, kept on purpose; see the next test and ACCESSIBILITY.md.
  await expectNoAxeViolations(page, { disableRules: ["aria-hidden-focus"] });
});

test("Tab closes the list and the rest of the page is exposed again", async ({ page }) => {
  await input(page).focus();
  await page.keyboard.type("col");
  await expect(page.getByRole("listbox")).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("listbox")).toBeHidden();
  // getByRole ignores aria-hidden content: these are only found once the page is exposed again.
  await expect(page.getByRole("button", { name: "Continue" })).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Skip to main content" })).toHaveCount(1);
  await expectNoAxeViolations(page);
});
test("no axe violations on the docs page", async ({ page }) => {
  await page.goto("/docs/combobox");
  await expectNoAxeViolations(page);
});

test("typing filters and announces the count; no match shows and announces 'No results.'", async ({ page }) => {
  await input(page).fill("col");
  await expect(page.getByRole("option")).toHaveCount(1);
  await expect(page.locator('[data-slot="combobox-status"]')).toHaveText("1 result");
  await input(page).fill("zzz");
  await expect(page.getByText("No results.")).toBeVisible();
});

test("keyboard: arrows highlight, Enter chooses, focus stays in the input", async ({ page }) => {
  await input(page).focus();
  await page.keyboard.type("ecu");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(input(page)).toHaveValue("Ecuador");
  await expect(input(page)).toBeFocused();
});

test("submit without a choice: focus moves to the input and the error is linked", async ({ page }) => {
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(input(page)).toBeFocused();
  await expect(input(page)).toHaveAccessibleDescription(/Choose your country\./);
});

test("the input shows a visible focus ring with at least 3:1 contrast (on its group)", async ({ page }) => {
  await input(page).focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  const s = await page.locator('[data-slot="combobox-input-group"]').evaluate((el) => {
    const c = getComputedStyle(el);
    return { style: c.outlineStyle, width: Number.parseFloat(c.outlineWidth), color: c.outlineColor, bg: getComputedStyle(document.documentElement).backgroundColor };
  });
  expect(s.style).not.toBe("none");
  expect(s.width).toBeGreaterThanOrEqual(2);
  expect(contrastRatio(s.color, s.bg)).toBeGreaterThanOrEqual(WCAG_AA.nonText);
});

test("the highlighted option has a ring with at least 3:1 contrast; options are 44px", async ({ page }) => {
  await input(page).focus();
  await page.keyboard.type("c");
  await page.keyboard.press("ArrowDown");
  await waitForAnimations(page);
  const option = page.locator('[data-slot="combobox-item"][data-highlighted]');
  await expect(option).toHaveCount(1);
  const s = await option.evaluate((el) => ({
    ring: getComputedStyle(el).outlineColor,
    bg: getComputedStyle(el.closest('[data-slot="combobox-content"]') as HTMLElement).backgroundColor,
  }));
  expect(contrastRatio(s.ring, s.bg)).toBeGreaterThanOrEqual(WCAG_AA.nonText);
  await expectMinTargetSize(await page.getByRole("option").all(), 44);
});

test("the show-options button is 44px with a visible focus ring", async ({ page }) => {
  const open = page.getByRole("button", { name: "Show options" });
  await expectMinTargetSize([open], 44);
  await open.focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await expectVisibleFocusRing(page);
});

test("no motion with prefers-reduced-motion: reduce", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await input(page).fill("c");
  await expectNoMotion(page, page.locator('[data-slot="combobox-content"]'));
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/combobox", "/docs/combobox"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
  test("the open list fits", async ({ page }) => {
    await input(page).fill("c");
    const box = await page.getByRole("listbox").boundingBox();
    expect(box!.x + box!.width).toBeLessThanOrEqual(REFLOW_VIEWPORT.width);
  });
});
