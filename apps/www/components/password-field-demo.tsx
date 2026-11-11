"use client";

import * as React from "react";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/registry/akso/ui/field";
import { PasswordField } from "@/registry/akso/ui/password-field";

/** Demo used by the docs page and by the e2e tests. */
export function PasswordFieldDemo() {
  const [submitted, setSubmitted] = React.useState(false);
  return (
    <form
      className="flex max-w-sm flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <Field name="password" required validationMode="onBlur">
        <FieldLabel>Password</FieldLabel>
        <FieldDescription>At least 8 characters.</FieldDescription>
        <PasswordField autoComplete="new-password" minLength={8} />
        <FieldError match="valueMissing">Enter a password.</FieldError>
        <FieldError match="tooShort">Use at least 8 characters.</FieldError>
      </Field>
      <button
        type="submit"
        className="min-h-11 self-start rounded-md bg-akso-primary px-4 text-akso-primary-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-akso-focus-ring"
      >
        Create account
      </button>
      {submitted ? <p role="status">Account created.</p> : null}
    </form>
  );
}
