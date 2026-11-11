"use client";

import { Separator as BaseSeparator } from "@base-ui/react/separator";

import { cn } from "@/lib/utils";

/*
 * Akso UI · Separator
 *
 * A line between groups of content. Built on @base-ui/react/separator, which renders
 * role="separator" with aria-orientation, so screen readers can tell where a group ends.
 *
 * This file adds:
 * - `decorative`: a line that is only visual (between paragraphs, inside a card). It is
 *   hidden from screen readers instead of announced. It does not use Base UI, so no role
 *   that Base UI sets is replaced.
 * - A line drawn with a border in the --akso-border color (at least 3:1 against the page), so
 *   it stays visible in Windows high contrast, where backgrounds are removed.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface SeparatorProps extends Omit<BaseSeparator.Props, "className"> {
  className?: string;
  /** Only visual: hide it from screen readers. Default: false (announced as a separator). */
  decorative?: boolean;
}

const lineClassName = (orientation: "horizontal" | "vertical") =>
  orientation === "vertical" ? "w-0 self-stretch border-l border-akso-border" : "h-0 w-full border-t border-akso-border";

/** A line between groups of content. Add `decorative` when it is only visual. */
function Separator({ className, orientation = "horizontal", decorative = false, ...props }: SeparatorProps) {
  if (decorative) {
    const { style, id } = props;
    return (
      <div
        aria-hidden="true"
        data-slot="separator"
        data-orientation={orientation}
        id={id}
        style={typeof style === "function" ? undefined : style}
        className={cn("shrink-0", lineClassName(orientation), className)}
      />
    );
  }
  return <BaseSeparator data-slot="separator" orientation={orientation} className={cn("shrink-0", lineClassName(orientation), className)} {...props} />;
}

export { Separator };
