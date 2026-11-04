import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { colors, contrastPairs } from "../src/tokens/colors";
import { contrastRatio, parseColor, WCAG_AA } from "../src/tokens/contrast";
import { buildTokensCss } from "../src/tokens/css";

describe("contrastRatio", () => {
  it("matches known WCAG reference values", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
    expect(contrastRatio("#ffffff", "#ffffff")).toBe(1);
    // #767676 on white is the classic "just passes AA" grey (≈ 4.54).
    expect(contrastRatio("#767676", "#ffffff")).toBeCloseTo(4.54, 2);
  });

  it("is symmetric", () => {
    expect(contrastRatio("#1d4ed8", "#ffffff")).toBe(contrastRatio("#ffffff", "#1d4ed8"));
  });

  it("parses hex and rgb() formats", () => {
    expect(parseColor("#fff")).toEqual([255, 255, 255]);
    expect(parseColor("rgb(29, 78, 216)")).toEqual([29, 78, 216]);
    expect(parseColor("rgb(29 78 216 / 0.5)")).toEqual([29, 78, 216]);
    expect(() => parseColor("blue")).toThrow(/Unsupported/);
  });
});

describe.each(["light", "dark"] as const)("%s color tokens meet WCAG 2.2 AA", (scheme) => {
  it.each(contrastPairs.map((pair) => [pair.usage, pair] as const))("%s", (_usage, pair) => {
    const fg = colors[scheme][pair.foreground];
    const bg = colors[scheme][pair.background];
    const ratio = contrastRatio(fg, bg);
    expect(
      ratio,
      `${pair.foreground} (${fg}) on ${pair.background} (${bg}) is ${ratio.toFixed(2)}:1, needs ${WCAG_AA[pair.level]}:1`,
    ).toBeGreaterThanOrEqual(WCAG_AA[pair.level]);
  });
});

describe("tokens.css", () => {
  it("is up to date with colors.ts (run `pnpm --filter akso-ui generate:css`)", () => {
    const file = readFileSync(resolve(import.meta.dirname, "../tokens.css"), "utf8");
    expect(file).toBe(buildTokensCss());
  });
});
