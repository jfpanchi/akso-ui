"use client";

import * as React from "react";
import { Fieldset as BaseFieldset } from "@base-ui/react/fieldset";
import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";

import { Field as BaseField } from "@base-ui/react/field";

import { cn } from "@/lib/utils";
import { useAksoField } from "@/registry/akso/lib/akso-form";
import { choiceControlClassName, choiceLabelClassName, legendClassName } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Radio group
 *
 * A <fieldset> rendered as a Base UI RadioGroup, with a <legend> that names the group
 * (the pattern from the Base UI forms guide). Base UI provides role="radiogroup"/"radio",
 * aria-checked, roving focus and arrow-key navigation. Each Radio is labeled with an
 * enclosing <label>, so the circle and its text form one large target.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface RadioGroupProps extends Omit<BaseRadioGroup.Props, "className" | "render"> {
  /** The visible name of the group (the question). Required. Inside a required Field it shows "(required)". */
  legend: React.ReactNode;
  className?: string;
}

/** A set of options where only one can be chosen. */
function RadioGroup({ legend, className, children, required, ...props }: RadioGroupProps) {
  const field = useAksoField();
  return (
    <BaseFieldset.Root
      data-slot="radio-group"
      className={cn("flex min-w-0 flex-col border-0 p-0", className)}
      render={<BaseRadioGroup required={required ?? field?.required} {...props} />}
    >
      <BaseFieldset.Legend data-slot="radio-group-legend" className={legendClassName}>
        {legend}
        {field?.required ? (
          <span aria-hidden="true" className="font-normal text-akso-muted-foreground">
            {" "}
            {field.requiredText}
          </span>
        ) : null}
      </BaseFieldset.Legend>
      {children}
    </BaseFieldset.Root>
  );
}

export interface RadioProps extends Omit<BaseRadio.Root.Props, "className" | "children"> {
  /** The visible label of the option. Required. */
  children: React.ReactNode;
  className?: string;
}

/** One option of a RadioGroup. Shows a filled dot when chosen, not only a color change. */
function Radio({ children, className, ...props }: RadioProps) {
  return (
    <ChoiceLabel data-slot="radio-label" className={choiceLabelClassName(className)}>
      <BaseRadio.Root data-slot="radio" className={cn(choiceControlClassName, "rounded-full data-checked:bg-akso-surface")} {...props}>
        <BaseRadio.Indicator data-slot="radio-indicator" className="size-3 rounded-full bg-akso-primary" />
      </BaseRadio.Root>
      <span>{children}</span>
    </ChoiceLabel>
  );
}

/**
 * The enclosing <label>. Inside a Field it is a Field.Item, which gives each option its own
 * label scope (Base UI forms guide); without it, options in one Field share a label id and
 * every option gets the name of the first one.
 */
function ChoiceLabel(props: React.ComponentProps<"label">) {
  const inField = useAksoField() !== null;
  // The control and its text arrive as children (see the component above), which the lint rule cannot see.
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  if (inField) return <BaseField.Item render={<label />} {...(props as Omit<BaseField.Item.Props, "render">)} />;
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  return <label {...props} />;
}

export { Radio, RadioGroup };
