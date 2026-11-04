"use client";

import * as React from "react";
import { Menu as BaseMenu } from "@base-ui/react/menu";

import { cn } from "@/lib/utils";
import { buttonClassName, listItemClassName, popupSurfaceClassName, type ButtonSize, type ButtonVariant } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Menu
 *
 * Built on @base-ui/react/menu: role="menu"/"menuitem" (and menuitemcheckbox/menuitemradio),
 * arrow keys, Home/End, typeahead, Escape, and focus return to the trigger. The highlighted
 * item has a 2px ring with ≥3:1 contrast, and checked items show a check mark or dot.
 *
 * Use a menu for actions ("Rename", "Delete"). For navigation between pages, use links.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

function Menu(props: BaseMenu.Root.Props) {
  return <BaseMenu.Root {...props} />;
}

type ButtonPartProps<P> = Omit<P, "className"> & { className?: string; variant?: ButtonVariant; size?: ButtonSize };

/** The button that opens the menu. Icon-only triggers need an aria-label ("More actions"). */
function MenuTrigger({ className, variant = "secondary", size, ...props }: ButtonPartProps<BaseMenu.Trigger.Props>) {
  return <BaseMenu.Trigger data-slot="menu-trigger" className={buttonClassName({ variant, size, className })} {...props} />;
}

export interface MenuContentProps extends Omit<BaseMenu.Popup.Props, "className"> {
  className?: string;
  side?: BaseMenu.Positioner.Props["side"];
  align?: BaseMenu.Positioner.Props["align"];
}

function MenuContent({ className, side = "bottom", align = "start", ...props }: MenuContentProps) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner data-slot="menu-positioner" className="z-50 outline-none" side={side} align={align} sideOffset={4} collisionPadding={16}>
        <BaseMenu.Popup data-slot="menu-content" className={cn(popupSurfaceClassName, "min-w-48 p-1", className)} {...props} />
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

function MenuItem({ className, ...props }: Omit<BaseMenu.Item.Props, "className"> & { className?: string }) {
  return <BaseMenu.Item data-slot="menu-item" className={cn(listItemClassName, className)} {...props} />;
}

const check = (
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7" />
  </svg>
);

/** An item that can be ticked on or off. Ticked items show a check mark. */
function MenuCheckboxItem({ className, children, ...props }: Omit<BaseMenu.CheckboxItem.Props, "className"> & { className?: string }) {
  return (
    <BaseMenu.CheckboxItem data-slot="menu-checkbox-item" className={cn(listItemClassName, "grid grid-cols-[1.25rem_1fr]", className)} {...props}>
      <BaseMenu.CheckboxItemIndicator className="col-start-1 flex text-akso-primary">{check}</BaseMenu.CheckboxItemIndicator>
      <span className="col-start-2">{children}</span>
    </BaseMenu.CheckboxItem>
  );
}

function MenuRadioGroup(props: BaseMenu.RadioGroup.Props) {
  return <BaseMenu.RadioGroup data-slot="menu-radio-group" {...props} />;
}

/** One choice of a MenuRadioGroup. The chosen one shows a dot. */
function MenuRadioItem({ className, children, ...props }: Omit<BaseMenu.RadioItem.Props, "className"> & { className?: string }) {
  return (
    <BaseMenu.RadioItem data-slot="menu-radio-item" className={cn(listItemClassName, "grid grid-cols-[1.25rem_1fr]", className)} {...props}>
      <BaseMenu.RadioItemIndicator className="col-start-1 flex items-center justify-center">
        <span className="size-2.5 rounded-full bg-akso-primary" />
      </BaseMenu.RadioItemIndicator>
      <span className="col-start-2">{children}</span>
    </BaseMenu.RadioItem>
  );
}

function MenuGroup(props: BaseMenu.Group.Props) {
  return <BaseMenu.Group data-slot="menu-group" {...props} />;
}

function MenuGroupLabel({ className, ...props }: Omit<BaseMenu.GroupLabel.Props, "className"> & { className?: string }) {
  return <BaseMenu.GroupLabel data-slot="menu-group-label" className={cn("px-2 py-1.5 text-sm font-semibold text-akso-muted-foreground", className)} {...props} />;
}

function MenuSeparator({ className, ...props }: Omit<BaseMenu.Separator.Props, "className"> & { className?: string }) {
  return <BaseMenu.Separator data-slot="menu-separator" className={cn("my-1 h-px bg-akso-border", className)} {...props} />;
}

export { Menu, MenuCheckboxItem, MenuContent, MenuGroup, MenuGroupLabel, MenuItem, MenuRadioGroup, MenuRadioItem, MenuSeparator, MenuTrigger };
