"use client";

import * as React from "react";
import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import { Toolbar as BaseToolbar } from "@base-ui/react/toolbar";

import { cn } from "@/lib/utils";
import { buttonClassName, focusRingClassName, forcedFillClassName, toggleClassName, warnIfUnnamed, type ButtonSize } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Toolbar
 *
 * Built on @base-ui/react/toolbar: a role="toolbar" with aria-orientation. Tab enters the
 * toolbar once; the arrow keys move between its controls (and wrap around), so a long
 * toolbar is a single Tab stop. Base UI's Toolbar does not handle Home/End (optional in the
 * WAI-ARIA pattern); inside a ToolbarToggleGroup they move within the group. Disabled buttons stay focusable (Base UI default), so people
 * can still find them and hear that they are unavailable.
 *
 * Toggle buttons inside it use Base UI Toggle through the `render` prop, as the Base UI docs
 * show, so they keep aria-pressed. This file adds 44px targets, the Akso pressed style (not
 * color alone), wrapping on narrow screens, and errors in development for unnamed parts.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

/** Sets several refs to the same node. */
function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.RefObject<T | null>).current = node;
    }
  };
}

/** A ref that logs an error in development when the element has no accessible name. */
function useNamedRef<T extends HTMLElement>(component: string, hint: string) {
  const inner = React.useRef<T | null>(null);
  React.useEffect(() => {
    warnIfUnnamed(inner.current, component, hint);
  }, [component, hint]);
  return inner;
}

export interface ToolbarProps extends Omit<BaseToolbar.Root.Props, "className"> {
  className?: string;
}

/** A row of controls, like the buttons above a text editor. Name it with `aria-label`, for example "Text formatting". */
function Toolbar({ className, ref, ...props }: ToolbarProps) {
  const inner = useNamedRef<HTMLDivElement>("Toolbar", 'Add an aria-label, for example aria-label="Text formatting".');
  return (
    <BaseToolbar.Root
      ref={mergeRefs(inner, ref)}
      data-slot="toolbar"
      className={cn(
        "flex max-w-full flex-wrap items-center gap-1 rounded-md border border-akso-border bg-akso-surface p-1 text-akso-foreground",
        "data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
        className,
      )}
      {...props}
    />
  );
}

export interface ToolbarButtonProps extends Omit<BaseToolbar.Button.Props, "className"> {
  className?: string;
  /** `icon` is a 44×44px square: give it an `aria-label`. */
  size?: ButtonSize;
}

/** A button in a toolbar. */
function ToolbarButton({ size = "default", className, type = "button", ref, ...props }: ToolbarButtonProps) {
  const inner = useNamedRef<HTMLButtonElement>("ToolbarButton", 'Add text, or an aria-label for icon-only buttons (size="icon").');
  return <BaseToolbar.Button ref={mergeRefs(inner, ref)} data-slot="toolbar-button" type={type} className={buttonClassName({ variant: "ghost", size, className })} {...props} />;
}

export interface ToolbarToggleProps extends Omit<BaseToggle.Props, "className" | "render"> {
  className?: string;
  /** Needed inside a ToolbarToggleGroup. */
  value?: string;
  /** `icon` is a 44×44px square: give it an `aria-label`. */
  size?: ButtonSize;
}

/** A button in a toolbar that stays on or off (aria-pressed), like "Bold". */
function ToolbarToggle({ size = "default", className, ref, ...props }: ToolbarToggleProps) {
  const inner = useNamedRef<HTMLButtonElement>("ToolbarToggle", 'Add text, or an aria-label for icon-only toggles (size="icon").');
  return <BaseToolbar.Button ref={mergeRefs(inner, ref)} data-slot="toolbar-toggle" render={<BaseToggle {...props} />} className={toggleClassName({ size, className })} />;
}

export interface ToolbarToggleGroupProps extends Omit<BaseToggleGroup.Props, "className"> {
  className?: string;
}

/** A set of ToolbarToggles that belong together, like text alignment. Name it with `aria-label`. */
function ToolbarToggleGroup({ className, ref, ...props }: ToolbarToggleGroupProps) {
  const inner = useNamedRef<HTMLDivElement>("ToolbarToggleGroup", 'Add an aria-label, for example aria-label="Alignment".');
  return <BaseToggleGroup ref={mergeRefs(inner, ref)} data-slot="toolbar-toggle-group" className={cn("flex flex-wrap gap-1", className)} {...props} />;
}

export interface ToolbarGroupProps extends Omit<BaseToolbar.Group.Props, "className"> {
  className?: string;
}

/** Groups related buttons. Name it with `aria-label` when its purpose is not obvious. */
function ToolbarGroup({ className, ...props }: ToolbarGroupProps) {
  return <BaseToolbar.Group data-slot="toolbar-group" className={cn("flex flex-wrap gap-1", className)} {...props} />;
}

/** A line between groups of controls. Screen readers announce it as a separator. */
function ToolbarSeparator({ className, ...props }: Omit<BaseToolbar.Separator.Props, "className"> & { className?: string }) {
  return (
    <BaseToolbar.Separator
      data-slot="toolbar-separator"
      className={cn("mx-1 h-6 w-px self-center bg-akso-border data-[orientation=horizontal]:my-1 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-auto", forcedFillClassName, className)}
      {...props}
    />
  );
}

/** A link in a toolbar, for example "Help". */
function ToolbarLink({ className, ...props }: Omit<BaseToolbar.Link.Props, "className"> & { className?: string }) {
  return (
    <BaseToolbar.Link
      data-slot="toolbar-link"
      className={cn("inline-flex min-h-11 items-center rounded-md px-3 text-akso-primary underline underline-offset-2", focusRingClassName, className)}
      {...props}
    />
  );
}

export { Toolbar, ToolbarButton, ToolbarGroup, ToolbarLink, ToolbarSeparator, ToolbarToggle, ToolbarToggleGroup };
