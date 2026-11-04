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

const trigger = page.getByRole("button", { name: "Open dialog" });
await trigger.focus();
await page.keyboard.press("Enter");
const dialog = page.getByRole("dialog", { name: "Installed from the registry" });
await dialog.waitFor();
// Wait for the opening transition: mid-fade text has lower contrast than the final state.
await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));
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

await browser.close();
if (failures.length) {
  console.error(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
console.log("\nRegistry install verified.");
