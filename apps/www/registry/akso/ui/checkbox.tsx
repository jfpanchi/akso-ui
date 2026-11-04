"use client";

import * as React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";

import { Field as BaseField } from "@base-ui/react/field";

import { cn } from "@/lib/utils";
import { useAksoField } from "@/registry/akso/lib/akso-form";
import { choiceControlClassName, choiceLabelClassName } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Checkbox
 *
 * Built on @base-ui/react/checkbox, labeled with an enclosing <label> (the Base UI
 * labeling pattern), so the box and its text form one large target. Base UI provides
 * role="checkbox", aria-checked (including "mixed"), keyboard support and form integration.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface CheckboxProps extends Omit<BaseCheckbox.Root.Props, "className" | "children"> {
  /** The visible label. Required: say what ticking the box means. */
  children: React.ReactNode;
  className?: string;
}

/** A box people can tick or untick. Shows a check mark when ticked and a dash when partly ticked. */
function Checkbox({ children, className, ...props }: CheckboxProps) {
  return (
    <ChoiceLabel data-slot="checkbox-label" className={choiceLabelClassName(className)}>
      <BaseCheckbox.Root data-slot="checkbox" className={cn(choiceControlClassName, "group rounded-md")} {...props}>
        <BaseCheckbox.Indicator data-slot="checkbox-indicator" className="flex">
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-4 group-data-indeterminate:hidden" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7" />
          </svg>
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="hidden size-4 group-data-indeterminate:block" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
            <path d="M6 12h12" />
          </svg>
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
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

export { Checkbox };
