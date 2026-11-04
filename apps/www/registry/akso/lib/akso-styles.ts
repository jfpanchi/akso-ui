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
  "data-disabled:cursor-not-allowed data-disabled:opacity-60",
  "motion-safe:transition-[color,background-color,border-color] motion-safe:duration-150",
  focusRingClassName,
);

const variants: Record<ButtonVariant, string> = {
  primary: "bg-akso-primary text-akso-primary-foreground hover:not-data-disabled:bg-akso-primary-hover",
  secondary: "border border-akso-border bg-akso-surface text-akso-foreground hover:not-data-disabled:bg-akso-surface-hover",
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
