"use client";

import * as React from "react";
import { Input as BaseInput } from "@base-ui/react/input";

import { cn } from "@/lib/utils";
import { announce, useAksoField, useAnnouncerRegion } from "@/registry/akso/lib/akso-form";
import { useAksoMessages } from "@/registry/akso/lib/akso-locale";
import { buttonClassName, inputClassName, warnIfUnnamed } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Password field
 *
 * A password input with a "Show" / "Hide" button. Built on @base-ui/react/input, so inside a
 * <Field> the label, description and errors are linked like any other input.
 *
 * Why the button: typing a password you cannot see is hard for many people (motor, memory,
 * dyslexia, small screens). Showing it helps them check it (WCAG 3.3.8 Accessible
 * Authentication asks not to block help like this). The field also never blocks paste, so
 * password managers and copy-paste work.
 *
 * This file adds:
 * - The button: visible text "Show" / "Hide", named "Show password" / "Hide password" (the
 *   visible text comes first in the name, WCAG 2.5.3), aria-controls on the input, 44px tall.
 * - An announcement after each press ("Your password is shown"), since the change itself is
 *   silent.
 * - autoComplete ("current-password" by default, "new-password" for sign-up), no spellcheck or
 *   autocapitalize.
 * - When the form is submitted, the password is hidden again, so the browser does not save the
 *   page with the password visible.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface PasswordFieldProps extends Omit<BaseInput.Props, "className" | "type"> {
  className?: string;
  /** "current-password" (sign in, default) or "new-password" (sign up, change password). */
  autoComplete?: "current-password" | "new-password";
  /** Visible text of the button. Default: "Show" / "Hide" (or the AksoLocaleProvider texts). */
  showLabel?: string;
  hideLabel?: string;
}

/** A password input with a Show / Hide button. Put it inside a Field with a FieldLabel. */
function PasswordField({ className, required, autoComplete = "current-password", showLabel, hideLabel, id: idProp, ...props }: PasswordFieldProps) {
  const field = useAksoField();
  const messages = useAksoMessages();
  const [visible, setVisible] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const fallbackId = React.useId();
  const [inputId, setInputId] = React.useState<string | undefined>(idProp);
  useAnnouncerRegion();

  React.useEffect(() => {
    const input = inputRef.current;
    warnIfUnnamed(input, "PasswordField", "Put it inside a <Field> with a <FieldLabel>.");
    // Base UI's Field may give the input its own id; point aria-controls at the real one.
    if (input?.id) setInputId(input.id);
    const form = input?.form;
    if (!form) return;
    const hide = () => setVisible(false);
    form.addEventListener("submit", hide);
    return () => form.removeEventListener("submit", hide);
  }, []);

  const show = showLabel ?? messages.showPassword;
  const hide = hideLabel ?? messages.hidePassword;
  const word = (text: string) => text.toLocaleLowerCase();

  const toggle = () => {
    const next = !visible;
    setVisible(next);
    announce(next ? messages.passwordShown : messages.passwordHidden);
  };

  return (
    <div data-slot="password-field" className={cn("flex w-full min-w-0 items-stretch gap-2", className)}>
      <BaseInput
        ref={inputRef}
        id={idProp ?? (field ? undefined : fallbackId)}
        data-slot="password-field-input"
        type={visible ? "text" : "password"}
        required={required ?? field?.required}
        autoComplete={autoComplete}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        className={inputClassName("flex-1")}
        {...props}
      />
      <button
        type="button"
        data-slot="password-field-toggle"
        aria-controls={inputId ?? idProp ?? fallbackId}
        // The visible word comes first, so voice control users can say what they see (WCAG 2.5.3).
        aria-label={`${visible ? hide : show} ${word(messages.passwordWord)}`}
        onClick={toggle}
        className={buttonClassName({ variant: "secondary", className: "min-w-20 shrink-0" })}
      >
        {visible ? hide : show}
      </button>
    </div>
  );
}

export { PasswordField };
