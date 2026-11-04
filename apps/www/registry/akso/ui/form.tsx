"use client";

import * as React from "react";
import { Form as BaseForm } from "@base-ui/react/form";

import { cn } from "@/lib/utils";
import { announce, markSubmitted, useAnnouncerRegion } from "@/registry/akso/lib/akso-form";

/*
 * Akso UI · Form
 *
 * Built on @base-ui/react/form. Base UI validates the fields on submit and moves focus
 * to the first invalid field, whose error is then read by screen readers. This file adds
 * a polite announcement with the number of fields that need attention, so people know
 * whether there are more errors further down.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface FormProps extends Omit<BaseForm.Props, "className"> {
  className?: string;
  /**
   * Message announced after a submit with errors. Default:
   * "1 field needs attention." / "3 fields need attention." Translate it for your audience.
   * Return an empty string to announce nothing.
   */
  invalidMessage?: (count: number) => string;
}

const defaultInvalidMessage = (count: number) => (count === 1 ? "1 field needs attention." : `${count} fields need attention.`);

/** A form that validates its Fields. Use `onFormSubmit` to get the values as an object. */
function Form({ className, invalidMessage = defaultInvalidMessage, ref, ...props }: FormProps) {
  const formRef = React.useRef<HTMLFormElement | null>(null);
  useAnnouncerRegion();

  // Listen in the capture phase, before Base UI handles the submit, without replacing its handlers.
  React.useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const onSubmit = () => {
      markSubmitted(form);
      // After Base UI has validated and moved focus, count the invalid fields.
      setTimeout(() => {
        const count = form.querySelectorAll('[data-slot="field"][data-invalid]').length;
        const message = count > 0 ? invalidMessage(count) : "";
        if (message) announce(message, form.ownerDocument);
      }, 0);
    };
    form.addEventListener("submit", onSubmit, { capture: true });
    return () => form.removeEventListener("submit", onSubmit, { capture: true });
  }, [invalidMessage]);

  const setRefs = React.useCallback(
    (node: HTMLFormElement | null) => {
      formRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  return <BaseForm ref={setRefs} data-slot="form" className={cn("flex flex-col gap-6", className)} {...props} />;
}

export { Form };
