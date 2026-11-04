/**
 * Copies the color tokens from packages/core into registry.json, so components
 * installed with `npx shadcn add` get the same verified colors.
 * Run: pnpm --filter www registry:sync
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { colorTokenNames, colors } from "../../../packages/core/src/tokens/colors.ts";

export function buildCssVars() {
  const pick = (scheme: "light" | "dark") =>
    Object.fromEntries(colorTokenNames.map((name) => [`akso-${name}`, colors[scheme][name]]));
  return {
    theme: Object.fromEntries(colorTokenNames.map((name) => [`color-akso-${name}`, `var(--akso-${name})`])),
    light: pick("light"),
    dark: pick("dark"),
  };
}

if (import.meta.main) {
  const file = resolve(import.meta.dirname, "../registry.json");
  const registry = JSON.parse(readFileSync(file, "utf8"));
  for (const item of registry.items) {
    if (item.cssVars) item.cssVars = buildCssVars();
  }
  writeFileSync(file, `${JSON.stringify(registry, null, 2)}\n`);
  console.log(`Synced tokens into ${file}`);
}
