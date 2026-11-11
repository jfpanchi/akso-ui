"use client";

import * as React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";

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
 * - Row selection (useTableSelection, TableSelectAll, TableRowCheckbox): Base UI checkboxes
 *   named after their row, a "select all" that is mixed when some rows are selected, 44px
 *   targets, and the new count announced after each change ("2 rows selected").
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

export interface TableRowProps extends React.ComponentProps<"tr"> {
  /** The row is selected (with a TableRowCheckbox). Adds a background; the checkbox shows the state. */
  selected?: boolean;
}

function TableRow({ className, selected, ...props }: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      data-selected={selected || undefined}
      className={cn("border-t border-akso-border first:border-t-0 data-selected:bg-akso-surface-hover", className)}
      {...props}
    />
  );
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

/* -------------------------------------------------------------------------- */
/* Row selection                                                               */
/* -------------------------------------------------------------------------- */

export interface TableSelection {
  selected: ReadonlySet<string>;
  isSelected: (id: string) => boolean;
  toggle: (id: string, checked: boolean) => void;
  toggleAll: (checked: boolean) => void;
  /** "all", "some" or "none" of the rows are selected. */
  state: "all" | "some" | "none";
}

/**
 * Keeps track of the selected rows (by id) and announces the count when it changes,
 * like "2 rows selected". Pass the ids of the rows that are shown.
 */
function useTableSelection(ids: readonly string[], initial: readonly string[] = []): TableSelection {
  const messages = useAksoMessages();
  const [selected, setSelected] = React.useState<ReadonlySet<string>>(() => new Set(initial));
  useAnnouncerRegion();

  const update = (next: Set<string>) => {
    setSelected(next);
    announce(messages.rowsSelected(ids.filter((id) => next.has(id)).length));
  };
  const count = ids.filter((id) => selected.has(id)).length;

  return {
    selected,
    isSelected: (id) => selected.has(id),
    toggle: (id, checked) => {
      const next = new Set(selected);
      if (checked) next.add(id);
      else next.delete(id);
      update(next);
    },
    toggleAll: (checked) => update(checked ? new Set([...selected, ...ids]) : new Set([...selected].filter((id) => !ids.includes(id)))),
    state: count === 0 ? "none" : count === ids.length ? "all" : "some",
  };
}

interface TableCheckboxProps extends Omit<BaseCheckbox.Root.Props, "className" | "children"> {
  className?: string;
}

/** A 44px checkbox for a table cell. The visible box is 24px; the rest is the target around it. */
function TableCheckbox({ className, ...props }: TableCheckboxProps) {
  return (
    <BaseCheckbox.Root
      data-slot="table-checkbox"
      className={cn("group inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md align-middle", focusRingClassName, className)}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex size-6 items-center justify-center rounded-md border-2 border-akso-border bg-akso-surface text-akso-primary-foreground",
          "group-data-checked:border-akso-primary group-data-checked:bg-akso-primary group-data-indeterminate:border-akso-primary group-data-indeterminate:bg-akso-primary",
          "forced-colors:group-data-checked:bg-[Highlight] forced-colors:group-data-indeterminate:bg-[Highlight]",
        )}
      >
        <BaseCheckbox.Indicator className="flex">
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-4 group-data-indeterminate:hidden" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7" />
          </svg>
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="hidden size-4 group-data-indeterminate:block" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
            <path d="M6 12h12" />
          </svg>
        </BaseCheckbox.Indicator>
      </span>
    </BaseCheckbox.Root>
  );
}

export interface TableSelectAllProps {
  selection: TableSelection;
  /** Name of the checkbox. Default: "Select all rows" (or the AksoLocaleProvider text). */
  label?: string;
}

/** The "select all" checkbox, for the first header cell. Shows a dash when only some rows are selected. */
function TableSelectAll({ selection, label }: TableSelectAllProps) {
  const messages = useAksoMessages();
  return (
    <TableCheckbox
      aria-label={label ?? messages.selectAllRows}
      checked={selection.state === "all"}
      indeterminate={selection.state === "some"}
      onCheckedChange={(checked) => selection.toggleAll(checked)}
    />
  );
}

export interface TableRowCheckboxProps {
  selection: TableSelection;
  id: string;
  /** What the row is, for the checkbox name: "Laura Torres" gives "Select Laura Torres". */
  rowName: string;
}

/** The checkbox that selects one row. */
function TableRowCheckbox({ selection, id, rowName }: TableRowCheckboxProps) {
  const messages = useAksoMessages();
  return <TableCheckbox aria-label={messages.selectRow(rowName)} checked={selection.isSelected(id)} onCheckedChange={(checked) => selection.toggle(id, checked)} />;
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableRowCheckbox,
  TableSelectAll,
  useTableSelection,
};
