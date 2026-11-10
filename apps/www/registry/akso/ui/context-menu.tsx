"use client";

import { ContextMenu as BaseContextMenu } from "@base-ui/react/context-menu";

import { cn } from "@/lib/utils";
import { listItemClassName, popupSurfaceClassName } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Context menu
 *
 * Built on @base-ui/react/context-menu: the same menu as Menu (role="menu", arrow keys,
 * Home/End, typeahead, Escape, focus return), opened with a right-click, a long press on
 * touch screens, or the keyboard (Shift+F10 or the Menu key) on a focused element inside
 * the trigger area.
 *
 * A context menu must never be the only way to do something: many people never open one
 * (keyboard and screen reader users, voice control, touch). Always offer the same actions
 * with visible controls too, for example a Menu with a "More actions" button.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

function ContextMenu(props: BaseContextMenu.Root.Props) {
  return <BaseContextMenu.Root {...props} />;
}

/**
 * The area that opens the menu with a right-click or a long press. Keep focusable content
 * inside it (a link or a button): Shift+F10 or the Menu key on that content opens the menu.
 */
function ContextMenuTrigger({ className, ...props }: Omit<BaseContextMenu.Trigger.Props, "className"> & { className?: string }) {
  return <BaseContextMenu.Trigger data-slot="context-menu-trigger" className={cn("rounded-md", className)} {...props} />;
}

function ContextMenuContent({ className, ...props }: Omit<BaseContextMenu.Popup.Props, "className"> & { className?: string }) {
  return (
    <BaseContextMenu.Portal>
      <BaseContextMenu.Positioner data-slot="context-menu-positioner" className="z-50 outline-none" collisionPadding={16}>
        <BaseContextMenu.Popup data-slot="context-menu-content" className={cn(popupSurfaceClassName, "min-w-48 p-1", className)} {...props} />
      </BaseContextMenu.Positioner>
    </BaseContextMenu.Portal>
  );
}

function ContextMenuItem({ className, ...props }: Omit<BaseContextMenu.Item.Props, "className"> & { className?: string }) {
  return <BaseContextMenu.Item data-slot="context-menu-item" className={cn(listItemClassName, className)} {...props} />;
}

const check = (
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7" />
  </svg>
);

/** An item that can be ticked on or off. Ticked items show a check mark. */
function ContextMenuCheckboxItem({ className, children, ...props }: Omit<BaseContextMenu.CheckboxItem.Props, "className"> & { className?: string }) {
  return (
    <BaseContextMenu.CheckboxItem data-slot="context-menu-checkbox-item" className={cn(listItemClassName, "grid grid-cols-[1.25rem_1fr]", className)} {...props}>
      <BaseContextMenu.CheckboxItemIndicator className="col-start-1 flex text-akso-primary">{check}</BaseContextMenu.CheckboxItemIndicator>
      <span className="col-start-2">{children}</span>
    </BaseContextMenu.CheckboxItem>
  );
}

function ContextMenuRadioGroup(props: BaseContextMenu.RadioGroup.Props) {
  return <BaseContextMenu.RadioGroup data-slot="context-menu-radio-group" {...props} />;
}

/** One choice of a ContextMenuRadioGroup. The chosen one shows a dot. */
function ContextMenuRadioItem({ className, children, ...props }: Omit<BaseContextMenu.RadioItem.Props, "className"> & { className?: string }) {
  return (
    <BaseContextMenu.RadioItem data-slot="context-menu-radio-item" className={cn(listItemClassName, "grid grid-cols-[1.25rem_1fr]", className)} {...props}>
      <BaseContextMenu.RadioItemIndicator className="col-start-1 flex items-center justify-center">
        <span className="size-2.5 rounded-full bg-akso-primary" />
      </BaseContextMenu.RadioItemIndicator>
      <span className="col-start-2">{children}</span>
    </BaseContextMenu.RadioItem>
  );
}

/** A menu inside the menu. Put a ContextMenuSubTrigger and a MenuContent inside. */
function ContextMenuSub(props: BaseContextMenu.SubmenuRoot.Props) {
  return <BaseContextMenu.SubmenuRoot {...props} />;
}

/** The item that opens a submenu. Arrow Right (or Enter) opens it; Arrow Left closes it (Base UI). */
function ContextMenuSubTrigger({ className, children, ...props }: Omit<BaseContextMenu.SubmenuTrigger.Props, "className"> & { className?: string }) {
  return (
    <BaseContextMenu.SubmenuTrigger data-slot="context-menu-sub-trigger" className={cn(listItemClassName, "justify-between data-popup-open:bg-akso-surface-hover", className)} {...props}>
      <span>{children}</span>
      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 6l6 6-6 6" />
      </svg>
    </BaseContextMenu.SubmenuTrigger>
  );
}

function ContextMenuGroup(props: BaseContextMenu.Group.Props) {
  return <BaseContextMenu.Group data-slot="context-menu-group" {...props} />;
}

function ContextMenuGroupLabel({ className, ...props }: Omit<BaseContextMenu.GroupLabel.Props, "className"> & { className?: string }) {
  return <BaseContextMenu.GroupLabel data-slot="context-menu-group-label" className={cn("px-2 py-1.5 text-sm font-semibold text-akso-muted-foreground", className)} {...props} />;
}

function ContextMenuSeparator({ className, ...props }: Omit<BaseContextMenu.Separator.Props, "className"> & { className?: string }) {
  return <BaseContextMenu.Separator data-slot="context-menu-separator" className={cn("my-1 h-px bg-akso-border", className)} {...props} />;
}

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuGroupLabel,
  ContextMenuItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
};
