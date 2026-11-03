"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import { visuallyHiddenStyle } from "./visually-hidden";

export interface LiveRegionProps extends Omit<ComponentPropsWithoutRef<"div">, "children" | "role"> {
  /** The message to announce. Changing it triggers a new announcement. */
  message: string;
  /**
   * `polite` waits until the screen reader is idle (status messages).
   * `assertive` interrupts it: use only for urgent errors.
   */
  politeness?: "polite" | "assertive";
  /** Show the message on screen as well. Hidden by default. */
  visible?: boolean;
  /**
   * Delay in ms before the message is inserted. Screen readers ignore regions
   * whose content is present on first render, so a short delay improves reliability.
   */
  delay?: number;
}

/**
 * Announces status messages to screen readers (WCAG 4.1.3 Status Messages).
 *
 * The region element is always rendered, and only its text changes, because
 * many screen readers miss live regions that are added together with their content.
 */
export function LiveRegion({ message, politeness = "polite", visible = false, delay = 100, style, ...props }: LiveRegionProps) {
  const regionRef = useRef<HTMLDivElement>(null);

  // The text is written directly to the DOM: the region is an external system
  // (the screen reader listens to its mutations), and this avoids extra renders.
  useEffect(() => {
    const region = regionRef.current;
    if (!region) return;
    // Clear first so repeating the same message is announced again.
    region.textContent = "";
    if (!message) return;
    const timer = setTimeout(() => {
      region.textContent = message;
    }, delay);
    return () => clearTimeout(timer);
  }, [message, delay]);

  return (
    <div
      {...props}
      ref={regionRef}
      role={politeness === "assertive" ? "alert" : "status"}
      aria-live={politeness}
      aria-atomic="true"
      style={visible ? style : { ...visuallyHiddenStyle, ...style }}
    />
  );
}
