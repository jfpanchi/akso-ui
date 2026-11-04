"use client";

import { Field, FieldLabel } from "@/registry/akso/ui/field";
import { Fieldset, FieldsetLegend } from "@/registry/akso/ui/fieldset";
import { Input } from "@/registry/akso/ui/input";

/** Demo used by the docs page and by the e2e tests. */
export function FieldsetDemo() {
  return (
    <Fieldset className="max-w-md">
      <FieldsetLegend>Delivery address</FieldsetLegend>
      <Field name="street" required>
        <FieldLabel>Street and number</FieldLabel>
        <Input autoComplete="street-address" />
      </Field>
      <Field name="city" required>
        <FieldLabel>City</FieldLabel>
        <Input autoComplete="address-level2" />
      </Field>
      <Field name="postal-code">
        <FieldLabel>Postal code</FieldLabel>
        <Input autoComplete="postal-code" className="max-w-40" />
      </Field>
    </Fieldset>
  );
}
