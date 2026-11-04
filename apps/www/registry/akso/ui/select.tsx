"use client";

import { Select as BaseSelect } from "@base-ui/react/select";

import { cn } from "@/lib/utils";
import { useAksoField } from "@/registry/akso/lib/akso-form";
import { focusRingClassName } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Select
 *
 * Built on @base-ui/react/select. Base UI provides the listbox semantics, the label
 * association, keyboard navigation (arrows, Home/End, typeahead, Enter, Escape), focus
 * return to the trigger and form integration. This file adds styles where:
 * - the highlighted option has an inset ring with ≥3:1 contrast, not only a background;
 * - the chosen option has a check mark and bold text, not only a color.
 *
 * For long lists that people need to search, use a Combobox instead (Base UI guideline).
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

/** Holds the select state. Accepts `items`, `value`, `defaultValue`, `onValueChange`, `name`, `required`… */
function Select<Value, Multiple extends boolean | undefined = false>({ required, ...props }: BaseSelect.Root.Props<Value, Multiple>) {
  const field = useAksoField();
  return <BaseSelect.Root required={required ?? field?.required} {...props} />;
}

/** The visible label. Required: every select needs one. Inside a required Field it shows "(required)". */
function SelectLabel({ className, children, ...props }: Omit<BaseSelect.Label.Props, "className"> & { className?: string }) {
  const field = useAksoField();
  return (
    <BaseSelect.Label data-slot="select-label" className={cn("font-medium text-akso-foreground", className)} {...props}>
      {children}
      {field?.required ? (
        <span aria-hidden="true" className="font-normal text-akso-muted-foreground">
          {" "}
          {field.requiredText}
        </span>
      ) : null}
    </BaseSelect.Label>
  );
}

export interface SelectTriggerProps extends Omit<BaseSelect.Trigger.Props, "className" | "children"> {
  className?: string;
  /** Text shown before anything is chosen, for example "Choose a country". */
  placeholder?: string;
}

/** The button that shows the chosen option and opens the list. */
function SelectTrigger({ className, placeholder, ...props }: SelectTriggerProps) {
  return (
    <BaseSelect.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex min-h-11 w-full min-w-0 cursor-pointer items-center justify-between gap-3 rounded-md border border-akso-border bg-akso-surface px-3 py-2 text-left text-base text-akso-foreground",
        "hover:not-data-disabled:bg-akso-surface-hover",
        "data-invalid:border-2 data-invalid:border-akso-danger",
        "data-disabled:cursor-not-allowed data-disabled:opacity-60",
        "motion-safe:transition-[background-color,border-color] motion-safe:duration-150",
        focusRingClassName,
        className,
      )}
      {...props}
    >
      <BaseSelect.Value data-slot="select-value" className="min-w-0 truncate data-placeholder:text-akso-muted-foreground" placeholder={placeholder} />
      <BaseSelect.Icon data-slot="select-icon" className="flex shrink-0 text-akso-muted-foreground">
        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 10l5 5 5-5" />
        </svg>
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  );
}

export interface SelectContentProps extends Omit<BaseSelect.Popup.Props, "className"> {
  className?: string;
  /**
   * Overlap the trigger so the chosen option sits on top of it (Base UI default).
   * Set to `false` to always open the list below the trigger.
   */
  alignItemWithTrigger?: boolean;
}

/** The list of options. */
function SelectContent({ className, children, alignItemWithTrigger = true, ...props }: SelectContentProps) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner data-slot="select-positioner" className="z-50 outline-none" sideOffset={4} alignItemWithTrigger={alignItemWithTrigger}>
        <BaseSelect.Popup
          data-slot="select-content"
          className={cn(
            "min-w-[var(--anchor-width)] max-w-[calc(100vw-2rem)] origin-[var(--transform-origin)] rounded-md border border-akso-border bg-akso-surface text-akso-foreground shadow-lg outline-none",
            "motion-safe:transition-[opacity,scale] motion-safe:duration-100 motion-safe:ease-out",
            "data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0",
            "data-[side=none]:data-starting-style:scale-100 data-[side=none]:data-starting-style:opacity-100",
            className,
          )}
          {...props}
        >
          <BaseSelect.List data-slot="select-list" className="max-h-[min(var(--available-height),24rem)] overflow-y-auto p-1">
            {children}
          </BaseSelect.List>
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}

/** One option. The text inside is what the trigger shows and what typeahead matches. */
function SelectItem({ className, children, ...props }: Omit<BaseSelect.Item.Props, "className"> & { className?: string }) {
  return (
    <BaseSelect.Item
      data-slot="select-item"
      className={cn(
        "grid min-h-11 cursor-pointer grid-cols-[1.25rem_1fr] items-center gap-2 rounded-sm px-2 py-2 text-base outline-none select-none",
        // Highlight: background plus an inset ring with ≥3:1 contrast (the background alone is too subtle).
        "data-highlighted:bg-akso-surface-hover data-highlighted:outline-2 data-highlighted:-outline-offset-2 data-highlighted:outline-solid data-highlighted:outline-akso-focus-ring",
        "data-selected:font-semibold",
        "data-disabled:cursor-not-allowed data-disabled:opacity-60",
        className,
      )}
      {...props}
    >
      <BaseSelect.ItemIndicator data-slot="select-item-indicator" className="col-start-1 flex text-akso-primary">
        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7" />
        </svg>
      </BaseSelect.ItemIndicator>
      <BaseSelect.ItemText data-slot="select-item-text" className="col-start-2 min-w-0 break-words">
        {children}
      </BaseSelect.ItemText>
    </BaseSelect.Item>
  );
}

/** Groups related options under a visible heading. */
function SelectGroup({ className, ...props }: Omit<BaseSelect.Group.Props, "className"> & { className?: string }) {
  return <BaseSelect.Group data-slot="select-group" className={cn("py-1", className)} {...props} />;
}

/** The heading of a SelectGroup. */
function SelectGroupLabel({ className, ...props }: Omit<BaseSelect.GroupLabel.Props, "className"> & { className?: string }) {
  return <BaseSelect.GroupLabel data-slot="select-group-label" className={cn("px-2 py-1.5 text-sm font-semibold text-akso-muted-foreground", className)} {...props} />;
}

/** A line between groups of options. */
function SelectSeparator({ className, ...props }: Omit<BaseSelect.Separator.Props, "className"> & { className?: string }) {
  return <BaseSelect.Separator data-slot="select-separator" className={cn("my-1 h-px bg-akso-border", className)} {...props} />;
}

export { Select, SelectContent, SelectGroup, SelectGroupLabel, SelectItem, SelectLabel, SelectSeparator, SelectTrigger };
