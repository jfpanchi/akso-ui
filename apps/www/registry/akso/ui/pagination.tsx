"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useAksoMessages } from "@/registry/akso/lib/akso-locale";
import { focusRingClassName } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Pagination
 *
 * Plain HTML (Base UI has no pagination), following the GOV.UK pattern, which was tested
 * with users:
 * - a <nav> landmark named "Pagination" (or the AksoLocaleProvider text) with a list;
 * - "Previous" and "Next" with visible text, left out on the first and last page
 *   (instead of disabled links, which are confusing);
 * - each number is named "Page 3" for screen readers and still matches the visible "3"
 *   for voice control; the current page has aria-current="page";
 * - the current page is shown with a fill, bold text and a thicker border, not color alone;
 * - 44×44px targets, wrapping on narrow screens; the "…" is hidden from screen readers.
 *
 * Pages are links when you pass `getHref` (best: they work without JavaScript and can be
 * opened in a new tab), or buttons when you only pass `onPageChange`.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

/** Pages to show: the first, the last, and `siblings` on each side of the current page. */
export function paginationRange(page: number, pageCount: number, siblings = 1): (number | "ellipsis")[] {
  const pages = new Set<number>([1, pageCount]);
  for (let p = page - siblings; p <= page + siblings; p++) if (p >= 1 && p <= pageCount) pages.add(p);
  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];
  for (const [i, p] of sorted.entries()) {
    const previous = sorted[i - 1];
    if (previous !== undefined && p - previous === 2) result.push(previous + 1);
    else if (previous !== undefined && p - previous > 2) result.push("ellipsis");
    result.push(p);
  }
  return result;
}

export interface PaginationProps extends Omit<React.ComponentProps<"nav">, "children"> {
  /** The current page, starting at 1. */
  page: number;
  /** How many pages there are. With 1 page or less, nothing is rendered. */
  pageCount: number;
  /** The URL of each page. Pages are links when this is set. */
  getHref?: (page: number) => string;
  /** Called when a page is chosen (links and buttons). */
  onPageChange?: (page: number) => void;
  /** Renders each link, for router links: `renderLink={(props) => <Link {...props} />}`. */
  renderLink?: (props: React.ComponentProps<"a"> & { href: string }) => React.ReactElement;
  /** Pages shown on each side of the current page. Default: 1. */
  siblings?: number;
  /** Name of the navigation landmark. Default: "Pagination" (or the AksoLocaleProvider text). */
  label?: string;
}

const itemClassName = cn(
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-md border border-transparent px-3 text-base font-medium text-akso-primary underline underline-offset-2",
  "hover:decoration-2 hover:bg-akso-surface-hover",
  focusRingClassName,
);

const currentClassName = cn(
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border-2 border-akso-primary bg-akso-primary px-3 text-base font-bold text-akso-primary-foreground",
  "forced-colors:forced-color-adjust-none forced-colors:border-[Highlight] forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]",
);

/** Links (or buttons) to move between the pages of a long list. */
function Pagination({ page, pageCount, getHref, onPageChange, renderLink, siblings = 1, label, className, ...props }: PaginationProps) {
  const messages = useAksoMessages();
  if (pageCount <= 1) return null;
  const current = Math.min(Math.max(1, page), pageCount);

  function control(target: number, content: React.ReactNode, extra: { "aria-label"?: string; rel?: string; slot: string }) {
    const common = {
      className: itemClassName,
      "aria-label": extra["aria-label"],
      "data-slot": extra.slot,
      onClick: onPageChange ? () => onPageChange(target) : undefined,
      children: content,
    };
    if (getHref) {
      const linkProps = { ...common, href: getHref(target), rel: extra.rel };
      if (renderLink) return renderLink(linkProps);
      const { children, ...anchorProps } = linkProps;
      return <a {...anchorProps}>{children}</a>;
    }
    return <button type="button" {...common} />;
  }

  const arrow = (d: string) => (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );

  return (
    <nav aria-label={label ?? messages.pagination} data-slot="pagination" className={cn("min-w-0", className)} {...props}>
      <ul className="flex flex-wrap items-center gap-1">
        {current > 1 ? (
          <li>
            {control(
              current - 1,
              <>
                {arrow("m15 6-6 6 6 6")}
                {messages.previousPage}
              </>,
              { rel: "prev", slot: "pagination-previous" },
            )}
          </li>
        ) : null}
        {paginationRange(current, pageCount, siblings).map((item, i) =>
          item === "ellipsis" ? (
            <li key={`ellipsis-${i}`} aria-hidden="true" data-slot="pagination-ellipsis" className="inline-flex min-h-11 min-w-6 items-center justify-center text-akso-muted-foreground">
              …
            </li>
          ) : (
            <li key={item}>
              {item === current ? (
                <span aria-current="page" data-slot="pagination-current" className={currentClassName}>
                  {/* A span cannot take aria-label: hidden text gives screen readers "Page 3". */}
                  <span className="sr-only">{messages.page(item)}</span>
                  <span aria-hidden="true">{item}</span>
                </span>
              ) : (
                control(item, item, { "aria-label": messages.page(item), slot: "pagination-page" })
              )}
            </li>
          ),
        )}
        {current < pageCount ? (
          <li>
            {control(
              current + 1,
              <>
                {messages.nextPage}
                {arrow("m9 6 6 6-6 6")}
              </>,
              { rel: "next", slot: "pagination-next" },
            )}
          </li>
        ) : null}
      </ul>
    </nav>
  );
}

export { Pagination };
