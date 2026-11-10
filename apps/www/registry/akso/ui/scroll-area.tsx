"use client";

import * as React from "react";
import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area";

import { cn } from "@/lib/utils";
import { forcedFillClassName, warnIfUnnamed } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Scroll area
 *
 * A box with its own scrollbars, for content that must stay inside a fixed height or width.
 * Built on @base-ui/react/scroll-area. Base UI provides:
 * - The viewport is a real scrolling element, so wheel, touch, arrow keys, Page Up/Down,
 *   Space and Home/End work as usual once it has focus.
 * - The viewport is in the Tab order only when its content overflows (axe:
 *   scrollable-region-focusable), so keyboard users can scroll content with no links.
 * - The custom scrollbars are hidden from screen readers (they only repeat the scrolling).
 *
 * This file adds:
 * - role="region" and a name on the viewport (from `aria-label` or `aria-labelledby`), so a
 *   screen reader says what got focus instead of nothing. Base UI sets no role there.
 * - A focus ring drawn inside the box (it would be cut off outside).
 * - Scrollbars that stay visible (they do not fade out), so people can see that there is more
 *   content; a thumb with at least 3:1 contrast, and Windows high contrast colors.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface ScrollAreaProps extends Omit<BaseScrollArea.Root.Props, "className" | "children"> {
  className?: string;
  /** Class for the viewport. */
  viewportClassName?: string;
  children?: React.ReactNode;
  /** Which scrollbars to show. Default: "vertical". */
  orientation?: "vertical" | "horizontal" | "both";
  /** Name of the region. Needed when the content can scroll. */
  "aria-label"?: string;
  /** id of a visible heading that names the region. */
  "aria-labelledby"?: string;
}

function Scrollbar({ orientation }: { orientation: "vertical" | "horizontal" }) {
  return (
    <BaseScrollArea.Scrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "m-0.5 flex touch-none rounded-full bg-akso-surface-hover p-0.5 select-none",
        "data-[orientation=vertical]:w-3 data-[orientation=horizontal]:h-3 data-[orientation=horizontal]:flex-col",
        "forced-colors:border",
      )}
    >
      <BaseScrollArea.Thumb data-slot="scroll-area-thumb" className={cn("w-full flex-1 rounded-full bg-akso-muted-foreground", forcedFillClassName)} />
    </BaseScrollArea.Scrollbar>
  );
}

/** A box with its own scrollbars. Give it a name with `aria-label` or `aria-labelledby`. */
function ScrollArea({
  className,
  viewportClassName,
  children,
  orientation = "vertical",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: ScrollAreaProps) {
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    warnIfUnnamed(viewportRef.current, "ScrollArea", "Pass aria-label, or aria-labelledby with the id of a visible heading.");
  }, []);

  return (
    <BaseScrollArea.Root data-slot="scroll-area" className={cn("relative min-h-0 overflow-hidden rounded-md border border-akso-border bg-akso-surface", className)} {...props}>
      <BaseScrollArea.Viewport
        ref={viewportRef}
        data-slot="scroll-area-viewport"
        role="region"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={cn(
          "h-full w-full overscroll-contain rounded-md",
          "outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-solid focus-visible:outline-akso-focus-ring",
          viewportClassName,
        )}
      >
        <BaseScrollArea.Content
          data-slot="scroll-area-content"
          className={cn("p-3", orientation !== "horizontal" && "pr-5", orientation !== "vertical" && "pb-5")}
        >
          {children}
        </BaseScrollArea.Content>
      </BaseScrollArea.Viewport>
      {orientation !== "horizontal" ? <Scrollbar orientation="vertical" /> : null}
      {orientation !== "vertical" ? <Scrollbar orientation="horizontal" /> : null}
      {orientation === "both" ? <BaseScrollArea.Corner data-slot="scroll-area-corner" /> : null}
    </BaseScrollArea.Root>
  );
}

export { ScrollArea };
