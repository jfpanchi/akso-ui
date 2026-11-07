"use client";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/registry/akso/ui/field";
import { NumberField } from "@/registry/akso/ui/number-field";

/** Demo used by the docs page and by the e2e tests. */
export function NumberFieldDemo() {
  return (
    <div className="flex flex-col gap-6">
      <Field name="guests" required validationMode="onBlur">
        <FieldLabel>Guests</FieldLabel>
        <FieldDescription>From 1 to 8 people.</FieldDescription>
        <NumberField defaultValue={2} min={1} max={8} />
        <FieldError match="valueMissing">Enter the number of guests.</FieldError>
      </Field>
      <Field>
        <FieldLabel>Price per night</FieldLabel>
        <NumberField name="price" defaultValue={80} min={0} step={5} format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }} />
      </Field>
      <Field disabled>
        <FieldLabel>Rooms (not available)</FieldLabel>
        <NumberField name="rooms" defaultValue={1} disabled />
      </Field>
    </div>
  );
}
