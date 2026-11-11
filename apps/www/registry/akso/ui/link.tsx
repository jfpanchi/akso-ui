"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useAksoMessages } from "@/registry/akso/lib/akso-locale";
import { focusRingClassName } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Link
 *
 * A text link. There is no Base UI part for this; it is a real <a href>.
 * - Always underlined, so links are not shown by color alone (WCAG 1.4.1); a thicker
 *   underline on hover; link color with at least 4.5:1 contrast; a focus ring.
 * - `newTab`: opens in a new tab with rel="noopener noreferrer", shows an icon, and adds a
 *   hidden "(opens in a new tab)" to the name, so nobody is surprised by a new tab
 *   (WCAG 3.2.5). The text can be translated or changed with `newTabLabel`.
 * - `render` lets you use your router's link (Next.js Link, React Router Link) with the same
 *   styles.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export const linkClassName = cn(
  "rounded-sm text-akso-primary underline underline-offset-2 hover:decoration-2 [overflow-wrap:anywhere]",
  focusRingClassName,
);

export interface LinkProps extends React.ComponentProps<"a"> {
  href: string;
  /** Open in a new tab, and say so. Use it only when people would lose work otherwise. */
  newTab?: boolean;
  /** Hidden text for new-tab links. Default: "(opens in a new tab)" (or the AksoLocaleProvider text). */
  newTabLabel?: string;
  /** Render your router's link instead of <a>. It receives href, className, the new-tab attributes and children. */
  render?: (props: React.ComponentProps<"a"> & { href: string }) => React.ReactElement;
}

/** A text link: underlined, with a focus ring, and honest about new tabs. */
function Link({ className, newTab = false, newTabLabel, render, children, ...props }: LinkProps) {
  const messages = useAksoMessages();
  const content = (
    <>
      {children}
      {newTab ? (
        <>
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="ml-1 inline size-4 align-[-0.125em]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
          </svg>
          <span className="sr-only"> {newTabLabel ?? messages.opensInNewTab}</span>
        </>
      ) : null}
    </>
  );
  const linkProps = {
    "data-slot": "link",
    className: cn(linkClassName, className),
    ...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {}),
    ...props,
  };
  return render ? render({ ...linkProps, children: content }) : <a {...linkProps}>{content}</a>;
}

export { Link };
