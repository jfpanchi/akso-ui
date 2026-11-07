"use client";

import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";

import { cn } from "@/lib/utils";
import { useAksoMessages } from "@/registry/akso/lib/akso-locale";
import { focusRingClassName } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Breadcrumb
 *
 * The WAI-ARIA breadcrumb pattern, with plain HTML (Base UI has no breadcrumb):
 * - a <nav> landmark named "Breadcrumb" (or the AksoLocaleProvider text), so screen reader
 *   users can find it and skip it;
 * - an ordered list, so screen readers say how many levels there are;
 * - the current page marked with aria-current="page", as text (not a link to itself);
 * - separators hidden from screen readers, so they are not read between every link.
 * Links are underlined (not color alone), 44px tall, and wrap on narrow screens.
 * BreadcrumbLink takes a `render` prop (Base UI useRender) for router links, like Next.js <Link>.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface BreadcrumbProps extends React.ComponentProps<"nav"> {
  /** Name of the navigation landmark. Default: "Breadcrumb" (or the AksoLocaleProvider text). */
  label?: string;
}

/** Shows where the current page is in the site, with links to the pages above it. */
function Breadcrumb({ label, className, children, ...props }: BreadcrumbProps) {
  const messages = useAksoMessages();
  return (
    <nav aria-label={label ?? messages.breadcrumb} data-slot="breadcrumb" className={cn("min-w-0", className)} {...props}>
      <ol data-slot="breadcrumb-list" className="flex flex-wrap items-center gap-x-1 text-base text-akso-foreground">
        {children}
      </ol>
    </nav>
  );
}

/** One level of the breadcrumb. A separator is drawn before every item except the first. */
function BreadcrumbItem({ className, children, ...props }: React.ComponentProps<"li">) {
  return (
    <li data-slot="breadcrumb-item" className={cn("group/breadcrumb-item inline-flex min-w-0 items-center gap-1", className)} {...props}>
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 24 24"
        className="size-4 shrink-0 text-akso-muted-foreground group-first/breadcrumb-item:hidden"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m9 6 6 6-6 6" />
      </svg>
      {children}
    </li>
  );
}

export type BreadcrumbLinkProps = useRender.ComponentProps<"a">;

/** A link to a page above the current one. Use `render` for router links: `render={<Link href="/shop" />}`. */
function BreadcrumbLink({ render, className, ...props }: BreadcrumbLinkProps) {
  return useRender({
    defaultTagName: "a",
    render,
    props: mergeProps<"a">(
      {
        className: cn(
          "inline-flex min-h-11 items-center rounded-sm px-1 text-akso-primary underline underline-offset-2 [overflow-wrap:anywhere] hover:decoration-2",
          focusRingClassName,
          className,
        ),
      },
      { "data-slot": "breadcrumb-link", ...props } as React.ComponentProps<"a">,
    ),
  });
}

/** The current page: plain text with aria-current="page". */
function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-current="page"
      data-slot="breadcrumb-page"
      className={cn("inline-flex min-h-11 items-center px-1 font-semibold [overflow-wrap:anywhere]", className)}
      {...props}
    />
  );
}

export { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage };
