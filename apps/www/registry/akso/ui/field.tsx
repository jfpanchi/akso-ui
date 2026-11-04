"use client";

import * as React from "react";
import { Field as BaseField } from "@base-ui/react/field";

import { cn } from "@/lib/utils";
import { useAksoMessages } from "@/registry/akso/lib/akso-locale";
import { AksoFieldContext, announce, useAnnouncerRegion, wasJustSubmitted } from "@/registry/akso/lib/akso-form";

/*
 * Akso UI · Field
 *
 * Built on @base-ui/react/field. Base UI links the label, the description and the
 * error to the control (label/for, aria-describedby), sets aria-invalid and runs
 * validation. This file adds:
 * - a visible "(required)" text after the label of required fields;
 * - an error icon next to the error text, so errors do not depend on color;
 * - a polite announcement when an error appears or changes while the person is
 *   filling in the form (Base UI's Field.Error is not a live region).
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface FieldProps extends Omit<BaseField.Root.Props, "className"> {
  className?: string;
  /** The field must be filled in. Shows `requiredText` after the label and makes Input/Textarea required. */
  required?: boolean;
  /** Text after the label of a required field. Default: "(required)" (or the AksoLocaleProvider text). */
  requiredText?: string;
  /** Announce errors to screen readers when they appear or change. Default: `true`. */
  announceErrors?: boolean;
}

/** Groups a label, a control, an optional description and error messages. */
function Field({ className, required = false, requiredText, announceErrors = true, ref, ...props }: FieldProps) {
  const messages = useAksoMessages();
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  useErrorAnnouncements(rootRef, announceErrors);

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const resolvedRequiredText = requiredText ?? messages.required;
  const context = React.useMemo(() => ({ required, requiredText: resolvedRequiredText }), [required, resolvedRequiredText]);

  return (
    <AksoFieldContext.Provider value={context}>
      <BaseField.Root ref={setRefs} data-slot="field" className={cn("flex min-w-0 flex-col gap-1.5", className)} {...props} />
    </AksoFieldContext.Provider>
  );
}

/** The visible label. Required: every field has a visible label. */
function FieldLabel({ className, children, ...props }: Omit<BaseField.Label.Props, "className"> & { className?: string }) {
  const field = React.useContext(AksoFieldContext);
  return (
    <BaseField.Label data-slot="field-label" className={cn("font-medium text-akso-foreground", className)} {...props}>
      {children}
      {field?.required ? (
        // Hidden from the accessible name: screen readers already say "required" from the control.
        // Keeping the name short also helps voice control ("click Name").
        <span aria-hidden="true" className="font-normal text-akso-muted-foreground">
          {" "}
          {field.requiredText}
        </span>
      ) : null}
    </BaseField.Label>
  );
}

/** Extra help, read by screen readers after the label. Keep it short. */
function FieldDescription({ className, ...props }: Omit<BaseField.Description.Props, "className"> & { className?: string }) {
  return <BaseField.Description data-slot="field-description" className={cn("text-sm text-akso-muted-foreground", className)} {...props} />;
}

/**
 * Error message, shown when the field is invalid. Without children it shows the browser's message;
 * use `match` to write your own, clear message for each problem:
 * `<FieldError match="valueMissing">Enter your name</FieldError>`.
 */
function FieldError({ className, ...props }: Omit<BaseField.Error.Props, "className" | "render"> & { className?: string }) {
  return (
    <BaseField.Error
      data-slot="field-error"
      className={cn("flex items-start gap-1.5 text-sm font-medium text-akso-danger", className)}
      // `render` receives Base UI's children: your text, or the default message (browser or server error) when you pass none.
      render={(renderProps) => (
        <div {...renderProps}>
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 7v6M12 17h.01" />
          </svg>
          <span>{renderProps.children}</span>
        </div>
      )}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Error announcements                                                         */
/* -------------------------------------------------------------------------- */

const ANNOUNCE_DELAY_MS = 500;

function readErrors(root: HTMLElement) {
  return Array.from(root.querySelectorAll('[data-slot="field-error"]'), (el) => el.textContent?.trim() ?? "")
    .filter(Boolean)
    .join(" ");
}

function readLabel(root: HTMLElement) {
  const label = root.querySelector('[data-slot="field-label"]');
  if (!label) return "";
  // Leave out aria-hidden parts, such as "(required)".
  const clone = label.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('[aria-hidden="true"]').forEach((el) => el.remove());
  return clone.textContent?.trim() ?? "";
}

/**
 * Watches the field's error messages and announces new or changed ones, for example
 * when validation runs on blur or while typing. Waits a little so fast typing does not
 * cause a flood of announcements. Skips errors shown by a submit: Base UI then moves
 * focus to the first invalid field and its error is read as the field's description.
 */
function useErrorAnnouncements(rootRef: React.RefObject<HTMLElement | null>, enabled: boolean) {
  useAnnouncerRegion();
  React.useEffect(() => {
    const root = rootRef.current;
    if (!enabled || !root) return;
    let last = readErrors(root);
    let timer: ReturnType<typeof setTimeout> | undefined;

    const observer = new MutationObserver(() => {
      clearTimeout(timer);
      const fromSubmit = wasJustSubmitted(root);
      timer = setTimeout(() => {
        const current = readErrors(root);
        if (current === last) return;
        last = current;
        if (!current || fromSubmit || wasJustSubmitted(root)) return;
        const label = readLabel(root);
        announce(label ? `${label}: ${current}` : current, root.ownerDocument);
      }, ANNOUNCE_DELAY_MS);
    });
    observer.observe(root, { childList: true, subtree: true, characterData: true });
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [rootRef, enabled]);
}

/** Read the field's validity in render, for advanced cases. */
const FieldValidity = BaseField.Validity;

export { Field, FieldDescription, FieldError, FieldLabel, FieldValidity };
