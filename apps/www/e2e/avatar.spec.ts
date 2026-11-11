import { expect, test } from "./fixtures";
import { expectNoAxeViolations, expectNoHorizontalScroll, expectNoMotion, REFLOW_VIEWPORT } from "./helpers/a11y";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/avatar");
});

test.describe("axe", () => {
  test("no violations, after the pictures load or fail", async ({ page }) => {
    await expect(page.locator('[data-slot="avatar-image"]').first()).toBeVisible();
    await expect(page.getByRole("img", { name: "Ana Gómez" })).toHaveText("AG");
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/avatar");
    await expectNoAxeViolations(page);
  });
});

test.describe("name", () => {
  test("each avatar has one name, with or without its picture", async ({ page }) => {
    const main = page.getByRole("main");
    await expect(page.locator('[data-slot="avatar-image"]').first()).toBeVisible();
    await expect(main.getByRole("img", { name: "Laura Torres" })).toHaveCount(1);
    await expect(main.getByRole("img", { name: "Mateo Ruiz" })).toHaveText("MR");
    // The picture failed to load: the initials are shown, the name stays the same.
    await expect(main.getByRole("img", { name: "Ana Gómez" })).toHaveText("AG");
  });
  test("decorative avatars are hidden, so the written name is read once", async ({ page }) => {
    const team = page.getByRole("list", { name: "Team" });
    await expect(team.getByRole("img")).toHaveCount(0);
    await expect(team.getByRole("listitem").first()).toHaveText("Laura Torres");
  });
});

test.describe("keyboard", () => {
  test("avatars are not in the Tab order", async ({ page }) => {
    const focusable = await page.locator('[data-slot="avatar"]').evaluateAll((els) => els.filter((el) => el.matches("[tabindex], a, button")).length);
    expect(focusable).toBe(0);
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
  for (const path of ["/test/avatar", "/docs/avatar"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
