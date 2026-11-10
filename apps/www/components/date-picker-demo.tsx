"use client";

import * as React from "react";

import { DatePicker } from "@/registry/akso/ui/date-picker";
import { Field, FieldError, FieldLabel } from "@/registry/akso/ui/field";

/** Demo used by the docs page and by the e2e tests. */
export function DatePickerDemo() {
  const [date, setDate] = React.useState("2026-03-05");
  return (
    <div className="flex flex-col gap-6">
      <Field name="appointment" validationMode="onBlur">
        <FieldLabel>Appointment date</FieldLabel>
        <DatePicker value={date} onValueChange={setDate} min="2026-01-01" max="2026-12-31" />
        <FieldError />
      </Field>
      <p>
        Chosen: <output data-testid="chosen-date">{date || "none"}</output>
      </p>
      <Field name="birthday" validationMode="onBlur">
        <FieldLabel>Date of birth</FieldLabel>
        <DatePicker calendar={false} autoComplete="bday" />
        <FieldError />
      </Field>
    </div>
  );
}
