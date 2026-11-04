/**
 * Windows high contrast (forced colors). The browser replaces most colors with the person's
 * system colors and removes backgrounds, so anything drawn only with a background or a color
 * can disappear. These checks run in Chromium, which can emulate forced colors.
 */
import { expect, test, type Locator, type Page } from "./fixtures";
import { contrastRatio, WCAG_AA } from "akso-ui/tokens";
import { expectVisibleFocusRing } from "./helpers/a11y";

test.skip(({ browserName }) => browserName !== "chromium", "Only Chromium can emulate forced colors.");

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active" });
});

/** Contrast of an element's own fill against the first non-transparent background behind it. */
async function fillContrast(target: Locator) {
  const { own, behind } = await target.evaluate((el) => {
    let behind = getComputedStyle(document.documentElement).backgroundColor;
    for (let n = el.parentElement; n; n = n.parentElement) {
      const c = getComputedStyle(n).backgroundColor;
      if (c !== "rgba(0, 0, 0, 0)" && c !== "transparent") {
        behind = c;
        break;
      }
    }
    return { own: getComputedStyle(el).backgroundColor, behind };
  });
  return contrastRatio(own, behind);
}

/** A visible outline (border) with ≥3:1 contrast against the page. */
async function expectVisibleBorder(target: Locator, label: string) {
  const s = await target.evaluate((el) => {
    const c = getComputedStyle(el);
    return { width: Number.parseFloat(c.borderTopWidth), style: c.borderTopStyle, color: c.borderTopColor, page: getComputedStyle(document.documentElement).backgroundColor };
  });
  expect(s.width, `${label}: border width`).toBeGreaterThanOrEqual(1);
  expect(s.style, `${label}: border style`).not.toBe("none");
  expect(contrastRatio(s.color, s.page), `${label}: border contrast`).toBeGreaterThanOrEqual(WCAG_AA.nonText);
}

async function goto(page: Page, path: string) {
  await page.goto(path);
  await page.evaluate(() => Promise.all(document.getAnimations().filter((a) => a.effect?.getComputedTiming().endTime !== Infinity).map((a) => a.finished.catch(() => undefined))));
}

test("every button variant keeps a visible outline", async ({ page }) => {
  await goto(page, "/test/button");
  for (const name of ["Primary", "Secondary", "Delete", "Small", "Save changes"]) {
    await expectVisibleBorder(page.getByRole("button", { name }), name);
  }
});

test("the focus ring is still visible", async ({ page }) => {
  await goto(page, "/test/button");
  await page.getByRole("button", { name: "Primary" }).focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await expectVisibleFocusRing(page);
});

test("checkbox: box border and check mark stay visible", async ({ page }) => {
  await goto(page, "/test/checkbox");
  const box = page.getByRole("checkbox", { name: "Remember me on this device" });
  await expectVisibleBorder(box, "checkbox");
  const stroke = await box.locator("svg").first().evaluate((el) => getComputedStyle(el).color);
  const bg = await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);
  expect(contrastRatio(stroke, bg)).toBeGreaterThanOrEqual(WCAG_AA.nonText);
});

test("radio: the chosen dot stays visible", async ({ page }) => {
  await goto(page, "/test/radio-group");
  await page.getByText("Express: 1 to 2 days, $5").click();
  expect(await fillContrast(page.locator('[data-slot="radio-indicator"]').first())).toBeGreaterThanOrEqual(WCAG_AA.nonText);
});

test("switch: the thumb stays visible, off and on", async ({ page }) => {
  await goto(page, "/test/switch");
  const sw = page.getByRole("switch", { name: "Email notifications" });
  const thumb = sw.locator('[data-slot="switch-thumb"]');
  expect(await fillContrast(thumb), "off").toBeGreaterThanOrEqual(WCAG_AA.nonText);
  await sw.click();
  expect(await fillContrast(thumb), "on").toBeGreaterThanOrEqual(WCAG_AA.nonText);
  await expectVisibleBorder(sw, "switch track");
});

for (const [path, slot] of [
  ["/test/progress", "progress-indicator"],
  ["/test/meter", "meter-indicator"],
  ["/test/slider", "slider-indicator"],
] as const) {
  test(`${slot}: the bar stays visible`, async ({ page }) => {
    await goto(page, path);
    expect(await fillContrast(page.locator(`[data-slot="${slot}"]`).first())).toBeGreaterThanOrEqual(WCAG_AA.nonText);
  });
}

test("tabs: the selected tab keeps its underline", async ({ page }) => {
  await goto(page, "/test/tabs");
  const s = await page.getByRole("tab", { name: "Profile" }).evaluate((el) => {
    const c = getComputedStyle(el);
    return { width: Number.parseFloat(c.borderBottomWidth), color: c.borderBottomColor, page: getComputedStyle(document.documentElement).backgroundColor };
  });
  expect(s.width).toBeGreaterThanOrEqual(3);
  expect(contrastRatio(s.color, s.page)).toBeGreaterThanOrEqual(WCAG_AA.nonText);
});

test("inputs and select keep a visible border", async ({ page }) => {
  await goto(page, "/test/input");
  await expectVisibleBorder(page.getByRole("textbox", { name: "Phone number" }), "input");
  await goto(page, "/test/select");
  await expectVisibleBorder(page.getByRole("combobox", { name: "Time zone" }), "select trigger");
});

test("dialog: the window has a visible edge", async ({ page }) => {
  await goto(page, "/test/dialog");
  await page.getByRole("button", { name: "Edit profile" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => undefined))));
  await expectVisibleBorder(dialog, "dialog");
});
