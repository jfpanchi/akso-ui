/**
 * Akso UI color tokens.
 *
 * Every pair listed in `contrastPairs` is checked by `tests/tokens.test.ts`.
 * If you change a value, the test tells you whether it still meets WCAG 2.2 AA.
 *
 * This file must stay dependency-free: `scripts/generate-tokens-css.ts`
 * imports it directly with Node's type stripping.
 */

export const colorTokenNames = [
  "background",
  "foreground",
  "muted-foreground",
  "surface",
  "surface-hover",
  "border",
  "primary",
  "primary-hover",
  "primary-foreground",
  "danger",
  "danger-foreground",
  "success",
  "warning",
  "focus-ring",
  "overlay",
] as const;

export type ColorTokenName = (typeof colorTokenNames)[number];
export type ColorScheme = Record<ColorTokenName, string>;

export const colors = {
  light: {
    background: "#ffffff",
    foreground: "#18181b",
    "muted-foreground": "#52525b",
    surface: "#ffffff",
    "surface-hover": "#f4f4f5",
    border: "#71717a",
    primary: "#1d4ed8",
    "primary-hover": "#1e40af",
    "primary-foreground": "#ffffff",
    danger: "#b91c1c",
    "danger-foreground": "#ffffff",
    success: "#15803d",
    warning: "#a16207",
    "focus-ring": "#1d4ed8",
    overlay: "rgb(9 9 11 / 0.6)",
  },
  dark: {
    background: "#09090b",
    foreground: "#fafafa",
    "muted-foreground": "#a1a1aa",
    surface: "#18181b",
    "surface-hover": "#27272a",
    border: "#a1a1aa",
    primary: "#93c5fd",
    "primary-hover": "#bfdbfe",
    "primary-foreground": "#09090b",
    danger: "#fca5a5",
    "danger-foreground": "#09090b",
    success: "#86efac",
    warning: "#fde047",
    "focus-ring": "#93c5fd",
    overlay: "rgb(0 0 0 / 0.75)",
  },
} as const satisfies Record<"light" | "dark", ColorScheme>;

export interface ContrastPair {
  foreground: ColorTokenName;
  background: ColorTokenName;
  /** "text" = 4.5:1, "nonText" = 3:1 (WCAG 1.4.11). */
  level: "text" | "nonText";
  usage: string;
}

/** Combinations that components actually use. Each one is verified in both schemes. */
export const contrastPairs: readonly ContrastPair[] = [
  { foreground: "foreground", background: "background", level: "text", usage: "Body text" },
  { foreground: "foreground", background: "surface", level: "text", usage: "Text inside dialogs and cards" },
  { foreground: "foreground", background: "surface-hover", level: "text", usage: "Text on hovered secondary buttons" },
  { foreground: "muted-foreground", background: "background", level: "text", usage: "Secondary text" },
  { foreground: "muted-foreground", background: "surface", level: "text", usage: "Dialog description" },
  { foreground: "muted-foreground", background: "surface-hover", level: "text", usage: "Hovered icon buttons" },
  { foreground: "primary-foreground", background: "primary", level: "text", usage: "Primary button label" },
  { foreground: "primary-foreground", background: "primary-hover", level: "text", usage: "Hovered primary button label" },
  { foreground: "danger-foreground", background: "danger", level: "text", usage: "Destructive button label" },
  { foreground: "danger", background: "surface", level: "text", usage: "Error text inside dialogs and cards" },
  { foreground: "danger", background: "background", level: "text", usage: "Error text on the page" },
  { foreground: "danger", background: "surface", level: "nonText", usage: "Border of an invalid field" },
  { foreground: "muted-foreground", background: "surface", level: "text", usage: "Placeholder and hint text in fields" },
  { foreground: "primary", background: "background", level: "text", usage: "Links" },
  { foreground: "primary", background: "surface", level: "nonText", usage: "Radio dot, select check mark, checked borders" },
  { foreground: "muted-foreground", background: "surface", level: "nonText", usage: "Switch thumb when off" },
  { foreground: "success", background: "surface", level: "text", usage: "Success icon and text in alerts and toasts" },
  { foreground: "success", background: "background", level: "text", usage: "Success text on the page" },
  { foreground: "warning", background: "surface", level: "text", usage: "Warning icon and text in alerts and toasts" },
  { foreground: "warning", background: "background", level: "text", usage: "Warning text on the page" },
  { foreground: "primary", background: "surface-hover", level: "nonText", usage: "Progress and meter bar on its track" },
  { foreground: "border", background: "background", level: "nonText", usage: "Control borders" },
  { foreground: "border", background: "surface", level: "nonText", usage: "Control borders inside dialogs" },
  { foreground: "focus-ring", background: "background", level: "nonText", usage: "Focus ring on the page" },
  { foreground: "focus-ring", background: "surface", level: "nonText", usage: "Focus ring inside dialogs" },
  { foreground: "focus-ring", background: "surface-hover", level: "nonText", usage: "Focus ring next to hovered elements" },
];
