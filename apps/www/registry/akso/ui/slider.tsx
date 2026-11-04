"use client";

import * as React from "react";
import { Slider as BaseSlider } from "@base-ui/react/slider";

import { cn } from "@/lib/utils";
import { useAksoMessages } from "@/registry/akso/lib/akso-locale";
import { buttonClassName, forcedBarClassName } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Slider
 *
 * Built on @base-ui/react/slider: each thumb is a native range input (role="slider") with
 * aria-valuenow/min/max, named by the visible label, and moved with the arrow keys,
 * Page Up/Down and Home/End.
 *
 * Dragging is never the only way (WCAG 2.5.7 Dragging Movements): people can click the track,
 * use the keyboard, or press the − and + buttons, which are single taps. The current value is
 * always shown as text.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface SliderProps extends Omit<BaseSlider.Root.Props<number>, "className" | "children" | "value" | "defaultValue" | "onValueChange"> {
  /** Visible label. Required. */
  label: React.ReactNode;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Show − and + buttons (single-tap alternative to dragging). Default: true. */
  showSteppers?: boolean;
  /** Accessible names of the step buttons. Default: "Decrease" and "Increase". */
  decreaseLabel?: string;
  increaseLabel?: string;
  /** Friendlier text for screen readers, for example `(v) => `${v} degrees``. */
  getValueText?: (value: number) => string;
  className?: string;
}

function Slider({
  label,
  value,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  showSteppers = true,
  decreaseLabel: decreaseLabelProp,
  increaseLabel: increaseLabelProp,
  getValueText,
  disabled,
  className,
  ...props
}: SliderProps) {
  const messages = useAksoMessages();
  const decreaseLabel = decreaseLabelProp ?? messages.decrease;
  const increaseLabel = increaseLabelProp ?? messages.increase;
  const [inner, setInner] = React.useState(defaultValue ?? min);
  const current = value ?? inner;
  const set = (next: number) => {
    const clamped = Math.min(max, Math.max(min, next));
    if (value === undefined) setInner(clamped);
    onValueChange?.(clamped);
  };

  return (
    <BaseSlider.Root
      data-slot="slider"
      value={current}
      onValueChange={(v) => set(Array.isArray(v) ? (v[0] ?? min) : v)}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      className={cn("grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-2", className)}
      {...props}
    >
      <BaseSlider.Label data-slot="slider-label" className="col-span-2 font-medium text-akso-foreground">
        {label}
      </BaseSlider.Label>
      <BaseSlider.Value data-slot="slider-value" className="text-right text-base text-akso-foreground tabular-nums" />
      {showSteppers ? (
        <button
          type="button"
          tabIndex={-1}
          aria-label={decreaseLabel}
          disabled={disabled || current <= min}
          onClick={() => set(current - step)}
          className={buttonClassName({ variant: "secondary", size: "icon" })}
        >
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 12h12" />
          </svg>
        </button>
      ) : (
        <span />
      )}
      <BaseSlider.Control data-slot="slider-control" className="flex min-h-11 w-full cursor-pointer touch-none items-center select-none data-disabled:cursor-not-allowed">
        <BaseSlider.Track data-slot="slider-track" className="relative h-2 w-full rounded-full border border-akso-border bg-akso-surface-hover">
          <BaseSlider.Indicator data-slot="slider-indicator" className={cn("rounded-full bg-akso-primary", forcedBarClassName)} />
          <BaseSlider.Thumb
            data-slot="slider-thumb"
            getAriaValueText={getValueText ? (_formatted, v) => getValueText(v) : undefined}
            className={cn(
              "size-6 rounded-full border-2 border-akso-primary bg-akso-surface shadow",
              "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-solid has-[:focus-visible]:outline-akso-focus-ring",
              "data-disabled:opacity-60",
            )}
          />
        </BaseSlider.Track>
      </BaseSlider.Control>
      {showSteppers ? (
        <button
          type="button"
          tabIndex={-1}
          aria-label={increaseLabel}
          disabled={disabled || current >= max}
          onClick={() => set(current + step)}
          className={buttonClassName({ variant: "secondary", size: "icon" })}
        >
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 12h12M12 6v12" />
          </svg>
        </button>
      ) : (
        <span />
      )}
    </BaseSlider.Root>
  );
}

export { Slider };
