"use client";

import { Combobox } from "@/registry/akso/ui/combobox";
import { Field, FieldDescription, FieldError } from "@/registry/akso/ui/field";
import { Form } from "@/registry/akso/ui/form";
import { Button } from "@/registry/akso/ui/button";

const countries = [
  "Argentina", "Bolivia", "Brazil", "Chile", "Colombia", "Costa Rica", "Cuba", "Dominican Republic", "Ecuador", "El Salvador",
  "Guatemala", "Honduras", "Mexico", "Nicaragua", "Panama", "Paraguay", "Peru", "Puerto Rico", "Spain", "Uruguay", "Venezuela",
].map((label) => ({ value: label.toLowerCase().replace(/\s+/g, "-"), label }));

/** Demo used by the docs page and by the e2e tests. */
export function ComboboxDemo() {
  return (
    <Form className="max-w-md">
      <Field name="country" required>
        <Combobox label="Country" items={countries} placeholder="Type to search" />
        <FieldDescription>Start typing to filter the list.</FieldDescription>
        <FieldError match="valueMissing">Choose your country.</FieldError>
      </Field>
      <div>
        <Button type="submit" variant="primary">
          Continue
        </Button>
      </div>
    </Form>
  );
}
