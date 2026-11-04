"use client";

import { Accordion as BaseAccordion } from "@base-ui/react/accordion";

import { cn } from "@/lib/utils";
import { focusRingClassName } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Accordion
 *
 * Built on @base-ui/react/accordion: each trigger is a button inside a heading, with
 * aria-expanded and aria-controls. Closed panels use hidden="until-found" by default, so the
 * browser's find-in-page (Ctrl/Cmd+F) can search them and open the matching one.
 * Open/closed is shown by the arrow direction, not only by color.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

function Accordion({ className, hiddenUntilFound = true, ...props }: Omit<BaseAccordion.Root.Props, "className"> & { className?: string }) {
  return (
    <BaseAccordion.Root
      data-slot="accordion"
      hiddenUntilFound={hiddenUntilFound}
      className={cn("flex w-full flex-col divide-y divide-akso-border border-y border-akso-border", className)}
      {...props}
    />
  );
}

function AccordionItem({ className, ...props }: Omit<BaseAccordion.Item.Props, "className"> & { className?: string }) {
  return <BaseAccordion.Item data-slot="accordion-item" className={cn("min-w-0", className)} {...props} />;
}

export interface AccordionTriggerProps extends Omit<BaseAccordion.Trigger.Props, "className"> {
  className?: string;
  /** Heading level of the item, to fit the page outline. Default: 3. */
  level?: 2 | 3 | 4 | 5 | 6;
}

/** The heading and button that open or close one item. */
function AccordionTrigger({ className, children, level = 3, ...props }: AccordionTriggerProps) {
  const Heading = `h${level}` as const;
  return (
    <BaseAccordion.Header data-slot="accordion-header" render={<Heading />} className="m-0">
      <BaseAccordion.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group flex min-h-11 w-full cursor-pointer items-center justify-between gap-4 rounded-sm py-3 text-left text-base font-semibold text-akso-foreground",
          "hover:not-data-disabled:underline data-disabled:cursor-not-allowed data-disabled:opacity-60",
          focusRingClassName,
          className,
        )}
        {...props}
      >
        <span className="min-w-0 break-words">{children}</span>
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 24 24"
          className="size-5 shrink-0 text-akso-muted-foreground group-data-panel-open:rotate-180 motion-safe:transition-transform motion-safe:duration-150"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  );
}

function AccordionPanel({ className, children, ...props }: Omit<BaseAccordion.Panel.Props, "className"> & { className?: string }) {
  return (
    <BaseAccordion.Panel
      data-slot="accordion-panel"
      className={cn(
        "h-[var(--accordion-panel-height)] overflow-hidden text-base text-akso-foreground",
        "motion-safe:transition-[height] motion-safe:duration-200 motion-safe:ease-out",
        "data-starting-style:h-0 data-ending-style:h-0",
      )}
      {...props}
    >
      <div className={cn("pb-4", className)}>{children}</div>
    </BaseAccordion.Panel>
  );
}

export { Accordion, AccordionItem, AccordionPanel, AccordionTrigger };
