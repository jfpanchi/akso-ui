"use client";

import { Button } from "@/registry/akso/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/registry/akso/ui/field";
import { Textarea } from "@/registry/akso/ui/textarea";

/** Demo used by the docs page and by the e2e tests. */
export function TextareaDemo() {
  return (
    <div className="flex max-w-md flex-col gap-6">
      <Field name="feedback" required validationMode="onBlur">
        <FieldLabel>Your feedback</FieldLabel>
        <Textarea maxLength={500} />
        <FieldDescription>Up to 500 characters.</FieldDescription>
        <FieldError match="valueMissing">Write your feedback.</FieldError>
      </Field>
      {/* A real form has something after its last field. Without it, Tab from the textarea leaves the
          page, and Firefox (headless) keeps focus on it, so the blur that validates never happens. */}
      <div>
        <Button variant="primary">Send feedback</Button>
      </div>
    </div>
  );
}
