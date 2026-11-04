"use client";

import * as React from "react";
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";

import { cn } from "@/lib/utils";

/*
 * Akso UI · Tooltip
 *
 * Built on @base-ui/react/tooltip. A tooltip is a VISUAL label for sighted mouse and keyboard
 * users (Base UI guideline): it does not appear on touch screens and screen readers do not
 * rely on it. So:
 * - the trigger always needs its own accessible name. An icon-only trigger without one gets the
 *   tooltip text as its aria-label. A trigger with visible text keeps it as its name, so the
 *   name matches what people see and say to voice control (WCAG 2.5.3 Label in Name);
 * - never put information people need only in a tooltip. Use Popover or text on the page.
 *
 * Base UI shows it on hover and keyboard focus, keeps it open while the pointer is over it,
 * and closes it with Escape (WCAG 1.4.13 Content on Hover or Focus).
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

/** Put it once around the app (or a toolbar) so tooltips share their open delay. */
function TooltipProvider({ delay = 500, ...props }: BaseTooltip.Provider.Props) {
  return <BaseTooltip.Provider delay={delay} {...props} />;
}

export interface TooltipProps {
  /** Short text, the same words as the trigger's accessible name ("Bold", "Settings"). */
  content: string;
  /** A single focusable element, usually a Button. */
  children: React.ReactElement<Record<string, unknown>>;
  side?: BaseTooltip.Positioner.Props["side"];
  className?: string;
}

/** A short visual label for an icon or control. */
function Tooltip({ content, children, side = "top", className }: TooltipProps) {
  const childProps = children.props;
  const hasName = Boolean(childProps["aria-label"] || childProps["aria-labelledby"] || hasVisibleText(childProps.children));
  // Give icon-only triggers a name that matches the tooltip text (Base UI guideline).
  const trigger = hasName ? children : React.cloneElement(children, { "aria-label": content });
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger data-slot="tooltip-trigger" render={trigger} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner data-slot="tooltip-positioner" className="z-50" side={side} sideOffset={8} collisionPadding={8}>
          <BaseTooltip.Popup
            data-slot="tooltip-content"
            className={cn(
              "max-w-xs rounded-md bg-akso-foreground px-3 py-1.5 text-sm text-akso-background shadow-md",
              "motion-safe:transition-opacity motion-safe:duration-100",
              "data-starting-style:opacity-0 data-ending-style:opacity-0",
              className,
            )}
          >
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}

/** True when the children contain text (strings or numbers), at any depth. */
function hasVisibleText(node: unknown): boolean {
  if (typeof node === "string") return node.trim().length > 0;
  if (typeof node === "number") return true;
  if (Array.isArray(node)) return node.some(hasVisibleText);
  if (React.isValidElement<{ children?: unknown; "aria-hidden"?: unknown }>(node)) {
    if (node.props["aria-hidden"] === true || node.props["aria-hidden"] === "true") return false;
    return hasVisibleText(node.props.children);
  }
  return false;
}

export { Tooltip, TooltipProvider };
