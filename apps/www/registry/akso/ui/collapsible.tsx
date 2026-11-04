"use client";

import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";

import { cn } from "@/lib/utils";
import { buttonClassName } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Collapsible
 *
 * Built on @base-ui/react/collapsible: a button with aria-expanded and aria-controls that shows
 * or hides one panel. The arrow direction shows the state, not only color. Closed panels use
 * hidden="until-found" by default so find-in-page can reveal them.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

function Collapsible({ className, ...props }: Omit<BaseCollapsible.Root.Props, "className"> & { className?: string }) {
  return <BaseCollapsible.Root data-slot="collapsible" className={cn("flex min-w-0 flex-col gap-2", className)} {...props} />;
}

/** The button that shows or hides the panel. Its text says what is inside ("Show order details"). */
function CollapsibleTrigger({ className, children, ...props }: Omit<BaseCollapsible.Trigger.Props, "className"> & { className?: string }) {
  return (
    <BaseCollapsible.Trigger data-slot="collapsible-trigger" className={buttonClassName({ variant: "ghost", className: cn("group self-start", className) })} {...props}>
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 24 24"
        className="size-5 shrink-0 group-data-panel-open:rotate-90 motion-safe:transition-transform motion-safe:duration-150"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 6l6 6-6 6" />
      </svg>
      {children}
    </BaseCollapsible.Trigger>
  );
}

function CollapsiblePanel({ className, children, hiddenUntilFound = true, ...props }: Omit<BaseCollapsible.Panel.Props, "className"> & { className?: string }) {
  return (
    <BaseCollapsible.Panel
      data-slot="collapsible-panel"
      hiddenUntilFound={hiddenUntilFound}
      className={cn(
        "h-[var(--collapsible-panel-height)] overflow-hidden",
        "motion-safe:transition-[height] motion-safe:duration-200 motion-safe:ease-out",
        "data-starting-style:h-0 data-ending-style:h-0",
      )}
      {...props}
    >
      <div className={cn("text-base text-akso-foreground", className)}>{children}</div>
    </BaseCollapsible.Panel>
  );
}

export { Collapsible, CollapsiblePanel, CollapsibleTrigger };
