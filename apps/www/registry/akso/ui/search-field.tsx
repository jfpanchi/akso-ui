"use client";

import * as React from "react";
import { Input as BaseInput } from "@base-ui/react/input";

import { cn } from "@/lib/utils";
import { announce, useAnnouncerRegion } from "@/registry/akso/lib/akso-form";
import { useAksoMessages } from "@/registry/akso/lib/akso-locale";
import { buttonClassName, inputClassName } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Search field
 *
 * A search box for a page or a list. Built on @base-ui/react/input.
 * - A search landmark (role="search" on a <form>), so screen reader users can jump to it.
 * - A visible label ("Search", or your `label`) tied to an <input type="search">, with
 *   enterKeyHint="search" for phone keyboards.
 * - A "Clear search" button (44px) when there is text. It empties the field and puts focus back
 *   in it, so the next search starts right away. Escape also clears (the browser default for
 *   type="search", kept).
 * - `resultCount`: when the number of results changes after a search, it is announced
 *   ("3 results"), because the list updating is silent. It waits until typing pauses.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface SearchFieldProps extends Omit<BaseInput.Props, "className" | "type" | "value" | "defaultValue" | "onValueChange"> {
  className?: string;
  /** Visible label. Default: "Search" (or the AksoLocaleProvider text). */
  label?: string;
  /** Hide the label visually (it stays the field's name). Default: false. */
  hideLabel?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called on Enter (submit). */
  onSearch?: (value: string) => void;
  /** Number of results for the current text; announced after it changes. */
  resultCount?: number;
}

/** A labelled search box with a Clear button, inside a search landmark. */
function SearchField({
  className,
  label,
  hideLabel = false,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSearch,
  resultCount,
  id: idProp,
  ...props
}: SearchFieldProps) {
  const messages = useAksoMessages();
  const autoId = React.useId();
  const id = idProp ?? autoId;
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [inner, setInner] = React.useState(defaultValue);
  const value = valueProp ?? inner;
  useAnnouncerRegion();

  const setValue = (next: string) => {
    if (valueProp === undefined) setInner(next);
    onValueChange?.(next);
  };

  // Announce the result count after it changes (not on first render), once typing pauses.
  const first = React.useRef(true);
  React.useEffect(() => {
    if (resultCount === undefined) return;
    if (first.current) {
      first.current = false;
      return;
    }
    const timer = setTimeout(() => announce(messages.searchResults(resultCount)), 500);
    return () => clearTimeout(timer);
  }, [resultCount, messages]);

  return (
    <form
      role="search"
      data-slot="search-field"
      className={cn("flex w-full flex-col gap-1", className)}
      onSubmit={(event) => {
        event.preventDefault();
        onSearch?.(value);
      }}
    >
      <label htmlFor={id} className={cn("font-medium text-akso-foreground", hideLabel && "sr-only")}>
        {label ?? messages.search}
      </label>
      <div className="flex min-w-0 items-stretch gap-2">
        <BaseInput
          ref={inputRef}
          id={id}
          type="search"
          data-slot="search-field-input"
          enterKeyHint="search"
          autoComplete="off"
          value={value}
          onValueChange={(next) => setValue(next)}
          className={inputClassName("flex-1 [&::-webkit-search-cancel-button]:hidden")}
          {...props}
        />
        {value ? (
          <button
            type="button"
            data-slot="search-field-clear"
            onClick={() => {
              setValue("");
              inputRef.current?.focus();
            }}
            className={buttonClassName({ variant: "secondary", className: "min-h-11 shrink-0 px-3" })}
          >
            {messages.clearSearch}
          </button>
        ) : null}
      </div>
    </form>
  );
}

export { SearchField };
