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

test.beforeEach(async ({ page }) => {
  await page.goto("/test/accordion");
});

const trigger = (page: Page, name: string) => page.getByRole("button", { name });

test("no axe violations, closed and open", async ({ page }) => {
  await expectNoAxeViolations(page);
  await trigger(page, "Can I return an item?").click();
  await expectNoAxeViolations(page);
});
test("no axe violations on the docs page", async ({ page }) => {
  await page.goto("/docs/accordion");
  await expectNoAxeViolations(page);
});

test("triggers are inside headings; Enter opens; aria-expanded follows", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 3, name: "How long does shipping take?" })).toBeVisible();
  const t = trigger(page, "How long does shipping take?");
  await t.focus();
  await page.keyboard.press("Enter");
  await expect(t).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText("Between 3 and 5 working days.", { exact: false })).toBeVisible();
  await expectVisibleFocusRing(page);
});

test("find-in-page can reveal a closed section (hidden=until-found)", async ({ page }) => {
  const panel = page.getByText("We pay the restocking fee.", { exact: false });
  await expect(panel).toBeHidden();
  // Simulate what the browser does when find-in-page matches inside a hidden=until-found element.
  await panel.evaluate((el) => {
    const host = el.closest('[hidden="until-found"]') as HTMLElement;
    host.dispatchEvent(new Event("beforematch", { bubbles: true }));
  });
  await expect(trigger(page, "Can I return an item?")).toHaveAttribute("aria-expanded", "true");
  await expect(panel).toBeVisible();
});

test("the arrow points another way when open (not only color)", async ({ page }) => {
  const t = trigger(page, "Can I return an item?");
  // Tailwind v4 rotate-* uses the CSS `rotate` property.
  const transform = () => t.locator("svg").evaluate((el) => getComputedStyle(el).rotate);
  const closed = await transform();
  await t.click();
  await expect.poll(transform).not.toBe(closed);
});

test("triggers are 44px and the focus ring appears immediately", async ({ page }) => {
  await expectMinTargetSize(await page.locator('[data-slot="accordion-trigger"]').all(), 44);
  await expectNoAnimatedOutline(page.locator("main"));
});

test.describe("reduced motion", () => {
  test("no motion with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await trigger(page, "Can I return an item?").click();
    await expectNoMotion(page, page.locator("main"));
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/accordion", "/docs/accordion"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
