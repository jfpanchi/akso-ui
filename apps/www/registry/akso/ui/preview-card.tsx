"use client";

import { PreviewCard as BasePreviewCard } from "@base-ui/react/preview-card";

import { cn } from "@/lib/utils";
import { focusRingClassName, popupSurfaceClassName } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Preview card
 *
 * A link that shows a preview of its destination when you hover it or focus it with the
 * keyboard. Built on @base-ui/react/preview-card. Base UI provides:
 * - Opening on hover and on keyboard focus, after a short delay (600ms), and closing with
 *   Escape, when the pointer leaves, or when focus moves away (WCAG 1.4.13: dismissible,
 *   hoverable, persistent).
 * - The link stays the only thing in the Tab order. The preview is not focusable and screen
 *   readers are not sent into it, so it does not interrupt reading.
 *
 * Because of that, the preview is only a visual extra for sighted mouse and keyboard users.
 * Never put information there that is not also on the linked page (see the docs).
 *
 * This file adds the link style (underlined, so it is not shown by color alone), a focus ring,
 * the card surface, and motion only with motion-safe.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

const PreviewCard = BasePreviewCard.Root;

export interface PreviewCardTriggerProps extends Omit<BasePreviewCard.Trigger.Props, "className"> {
  className?: string;
  /** Where the link goes. The page there must have everything the preview shows. */
  href: string;
}

/** The link. It works like any link; the preview is extra. */
function PreviewCardTrigger({ className, ...props }: PreviewCardTriggerProps) {
  return (
    <BasePreviewCard.Trigger
      data-slot="preview-card-trigger"
      className={cn("rounded-sm text-akso-primary underline underline-offset-2 hover:decoration-2 data-popup-open:decoration-2", focusRingClassName, className)}
      {...props}
    />
  );
}

export interface PreviewCardContentProps extends Omit<BasePreviewCard.Popup.Props, "className"> {
  className?: string;
  side?: BasePreviewCard.Positioner.Props["side"];
  align?: BasePreviewCard.Positioner.Props["align"];
}

/** The preview. Only a visual extra: keep its content on the linked page too. */
function PreviewCardContent({ className, side = "bottom", align = "center", ...props }: PreviewCardContentProps) {
  return (
    <BasePreviewCard.Portal>
      <BasePreviewCard.Positioner data-slot="preview-card-positioner" className="z-50" side={side} align={align} sideOffset={8} collisionPadding={16}>
        <BasePreviewCard.Popup data-slot="preview-card-content" className={cn(popupSurfaceClassName, "flex w-72 flex-col gap-2 p-4", className)} {...props} />
      </BasePreviewCard.Positioner>
    </BasePreviewCard.Portal>
  );
}

export { PreviewCard, PreviewCardTrigger, PreviewCardContent };
