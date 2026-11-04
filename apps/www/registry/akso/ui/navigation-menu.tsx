"use client";

import { NavigationMenu as BaseNavigationMenu } from "@base-ui/react/navigation-menu";

import { cn } from "@/lib/utils";
import { focusRingClassName, popupSurfaceClassName } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Navigation menu
 *
 * Site navigation with sections that open a panel of links. Built on
 * @base-ui/react/navigation-menu: a <nav> with buttons (aria-expanded) that open panels
 * of real links, keyboard support and focus management. Links stay links (no role="menu"),
 * so screen readers treat them as navigation. The current page is marked with
 * aria-current="page" (Base UI `active`) and shown with an underline and bold text.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

/** Wraps the whole navigation. Give it an aria-label ("Main") when the page has more than one <nav>. */
function NavigationMenu({ className, children, ...props }: Omit<BaseNavigationMenu.Root.Props, "className"> & { className?: string }) {
  return (
    <BaseNavigationMenu.Root data-slot="navigation-menu" className={cn("relative min-w-0", className)} {...props}>
      {children}
      <BaseNavigationMenu.Portal>
        <BaseNavigationMenu.Positioner data-slot="navigation-menu-positioner" className="z-50" sideOffset={8} collisionPadding={16} collisionAvoidance={{ side: "none" }}>
          <BaseNavigationMenu.Popup data-slot="navigation-menu-popup" className={cn(popupSurfaceClassName, "w-[var(--popup-width)] max-w-[calc(100vw-2rem)]")}>
            <BaseNavigationMenu.Viewport data-slot="navigation-menu-viewport" className="relative overflow-hidden" />
          </BaseNavigationMenu.Popup>
        </BaseNavigationMenu.Positioner>
      </BaseNavigationMenu.Portal>
    </BaseNavigationMenu.Root>
  );
}

function NavigationMenuList({ className, ...props }: Omit<BaseNavigationMenu.List.Props, "className"> & { className?: string }) {
  return <BaseNavigationMenu.List data-slot="navigation-menu-list" className={cn("flex flex-wrap items-center gap-1", className)} {...props} />;
}

function NavigationMenuItem(props: BaseNavigationMenu.Item.Props) {
  return <BaseNavigationMenu.Item data-slot="navigation-menu-item" {...props} />;
}

const itemClassName = cn(
  "inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-md px-3 py-2 text-base font-medium text-akso-foreground no-underline",
  "hover:bg-akso-surface-hover data-popup-open:bg-akso-surface-hover",
  "motion-safe:transition-[background-color] motion-safe:duration-150",
  focusRingClassName,
);

/** A button that opens a panel of links. Its text names the section ("Products"). */
function NavigationMenuTrigger({ className, children, ...props }: Omit<BaseNavigationMenu.Trigger.Props, "className"> & { className?: string }) {
  return (
    <BaseNavigationMenu.Trigger data-slot="navigation-menu-trigger" className={cn(itemClassName, "group", className)} {...props}>
      {children}
      <BaseNavigationMenu.Icon className="flex">
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 24 24"
          className="size-4 group-data-popup-open:rotate-180 motion-safe:transition-transform motion-safe:duration-150"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </BaseNavigationMenu.Icon>
    </BaseNavigationMenu.Trigger>
  );
}

/** The panel of links shown by a trigger. */
function NavigationMenuContent({ className, ...props }: Omit<BaseNavigationMenu.Content.Props, "className"> & { className?: string }) {
  return <BaseNavigationMenu.Content data-slot="navigation-menu-content" className={cn("w-[min(28rem,calc(100vw-2rem))] p-2", className)} {...props} />;
}

/**
 * A link. Set `active` on the link to the current page: it gets aria-current="page" and is
 * shown with an underline and bold text.
 */
function NavigationMenuLink({ className, ...props }: Omit<BaseNavigationMenu.Link.Props, "className"> & { className?: string }) {
  return (
    <BaseNavigationMenu.Link
      data-slot="navigation-menu-link"
      className={cn(itemClassName, "flex w-full data-active:font-semibold data-active:underline data-active:underline-offset-4", className)}
      {...props}
    />
  );
}

export { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger };
