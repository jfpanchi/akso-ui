"use client";

import type { ComponentPropsWithoutRef, MouseEvent } from "react";

export interface SkipLinkProps extends Omit<ComponentPropsWithoutRef<"a">, "href"> {
  /** The id of the main content element, without `#`. */
  targetId?: string;
}

/**
 * First focusable element on the page. Lets keyboard users jump past
 * repeated navigation (WCAG 2.4.1 Bypass Blocks).
 *
 * It is hidden until it receives focus. Style it with the
 * `akso-skip-link` class or pass your own `className`.
 */
export function SkipLink({ targetId = "main-content", children = "Skip to main content", onClick, className, ...props }: SkipLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    const target = document.getElementById(targetId);
    if (!target) return;
    // Move focus as well as scroll, so the next Tab continues from the target.
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus();
  }

  return (
    <a {...props} href={`#${targetId}`} onClick={handleClick} className={className ?? "akso-skip-link"}>
      {children}
    </a>
  );
}
