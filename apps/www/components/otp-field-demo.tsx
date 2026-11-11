"use client";

import * as React from "react";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/registry/akso/ui/field";
import { OtpField } from "@/registry/akso/ui/otp-field";

/** Demo used by the docs page and by the e2e tests. */
export function OtpFieldDemo() {
  const [code, setCode] = React.useState("");
  return (
    <div className="flex flex-col gap-6">
      <Field name="code" required validationMode="onBlur">
        <FieldLabel>Verification code</FieldLabel>
        <FieldDescription>Enter the 6-digit code we sent to your email.</FieldDescription>
        <OtpField length={6} groupSize={3} value={code} onValueChange={setCode} />
        <FieldError match="valueMissing">Enter the code.</FieldError>
        <FieldError match="patternMismatch">Enter all 6 digits.</FieldError>
      </Field>
      <p className="text-sm text-akso-muted-foreground">
        Code entered: <output data-testid="otp-value">{code || "none"}</output>
      </p>
      <Field name="backup">
        <FieldLabel>Backup code</FieldLabel>
        <FieldDescription>8 letters or numbers.</FieldDescription>
        <OtpField length={8} validationType="alphanumeric" normalizeValue={(v) => v.toUpperCase()} />
      </Field>
      <Field disabled>
        <FieldLabel>PIN (not available)</FieldLabel>
        <OtpField length={4} mask disabled />
      </Field>
    </div>
  );
}
