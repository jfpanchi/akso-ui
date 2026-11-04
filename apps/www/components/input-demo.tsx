"use client";

import { Field, FieldError, FieldLabel } from "@/registry/akso/ui/field";
import { Input } from "@/registry/akso/ui/input";

/** Demo used by the docs page and by the e2e tests. */
export function InputDemo() {
  return (
    <div className="flex max-w-md flex-col gap-6">
      <Field name="phone">
        <FieldLabel>Phone number</FieldLabel>
        <Input type="tel" autoComplete="tel" inputMode="tel" />
      </Field>
      <Field name="code" invalid>
        <FieldLabel>Discount code</FieldLabel>
        <Input defaultValue="SUMMER" autoComplete="off" />
        <FieldError match>This code has expired.</FieldError>
      </Field>
      <Field name="account" disabled>
        <FieldLabel>Account number</FieldLabel>
        <Input defaultValue="0042-1337" />
      </Field>
    </div>
  );
}
