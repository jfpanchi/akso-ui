import * as React from "react";

import { cn } from "@/lib/utils";
import { defaultStatusLabels, StatusIcon, statusBorderClassName, type Status } from "@/registry/akso/lib/akso-status";

/*
 * Akso UI · Alert
 *
 * A message on the page: information, success, a warning or an error. Each status has its
 * own icon shape and a hidden status word ("Warning:"), so the meaning never depends on color.
 *
 * It is NOT a live region by default: a message that is on the page when it loads should not
 * interrupt screen readers. If the message appears after something the person did, set
 * `live="polite"` (or `"assertive"` for urgent errors) and render the Alert before its content
 * changes, so screen readers notice the change.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface AlertProps extends Omit<React.ComponentProps<"div">, "title" | "role"> {
  status?: Status;
  /** A short heading. */
  title?: React.ReactNode;
  /** Announce changes: "polite" (role=status) or "assertive" (role=alert). Default: not announced. */
  live?: "polite" | "assertive";
  /** Hidden word read before the title, so the status is not only shown by color and icon. Default: "Warning", "Error"… */
  statusLabel?: string;
}

/** A message about something important on the page. */
function Alert({ status = "info", title, live, statusLabel = defaultStatusLabels[status], className, children, ...props }: AlertProps) {
  const role = live === "assertive" ? "alert" : live === "polite" ? "status" : undefined;
  return (
    <div
      data-slot="alert"
      data-status={status}
      role={role}
      className={cn(
        "flex gap-3 rounded-md border border-l-4 border-akso-border bg-akso-surface p-4 text-akso-foreground",
        statusBorderClassName[status],
        className,
      )}
      {...props}
    >
      <StatusIcon status={status} className="mt-0.5" />
      <div className="flex min-w-0 flex-col gap-1 break-words">
        {title ? (
          <p data-slot="alert-title" className="font-semibold">
            <span className="sr-only">{statusLabel}: </span>
            {title}
          </p>
        ) : (
          <span className="sr-only">{statusLabel}: </span>
        )}
        {children ? (
          <div data-slot="alert-description" className="text-base">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export { Alert };
