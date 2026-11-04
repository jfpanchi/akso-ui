/**
 * WCAG 2.x contrast utilities.
 * Formula: https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio
 */

export type RGB = readonly [r: number, g: number, b: number];

/** Parses `#rgb`, `#rrggbb`, `rgb(r, g, b)`, `rgb(r g b)` and `color(srgb r g b)` into 0–255 channels. */
export function parseColor(color: string): RGB {
  const value = color.trim().toLowerCase();

  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(value);
  if (hex?.[1]) {
    const raw = hex[1];
    const full = raw.length === 3 ? [...raw].map((c) => c + c).join("") : raw;
    return [
      Number.parseInt(full.slice(0, 2), 16),
      Number.parseInt(full.slice(2, 4), 16),
      Number.parseInt(full.slice(4, 6), 16),
    ];
  }

  const rgb = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/.exec(value);
  if (rgb?.[1] && rgb[2] && rgb[3]) {
    return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  }

  // WebKit can report computed colors as color(srgb r g b), with channels from 0 to 1.
  const srgb = /^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/.exec(value);
  if (srgb?.[1] && srgb[2] && srgb[3]) {
    return [Number(srgb[1]) * 255, Number(srgb[2]) * 255, Number(srgb[3]) * 255];
  }

  throw new Error(`Unsupported color format: "${color}". Use hex, rgb() or color(srgb ...).`);
}

function channelToLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** Relative luminance, from 0 (black) to 1 (white). */
export function relativeLuminance(color: string | RGB): number {
  const [r, g, b] = typeof color === "string" ? parseColor(color) : color;
  return 0.2126 * channelToLinear(r) + 0.7152 * channelToLinear(g) + 0.0722 * channelToLinear(b);
}

/** Contrast ratio between two opaque colors, from 1 to 21. */
export function contrastRatio(a: string | RGB, b: string | RGB): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [light, dark] = la > lb ? [la, lb] : [lb, la];
  return (light + 0.05) / (dark + 0.05);
}

/** Minimum ratios required by WCAG 2.2 level AA. */
export const WCAG_AA = {
  /** 1.4.3 Contrast (Minimum), normal text. */
  text: 4.5,
  /** 1.4.3 Contrast (Minimum), large text (≥ 24px, or ≥ 18.66px bold). */
  largeText: 3,
  /** 1.4.11 Non-text Contrast: focus indicators, borders of controls, icons. */
  nonText: 3,
} as const;

export type ContrastLevel = keyof typeof WCAG_AA;

export function meetsAA(foreground: string | RGB, background: string | RGB, level: ContrastLevel = "text"): boolean {
  return contrastRatio(foreground, background) >= WCAG_AA[level];
}
