"use client";

import * as React from "react";
import { Meter as BaseMeter } from "@base-ui/react/meter";

import { cn } from "@/lib/utils";
import { forcedBarClassName } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Meter
 *
 * Built on @base-ui/react/meter: role="meter" with aria-valuenow/min/max, named by its visible
 * label. Use it for a measurement within a known range (storage used, password strength),
 * not for task progress (use Progress). The value is also shown as text.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface MeterProps extends Omit<BaseMeter.Root.Props, "className" | "children"> {
  /** Visible label. Required. */
  label: React.ReactNode;
  /** Show the value as text. Default: true. Use `aria-valuetext`/`getAriaValueText` for friendlier text ("3 GB of 10 GB"). */
  showValue?: boolean;
  className?: string;
}

function Meter({ label, showValue = true, className, ...props }: MeterProps) {
  return (
    <BaseMeter.Root data-slot="meter" className={cn("grid w-full grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5", className)} {...props}>
      <BaseMeter.Label data-slot="meter-label" className="font-medium text-akso-foreground">
        {label}
      </BaseMeter.Label>
      {showValue ? <BaseMeter.Value data-slot="meter-value" className="text-sm text-akso-muted-foreground tabular-nums" /> : <span />}
      <BaseMeter.Track data-slot="meter-track" className="col-span-2 h-3 overflow-hidden rounded-full border border-akso-border bg-akso-surface-hover">
        <BaseMeter.Indicator data-slot="meter-indicator" className={cn("block h-full bg-akso-primary motion-safe:transition-[width] motion-safe:duration-300", forcedBarClassName)} />
      </BaseMeter.Track>
    </BaseMeter.Root>
  );
}

export { Meter };
