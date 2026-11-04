"use client";

import { Checkbox } from "@/registry/akso/ui/checkbox";
import { CheckboxGroup } from "@/registry/akso/ui/checkbox-group";

/** Demo used by the docs page and by the e2e tests. */
export function CheckboxGroupDemo() {
  return (
    <CheckboxGroup legend="How should we contact you?" defaultValue={["email"]}>
      <Checkbox value="email">Email</Checkbox>
      <Checkbox value="sms">Text message</Checkbox>
      <Checkbox value="phone">Phone call</Checkbox>
    </CheckboxGroup>
  );
}
