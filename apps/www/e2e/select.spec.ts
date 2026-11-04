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
import { contrastRatio, WCAG_AA } from "akso-ui/tokens";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/select");
});

const trigger = (page: Page) => page.getByRole("combobox", { name: "Time zone" });

async function openWithKeyboard(page: Page) {
  await trigger(page).focus();
  await page.keyboard.press("ArrowDown");
  const listbox = page.getByRole("listbox");
  await expect(listbox).toBeVisible();
  return listbox;
}

test.describe("axe", () => {
  test("no violations closed", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
  test("no violations open", async ({ page }) => {
    await openWithKeyboard(page);
    await expectNoAxeViolations(page);
  });
  test("no violations after a submit without a choice", async ({ page }) => {
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Choose a time zone.")).toBeVisible();
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/select");
    await expectNoAxeViolations(page);
  });
});

test.describe("keyboard", () => {
  test("arrows, Enter: choose an option, focus returns to the trigger", async ({ page }) => {
    await openWithKeyboard(page);
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("listbox")).toBeHidden();
    await expect(trigger(page)).toBeFocused();
    await expect(trigger(page)).toContainText("Santiago");
  });

  test("typeahead jumps to a matching option", async ({ page }) => {
    await openWithKeyboard(page);
    await page.keyboard.type("m");
    await expect(page.getByRole("option", { name: "Madrid (UTC+1)" })).toBeFocused();
  });

  test("Escape closes without changing the value", async ({ page }) => {
    await openWithKeyboard(page);
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("listbox")).toBeHidden();
    await expect(trigger(page)).toBeFocused();
    await expect(trigger(page)).toContainText("Choose a time zone");
  });

  test("submit without a choice moves focus to the trigger and links the error", async ({ page }) => {
    await page.getByRole("button", { name: "Save" }).click();
    await expect(trigger(page)).toBeFocused();
    await expect(trigger(page)).toHaveAccessibleDescription(/Choose a time zone\./);
  });
});

test.describe("visual accessibility", () => {
  test("the trigger has a visible focus ring with at least 3:1 contrast", async ({ page }) => {
    await trigger(page).focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(trigger(page)).toBeFocused();
    await expectVisibleFocusRing(page);
  });

  test("the highlighted option has a ring with at least 3:1 contrast against the list", async ({ page }) => {
    await openWithKeyboard(page);
    await page.keyboard.press("ArrowDown");
    const option = page.locator('[data-slot="select-item"][data-highlighted]');
    await expect(option).toHaveCount(1);
    const { ring, width, background } = await option.evaluate((el) => {
      const s = getComputedStyle(el);
      const list = el.closest('[data-slot="select-content"]') as HTMLElement;
      return { ring: s.outlineColor, width: Number.parseFloat(s.outlineWidth), background: getComputedStyle(list).backgroundColor };
    });
    expect(width).toBeGreaterThanOrEqual(2);
    expect(contrastRatio(ring, background)).toBeGreaterThanOrEqual(WCAG_AA.nonText);
  });

  test("the chosen option has a visible check mark", async ({ page }) => {
    await openWithKeyboard(page);
    await page.keyboard.press("Enter");
    await expect(page.getByRole("listbox")).toBeHidden();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("listbox")).toBeVisible();
    const chosen = page.getByRole("option", { selected: true });
    await expect(chosen.locator("svg")).toBeVisible();
  });

  test("trigger and options are at least 44px tall", async ({ page }) => {
    await expectMinTargetSize([trigger(page)], 44);
    await openWithKeyboard(page);
    await expectMinTargetSize(await page.getByRole("option").all(), 44);
  });

  test("the focus ring appears immediately", async ({ page }) => {
    await expectNoAnimatedOutline(page.locator("main"));
  });
});

test.describe("reduced motion", () => {
  test("the list opens without motion with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openWithKeyboard(page);
    await expectNoMotion(page, page.locator('[data-slot="select-content"]'));
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/select", "/docs/select"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
  test("the open list fits the screen", async ({ page }) => {
    const listbox = await openWithKeyboard(page);
    const box = await listbox.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(REFLOW_VIEWPORT.width);
    await expectNoHorizontalScroll(page);
  });
});
