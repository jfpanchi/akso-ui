"use client";

import { useState } from "react";
import { LiveRegion } from "akso-ui";
import { Button } from "@/registry/akso/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/registry/akso/ui/field";
import { Fieldset, FieldsetLegend } from "@/registry/akso/ui/fieldset";
import { Form } from "@/registry/akso/ui/form";
import { Input } from "@/registry/akso/ui/input";
import { Textarea } from "@/registry/akso/ui/textarea";

/** Demo used by the docs page and by the e2e tests. */
export function FormDemo({ errorSummary = false }: { errorSummary?: boolean }) {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <div className="flex max-w-md flex-col gap-4">
      <Form
        errorSummary={errorSummary}
        errors={errors}
        onFormSubmit={async (values: { name?: string; email?: string; message?: string }) => {
          setSending(true);
          setStatus("");
          await new Promise((r) => setTimeout(r, 600));
          setSending(false);
          // Mimic a server-side check.
          if (values.email?.endsWith("@example.org")) {
            setErrors({ email: "We cannot reply to example.org addresses. Use another email." });
            return;
          }
          setErrors({});
          setStatus("Message sent. We will reply within 2 days.");
        }}
      >
        <Fieldset>
          <FieldsetLegend>Your details</FieldsetLegend>
          <Field name="name" required>
            <FieldLabel>Name</FieldLabel>
            <Input autoComplete="name" />
            <FieldError match="valueMissing">Enter your name.</FieldError>
          </Field>
          <Field name="email" required>
            <FieldLabel>Email</FieldLabel>
            <Input type="email" autoComplete="email" />
            <FieldDescription>We only use it to reply to you.</FieldDescription>
            <FieldError match="valueMissing">Enter your email.</FieldError>
            <FieldError match="typeMismatch">Enter an email like name@example.com.</FieldError>
            {errors.email ? <FieldError /> : null}
          </Field>
        </Fieldset>
        <Field name="message" required>
          <FieldLabel>Message</FieldLabel>
          <Textarea />
          <FieldError match="valueMissing">Write a message.</FieldError>
        </Field>
        <div>
          <Button type="submit" variant="primary" loading={sending} loadingText="Sending">
            Send message
          </Button>
        </div>
      </Form>
      <LiveRegion message={status} visible className="font-medium" />
    </div>
  );
}
