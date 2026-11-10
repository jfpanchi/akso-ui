"use client";

import * as React from "react";
import { Menu as BaseMenu } from "@base-ui/react/menu";
import { Menubar as BaseMenubar } from "@base-ui/react/menubar";

import { cn } from "@/lib/utils";
import { buttonClassName, listItemClassName, popupSurfaceClassName, warnIfUnnamed } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Menubar
 *
 * Built on @base-ui/react/menubar and menu: a role="menubar" (with aria-orientation) whose
 * top-level items open menus, like "File · Edit · View" in a desktop app. The menubar is one
 * Tab stop; ← / → move between its menus, ↓ / Enter / Space open one, and while a menu is open
 * ← / → move to the next menu. Inside a menu: arrow keys, Home/End, typeahead, Escape.
 *
 * Menubars are for app-like interfaces (editors, dashboards). For site navigation, use
 * NavigationMenu or plain links: a menubar's keyboard model surprises people on a website.
 *
 * This file adds 44px triggers and items, a highlight ring, check marks and dots that do not
 * rely on color, and an error in development when the menubar has no name.
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

export interface MenubarProps extends Omit<BaseMenubar.Props, "className"> {
  className?: string;
}

/** The bar. Name it with `aria-label`, for example "Editor". */
function Menubar({ className, ref, ...props }: MenubarProps) {
  const inner = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    warnIfUnnamed(inner.current, "Menubar", 'Add an aria-label, for example aria-label="Editor".');
  }, []);
  return (
    <BaseMenubar
      ref={mergeRefs(inner, ref)}
      data-slot="menubar"
      className={cn("flex max-w-full flex-wrap items-center gap-1 rounded-md border border-akso-border bg-akso-surface p-1 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch", className)}
      {...props}
    />
  );
}

/** One menu in the bar: a MenubarTrigger and a MenubarContent. */
function MenubarMenu(props: BaseMenu.Root.Props) {
  return <BaseMenu.Root {...props} />;
}

/** The top-level item that opens a menu, like "File". */
function MenubarTrigger({ className, ...props }: Omit<BaseMenu.Trigger.Props, "className"> & { className?: string }) {
  return (
    <BaseMenu.Trigger
      data-slot="menubar-trigger"
      className={cn(buttonClassName({ variant: "ghost" }), "data-popup-open:bg-akso-surface-hover data-popup-open:underline data-popup-open:underline-offset-4", className)}
      {...props}
    />
  );
}

export interface MenubarContentProps extends Omit<BaseMenu.Popup.Props, "className"> {
  className?: string;
  side?: BaseMenu.Positioner.Props["side"];
  align?: BaseMenu.Positioner.Props["align"];
}

function MenubarContent({ className, side = "bottom", align = "start", ...props }: MenubarContentProps) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner data-slot="menubar-positioner" className="z-50 outline-none" side={side} align={align} sideOffset={4} collisionPadding={16}>
        <BaseMenu.Popup data-slot="menubar-content" className={cn(popupSurfaceClassName, "min-w-48 p-1", className)} {...props} />
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

function MenubarItem({ className, ...props }: Omit<BaseMenu.Item.Props, "className"> & { className?: string }) {
  return <BaseMenu.Item data-slot="menubar-item" className={cn(listItemClassName, className)} {...props} />;
}

const check = (
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7" />
  </svg>
);

/** An item that can be ticked on or off. Ticked items show a check mark. */
function MenubarCheckboxItem({ className, children, ...props }: Omit<BaseMenu.CheckboxItem.Props, "className"> & { className?: string }) {
  return (
    <BaseMenu.CheckboxItem data-slot="menubar-checkbox-item" className={cn(listItemClassName, "grid grid-cols-[1.25rem_1fr]", className)} {...props}>
      <BaseMenu.CheckboxItemIndicator className="col-start-1 flex text-akso-primary">{check}</BaseMenu.CheckboxItemIndicator>
      <span className="col-start-2">{children}</span>
    </BaseMenu.CheckboxItem>
  );
}

function MenubarRadioGroup(props: BaseMenu.RadioGroup.Props) {
  return <BaseMenu.RadioGroup data-slot="menubar-radio-group" {...props} />;
}

/** One choice of a MenubarRadioGroup. The chosen one shows a dot. */
function MenubarRadioItem({ className, children, ...props }: Omit<BaseMenu.RadioItem.Props, "className"> & { className?: string }) {
  return (
    <BaseMenu.RadioItem data-slot="menubar-radio-item" className={cn(listItemClassName, "grid grid-cols-[1.25rem_1fr]", className)} {...props}>
      <BaseMenu.RadioItemIndicator className="col-start-1 flex items-center justify-center">
        <span className="size-2.5 rounded-full bg-akso-primary" />
      </BaseMenu.RadioItemIndicator>
      <span className="col-start-2">{children}</span>
    </BaseMenu.RadioItem>
  );
}

/** A menu inside the menu. Put a MenubarSubTrigger and a MenubarContent inside. */
function MenubarSub(props: BaseMenu.SubmenuRoot.Props) {
  return <BaseMenu.SubmenuRoot {...props} />;
}

/** The item that opens a submenu. Arrow Right (or Enter) opens it; Arrow Left closes it (Base UI). */
function MenubarSubTrigger({ className, children, ...props }: Omit<BaseMenu.SubmenuTrigger.Props, "className"> & { className?: string }) {
  return (
    <BaseMenu.SubmenuTrigger data-slot="menubar-sub-trigger" className={cn(listItemClassName, "justify-between data-popup-open:bg-akso-surface-hover", className)} {...props}>
      <span>{children}</span>
      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 6l6 6-6 6" />
      </svg>
    </BaseMenu.SubmenuTrigger>
  );
}

function MenubarGroup(props: BaseMenu.Group.Props) {
  return <BaseMenu.Group data-slot="menubar-group" {...props} />;
}

function MenubarGroupLabel({ className, ...props }: Omit<BaseMenu.GroupLabel.Props, "className"> & { className?: string }) {
  return <BaseMenu.GroupLabel data-slot="menubar-group-label" className={cn("px-2 py-1.5 text-sm font-semibold text-akso-muted-foreground", className)} {...props} />;
}

function MenubarSeparator({ className, ...props }: Omit<BaseMenu.Separator.Props, "className"> & { className?: string }) {
  return <BaseMenu.Separator data-slot="menubar-separator" className={cn("my-1 h-px bg-akso-border", className)} {...props} />;
}

export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarGroupLabel,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarSub,
  MenubarSubTrigger,
  MenubarTrigger,
};
