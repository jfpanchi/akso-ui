"use client";

import * as React from "react";
import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";

import { cn } from "@/lib/utils";
import { toggleClassName, warnIfUnnamed, type ToggleSize } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Toggle group
 *
 * Built on @base-ui/react/toggle-group: a role="group" with toggle buttons (aria-pressed).
 * Tab enters the group on one button; the arrow keys move between buttons; Space or Enter
 * presses one. Without `multiple`, pressing one releases the others (like text alignment).
 * This file adds the same pressed style as Toggle (not color alone), 44px targets,
 * wrapping on narrow screens, and an error in development when the group has no name.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface ToggleGroupProps extends Omit<BaseToggleGroup.Props, "className"> {
  className?: string;
}

/** A set of toggle buttons. Name it with `aria-label` (or `aria-labelledby`), for example "Text alignment". */
function ToggleGroup({ className, ref, ...props }: ToggleGroupProps) {
  const innerRef = React.useRef<HTMLDivElement | null>(null);
  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );
  React.useEffect(() => {
    warnIfUnnamed(innerRef.current, "ToggleGroup", 'Add an aria-label, for example aria-label="Text alignment".');
  }, []);

  return (
    <BaseToggleGroup
      ref={setRefs}
      data-slot="toggle-group"
      className={cn("inline-flex max-w-full flex-wrap gap-1 data-[orientation=vertical]:flex-col", className)}
      {...props}
    />
  );
}

export interface ToggleGroupItemProps extends Omit<BaseToggle.Props, "className"> {
  className?: string;
  /** Identifies the button in the group's `value`. */
  value: string;
  /** `icon` is a 44×44px square: give it an `aria-label`. */
  size?: ToggleSize;
}

/** One button in a ToggleGroup. */
function ToggleGroupItem({ size = "default", className, ref, ...props }: ToggleGroupItemProps) {
  const innerRef = React.useRef<HTMLButtonElement | null>(null);
  const setRefs = React.useCallback(
    (node: HTMLButtonElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );
  React.useEffect(() => {
    warnIfUnnamed(innerRef.current, "ToggleGroupItem", 'Add text, or an aria-label for icon-only items (size="icon").');
  }, []);

  return <BaseToggle ref={setRefs} data-slot="toggle-group-item" className={toggleClassName({ size, className })} {...props} />;
}

export { ToggleGroup, ToggleGroupItem };
