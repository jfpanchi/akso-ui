"use client";

import * as React from "react";
import { Form as BaseForm } from "@base-ui/react/form";

import { cn } from "@/lib/utils";
import { useAksoMessages } from "@/registry/akso/lib/akso-locale";
import { announce, markSubmitted, useAnnouncerRegion } from "@/registry/akso/lib/akso-form";
import { StatusIcon } from "@/registry/akso/lib/akso-status";
import { focusRingClassName } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Form
 *
 * Built on @base-ui/react/form. Base UI validates the fields on submit and moves focus
 * to the first invalid field, whose error is then read by screen readers. This file adds
 * a polite announcement with the number of fields that need attention, so people know
 * whether there are more errors further down.
 *
 * With `errorSummary`, a submit with errors instead shows a summary at the top of the form
 * (the GOV.UK pattern): a heading and one link per field with an error. Focus moves to the
 * summary, so screen readers read it first; each link moves focus to its field. This helps in
 * long forms, where the first error may not be the only one.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface FormProps extends Omit<BaseForm.Props, "className"> {
  className?: string;
  /**
   * Message announced after a submit with errors. Default:
   * "1 field needs attention." / "3 fields need attention." (or the AksoLocaleProvider text).
   * Return an empty string to announce nothing. Not used when `errorSummary` is on.
   */
  invalidMessage?: (count: number) => string;
  /** Show an error summary with links at the top of the form after a submit with errors. */
  errorSummary?: boolean;
  /** Heading of the error summary. Default: "There is a problem" (or the AksoLocaleProvider text). */
  errorSummaryTitle?: string;
}

interface SummaryItem {
  id: string;
  label: string;
  error: string;
}

/** Visible text of an element, without the parts hidden from assistive technology (like "(required)"). */
function visibleText(el: Element | null) {
  if (!el) return "";
  const clone = el.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('[aria-hidden="true"]').forEach((n) => n.remove());
  return clone.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

/** The element to focus for a field: its labelled control, or the first focusable control inside it. */
function focusTarget(field: Element): HTMLElement | null {
  const forId = field.querySelector("label[for]")?.getAttribute("for");
  const byLabel = forId ? field.ownerDocument.getElementById(forId) : null;
  if (byLabel && !byLabel.hasAttribute("aria-hidden")) return byLabel;
  return field.querySelector<HTMLElement>(
    '[role="combobox"], [role="radio"], [role="checkbox"], [role="switch"], textarea, select, input:not([type="hidden"]):not([aria-hidden="true"]), button',
  );
}

function collectErrors(form: HTMLFormElement): SummaryItem[] {
  return Array.from(form.querySelectorAll('[data-slot="field"][data-invalid]')).flatMap((field) => {
    const target = focusTarget(field);
    if (!target) return [];
    if (!target.id) target.id = `akso-field-${Math.random().toString(36).slice(2, 9)}`;
    const label = visibleText(field.querySelector('[data-slot="field-label"], [data-slot="select-label"], [data-slot="combobox-label"], legend, [data-slot$="-legend"]'));
    const error = Array.from(field.querySelectorAll('[data-slot="field-error"]'), visibleText).filter(Boolean).join(" ");
    return [{ id: target.id, label, error }];
  });
}

/** A form that validates its Fields. Use `onFormSubmit` to get the values as an object. */
function Form({ className, invalidMessage: invalidMessageProp, errorSummary = false, errorSummaryTitle, children, ref, ...props }: FormProps) {
  const messages = useAksoMessages();
  const invalidMessage = invalidMessageProp ?? messages.fieldsNeedAttention;
  const summaryTitle = errorSummaryTitle ?? messages.errorSummaryTitle;
  const formRef = React.useRef<HTMLFormElement | null>(null);
  const summaryRef = React.useRef<HTMLDivElement | null>(null);
  const [summary, setSummary] = React.useState<SummaryItem[]>([]);
  const titleId = React.useId();
  useAnnouncerRegion();

  // Listen in the capture phase, before Base UI handles the submit, without replacing its handlers.
  React.useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const onSubmit = () => {
      markSubmitted(form);
      // After Base UI has validated and moved focus, read the invalid fields.
      setTimeout(() => {
        if (errorSummary) {
          setSummary(collectErrors(form));
          return;
        }
        const count = form.querySelectorAll('[data-slot="field"][data-invalid]').length;
        const message = count > 0 ? invalidMessage(count) : "";
        if (message) announce(message, form.ownerDocument);
      }, 0);
    };
    form.addEventListener("submit", onSubmit, { capture: true });
    return () => form.removeEventListener("submit", onSubmit, { capture: true });
  }, [invalidMessage, errorSummary]);

  // When a new summary appears, move focus to it so it is read first.
  React.useEffect(() => {
    if (summary.length > 0) summaryRef.current?.focus();
  }, [summary]);

  const setRefs = React.useCallback(
    (node: HTMLFormElement | null) => {
      formRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  return (
    <BaseForm ref={setRefs} data-slot="form" className={cn("flex flex-col gap-6", className)} {...props}>
      {errorSummary && summary.length > 0 ? (
        <div
          ref={summaryRef}
          data-slot="form-error-summary"
          role="group"
          aria-labelledby={titleId}
          tabIndex={-1}
          className={cn("flex gap-3 rounded-md border-2 border-akso-danger bg-akso-surface p-4 text-akso-foreground", focusRingClassName)}
        >
          <StatusIcon status="error" className="mt-0.5" />
          <div className="flex min-w-0 flex-col gap-2">
            <h2 id={titleId} className="text-lg font-semibold">
              {summaryTitle}
            </h2>
            <ul className="flex flex-col gap-1">
              {summary.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(event) => {
                      event.preventDefault();
                      const target = document.getElementById(item.id);
                      target?.focus();
                      target?.scrollIntoView?.({ block: "center" });
                    }}
                    className={cn("inline-flex min-h-6 font-medium text-akso-danger underline underline-offset-2", focusRingClassName)}
                  >
                    {item.label ? `${item.label}: ` : ""}
                    {item.error}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
      {children}
    </BaseForm>
  );
}

export { Form };
