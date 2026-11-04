"use client";

import * as React from "react";
import { Progress as BaseProgress } from "@base-ui/react/progress";

import { cn } from "@/lib/utils";

/*
 * Akso UI · Progress
 *
 * Built on @base-ui/react/progress: role="progressbar" with aria-valuenow/min/max, named by
 * its visible label. Shows the value as text next to the bar, so it does not depend on the
 * length of the bar alone. `value={null}` means "in progress, unknown amount".
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface ProgressProps extends Omit<BaseProgress.Root.Props, "className" | "children"> {
  /** Visible label. Required. */
  label: React.ReactNode;
  /** Show the value as text, for example "40%". Default: true. */
  showValue?: boolean;
  className?: string;
}

/** Shows how much of a task is done. */
function Progress({ label, showValue = true, className, ...props }: ProgressProps) {
  return (
    <BaseProgress.Root data-slot="progress" className={cn("grid w-full grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5", className)} {...props}>
      <BaseProgress.Label data-slot="progress-label" className="font-medium text-akso-foreground">
        {label}
      </BaseProgress.Label>
      {showValue ? <BaseProgress.Value data-slot="progress-value" className="text-sm text-akso-muted-foreground tabular-nums" /> : <span />}
      <BaseProgress.Track data-slot="progress-track" className="col-span-2 h-3 overflow-hidden rounded-full border border-akso-border bg-akso-surface-hover">
        <BaseProgress.Indicator
          data-slot="progress-indicator"
          className={cn(
            "block h-full bg-akso-primary",
            "motion-safe:transition-[width] motion-safe:duration-300",
            // Unknown amount: a half bar that pulses, and stays still when motion is reduced.
            "data-indeterminate:w-1/2 motion-safe:data-indeterminate:animate-pulse",
          )}
        />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}

export { Progress };
