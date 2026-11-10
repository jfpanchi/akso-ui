"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { announce, useAnnouncerRegion } from "@/registry/akso/lib/akso-form";
import { useAksoMessages } from "@/registry/akso/lib/akso-locale";
import { focusRingClassName } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Table
 *
 * Plain HTML table semantics (Base UI has no table), so screen readers can read each cell
 * with its column and row headers:
 * - <caption> names the table (TableCaption). Always add one; it can be visually hidden.
 * - <th scope="col"> for column headers and <th scope="row"> for row headers (TableHead).
 * - Sortable columns: a button inside the <th>, aria-sort on the sorted column only, an arrow
 *   that shows the direction (not color), and a polite announcement after sorting, because
 *   screen readers announce aria-sort changes unreliably.
 * - Wide tables scroll inside their container, not the page. When the table does not fit,
 *   the container becomes a named, focusable region, so keyboard users can scroll it.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

const TableContext = React.createContext<{ captionId: string } | null>(null);

/** A data table. Put a TableCaption first. */
function Table({ className, children, ...props }: React.ComponentProps<"table">) {
  const captionId = React.useId();
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const [overflows, setOverflows] = React.useState(false);

  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const check = () => setOverflows(el.scrollWidth > el.clientWidth + 1);
    check();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(check);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    return () => observer.disconnect();
  }, []);

  return (
    <TableContext.Provider value={{ captionId }}>
      <div
        ref={scrollerRef}
        data-slot="table-container"
        // Only a stop for Tab when there is something to scroll.
        {...(overflows ? { role: "region", "aria-labelledby": captionId, tabIndex: 0 } : {})}
        className={cn("relative w-full max-w-full overflow-x-auto rounded-md border border-akso-border", focusRingClassName)}
      >
        <table data-slot="table" className={cn("w-full border-collapse text-left text-base text-akso-foreground", className)} {...props}>
          {children}
        </table>
      </div>
    </TableContext.Provider>
  );
}

/** The name of the table, read when screen reader users reach it. Use `className="sr-only"` to hide it visually. */
function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  const context = React.useContext(TableContext);
  return (
    <caption
      id={context?.captionId}
      data-slot="table-caption"
      className={cn("px-4 py-3 text-left text-lg font-semibold text-akso-foreground", className)}
      {...props}
    />
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={cn("bg-akso-surface-hover", className)} {...props} />;
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={className} {...props} />;
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return <tfoot data-slot="table-footer" className={cn("border-t-2 border-akso-border font-semibold", className)} {...props} />;
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return <tr data-slot="table-row" className={cn("border-t border-akso-border first:border-t-0", className)} {...props} />;
}

export type TableSortDirection = "ascending" | "descending" | "none";

export interface TableHeadProps extends Omit<React.ComponentProps<"th">, "scope"> {
  /** "col" for column headers (default), "row" for the first cell of a row. */
  scope?: "col" | "row";
  /** Makes the column sortable. Called when the header button is pressed. */
  onSort?: () => void;
  /** The current sort of this column. Only one column should be "ascending" or "descending". */
  sortDirection?: TableSortDirection;
}

/** A header cell: a column header, or a row header with `scope="row"`. */
function TableHead({ scope = "col", onSort, sortDirection = "none", className, children, ...props }: TableHeadProps) {
  const messages = useAksoMessages();
  const thRef = React.useRef<HTMLTableCellElement | null>(null);
  const previous = React.useRef(sortDirection);
  useAnnouncerRegion();

  // Announce a new sort (not on first render): aria-sort changes are not read reliably.
  React.useEffect(() => {
    if (sortDirection !== previous.current && sortDirection !== "none" && thRef.current) {
      announce(messages.sortedBy(thRef.current.textContent?.trim() ?? "", sortDirection), thRef.current.ownerDocument);
    }
    previous.current = sortDirection;
  }, [sortDirection, messages]);

  const sortable = Boolean(onSort);
  return (
    <th
      ref={thRef}
      scope={scope}
      aria-sort={sortable && sortDirection !== "none" ? sortDirection : undefined}
      data-slot="table-head"
      className={cn("px-4 py-3 align-top font-semibold", sortable ? "p-1" : "", className)}
      {...props}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          data-slot="table-sort-button"
          className={cn(
            "inline-flex min-h-11 w-full items-center gap-2 rounded-sm px-3 text-left font-semibold underline-offset-2 hover:underline",
            focusRingClassName,
          )}
        >
          {children}
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {sortDirection === "ascending" ? <path d="m6 15 6-6 6 6" /> : sortDirection === "descending" ? <path d="m6 9 6 6 6-6" /> : <path d="m8 9 4-4 4 4M8 15l4 4 4-4" />}
          </svg>
        </button>
      ) : (
        children
      )}
    </th>
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return <td data-slot="table-cell" className={cn("px-4 py-3 align-top", className)} {...props} />;
}

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };
