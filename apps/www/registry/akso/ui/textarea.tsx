"use client";

import * as React from "react";
import { Input as BaseInput } from "@base-ui/react/input";

import { cn } from "@/lib/utils";
import { announce, useAksoField, useAnnouncerRegion } from "@/registry/akso/lib/akso-form";
import { useAksoMessages } from "@/registry/akso/lib/akso-locale";
import { inputClassName } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Textarea
 *
 * A multi-line text field. Built on @base-ui/react/input rendered as a <textarea>,
 * so it works with Field (label, description, errors, validation) like Input.
 *
 * With `maxLength`, it shows how many characters are left. Screen readers hear it only at a
 * few thresholds (20 left, 10 left, at the limit), not on every key, through the shared polite
 * live region. The control's aria-describedby stays as Base UI sets it.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface TextareaProps extends Omit<BaseInput.Props, "className" | "render"> {
  className?: string;
  /** Visible number of lines. Default: 4. */
  rows?: number;
  /** Maximum number of characters. Shows a "characters left" counter. */
  maxLength?: number;
  /** Show the counter when `maxLength` is set. Default: true. */
  showCount?: boolean;
}

/** Remaining counts at which the counter is announced. */
const ANNOUNCE_AT = [20, 10, 0];

/** A multi-line text field. It can be resized vertically. */
function Textarea({ className, required, rows = 4, maxLength, showCount = true, onValueChange, value, defaultValue, ...props }: TextareaProps) {
  const field = useAksoField();
  const messages = useAksoMessages();
  const counterId = React.useId();
  const [uncontrolledLength, setLength] = React.useState(() => String(defaultValue ?? "").length);
  const length = value !== undefined ? String(value).length : uncontrolledLength;
  const counting = maxLength !== undefined && showCount;
  const remaining = counting ? Math.max(0, maxLength - length) : 0;
  const lastAnnounced = React.useRef<number | null>(null);
  useAnnouncerRegion();

  React.useEffect(() => {
    if (!counting) return;
    const threshold = ANNOUNCE_AT.find((t) => remaining === t);
    if (threshold !== undefined && lastAnnounced.current !== threshold) {
      lastAnnounced.current = threshold;
      announce(messages.charactersLeft(remaining));
    }
    // Typing back above a threshold lets it be announced again later.
    if (lastAnnounced.current !== null && remaining > lastAnnounced.current) lastAnnounced.current = null;
  }, [remaining, counting, messages]);

  const control = (
    <BaseInput
      data-slot="textarea"
      render={<textarea rows={rows} maxLength={maxLength} />}
      required={required ?? field?.required}
      className={inputClassName(cn("min-h-24 resize-y", className))}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next, details) => {
        setLength(next.length);
        onValueChange?.(next, details);
      }}
      {...props}
    />
  );

  if (!counting) return control;
  return (
    <>
      {control}
      <p
        id={counterId}
        data-slot="textarea-count"
        data-near-limit={remaining <= 20 ? "" : undefined}
        className="text-sm text-akso-muted-foreground tabular-nums data-near-limit:font-semibold data-near-limit:text-akso-foreground"
      >
        {messages.charactersLeft(remaining)}
      </p>
    </>
  );
}

export { Textarea };
