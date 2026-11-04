"use client";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/registry/akso/ui/field";
import { Input } from "@/registry/akso/ui/input";

/** Demo used by the docs page and by the e2e tests. Validates when focus leaves the field. */
export function FieldDemo() {
  return (
    <div className="flex max-w-md flex-col gap-6">
      <Field name="email" required validationMode="onBlur">
        <FieldLabel>Email</FieldLabel>
        <Input type="email" autoComplete="email" />
        <FieldDescription>We only use it to reply to you.</FieldDescription>
        <FieldError match="valueMissing">Enter your email.</FieldError>
        <FieldError match="typeMismatch">Enter an email like name@example.com.</FieldError>
      </Field>
      <Field name="nickname">
        <FieldLabel>Nickname</FieldLabel>
        <Input autoComplete="nickname" />
      </Field>
    </div>
  );
}
