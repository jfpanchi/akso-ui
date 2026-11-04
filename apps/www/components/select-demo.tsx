"use client";

import { Button } from "@/registry/akso/ui/button";
import { Field, FieldDescription, FieldError } from "@/registry/akso/ui/field";
import { Form } from "@/registry/akso/ui/form";
import { Select, SelectContent, SelectGroup, SelectGroupLabel, SelectItem, SelectLabel, SelectSeparator, SelectTrigger } from "@/registry/akso/ui/select";

const timeZones = {
  americas: [
    { value: "america-bogota", label: "Bogotá, Lima, Quito (UTC−5)" },
    { value: "america-santiago", label: "Santiago (UTC−4)" },
    { value: "america-buenos-aires", label: "Buenos Aires (UTC−3)" },
  ],
  europe: [
    { value: "europe-madrid", label: "Madrid (UTC+1)" },
    { value: "europe-london", label: "London (UTC+0)" },
  ],
};
const items = [...timeZones.americas, ...timeZones.europe];

/** Demo used by the docs page and by the e2e tests. */
export function SelectDemo() {
  return (
    <Form className="max-w-md">
      <Field name="timezone" required>
        <Select items={items}>
          <SelectLabel>Time zone</SelectLabel>
          <SelectTrigger placeholder="Choose a time zone" />
          <SelectContent>
            <SelectGroup>
              <SelectGroupLabel>Americas</SelectGroupLabel>
              {timeZones.americas.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectGroupLabel>Europe</SelectGroupLabel>
              {timeZones.europe.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <FieldDescription>Used for reminders.</FieldDescription>
        <FieldError match="valueMissing">Choose a time zone.</FieldError>
      </Field>
      <div>
        <Button type="submit" variant="primary">
          Save
        </Button>
      </div>
    </Form>
  );
}
