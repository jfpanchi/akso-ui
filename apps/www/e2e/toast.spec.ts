import { expect, test, type Page } from "@playwright/test";
import {
  expectNoAxeViolations,
  expectNoHorizontalScroll,
  expectNoMotion,
  expectVisibleFocusRing,
  REFLOW_VIEWPORT,
} from "./helpers/a11y";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/toast");
});

const toasts = (page: Page) => page.locator('[data-slot="toast"]');

test.describe("axe", () => {
  test("no violations with several toasts shown", async ({ page }) => {
    await page.getByRole("button", { name: "Save" }).click();
    await page.getByRole("button", { name: "Upload" }).click();
    await expect(toasts(page)).toHaveCount(2);
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/toast");
    await expectNoAxeViolations(page);
  });
});

test.describe("keyboard and announcements", () => {
  test("showing a toast does not move focus", async ({ page }) => {
    const save = page.getByRole("button", { name: "Save" });
    await save.focus();
    await page.keyboard.press("Enter");
    await expect(toasts(page)).toHaveCount(1);
    await expect(save).toBeFocused();
  });

  test("errors are announced urgently (role=alert)", async ({ page }) => {
    await page.getByRole("button", { name: "Upload" }).click();
    // Next.js also has a role=alert (its route announcer), so filter by text.
    await expect(page.getByRole("alert").filter({ hasText: "Upload failed" })).toHaveCount(1);
  });

  test("F6 reaches the toasts; the action works with the keyboard", async ({ page }) => {
    await page.getByRole("button", { name: "Archive message" }).click();
    await expect(toasts(page)).toHaveCount(1);
    await page.keyboard.press("F6");
    await expect.poll(() => page.evaluate(() => !!document.activeElement?.closest('[data-slot="toast-viewport"]'))).toBe(true);
    const undo = page.getByRole("button", { name: "Undo" });
    await undo.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText("Message restored")).toBeVisible();
  });

  test("an error stays after 8 seconds; a success does not", async ({ page }) => {
    await page.clock.install();
    await page.goto("/test/toast");
    await page.getByRole("button", { name: "Upload" }).click();
    await page.getByRole("button", { name: "Save" }).click();
    await expect(toasts(page)).toHaveCount(2);
    await page.mouse.move(0, 0);
    await page.clock.runFor(8000);
    await expect(toasts(page)).toHaveCount(1);
    await expect(toasts(page).first()).toContainText("Upload failed");
  });
});

test.describe("visual accessibility", () => {
  test("every toast shows an icon and all toasts are fully visible (not stacked)", async ({ page }) => {
    await page.getByRole("button", { name: "Save" }).click();
    await page.getByRole("button", { name: "Upload" }).click();
    await expect(toasts(page)).toHaveCount(2);
    const boxes = await toasts(page).evaluateAll((els) => els.map((el) => el.getBoundingClientRect()).map((r) => ({ top: r.top, bottom: r.bottom })));
    const [a, b] = boxes.sort((x, y) => x.top - y.top);
    expect(a!.bottom).toBeLessThanOrEqual(b!.top);
    for (const t of await toasts(page).all()) await expect(t.locator("svg[data-status-icon]")).toBeVisible();
  });

  test("the close button has a visible focus ring and is at least 24px", async ({ page }) => {
    await page.getByRole("button", { name: "Upload" }).click();
    await page.keyboard.press("F6");
    const close = page.locator('[data-slot="toast-close"]').first();
    await close.focus();
    await expectVisibleFocusRing(page);
    const box = await close.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(24);
    expect(box!.height).toBeGreaterThanOrEqual(24);
  });
});

test.describe("reduced motion", () => {
  test("toasts appear without motion with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.getByRole("button", { name: "Save" }).click();
    await expect(toasts(page)).toHaveCount(1);
    await expectNoMotion(page, toasts(page).first());
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  test("toasts fit the screen", async ({ page }) => {
    await page.getByRole("button", { name: "Upload" }).click();
    const box = await toasts(page).first().boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(REFLOW_VIEWPORT.width);
    await expectNoHorizontalScroll(page);
  });
  test("/docs/toast has no horizontal scroll", async ({ page }) => {
    await page.goto("/docs/toast");
    await expectNoHorizontalScroll(page);
  });
});
