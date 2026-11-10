import * as React from "react";

import { cn } from "@/lib/utils";
import { StatusIcon, type Status } from "@/registry/akso/lib/akso-status";

/*
 * Akso UI · Badge
 *
 * A short label, like "New" or the status of an order ("Shipped"). There is no Base UI part
 * for this; it is a plain <span>, not focusable.
 * - The text is the meaning, and it always uses the main text color (at least 4.5:1).
 * - A `status` adds an icon with its own shape and a colored border (at least 3:1), so the
 *   status never depends on color alone (WCAG 1.4.1). The icon is hidden from screen readers:
 *   the text already says it.
 * - The border stays visible in Windows high contrast.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

const statusBorder: Record<Status, string> = {
  info: "border-akso-primary",
  success: "border-akso-success",
  warning: "border-akso-warning",
  error: "border-akso-danger",
};

export interface BadgeProps extends React.ComponentProps<"span"> {
  /** Adds an icon and a colored border. The text must still say the status. */
  status?: Status;
}

/** A short label. Write the meaning in the text; `status` only adds an icon and a border. */
function Badge({ status, className, children, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      data-status={status}
      className={cn(
        "inline-flex max-w-full items-center gap-1 rounded-full border bg-akso-surface px-2.5 py-0.5 align-middle text-sm font-medium text-akso-foreground [overflow-wrap:anywhere]",
        status ? cn("border-2", statusBorder[status]) : "border-akso-border",
        className,
      )}
      {...props}
    >
      {status ? <StatusIcon status={status} className="size-4" /> : null}
      {children}
    </span>
  );
}

export { Badge };
