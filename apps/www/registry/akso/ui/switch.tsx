"use client";

import * as React from "react";
import { Switch as BaseSwitch } from "@base-ui/react/switch";

import { cn } from "@/lib/utils";
import { choiceLabelClassName, focusRingClassName } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Switch
 *
 * Built on @base-ui/react/switch, labeled with an enclosing <label> (the Base UI labeling
 * pattern). Base UI provides role="switch", aria-checked and keyboard support.
 * "On" is shown three ways: the thumb moves, the track fills, and a check mark appears.
 *
 * Use a switch for settings that apply at once (like "Dark mode"). Inside a form that is
 * sent with a button, use a Checkbox instead.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface SwitchProps extends Omit<BaseSwitch.Root.Props, "className" | "children"> {
  /** The visible label: the name of the setting. Required. */
  children: React.ReactNode;
  className?: string;
}

/** Turns a setting on or off. */
function Switch({ children, className, ...props }: SwitchProps) {
  return (
    <label data-slot="switch-label" className={choiceLabelClassName(className)}>
      <BaseSwitch.Root
        data-slot="switch"
        className={cn(
          // 44×24px: at least the 24px minimum target size.
          "group relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-akso-border bg-akso-surface p-0.5",
          "data-checked:border-akso-primary data-checked:bg-akso-primary",
          "motion-safe:transition-[background-color,border-color] motion-safe:duration-150",
          focusRingClassName,
        )}
        {...props}
      >
        <BaseSwitch.Thumb
          data-slot="switch-thumb"
          className={cn(
            "flex size-4 items-center justify-center rounded-full bg-akso-muted-foreground text-akso-primary",
            "data-checked:translate-x-5 data-checked:bg-akso-primary-foreground",
            "motion-safe:transition-transform motion-safe:duration-150",
          )}
        >
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="hidden size-3 group-data-checked:block" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7" />
          </svg>
        </BaseSwitch.Thumb>
      </BaseSwitch.Root>
      <span>{children}</span>
    </label>
  );
}

export { Switch };
