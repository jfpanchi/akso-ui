import { cn } from "@/lib/utils";

/*
 * Akso UI · shared styles
 *
 * Used by every Akso component. It lives in its own file (installed as lib/akso-styles.ts)
 * so components can share button and focus styles without depending on components/ui/button.tsx,
 * which many projects already have from shadcn.
 */

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "default" | "sm" | "icon";

/** Focus ring shared by every Akso component. Never transition outline-color: the ring must appear at once. */
export const focusRingClassName =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-akso-focus-ring";

const base = cn(
  "relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-md font-medium leading-tight text-balance",
  // A transparent border becomes a visible outline in Windows high contrast (forced colors),
  // where background colors are removed.
  "border border-transparent",
  "data-disabled:cursor-not-allowed data-disabled:opacity-60",
  "motion-safe:transition-[color,background-color,border-color] motion-safe:duration-150",
  focusRingClassName,
);

const variants: Record<ButtonVariant, string> = {
  primary: "bg-akso-primary text-akso-primary-foreground hover:not-data-disabled:bg-akso-primary-hover",
  secondary: "border-akso-border bg-akso-surface text-akso-foreground hover:not-data-disabled:bg-akso-surface-hover",
  // The hover state adds an underline so it does not depend on a color change alone.
  danger: "bg-akso-danger text-akso-danger-foreground hover:not-data-disabled:underline",
  ghost: "bg-transparent text-akso-foreground hover:not-data-disabled:bg-akso-surface-hover",
};

// All sizes are above the 24×24px minimum (WCAG 2.5.8). `default` and `icon` reach 44×44px (2.5.5).
const sizes: Record<ButtonSize, string> = {
  default: "min-h-11 min-w-11 px-4 py-2 text-base",
  sm: "min-h-9 min-w-9 px-3 py-1.5 text-sm",
  icon: "size-11 shrink-0 p-0",
};

export interface ButtonClassNameOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/** Button classes, for elements that must look like a button (for example, a link: style the `<a>` itself). */
export function buttonClassName({ variant = "secondary", size = "default", className }: ButtonClassNameOptions = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

/**
 * Text field styles (Input, Textarea). 16px text avoids automatic zoom on iOS; 44px minimum height.
 * Invalid fields get a thicker danger border, and the error message adds an icon and text,
 * so the state never depends on color alone.
 */
export function inputClassName(className?: string) {
  return cn(
    "block w-full min-w-0 min-h-11 rounded-md border border-akso-border bg-akso-surface px-3 py-2 text-base text-akso-foreground",
    "placeholder:text-akso-muted-foreground",
    "data-invalid:border-2 data-invalid:border-akso-danger",
    "data-disabled:cursor-not-allowed data-disabled:opacity-60",
    focusRingClassName,
    className,
  );
}

/**
 * The row of a checkbox, radio or switch: an enclosing <label> (the Base UI labeling pattern).
 * The whole row is the click/touch target, at least 44px tall.
 */
export function choiceLabelClassName(className?: string) {
  return cn(
    "inline-flex min-h-11 cursor-pointer items-center gap-3 py-1 text-base text-akso-foreground",
    "has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:opacity-60",
    className,
  );
}

/** The visible box of a checkbox or radio. 2px border with ≥3:1 contrast; checked state adds a shape, not only a color. */
export const choiceControlClassName = cn(
  "relative inline-flex size-6 shrink-0 items-center justify-center border-2 border-akso-border bg-akso-surface text-akso-primary-foreground",
  "data-checked:border-akso-primary data-checked:bg-akso-primary data-indeterminate:border-akso-primary data-indeterminate:bg-akso-primary",
  "data-invalid:border-akso-danger",
  focusRingClassName,
);

/** Legend of a group of checkboxes or radios. */
export const legendClassName = "mb-1 text-base font-semibold text-akso-foreground";

/* Modal dialogs (Dialog, AlertDialog) share these, so both look and behave the same. */

export const modalBackdropClassName = cn(
  "fixed inset-0 z-50 min-h-dvh bg-akso-overlay",
  "motion-safe:transition-opacity motion-safe:duration-150",
  "data-starting-style:opacity-0 data-ending-style:opacity-0",
);

/** The viewport scrolls vertically when the content is taller than the screen, so nothing is cut off at 320px or 400% zoom. */
export const modalViewportClassName = "fixed inset-0 z-50 flex overflow-y-auto p-4 sm:p-6";

export const modalPopupClassName = cn(
  // m-auto centers the popup but lets it grow and scroll instead of being clipped.
  "relative m-auto flex w-full max-w-lg min-w-0 flex-col gap-4",
  "rounded-lg border border-akso-border bg-akso-surface p-5 text-akso-foreground shadow-xl sm:p-6",
  "break-words",
  focusRingClassName,
  "motion-safe:transition-[opacity,scale] motion-safe:duration-150 motion-safe:ease-out",
  "data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0",
);

export const modalTitleClassName = "text-xl font-semibold leading-snug";
export const modalDescriptionClassName = "text-base text-akso-muted-foreground";
export const modalFooterClassName = "flex flex-col-reverse gap-2 sm:flex-row sm:flex-wrap sm:justify-end";

/* Floating surfaces (Popover, Menu, Tooltip). */

export const popupSurfaceClassName = cn(
  "max-w-[calc(100vw-2rem)] origin-[var(--transform-origin)] rounded-md border border-akso-border bg-akso-surface text-akso-foreground shadow-lg outline-none",
  "motion-safe:transition-[opacity,scale] motion-safe:duration-150 motion-safe:ease-out",
  "data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0",
);

/**
 * An item in a list popup (Menu). The highlighted item gets a background AND a 2px inset ring
 * with ≥3:1 contrast: the background change alone is too subtle to see.
 */
export const listItemClassName = cn(
  "flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-left text-base outline-none select-none",
  "data-highlighted:bg-akso-surface-hover data-highlighted:outline-2 data-highlighted:-outline-offset-2 data-highlighted:outline-solid data-highlighted:outline-akso-focus-ring",
  "data-disabled:cursor-not-allowed data-disabled:opacity-60",
);

/**
 * For parts drawn only with a background (radio dot, switch thumb, progress bars).
 * In forced colors (Windows high contrast) backgrounds are replaced, so these keep a system
 * color that follows the person's theme.
 */
export const forcedFillClassName = "forced-colors:forced-color-adjust-none forced-colors:bg-[CanvasText]";
export const forcedBarClassName = "forced-colors:forced-color-adjust-none forced-colors:bg-[Highlight]";

// Typed here so the components build without Node.js types (Vite, React Router).
declare const process: { env: { NODE_ENV?: string } };

/**
 * True during development. Bundlers replace `process.env.NODE_ENV` at build time; where
 * `process` does not exist at all, development warnings are simply skipped.
 */
export function isDevelopment(): boolean {
  try {
    return process.env.NODE_ENV !== "production";
  } catch {
    return false;
  }
}

export type ToggleSize = ButtonSize;

/**
 * Toggle button styles (Toggle, ToggleGroupItem). Off: like a secondary button.
 * Pressed (`data-pressed`, set by Base UI with aria-pressed): filled with the primary color AND
 * a bar along the bottom, so the state does not depend on color alone. In forced colors
 * (Windows high contrast) the pressed fill uses the system Highlight colors.
 */
export function toggleClassName({ size = "default", className }: { size?: ToggleSize; className?: string } = {}) {
  return cn(
    base,
    variants.secondary,
    sizes[size],
    "data-pressed:border-akso-primary data-pressed:bg-akso-primary data-pressed:text-akso-primary-foreground",
    "data-pressed:hover:not-data-disabled:bg-akso-primary-hover",
    "data-pressed:after:pointer-events-none data-pressed:after:absolute data-pressed:after:inset-x-2 data-pressed:after:bottom-1 data-pressed:after:h-0.5 data-pressed:after:rounded-full data-pressed:after:bg-current",
    "forced-colors:data-pressed:forced-color-adjust-none forced-colors:data-pressed:border-[Highlight] forced-colors:data-pressed:bg-[Highlight] forced-colors:data-pressed:text-[HighlightText]",
    "forced-colors:data-pressed:focus-visible:outline-[CanvasText]",
    className,
  );
}

/**
 * Logs an error in development when an element has no accessible name
 * (for example, an icon-only toggle without aria-label). Call it from an effect.
 */
export function warnIfUnnamed(el: HTMLElement | null, component: string, hint: string) {
  if (!el || !isDevelopment()) return;
  const labelledBy = el.getAttribute("aria-labelledby");
  const name =
    el.getAttribute("aria-label")?.trim() ||
    (el instanceof HTMLInputElement && el.labels?.length ? (el.labels[0]?.textContent?.trim() ?? "") : "") ||
    (labelledBy ? el.ownerDocument.getElementById(labelledBy)?.textContent?.trim() : "") ||
    // Containers (group, toolbar…) are not named by their content.
    (["group", "toolbar", "radiogroup", "menubar", "region"].includes(el.getAttribute("role") ?? "") ? "" : el.textContent?.trim());
  if (!name) console.error(`[Akso UI] ${component} has no accessible name. ${hint}`);
}
