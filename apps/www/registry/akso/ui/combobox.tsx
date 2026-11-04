"use client";

import * as React from "react";
import { Combobox as BaseCombobox } from "@base-ui/react/combobox";

import { cn } from "@/lib/utils";
import { useAksoField } from "@/registry/akso/lib/akso-form";
import { focusRingClassName, listItemClassName, popupSurfaceClassName } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Combobox
 *
 * A Select whose options can be filtered by typing. Built on @base-ui/react/combobox:
 * role="combobox" on the input with aria-expanded and aria-activedescendant, a listbox of
 * options, arrow keys, Enter, Escape and form integration.
 *
 * This file adds:
 * - a visible <label> (required) and "(required)" text inside a required Field;
 * - a polite announcement of how many options match ("5 results"), through Base UI's
 *   Combobox.Status, so screen reader users know whether typing worked;
 * - a "no results" message (Combobox.Empty, also announced);
 * - a highlighted option with a ≥3:1 ring, and a check mark on the chosen one.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface ComboboxItem {
  value: string;
  label: string;
}

export interface ComboboxProps extends Omit<BaseCombobox.Root.Props<ComboboxItem, false>, "items" | "children" | "multiple"> {
  /** Visible label. Required. */
  label: React.ReactNode;
  items: ComboboxItem[];
  placeholder?: string;
  /** Shown and announced when nothing matches. Default: "No results." */
  emptyText?: string;
  /** Announced while the list is open. Default: "1 result" / "5 results". */
  resultsText?: (count: number) => string;
  /** Accessible name of the button that opens the list. Default: "Show options". */
  openLabel?: string;
  /** Accessible name of the clear button. Default: "Clear". */
  clearLabel?: string;
  className?: string;
}

const defaultResultsText = (count: number) => (count === 1 ? "1 result" : `${count} results`);

function Combobox({
  label,
  items,
  placeholder,
  emptyText = "No results.",
  resultsText = defaultResultsText,
  openLabel = "Show options",
  clearLabel = "Clear",
  className,
  required,
  ...props
}: ComboboxProps) {
  const id = React.useId();
  const field = useAksoField();
  const isRequired = required ?? field?.required;

  return (
    <BaseCombobox.Root items={items} required={isRequired} {...props}>
      <div data-slot="combobox" className={cn("flex min-w-0 flex-col gap-1.5", className)}>
        <label htmlFor={id} data-slot="combobox-label" className="font-medium text-akso-foreground">
          {label}
          {field?.required ? (
            <span aria-hidden="true" className="font-normal text-akso-muted-foreground">
              {" "}
              {field.requiredText}
            </span>
          ) : null}
        </label>
        <BaseCombobox.InputGroup
          data-slot="combobox-input-group"
          className={cn(
            "relative flex min-h-11 w-full items-center rounded-md border border-akso-border bg-akso-surface",
            "has-[[data-invalid]]:border-2 has-[[data-invalid]]:border-akso-danger",
            "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-solid focus-within:outline-akso-focus-ring",
          )}
        >
          <BaseCombobox.Input
            id={id}
            data-slot="combobox-input"
            placeholder={placeholder}
            className="h-full min-h-11 w-full min-w-0 rounded-md bg-transparent py-2 pr-24 pl-3 text-base text-akso-foreground outline-none placeholder:text-akso-muted-foreground"
          />
          <div className="absolute right-0 flex h-full items-center">
            <BaseCombobox.Clear
              data-slot="combobox-clear"
              aria-label={clearLabel}
              className={cn("flex size-11 cursor-pointer items-center justify-center rounded-md text-akso-muted-foreground hover:text-akso-foreground", focusRingClassName)}
            >
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </BaseCombobox.Clear>
            <BaseCombobox.Trigger
              data-slot="combobox-trigger"
              aria-label={openLabel}
              className={cn("flex size-11 cursor-pointer items-center justify-center rounded-md text-akso-muted-foreground hover:text-akso-foreground", focusRingClassName)}
            >
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 10l5 5 5-5" />
              </svg>
            </BaseCombobox.Trigger>
          </div>
        </BaseCombobox.InputGroup>
        <ResultsStatus total={items.length} resultsText={resultsText} />
      </div>
      <BaseCombobox.Portal>
        <BaseCombobox.Positioner data-slot="combobox-positioner" className="z-50 outline-none" sideOffset={4} collisionPadding={16}>
          <BaseCombobox.Popup data-slot="combobox-content" className={cn(popupSurfaceClassName, "w-[var(--anchor-width)] max-w-[var(--available-width)]")}>
            <BaseCombobox.Empty data-slot="combobox-empty" className="px-3 text-base text-akso-muted-foreground empty:p-0 [&:not(:empty)]:py-3">
              {emptyText}
            </BaseCombobox.Empty>
            <BaseCombobox.List data-slot="combobox-list" className="max-h-[min(22rem,var(--available-height))] overflow-y-auto p-1 data-empty:p-0">
              {(item: ComboboxItem) => (
                <BaseCombobox.Item key={item.value} value={item} data-slot="combobox-item" className={cn(listItemClassName, "grid grid-cols-[1.25rem_1fr] data-selected:font-semibold")}>
                  <BaseCombobox.ItemIndicator className="col-start-1 flex text-akso-primary">
                    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.5l4.5 4.5L19 7" />
                    </svg>
                  </BaseCombobox.ItemIndicator>
                  <span className="col-start-2 min-w-0 break-words">{item.label}</span>
                </BaseCombobox.Item>
              )}
            </BaseCombobox.List>
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Portal>
    </BaseCombobox.Root>
  );
}

/**
 * Always mounted (Base UI requirement for Status), visually hidden. Announces how many options
 * match once typing has filtered the list, so people get feedback without moving focus.
 * When nothing matches, Combobox.Empty announces the "no results" text instead.
 */
function ResultsStatus({ total, resultsText }: { total: number; resultsText: (count: number) => string }) {
  const filtered = BaseCombobox.useFilteredItems<ComboboxItem>();
  const filteredByTyping = filtered.length > 0 && filtered.length < total;
  return (
    <BaseCombobox.Status data-slot="combobox-status" className="sr-only">
      {filteredByTyping ? resultsText(filtered.length) : ""}
    </BaseCombobox.Status>
  );
}

export { Combobox };
