// Runs in the consumer project: axe + keyboard checks against the installed Dialog.
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "@playwright/test";

const url = process.argv[2] ?? "http://localhost:3200";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const context = await browser.newContext();
const page = await context.newPage();
const failures = [];
const check = (ok, message) => (ok ? console.log(`  ✓ ${message}`) : failures.push(message) && console.log(`  ✗ ${message}`));
const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

await page.goto(url);
let axe = await new AxeBuilder({ page }).withTags(tags).analyze();
check(axe.violations.length === 0, `axe closed: ${axe.violations.map((v) => v.id).join(", ") || "no violations"}`);

const saving = page.getByRole("button", { name: "Saving" });
check((await saving.getAttribute("aria-disabled")) === "true", "loading Button is named by its loading text and aria-disabled");

const trigger = page.getByRole("button", { name: "Open dialog" });
await trigger.focus();
await page.keyboard.press("Enter");
const dialog = page.getByRole("dialog", { name: "Installed from the registry" });
await dialog.waitFor();
// Wait for the opening transition: mid-fade text has lower contrast than the final state.
// Infinite animations (the loading spinner) are skipped.
await page.evaluate(() =>
  Promise.all(
    document
      .getAnimations()
      .filter((a) => a.effect?.getComputedTiming().endTime !== Infinity)
      .map((a) => a.finished.catch(() => undefined)),
  ),
);
check(true, "dialog opens with Enter and has an accessible name");

axe = await new AxeBuilder({ page }).withTags(tags).analyze();
check(axe.violations.length === 0, `axe open: ${axe.violations.map((v) => v.id).join(", ") || "no violations"}`);

const ring = await page.evaluate(() => {
  const s = getComputedStyle(document.activeElement);
  return { color: s.outlineColor, style: s.outlineStyle };
});
check(ring.style !== "none" && ring.color === "rgb(29, 78, 216)", `focus ring uses the akso focus token (${ring.color})`);

await page.keyboard.press("Escape");
await dialog.waitFor({ state: "hidden" });
check(await trigger.evaluate((el) => el === document.activeElement), "Escape closes and focus returns to the trigger");

await page.getByRole("button", { name: "Send" }).click();
const name = page.getByRole("textbox", { name: "Name" });
await page.getByText("Enter your name.").waitFor();
check(await name.evaluate((el) => el === document.activeElement), "form: submit with errors moves focus to the first invalid field");
check((await name.getAttribute("aria-invalid")) === "true", "form: the invalid field has aria-invalid");
await page.waitForFunction(() => document.getElementById("akso-announcer")?.textContent === "3 fields need attention.");
check(true, "form: the number of fields needing attention is announced");
axe = await new AxeBuilder({ page }).withTags(tags).analyze();
check(axe.violations.length === 0, `axe form with errors: ${axe.violations.map((v) => v.id).join(", ") || "no violations"}`);

const radios = page.getByRole("radiogroup", { name: "Delivery speed" });
check((await radios.getAttribute("aria-invalid")) === "true", "radio group: required group is invalid after submit");
check((await page.getByRole("radio").count()) === 2 && (await page.getByRole("radio", { name: "Express" }).count()) === 1, "radio group: each option has its own name");

const country = page.getByRole("combobox", { name: "Country" });
await country.focus();
await page.keyboard.press("ArrowDown");
await page.getByRole("listbox").waitFor();
await page.keyboard.press("ArrowDown");
await page.keyboard.press("Enter");
await page.getByRole("listbox").waitFor({ state: "hidden" });
check((await country.textContent())?.includes("Peru") && (await country.evaluate((el) => el === document.activeElement)), "select: choose with the keyboard; focus returns to the trigger");

await browser.close();
if (failures.length) {
  console.error(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
console.log("\nRegistry install verified.");
