// TEMPORARY diagnostic for a Firefox-only failure in textarea.spec.ts. Removed once fixed.
import { test } from "@playwright/test";

test("diag: textarea valueMissing on blur", async ({ page, browserName }) => {
  await page.goto("/test/textarea");
  const ta = page.getByRole("textbox", { name: "Your feedback" });
  const state = (label: string) =>
    ta.evaluate((el: HTMLTextAreaElement, label) => {
      const root = el.closest('[data-slot="field"]') as HTMLElement;
      return `${label}: value=${JSON.stringify(el.value)} required=${el.required} valueMissing=${el.validity.valueMissing} active=${document.activeElement === el} root=[${[...root.attributes].filter((a) => a.name.startsWith("data-")).map((a) => a.name).join(",")}] el=[${[...el.attributes].filter((a) => a.name.startsWith("data-")).map((a) => a.name).join(",")}] errors=${root.querySelectorAll('[data-slot="field-error"]').length}`;
    }, label);
  console.log(`[${browserName}]`, await state("start"));
  await ta.focus();
  await page.keyboard.type("x");
  console.log(`[${browserName}]`, await state("after type x"));
  await page.keyboard.press("Backspace");
  console.log(`[${browserName}]`, await state("after backspace"));
  await page.keyboard.press("Tab");
  await page.waitForTimeout(300);
  console.log(`[${browserName}]`, await state("after tab"));
});
