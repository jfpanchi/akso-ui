"use client";

import * as React from "react";
import { NumberField as BaseNumberField } from "@base-ui/react/number-field";

import { cn } from "@/lib/utils";
import { useAksoField } from "@/registry/akso/lib/akso-form";
import { useAksoMessages } from "@/registry/akso/lib/akso-locale";
import { warnIfUnnamed } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Number field
 *
 * Built on @base-ui/react/number-field. Base UI provides the text input (inputMode for a
 * numeric keyboard), the arrow keys (↑ ↓, Shift for big steps, Home/End for min/max),
 * min/max clamping, number formatting, and − / + buttons that are left out of the Tab order
 * (the arrow keys do the same) but stay reachable by touch screen readers.
 * Inside a <Field>, the label, description and errors are linked for you.
 *
 * This file adds 44px targets, a focus ring on the whole field, an invalid style with a
 * thicker border (the error text adds an icon), and translated texts: the button names and
 * the role description come from AksoLocaleProvider (Base UI's defaults are in English).
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface NumberFieldProps extends Omit<BaseNumberField.Root.Props, "className"> {
  className?: string;
  /** Name of the − button. Default: "Decrease" (or the AksoLocaleProvider text). */
  decreaseLabel?: string;
  /** Name of the + button. Default: "Increase" (or the AksoLocaleProvider text). */
  increaseLabel?: string;
  /** What screen readers call the field. Default: "Number field" (or the AksoLocaleProvider text). */
  roleDescription?: string;
}

const stepperClassName = cn(
  "flex w-11 shrink-0 cursor-pointer items-center justify-center self-stretch text-akso-foreground",
  "hover:not-data-disabled:bg-akso-surface-hover data-disabled:cursor-not-allowed data-disabled:opacity-60",
);

/** A field for a number, with − and + buttons. Put it inside a Field with a FieldLabel. */
function NumberField({ className, required, decreaseLabel, increaseLabel, roleDescription, ...props }: NumberFieldProps) {
  const field = useAksoField();
  const messages = useAksoMessages();
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  React.useEffect(() => {
    warnIfUnnamed(inputRef.current, "NumberField", "Put it inside a <Field> with a <FieldLabel>.");
  }, []);

  return (
    <BaseNumberField.Root data-slot="number-field" required={required ?? field?.required} className={cn("min-w-0", className)} {...props}>
      <BaseNumberField.Group
        data-slot="number-field-group"
        className={cn(
          "flex min-h-11 w-full max-w-60 items-stretch overflow-hidden rounded-md border border-akso-border bg-akso-surface",
          "data-invalid:border-2 data-invalid:border-akso-danger data-disabled:opacity-60",
          "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-solid focus-within:outline-akso-focus-ring",
        )}
      >
        <BaseNumberField.Decrement data-slot="number-field-decrement" aria-label={decreaseLabel ?? messages.decrease} className={cn(stepperClassName, "border-r border-akso-border")}>
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14" />
          </svg>
        </BaseNumberField.Decrement>
        <BaseNumberField.Input
          ref={inputRef}
          data-slot="number-field-input"
          aria-roledescription={roleDescription ?? messages.numberField}
          className="min-h-11 w-full min-w-0 flex-1 bg-transparent px-2 py-2 text-center text-base text-akso-foreground tabular-nums outline-none data-disabled:cursor-not-allowed"
        />
        <BaseNumberField.Increment data-slot="number-field-increment" aria-label={increaseLabel ?? messages.increase} className={cn(stepperClassName, "border-l border-akso-border")}>
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14M12 5v14" />
          </svg>
        </BaseNumberField.Increment>
      </BaseNumberField.Group>
    </BaseNumberField.Root>
  );
}

export { NumberField };
