"use client";

import * as React from "react";
import { OTPField as BaseOTPField } from "@base-ui/react/otp-field";

import { cn } from "@/lib/utils";
import { announce, useAksoField, useAnnouncerRegion } from "@/registry/akso/lib/akso-form";
import { useAksoMessages } from "@/registry/akso/lib/akso-locale";
import { focusRingClassName, warnIfUnnamed } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · OTP field
 *
 * A one-time code (verification code) split into boxes. Built on @base-ui/react/otp-field.
 * Base UI provides:
 * - role="group" named by the field label; the first box is also named by the label.
 * - One Tab stop: only the active box is in the Tab order. ← → move between boxes,
 *   Home/End go to the first and last box, Backspace deletes and moves back.
 * - Paste the whole code into any box, and autocomplete="one-time-code" on the first box,
 *   so phones can fill the code from a text message.
 * - A hidden input for forms (minLength, pattern, required), linked to Field validation.
 *
 * This file adds:
 * - The name of every other box ("Digit 2 of 6"), translated through AksoLocaleProvider.
 * - aria-invalid on the boxes when the Field's native validation fails (see renderSlot).
 * - An announcement when a character is rejected ("Only numbers are allowed."). Without it,
 *   a screen reader user who types a letter hears nothing and the box stays empty.
 * - 44px tall boxes that shrink in width on narrow screens (no horizontal scroll at 320px),
 *   a focus ring, and an invalid style with a thicker border.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface OtpFieldProps extends Omit<BaseOTPField.Root.Props, "className" | "children"> {
  className?: string;
  /** Show the code in groups, like 123–456. Default: no groups. */
  groupSize?: number;
  /** Name of each box after the first one. Default: "Digit 2 of 6" (or the AksoLocaleProvider text). */
  slotLabel?: (n: number, total: number) => string;
  /** Announced when a character is not allowed. Default: "Only numbers are allowed." (or the AksoLocaleProvider text). */
  rejectedMessage?: string;
}

const slotClassName = cn(
  "h-11 w-full min-w-0 max-w-11 flex-1 rounded-md border border-akso-border bg-akso-surface p-0 text-center text-lg text-akso-foreground tabular-nums",
  "data-invalid:border-2 data-invalid:border-akso-danger",
  "data-disabled:cursor-not-allowed data-disabled:opacity-60",
  focusRingClassName,
);

/*
 * Base UI marks the boxes data-invalid when the Field's validation fails (an incomplete code,
 * a missing required code), but only sets aria-invalid for app-controlled errors (the Field
 * `invalid` prop, Form errors). Here aria-invalid is added only when Base UI leaves it unset,
 * so screen readers also say "invalid" for the native errors. Nothing Base UI sets is replaced.
 */
const renderSlot = (props: React.ComponentProps<"input">, state: BaseOTPField.Input.State) => (
  <input {...props} aria-invalid={props["aria-invalid"] ?? (state.valid === false ? true : undefined)} />
);

/** A one-time code split into boxes. Put it inside a Field with a FieldLabel. */
function OtpField({
  className,
  length,
  groupSize,
  slotLabel,
  rejectedMessage,
  required,
  validationType = "numeric",
  onValueInvalid,
  ...props
}: OtpFieldProps) {
  const field = useAksoField();
  const messages = useAksoMessages();
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  useAnnouncerRegion();
  React.useEffect(() => {
    warnIfUnnamed(rootRef.current?.querySelector("input:not([aria-hidden])") ?? null, "OtpField", "Put it inside a <Field> with a <FieldLabel>.");
  }, []);

  const kind = validationType === "numeric" ? "digit" : "character";
  const labelFor = slotLabel ?? ((n: number, total: number) => messages.otpSlot(n, total, kind));

  const handleInvalid: BaseOTPField.Root.Props["onValueInvalid"] = (value, details) => {
    onValueInvalid?.(value, details);
    if (validationType !== "none") announce(rejectedMessage ?? messages.otpRejected(validationType));
  };

  const slots: React.ReactNode[] = [];
  for (let i = 0; i < length; i++) {
    if (groupSize && i > 0 && i % groupSize === 0) {
      slots.push(
        <BaseOTPField.Separator key={`separator-${i}`} data-slot="otp-field-separator" className="flex shrink-0 items-center text-akso-muted-foreground">
          <span aria-hidden="true">–</span>
        </BaseOTPField.Separator>,
      );
    }
    slots.push(
      <BaseOTPField.Input
        key={i}
        data-slot="otp-field-input"
        aria-label={i === 0 ? undefined : labelFor(i + 1, length)}
        className={slotClassName}
        render={renderSlot}
      />,
    );
  }

  return (
    <BaseOTPField.Root
      ref={rootRef}
      data-slot="otp-field"
      length={length}
      required={required ?? field?.required}
      validationType={validationType}
      onValueInvalid={handleInvalid}
      className={cn("flex w-full max-w-sm items-center gap-1.5 sm:gap-2", className)}
      {...props}
    >
      {slots}
    </BaseOTPField.Root>
  );
}

export { OtpField };
