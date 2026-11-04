"use client";

import * as React from "react";
import { Input as BaseInput } from "@base-ui/react/input";

import { cn } from "@/lib/utils";
import { useAksoField } from "@/registry/akso/lib/akso-form";
import { inputClassName } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Textarea
 *
 * A multi-line text field. Built on @base-ui/react/input rendered as a <textarea>,
 * so it works with Field (label, description, errors, validation) like Input.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface TextareaProps extends Omit<BaseInput.Props, "className" | "render"> {
  className?: string;
  /** Visible number of lines. Default: 4. */
  rows?: number;
}

/** A multi-line text field. It can be resized vertically. */
function Textarea({ className, required, rows = 4, ...props }: TextareaProps) {
  const field = useAksoField();
  return (
    <BaseInput
      data-slot="textarea"
      render={<textarea rows={rows} />}
      required={required ?? field?.required}
      className={inputClassName(cn("min-h-24 resize-y", className))}
      {...props}
    />
  );
}

export { Textarea };
