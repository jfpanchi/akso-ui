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
  await page.goto("/test/file-upload");
});

const input = (page: Page) => page.getByLabel("Documents");
const file = (name: string, mimeType: string, size = 1000) => ({ name, mimeType, buffer: Buffer.alloc(size, 1) });
const announcer = (page: Page) => page.locator('[data-slot="announcer"]');

test.describe("axe", () => {
  test("no violations: empty, with files and with an error", async ({ page }) => {
    await expectNoAxeViolations(page);
    await input(page).setInputFiles([file("report.pdf", "application/pdf"), file("huge.png", "image/png", 2 * 1024 * 1024)]);
    await expect(page.getByRole("list", { name: "Selected files" })).toBeVisible();
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/file-upload");
    await expectNoAxeViolations(page);
  });
});

test.describe("choosing files", () => {
  test("chosen files are listed, kept in the input, and announced", async ({ page }) => {
    await input(page).setInputFiles([file("a.pdf", "application/pdf"), file("b.png", "image/png")]);
    await expect(page.getByTestId("file-names")).toHaveText("a.pdf, b.png");
    await expect(announcer(page)).toHaveText("2 files added");
    expect(await input(page).evaluate((el: HTMLInputElement) => el.files?.length)).toBe(2);
  });
  test("a file that is too big or of the wrong type is refused with a linked, announced reason", async ({ page }) => {
    await input(page).setInputFiles([file("huge.png", "image/png", 2 * 1024 * 1024), file("notes.txt", "text/plain")]);
    await expect(input(page)).toHaveAttribute("aria-invalid", "true");
    await expect(input(page)).toHaveAccessibleDescription(/huge\.png is too big.*notes\.txt is not an allowed type of file\./);
    await expect(announcer(page)).toContainText("huge.png is too big");
    await expect(page.getByTestId("file-names")).toHaveText("none");
  });
  test("dropping files adds them", async ({ page }) => {
    const transfer = await page.evaluateHandle(() => {
      const dt = new DataTransfer();
      dt.items.add(new File(["x"], "dropped.pdf", { type: "application/pdf" }));
      return dt;
    });
    await page.locator('[data-slot="file-upload-dropzone"]').dispatchEvent("drop", { dataTransfer: transfer });
    await expect(page.getByTestId("file-names")).toHaveText("dropped.pdf");
  });
});

test.describe("keyboard", () => {
  test("Remove moves focus to the next file, then back to the input", async ({ page }) => {
    await input(page).setInputFiles([file("a.pdf", "application/pdf"), file("b.pdf", "application/pdf")]);
    await page.getByRole("button", { name: "Remove a.pdf" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: "Remove b.pdf" })).toBeFocused();
    await expect(announcer(page)).toHaveText("a.pdf removed");
    await page.keyboard.press("Enter");
    await expect(input(page)).toBeFocused();
    expect(await input(page).evaluate((el: HTMLInputElement) => el.files?.length)).toBe(0);
  });
});

test.describe("visual accessibility", () => {
  test("the file input and Remove buttons: focus rings of at least 3:1, 44px tall", async ({ page }) => {
    await input(page).setInputFiles([file("a.pdf", "application/pdf")]);
    await input(page).focus();
    await expectVisibleFocusRing(page);
    await page.keyboard.press("Tab");
    await expectVisibleFocusRing(page);
    await expectMinTargetSize([page.getByRole("button", { name: "Remove a.pdf" })], 44);
    const height = await input(page).evaluate((el) => el.getBoundingClientRect().height);
    expect(height).toBeGreaterThanOrEqual(44 - 0.01);
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
  for (const path of ["/test/file-upload", "/docs/file-upload"]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
  test("long file names wrap", async ({ page }) => {
    await input(page).setInputFiles([file(`${"very-long-file-name-".repeat(6)}.pdf`, "application/pdf")]);
    await expectNoHorizontalScroll(page);
  });
});
