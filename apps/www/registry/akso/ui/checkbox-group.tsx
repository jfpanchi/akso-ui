"use client";

import * as React from "react";
import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import { Fieldset as BaseFieldset } from "@base-ui/react/fieldset";

import { cn } from "@/lib/utils";
import { legendClassName } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Checkbox group
 *
 * A <fieldset> rendered as a Base UI CheckboxGroup, with a <legend> that names the group
 * (the pattern from the Base UI forms guide). Screen readers announce the legend when focus
 * enters the group. Put Akso <Checkbox> items inside, each with a `value`.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface CheckboxGroupProps extends Omit<BaseCheckboxGroup.Props, "className" | "render"> {
  /** The visible name of the group. Required. */
  legend: React.ReactNode;
  className?: string;
}

/** Several checkboxes that answer one question. */
function CheckboxGroup({ legend, className, children, ...props }: CheckboxGroupProps) {
  return (
    <BaseFieldset.Root
      data-slot="checkbox-group"
      className={cn("flex min-w-0 flex-col border-0 p-0", className)}
      render={<BaseCheckboxGroup {...props} />}
    >
      <BaseFieldset.Legend data-slot="checkbox-group-legend" className={legendClassName}>
        {legend}
      </BaseFieldset.Legend>
      {children}
    </BaseFieldset.Root>
  );
}

export { CheckboxGroup };
