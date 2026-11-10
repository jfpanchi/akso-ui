"use client";

import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";

import { cn } from "@/lib/utils";
import { useAksoMessages } from "@/registry/akso/lib/akso-locale";
import {
  buttonClassName,
  isDevelopment,
  modalBackdropClassName,
  modalDescriptionClassName,
  modalFooterClassName,
  modalPopupClassName,
  modalTitleClassName,
  modalViewportClassName,
  type ButtonSize,
  type ButtonVariant,
} from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Dialog
 *
 * Built on @base-ui/react/dialog. Base UI provides role="dialog",
 * aria-labelledby / aria-describedby, hides the rest of the page from
 * assistive technology, traps focus, closes on Escape and returns focus. This file only adds styles and safe defaults: do not override
 * those attributes or keyboard handlers.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

/* -------------------------------------------------------------------------- */
/* Parts                                                                       */
/* -------------------------------------------------------------------------- */

/** Holds the dialog state. Accepts `open`, `defaultOpen`, `onOpenChange` and the other Base UI Root props. */
function Dialog(props: BaseDialog.Root.Props) {
  return <BaseDialog.Root {...props} />;
}

type ButtonPartProps<P> = Omit<P, "className"> & {
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

/** The button that opens the dialog. Focus returns here when the dialog closes. */
function DialogTrigger({ className, variant = "secondary", size, ...props }: ButtonPartProps<BaseDialog.Trigger.Props>) {
  return <BaseDialog.Trigger data-slot="dialog-trigger" className={buttonClassName({ variant, size, className })} {...props} />;
}

/** A button that closes the dialog. Use it for "Cancel" or "Close" actions. */
function DialogClose({ className, variant = "secondary", size, ...props }: ButtonPartProps<BaseDialog.Close.Props>) {
  return <BaseDialog.Close data-slot="dialog-close" className={buttonClassName({ variant, size, className })} {...props} />;
}

export interface DialogContentProps extends Omit<BaseDialog.Popup.Props, "className"> {
  className?: string;
  /** Show the "×" close button in the top corner. Default: `true`. */
  showCloseButton?: boolean;
  /** Accessible name of the "×" button. Default: "Close" (or the AksoLocaleProvider text). */
  closeLabel?: string;
}

/**
 * The dialog window, with its backdrop. Must contain a `DialogTitle`.
 *
 * Layout: the viewport scrolls vertically when the content is taller than the screen,
 * so nothing is cut off at 320px wide or at 400% zoom.
 */
function DialogContent({ className, children, showCloseButton = true, closeLabel, ref, ...props }: DialogContentProps) {
  const messages = useAksoMessages();
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
      <BaseDialog.Backdrop data-slot="dialog-backdrop" className={modalBackdropClassName} />
      <BaseDialog.Viewport data-slot="dialog-viewport" className={modalViewportClassName}>
        <BaseDialog.Popup
          ref={setRefs}
          data-slot="dialog-content"
          className={cn(modalPopupClassName, className)}
          {...props}
        >
          {children}
          {showCloseButton ? (
            // Last in the DOM so the title is read first and Tab reaches the main actions first.
            <BaseDialog.Close
              data-slot="dialog-close-icon"
              className={buttonClassName({
                variant: "ghost",
                size: "icon",
                className: "absolute top-2 right-2 text-akso-muted-foreground hover:not-data-disabled:text-akso-foreground",
              })}
            >
              <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
              <span className="sr-only">{closeLabel ?? messages.close}</span>
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
      className={cn(modalFooterClassName, className)}
      {...props}
    />
  );
}

/** Required. Gives the dialog its accessible name (rendered as `<h2>`). */
function DialogTitle({ className, ...props }: Omit<BaseDialog.Title.Props, "className"> & { className?: string }) {
  return <BaseDialog.Title data-slot="dialog-title" className={cn(modalTitleClassName, className)} {...props} />;
}

/** Optional. Read by screen readers after the title. Keep it short. */
function DialogDescription({ className, ...props }: Omit<BaseDialog.Description.Props, "className"> & { className?: string }) {
  return <BaseDialog.Description data-slot="dialog-description" className={cn(modalDescriptionClassName, className)} {...props} />;
}

/* -------------------------------------------------------------------------- */
/* Development warning                                                         */
/* -------------------------------------------------------------------------- */

/** Logs an error in development when the dialog has no accessible name. */
function useWarnIfUnlabelled(ref: React.RefObject<HTMLElement | null>) {
  const warned = React.useRef(false);
  // Runs once when the popup mounts. Base UI links the title after its own effects, so the check
  // waits one frame. It must not be re-scheduled on every render: while the popup animates it
  // re-renders often, and cancelling the frame each time could stop the check from ever running.
  React.useEffect(() => {
    if (!isDevelopment() || warned.current) return;
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
  }, [ref]);
}

export { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger };
