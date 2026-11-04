"use client";

import { Input as BaseInput } from "@base-ui/react/input";

import { useAksoField } from "@/registry/akso/lib/akso-form";
import { inputClassName } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Input
 *
 * Built on @base-ui/react/input, which works with Field automatically: inside a
 * <Field>, the label, description and errors are linked for you.
 *
 * Every input needs a visible label. Use it inside <Field> with <FieldLabel>.
 * Set `type` and `autoComplete` (for example `type="email" autoComplete="email"`) so browsers
 * and password managers can fill it in (WCAG 1.3.5).
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface InputProps extends Omit<BaseInput.Props, "className"> {
  className?: string;
}

/** A single-line text field. */
function Input({ className, required, ...props }: InputProps) {
  const field = useAksoField();
  return <BaseInput data-slot="input" required={required ?? field?.required} className={inputClassName(className)} {...props} />;
}

export { Input };
