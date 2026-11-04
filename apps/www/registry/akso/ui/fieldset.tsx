"use client";

import * as React from "react";
import { Fieldset as BaseFieldset } from "@base-ui/react/fieldset";

import { cn } from "@/lib/utils";

/*
 * Akso UI · Fieldset
 *
 * Built on @base-ui/react/fieldset (a native <fieldset> with a <legend>). Screen readers
 * announce the legend when focus enters the group, so it gives context to every field inside
 * (for example "Delivery address" before "Street").
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

/** Groups related fields under a common name. Must contain a FieldsetLegend. */
function Fieldset({ className, ...props }: Omit<BaseFieldset.Root.Props, "className"> & { className?: string }) {
  return <BaseFieldset.Root data-slot="fieldset" className={cn("flex min-w-0 flex-col gap-4 border-0 p-0", className)} {...props} />;
}

/** The name of the group. Keep it short. */
function FieldsetLegend({ className, ...props }: Omit<BaseFieldset.Legend.Props, "className"> & { className?: string }) {
  return <BaseFieldset.Legend data-slot="fieldset-legend" className={cn("mb-1 text-lg font-semibold text-akso-foreground", className)} {...props} />;
}

export { Fieldset, FieldsetLegend };
