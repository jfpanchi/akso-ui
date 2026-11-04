import * as React from "react";

import { cn } from "@/lib/utils";

/*
 * Akso UI · status styles and icons
 *
 * Used by Alert and Toast. Each status has its own icon shape, and the components add a hidden
 * status word from lib/akso-locale, so the meaning never depends on color alone (WCAG 1.4.1).
 */

export type Status = "info" | "success" | "warning" | "error";

export const statusTextClassName: Record<Status, string> = {
  info: "text-akso-primary",
  success: "text-akso-success",
  warning: "text-akso-warning",
  error: "text-akso-danger",
};

export const statusBorderClassName: Record<Status, string> = {
  info: "border-l-akso-primary",
  success: "border-l-akso-success",
  warning: "border-l-akso-warning",
  error: "border-l-akso-danger",
};

const paths: Record<Status, React.ReactNode> = {
  // "i" in a circle
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 11v6M12 7h.01" />
    </>
  ),
  // check in a circle
  success: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M7.5 12.5l3 3 6-6.5" />
    </>
  ),
  // "!" in a triangle
  warning: (
    <>
      <path d="M10.3 3.9L1.8 18.5A2 2 0 0 0 3.5 21.5h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v5M12 17.5h.01" />
    </>
  ),
  // "x" in an octagon
  error: (
    <>
      <path d="M7.9 2h8.2L22 7.9v8.2L16.1 22H7.9L2 16.1V7.9z" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </>
  ),
};

/** A decorative status icon (hidden from assistive technology). Each status has a different shape. */
export function StatusIcon({ status, className }: { status: Status; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-status-icon={status}
      viewBox="0 0 24 24"
      className={cn("size-5 shrink-0", statusTextClassName[status], className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[status]}
    </svg>
  );
}
