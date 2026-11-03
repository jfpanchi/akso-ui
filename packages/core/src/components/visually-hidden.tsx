import type { ComponentPropsWithoutRef, CSSProperties } from "react";

/**
 * Styles that hide content visually but keep it available to screen readers.
 * Equivalent to Tailwind's `sr-only`.
 */
export const visuallyHiddenStyle: CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: 0,
};

export interface VisuallyHiddenProps extends ComponentPropsWithoutRef<"span"> {
  /**
   * Show the content when it (or something inside it) receives keyboard focus.
   * Use it for content that can be focused, such as skip links.
   */
  focusable?: boolean;
}

/**
 * Hides content visually and keeps it in the accessibility tree.
 * Use it for text that a screen reader needs but a sighted person does not,
 * such as the label of an icon-only button.
 */
export function VisuallyHidden({ focusable = false, style, className, ...props }: VisuallyHiddenProps) {
  if (focusable) {
    return <span {...props} className={["akso-visually-hidden-focusable", className].filter(Boolean).join(" ")} style={style} />;
  }
  return <span {...props} className={className} style={{ ...visuallyHiddenStyle, ...style }} />;
}
