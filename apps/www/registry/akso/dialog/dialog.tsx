"use client";

import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";

import { cn } from "@/lib/utils";

/*
 * Akso UI · Dialog
 *
 * Built on @base-ui/react/dialog. Base UI provides role="dialog", aria-modal,
 * aria-labelledby / aria-describedby, the focus trap, Escape to close and
 * focus return. This file only adds styles and safe defaults: do not override
 * those attributes or keyboard handlers.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

/* -------------------------------------------------------------------------- */
/* Button styles shared by the trigger and the close buttons                   */
/* -------------------------------------------------------------------------- */

export type DialogButtonVariant = "primary" | "secondary" | "danger";

const focusRing =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-akso-focus-ring";

const buttonBase = cn(
  // min-h-11 = 44px: above the 24×24px minimum (WCAG 2.5.8) and close to the 44px enhanced target (2.5.5).
  "inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2",
  "text-base font-medium leading-tight text-balance",
  "disabled:cursor-not-allowed disabled:opacity-60 data-disabled:cursor-not-allowed data-disabled:opacity-60",
  "motion-safe:transition-[color,background-color,border-color] motion-safe:duration-150",
  focusRing,
);

const buttonVariants: Record<DialogButtonVariant, string> = {
  primary: "bg-akso-primary text-akso-primary-foreground hover:bg-akso-primary-hover",
  secondary: "border border-akso-border bg-akso-surface text-akso-foreground hover:bg-akso-surface-hover",
  // No color-only hover change: the underline makes the state visible without relying on color.
  danger: "bg-akso-danger text-akso-danger-foreground hover:underline",
};

/** Classes for buttons that sit next to the dialog buttons (for example, a submit button). */
export function dialogButtonClassName(variant: DialogButtonVariant = "secondary", className?: string) {
  return cn(buttonBase, buttonVariants[variant], className);
}

/* -------------------------------------------------------------------------- */
/* Parts                                                                       */
/* -------------------------------------------------------------------------- */

/** Holds the dialog state. Accepts `open`, `defaultOpen`, `onOpenChange` and the other Base UI Root props. */
function Dialog(props: BaseDialog.Root.Props) {
  return <BaseDialog.Root {...props} />;
}

type ButtonPartProps<P> = Omit<P, "className"> & {
  className?: string;
  variant?: DialogButtonVariant;
};

/** The button that opens the dialog. Focus returns here when the dialog closes. */
function DialogTrigger({ className, variant = "secondary", ...props }: ButtonPartProps<BaseDialog.Trigger.Props>) {
  return <BaseDialog.Trigger data-slot="dialog-trigger" className={dialogButtonClassName(variant, className)} {...props} />;
}

/** A button that closes the dialog. Use it for "Cancel" or "Close" actions. */
function DialogClose({ className, variant = "secondary", ...props }: ButtonPartProps<BaseDialog.Close.Props>) {
  return <BaseDialog.Close data-slot="dialog-close" className={dialogButtonClassName(variant, className)} {...props} />;
}

export interface DialogContentProps extends Omit<BaseDialog.Popup.Props, "className"> {
  className?: string;
  /** Show the "×" close button in the top corner. Default: `true`. */
  showCloseButton?: boolean;
  /** Accessible name of the "×" button. Translate it for your audience. Default: `"Close"`. */
  closeLabel?: string;
}

/**
 * The dialog window, with its backdrop. Must contain a `DialogTitle`.
 *
 * Layout: the viewport scrolls vertically when the content is taller than the screen,
 * so nothing is cut off at 320px wide or at 400% zoom.
 */
function DialogContent({ className, children, showCloseButton = true, closeLabel = "Close", ref, ...props }: DialogContentProps) {
  const popupRef = React.useRef<HTMLDivElement | null>(null);
  useWarnIfUnlabelled(popupRef);

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      popupRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop
        data-slot="dialog-backdrop"
        className={cn(
          "fixed inset-0 z-50 min-h-dvh bg-akso-overlay",
          "motion-safe:transition-opacity motion-safe:duration-150",
          "data-starting-style:opacity-0 data-ending-style:opacity-0",
        )}
      />
      <BaseDialog.Viewport data-slot="dialog-viewport" className="fixed inset-0 z-50 flex overflow-y-auto p-4 sm:p-6">
        <BaseDialog.Popup
          ref={setRefs}
          data-slot="dialog-content"
          className={cn(
            // m-auto centers the popup but lets it grow and scroll instead of being clipped.
            "relative m-auto flex w-full max-w-lg min-w-0 flex-col gap-4",
            "rounded-lg border border-akso-border bg-akso-surface p-5 text-akso-foreground shadow-xl sm:p-6",
            "break-words",
            focusRing,
            "motion-safe:transition-[opacity,scale] motion-safe:duration-150 motion-safe:ease-out",
            "data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0",
            className,
          )}
          {...props}
        >
          {children}
          {showCloseButton ? (
            // Last in the DOM so the title is read first and Tab reaches the main actions first.
            <BaseDialog.Close
              data-slot="dialog-close-icon"
              className={cn(
                "absolute top-2 right-2 inline-flex size-11 cursor-pointer items-center justify-center rounded-md",
                "text-akso-muted-foreground hover:bg-akso-surface-hover hover:text-akso-foreground",
                "motion-safe:transition-[color,background-color,border-color] motion-safe:duration-150",
                focusRing,
              )}
            >
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
              <span className="sr-only">{closeLabel}</span>
            </BaseDialog.Close>
          ) : null}
        </BaseDialog.Popup>
      </BaseDialog.Viewport>
    </BaseDialog.Portal>
  );
}

/** Groups the title and description. Leaves room for the "×" button. */
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={cn("flex flex-col gap-1.5 pr-10", className)} {...props} />;
}

/** Groups the action buttons. Stacked on narrow screens, in a row from 640px. */
function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:flex-wrap sm:justify-end", className)}
      {...props}
    />
  );
}

/** Required. Gives the dialog its accessible name (rendered as `<h2>`). */
function DialogTitle({ className, ...props }: Omit<BaseDialog.Title.Props, "className"> & { className?: string }) {
  return <BaseDialog.Title data-slot="dialog-title" className={cn("text-xl font-semibold leading-snug", className)} {...props} />;
}

/** Optional. Read by screen readers after the title. Keep it short. */
function DialogDescription({ className, ...props }: Omit<BaseDialog.Description.Props, "className"> & { className?: string }) {
  return <BaseDialog.Description data-slot="dialog-description" className={cn("text-base text-akso-muted-foreground", className)} {...props} />;
}

/* -------------------------------------------------------------------------- */
/* Development warning                                                         */
/* -------------------------------------------------------------------------- */

/** Logs an error in development when the dialog has no accessible name. */
function useWarnIfUnlabelled(ref: React.RefObject<HTMLElement | null>) {
  const warned = React.useRef(false);
  React.useEffect(() => {
    if (process.env.NODE_ENV === "production" || warned.current) return;
    const frame = requestAnimationFrame(() => {
      const popup = ref.current;
      if (!popup) return;
      const labelId = popup.getAttribute("aria-labelledby");
      const label = labelId ? popup.ownerDocument.getElementById(labelId)?.textContent?.trim() : popup.getAttribute("aria-label");
      if (!label) {
        warned.current = true;
        console.error(
          "[Akso UI] Dialog has no accessible name. Add a <DialogTitle> inside <DialogContent> so screen readers can announce it. " +
            "To hide it visually, use <DialogTitle className=\"sr-only\">.",
        );
      }
    });
    return () => cancelAnimationFrame(frame);
  });
}

export { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger };
