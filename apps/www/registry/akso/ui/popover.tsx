"use client";

import { Popover as BasePopover } from "@base-ui/react/popover";

import { cn } from "@/lib/utils";
import { buttonClassName, popupSurfaceClassName, type ButtonSize, type ButtonVariant } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Popover
 *
 * Built on @base-ui/react/popover: the trigger has aria-expanded and aria-haspopup, focus
 * moves into the popup when it opens, Escape closes it and focus returns to the trigger.
 * Use it for extra content that people open on purpose, including "info" icons
 * (`openOnHover` on Popover; Base UI's alternative to tooltips, so touch and screen reader
 * users can open it too).
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

function Popover(props: BasePopover.Root.Props) {
  return <BasePopover.Root {...props} />;
}

type ButtonPartProps<P> = Omit<P, "className"> & { className?: string; variant?: ButtonVariant; size?: ButtonSize };

/** The button that opens the popover. Icon-only triggers need an aria-label ("More information"). */
function PopoverTrigger({ className, variant = "secondary", size, ...props }: ButtonPartProps<BasePopover.Trigger.Props>) {
  return <BasePopover.Trigger data-slot="popover-trigger" className={buttonClassName({ variant, size, className })} {...props} />;
}

export interface PopoverContentProps extends Omit<BasePopover.Popup.Props, "className"> {
  className?: string;
  side?: BasePopover.Positioner.Props["side"];
  align?: BasePopover.Positioner.Props["align"];
}

/** The floating panel. Add a PopoverTitle so screen readers announce what it is. */
function PopoverContent({ className, side = "bottom", align = "center", ...props }: PopoverContentProps) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner data-slot="popover-positioner" className="z-50" side={side} align={align} sideOffset={8} collisionPadding={16}>
        <BasePopover.Popup data-slot="popover-content" className={cn(popupSurfaceClassName, "flex w-80 flex-col gap-2 p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-akso-focus-ring", className)} {...props} />
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}

function PopoverTitle({ className, ...props }: Omit<BasePopover.Title.Props, "className"> & { className?: string }) {
  return <BasePopover.Title data-slot="popover-title" className={cn("text-base font-semibold", className)} {...props} />;
}

function PopoverDescription({ className, ...props }: Omit<BasePopover.Description.Props, "className"> & { className?: string }) {
  return <BasePopover.Description data-slot="popover-description" className={cn("text-base text-akso-muted-foreground", className)} {...props} />;
}

/** A button that closes the popover. */
function PopoverClose({ className, variant = "secondary", size = "sm", ...props }: ButtonPartProps<BasePopover.Close.Props>) {
  return <BasePopover.Close data-slot="popover-close" className={buttonClassName({ variant, size, className: cn("self-start", className) })} {...props} />;
}

export { Popover, PopoverClose, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger };
