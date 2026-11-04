import { expect, test } from "@playwright/test";
import { expectMinTargetSize, expectNoAxeViolations, expectNoHorizontalScroll, expectNoMotion, REFLOW_VIEWPORT } from "./helpers/a11y";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/slider");
});

test("no axe violations", async ({ page }) => {
  await expectNoAxeViolations(page);
});
test("no axe violations on the docs page", async ({ page }) => {
  await page.goto("/docs/slider");
  await expectNoAxeViolations(page);
});

test("keyboard: arrows, Home and End change the value; it is shown as text", async ({ page }) => {
  const volume = page.getByRole("slider", { name: "Volume" });
  await volume.focus();
  await page.keyboard.press("ArrowRight");
  await expect(volume).toHaveAttribute("aria-valuenow", "45");
  await page.keyboard.press("End");
  await expect(volume).toHaveAttribute("aria-valuenow", "100");
  await expect(page.locator('[data-slot="slider-value"]').first()).toHaveText("100");
});

test("single-tap alternative to dragging: the + and − buttons", async ({ page }) => {
  const volume = page.getByRole("slider", { name: "Volume" });
  await page.getByRole("button", { name: "Increase" }).first().click();
  await expect(volume).toHaveAttribute("aria-valuenow", "45");
  await page.getByRole("button", { name: "Decrease" }).first().click();
  await page.getByRole("button", { name: "Decrease" }).first().click();
  await expect(volume).toHaveAttribute("aria-valuenow", "35");
});

test("clicking the track moves the value (no dragging needed)", async ({ page }) => {
  const volume = page.getByRole("slider", { name: "Volume" });
  const track = page.locator('[data-slot="slider-control"]').first();
  const box = (await track.boundingBox())!;
  await page.mouse.click(box.x + box.width * 0.9, box.y + box.height / 2);
  expect(Number(await volume.getAttribute("aria-valuenow"))).toBeGreaterThan(70);
});

test("friendly value text", async ({ page }) => {
  await expect(page.getByRole("slider", { name: "Room temperature" })).toHaveAttribute("aria-valuetext", "21 degrees");
});

test("the thumb has a visible focus ring; thumb and buttons are at least 24px", async ({ page }) => {
  await page.getByRole("slider", { name: "Volume" }).focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  const ring = await page.locator('[data-slot="slider-thumb"]').first().evaluate((el) => {
    const c = getComputedStyle(el);
    return { style: c.outlineStyle, width: Number.parseFloat(c.outlineWidth) };
  });
  expect(ring.style).not.toBe("none");
  expect(ring.width).toBeGreaterThanOrEqual(2);
  await expectMinTargetSize([page.locator('[data-slot="slider-thumb"]').first()], 24);
  await expectMinTargetSize(await page.getByRole("button").all(), 44);
});

test("no motion with prefers-reduced-motion: reduce", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expectNoMotion(page, page.locator("main"));
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/slider", "/docs/slider"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
