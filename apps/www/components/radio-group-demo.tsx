"use client";

import { Button } from "@/registry/akso/ui/button";
import { Field, FieldError } from "@/registry/akso/ui/field";
import { Form } from "@/registry/akso/ui/form";
import { Radio, RadioGroup } from "@/registry/akso/ui/radio-group";

/** Demo used by the docs page and by the e2e tests. */
export function RadioGroupDemo() {
  return (
    <Form className="max-w-md">
      <Field name="delivery" required>
        <RadioGroup legend="Delivery speed">
          <Radio value="standard">Standard: 3 to 5 days, free</Radio>
          <Radio value="express">Express: 1 to 2 days, $5</Radio>
          <Radio value="pickup" disabled>
            Pick up in store (not available)
          </Radio>
        </RadioGroup>
        <FieldError match="valueMissing">Choose a delivery speed.</FieldError>
      </Field>
      <div>
        <Button type="submit" variant="primary">
          Continue
        </Button>
      </div>
    </Form>
  );
}
