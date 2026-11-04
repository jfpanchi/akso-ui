"use client";

import * as React from "react";
import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";

import { cn } from "@/lib/utils";
import { useAksoField } from "@/registry/akso/lib/akso-form";
import { useAksoMessages } from "@/registry/akso/lib/akso-locale";
import { focusRingClassName, listItemClassName, popupSurfaceClassName } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Autocomplete
 *
 * A text field with suggestions. Unlike Combobox, people can type any text; suggestions are
 * optional. Built on @base-ui/react/autocomplete: role="combobox" on the input with
 * aria-expanded and aria-activedescendant, a listbox of suggestions, arrow keys, Enter and
 * Escape.
 *
 * This file adds a visible <label> (required), "(required)" inside a required Field, a polite
 * announcement of how many suggestions match (Base UI's Status), a "no suggestions" message,
 * and a ≥3:1 highlight ring.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface AutocompleteProps extends Omit<BaseAutocomplete.Root.Props<string>, "items" | "children"> {
  /** Visible label. Required. */
  label: React.ReactNode;
  /** Suggestions. */
  items: string[];
  placeholder?: string;
  /** Shown and announced when no suggestion matches. Default: "No suggestions." */
  emptyText?: string;
  /** Announced while typing. Default: "3 suggestions". */
  suggestionsText?: (count: number) => string;
  /** Accessible name of the clear button. Default: "Clear". */
  clearLabel?: string;
  /** Use `type="search"` and the like for the input. */
  type?: React.HTMLInputTypeAttribute;
  autoComplete?: string;
  className?: string;
}

function Autocomplete({
  label,
  items,
  placeholder,
  emptyText: emptyTextProp,
  suggestionsText: suggestionsTextProp,
  clearLabel: clearLabelProp,
  type = "text",
  autoComplete = "off",
  className,
  required,
  ...props
}: AutocompleteProps) {
  const id = React.useId();
  const field = useAksoField();
  const messages = useAksoMessages();
  const emptyText = emptyTextProp ?? messages.noSuggestions;
  const suggestionsText = suggestionsTextProp ?? messages.suggestions;
  const clearLabel = clearLabelProp ?? messages.clear;

  return (
    <BaseAutocomplete.Root items={items} {...props}>
      <div data-slot="autocomplete" className={cn("flex min-w-0 flex-col gap-1.5", className)}>
        <label htmlFor={id} data-slot="autocomplete-label" className="font-medium text-akso-foreground">
          {label}
          {field?.required ? (
            <span aria-hidden="true" className="font-normal text-akso-muted-foreground">
              {" "}
              {field.requiredText}
            </span>
          ) : null}
        </label>
        <BaseAutocomplete.InputGroup
          data-slot="autocomplete-input-group"
          className={cn(
            "relative flex min-h-11 w-full items-center rounded-md border border-akso-border bg-akso-surface",
            "has-[[data-invalid]]:border-2 has-[[data-invalid]]:border-akso-danger",
            "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-solid focus-within:outline-akso-focus-ring",
          )}
        >
          <BaseAutocomplete.Input
            id={id}
            data-slot="autocomplete-input"
            type={type}
            autoComplete={autoComplete}
            placeholder={placeholder}
            required={required ?? field?.required}
            className="h-full min-h-11 w-full min-w-0 rounded-md bg-transparent py-2 pr-12 pl-3 text-base text-akso-foreground outline-none placeholder:text-akso-muted-foreground"
          />
          <BaseAutocomplete.Clear
            data-slot="autocomplete-clear"
            aria-label={clearLabel}
            className={cn("absolute right-0 flex size-11 cursor-pointer items-center justify-center rounded-md text-akso-muted-foreground hover:text-akso-foreground", focusRingClassName)}
          >
            <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </BaseAutocomplete.Clear>
        </BaseAutocomplete.InputGroup>
        <SuggestionsStatus total={items.length} suggestionsText={suggestionsText} />
      </div>
      <BaseAutocomplete.Portal>
        <BaseAutocomplete.Positioner data-slot="autocomplete-positioner" className="z-50 outline-none" sideOffset={4} collisionPadding={16}>
          <BaseAutocomplete.Popup data-slot="autocomplete-content" className={cn(popupSurfaceClassName, "w-[var(--anchor-width)] max-w-[var(--available-width)]")}>
            <BaseAutocomplete.Empty data-slot="autocomplete-empty" className="px-3 text-base text-akso-muted-foreground empty:p-0 [&:not(:empty)]:py-3">
              {emptyText}
            </BaseAutocomplete.Empty>
            <BaseAutocomplete.List data-slot="autocomplete-list" className="max-h-[min(22rem,var(--available-height))] overflow-y-auto p-1 data-empty:p-0">
              {(item: string) => (
                <BaseAutocomplete.Item key={item} value={item} data-slot="autocomplete-item" className={listItemClassName}>
                  <span className="min-w-0 break-words">{item}</span>
                </BaseAutocomplete.Item>
              )}
            </BaseAutocomplete.List>
          </BaseAutocomplete.Popup>
        </BaseAutocomplete.Positioner>
      </BaseAutocomplete.Portal>
    </BaseAutocomplete.Root>
  );
}

/** Always mounted (Base UI requirement for Status), visually hidden: announces how many suggestions match once typing filters them. */
function SuggestionsStatus({ total, suggestionsText }: { total: number; suggestionsText: (count: number) => string }) {
  const filtered = BaseAutocomplete.useFilteredItems<string>();
  const filteredByTyping = filtered.length > 0 && filtered.length < total;
  return (
    <BaseAutocomplete.Status data-slot="autocomplete-status" className="sr-only">
      {filteredByTyping ? suggestionsText(filtered.length) : ""}
    </BaseAutocomplete.Status>
  );
}

export { Autocomplete };
