"use client";

import { Tabs as BaseTabs } from "@base-ui/react/tabs";

import { cn } from "@/lib/utils";
import { focusRingClassName } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Tabs
 *
 * Built on @base-ui/react/tabs: role="tablist"/"tab"/"tabpanel", aria-selected,
 * aria-controls, and arrow-key navigation with one Tab stop for the list. Tabs are activated
 * with Enter or Space (manual activation, the Base UI default), so moving with the arrows does
 * not load content by surprise. The selected tab is shown with a thick underline and bold text,
 * not only a color.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

function Tabs({ className, ...props }: Omit<BaseTabs.Root.Props, "className"> & { className?: string }) {
  return <BaseTabs.Root data-slot="tabs" className={cn("flex flex-col gap-4 data-[orientation=vertical]:flex-row", className)} {...props} />;
}

/** The row of tabs. Give it an `aria-label` when there is no heading right above it. */
function TabsList({ className, ...props }: Omit<BaseTabs.List.Props, "className"> & { className?: string }) {
  return (
    <BaseTabs.List
      data-slot="tabs-list"
      className={cn(
        "flex flex-wrap gap-1 border-b border-akso-border",
        "data-[orientation=vertical]:flex-col data-[orientation=vertical]:flex-nowrap data-[orientation=vertical]:border-r data-[orientation=vertical]:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

/** One tab. Its text names the panel it shows. */
function TabsTrigger({ className, ...props }: Omit<BaseTabs.Tab.Props, "className"> & { className?: string }) {
  return (
    <BaseTabs.Tab
      data-slot="tabs-trigger"
      className={cn(
        "-mb-px inline-flex min-h-11 cursor-pointer items-center border-b-4 border-transparent px-4 py-2 text-base text-akso-muted-foreground",
        "hover:not-data-disabled:text-akso-foreground",
        "data-active:border-akso-primary data-active:font-semibold data-active:text-akso-foreground",
        "data-disabled:cursor-not-allowed data-disabled:opacity-60",
        "motion-safe:transition-[color,border-color] motion-safe:duration-150",
        focusRingClassName,
        className,
      )}
      {...props}
    />
  );
}

/** The content of one tab. It can receive focus so keyboard users can reach content without links. */
function TabsPanel({ className, ...props }: Omit<BaseTabs.Panel.Props, "className"> & { className?: string }) {
  return <BaseTabs.Panel data-slot="tabs-panel" className={cn("min-w-0 rounded-sm text-akso-foreground", focusRingClassName, className)} {...props} />;
}

export { Tabs, TabsList, TabsPanel, TabsTrigger };
