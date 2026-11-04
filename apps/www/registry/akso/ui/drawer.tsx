"use client";

import * as React from "react";
import { Drawer as BaseDrawer } from "@base-ui/react/drawer";

import { cn } from "@/lib/utils";
import { useAksoMessages } from "@/registry/akso/lib/akso-locale";
import {
  buttonClassName,
  focusRingClassName,
  modalDescriptionClassName,
  modalTitleClassName,
  type ButtonSize,
  type ButtonVariant,
} from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Drawer
 *
 * A panel that slides in from the edge of the screen. Built on @base-ui/react/drawer, which
 * extends Dialog: role="dialog", a focus trap, Escape to close and focus return, plus swipe
 * to dismiss.
 *
 * Swiping is never the only way to close it (WCAG 2.5.7): there is always a close button,
 * and Escape and the backdrop close it too. The slide does not run with reduced motion.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export type DrawerSide = "right" | "left" | "bottom";

type SnapPoint = NonNullable<BaseDrawer.Root.Props["snapPoint"]>;

interface DrawerContextValue {
  side: DrawerSide;
  snapPoints?: SnapPoint[];
  snapPoint: SnapPoint | null;
  setSnapPoint: (point: SnapPoint | null) => void;
}

const DrawerContext = React.createContext<DrawerContextValue>({ side: "right", snapPoint: null, setSnapPoint: () => {} });

export interface DrawerProps extends Omit<BaseDrawer.Root.Props, "swipeDirection"> {
  /** Edge the drawer comes from. Default: "right". Snap points only apply to "bottom". */
  side?: DrawerSide;
}

function Drawer({ side = "right", snapPoints, snapPoint: snapPointProp, defaultSnapPoint, onSnapPointChange, ...props }: DrawerProps) {
  const [innerSnapPoint, setInnerSnapPoint] = React.useState<SnapPoint | null>(defaultSnapPoint ?? snapPoints?.[0] ?? null);
  const snapPoint = snapPointProp !== undefined ? snapPointProp : innerSnapPoint;
  const setSnapPoint = React.useCallback(
    (point: SnapPoint | null) => {
      if (snapPointProp === undefined) setInnerSnapPoint(point);
      // Base UI calls onSnapPointChange with event details; a button press has none.
      (onSnapPointChange as ((p: SnapPoint | null) => void) | undefined)?.(point);
    },
    [snapPointProp, onSnapPointChange],
  );
  const usesSnapPoints = side === "bottom" && snapPoints !== undefined && snapPoints.length > 1;
  const context = React.useMemo(
    () => ({ side, snapPoints: usesSnapPoints ? snapPoints : undefined, snapPoint, setSnapPoint }),
    [side, usesSnapPoints, snapPoints, snapPoint, setSnapPoint],
  );
  return (
    <DrawerContext.Provider value={context}>
      <BaseDrawer.Root
        swipeDirection={side === "bottom" ? "down" : side}
        {...(usesSnapPoints ? { snapPoints, snapPoint, onSnapPointChange: (p: SnapPoint | null) => setSnapPoint(p) } : {})}
        {...props}
      />
    </DrawerContext.Provider>
  );
}

type ButtonPartProps<P> = Omit<P, "className"> & { className?: string; variant?: ButtonVariant; size?: ButtonSize };

function DrawerTrigger({ className, variant = "secondary", size, ...props }: ButtonPartProps<BaseDrawer.Trigger.Props>) {
  return <BaseDrawer.Trigger data-slot="drawer-trigger" className={buttonClassName({ variant, size, className })} {...props} />;
}

const popupBySide: Record<DrawerSide, string> = {
  right:
    "inset-y-0 right-0 h-full w-[min(24rem,calc(100vw-2rem))] border-l [transform:translateX(var(--drawer-swipe-movement-x))] data-starting-style:[transform:translateX(100%)] data-ending-style:[transform:translateX(100%)]",
  left:
    "inset-y-0 left-0 h-full w-[min(24rem,calc(100vw-2rem))] border-r [transform:translateX(var(--drawer-swipe-movement-x))] data-starting-style:[transform:translateX(-100%)] data-ending-style:[transform:translateX(-100%)]",
  bottom:
    "inset-x-0 bottom-0 max-h-[85dvh] w-full rounded-t-xl border-t [transform:translateY(calc(var(--drawer-snap-point-offset,0px)_+_var(--drawer-swipe-movement-y,0px)))] data-starting-style:[transform:translateY(100%)] data-ending-style:[transform:translateY(100%)]",
};

export interface DrawerContentProps extends Omit<BaseDrawer.Popup.Props, "className"> {
  className?: string;
  /** Accessible name of the × button. Default: "Close". */
  closeLabel?: string;
}

/** The sliding panel. Must contain a DrawerTitle. Always has a close button. */
function DrawerContent({ className, children, closeLabel, ...props }: DrawerContentProps) {
  const messages = useAksoMessages();
  const { side, snapPoints, snapPoint, setSnapPoint } = React.useContext(DrawerContext);
  const atLargest = snapPoints ? snapPoint === snapPoints[snapPoints.length - 1] : false;
  return (
    <BaseDrawer.Portal>
      <BaseDrawer.Backdrop
        data-slot="drawer-backdrop"
        className="fixed inset-0 z-50 min-h-dvh bg-akso-overlay data-starting-style:opacity-0 data-ending-style:opacity-0 motion-safe:transition-opacity motion-safe:duration-300"
      />
      <BaseDrawer.Viewport data-slot="drawer-viewport" className="fixed inset-0 z-50">
        <BaseDrawer.Popup
          data-slot="drawer-content"
          className={cn(
            "fixed flex flex-col overflow-y-auto overscroll-contain border-akso-border bg-akso-surface text-akso-foreground shadow-xl outline-none",
            popupBySide[side],
            // With snap points, the sheet takes the full height and Base UI moves it down to each snap point.
            snapPoints ? "h-[calc(100dvh-1rem)] max-h-none" : "",
            "motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out data-swiping:transition-none",
            focusRingClassName,
          )}
          {...props}
        >
          <BaseDrawer.Content data-slot="drawer-body" className={cn("relative flex flex-col gap-4 p-5 pr-16 sm:p-6 sm:pr-16", className)}>
            {snapPoints ? (
              // Changing the height must not require dragging (WCAG 2.5.7): one tap moves to the next size.
              <button
                type="button"
                data-slot="drawer-snap-toggle"
                aria-expanded={atLargest}
                onClick={() => {
                  const index = snapPoints.findIndex((p) => p === snapPoint);
                  setSnapPoint(snapPoints[(index + 1) % snapPoints.length] ?? snapPoints[0] ?? null);
                }}
                className={buttonClassName({ variant: "secondary", size: "sm", className: "self-start" })}
              >
                {atLargest ? messages.showLess : messages.showMore}
              </button>
            ) : null}
            {children}
            <BaseDrawer.Close
              data-slot="drawer-close-icon"
              className={buttonClassName({ variant: "ghost", size: "icon", className: "absolute top-2 right-2 text-akso-muted-foreground" })}
            >
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
              <span className="sr-only">{closeLabel ?? messages.close}</span>
            </BaseDrawer.Close>
          </BaseDrawer.Content>
        </BaseDrawer.Popup>
      </BaseDrawer.Viewport>
    </BaseDrawer.Portal>
  );
}

function DrawerTitle({ className, ...props }: Omit<BaseDrawer.Title.Props, "className"> & { className?: string }) {
  return <BaseDrawer.Title data-slot="drawer-title" className={cn(modalTitleClassName, className)} {...props} />;
}

function DrawerDescription({ className, ...props }: Omit<BaseDrawer.Description.Props, "className"> & { className?: string }) {
  return <BaseDrawer.Description data-slot="drawer-description" className={cn(modalDescriptionClassName, className)} {...props} />;
}

function DrawerClose({ className, variant = "secondary", size, ...props }: ButtonPartProps<BaseDrawer.Close.Props>) {
  return <BaseDrawer.Close data-slot="drawer-close" className={buttonClassName({ variant, size, className })} {...props} />;
}

export { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger };
