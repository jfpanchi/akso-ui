"use client";

import * as React from "react";
import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog";

import { cn } from "@/lib/utils";
import {
  buttonClassName,
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
 * Akso UI · Alert dialog
 *
 * Built on @base-ui/react/alert-dialog: role="alertdialog", a focus trap, Escape to cancel
 * and focus return. Unlike Dialog, clicking outside does not close it, so a decision is never
 * taken by accident. Use it to confirm actions that cannot be undone.
 *
 * Put AlertDialogCancel first in the footer: Base UI focuses the first button, so the safe
 * choice gets focus when it opens (on narrow screens it is shown below the action).
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

function AlertDialog(props: BaseAlertDialog.Root.Props) {
  return <BaseAlertDialog.Root {...props} />;
}

type ButtonPartProps<P> = Omit<P, "className"> & { className?: string; variant?: ButtonVariant; size?: ButtonSize };

/** The button that opens the alert dialog. Focus returns here when it closes. */
function AlertDialogTrigger({ className, variant = "secondary", size, ...props }: ButtonPartProps<BaseAlertDialog.Trigger.Props>) {
  return <BaseAlertDialog.Trigger data-slot="alert-dialog-trigger" className={buttonClassName({ variant, size, className })} {...props} />;
}

/** The dialog window and its backdrop. Must contain an AlertDialogTitle and an AlertDialogDescription. */
function AlertDialogContent({ className, ...props }: Omit<BaseAlertDialog.Popup.Props, "className"> & { className?: string }) {
  return (
    <BaseAlertDialog.Portal>
      <BaseAlertDialog.Backdrop data-slot="alert-dialog-backdrop" className={modalBackdropClassName} />
      <BaseAlertDialog.Viewport data-slot="alert-dialog-viewport" className={modalViewportClassName}>
        <BaseAlertDialog.Popup data-slot="alert-dialog-content" className={cn(modalPopupClassName, className)} {...props} />
      </BaseAlertDialog.Viewport>
    </BaseAlertDialog.Portal>
  );
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-dialog-header" className={cn("flex flex-col gap-1.5", className)} {...props} />;
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-dialog-footer" className={cn(modalFooterClassName, className)} {...props} />;
}

/** Required. A short question, such as "Delete this file?". */
function AlertDialogTitle({ className, ...props }: Omit<BaseAlertDialog.Title.Props, "className"> & { className?: string }) {
  return <BaseAlertDialog.Title data-slot="alert-dialog-title" className={cn(modalTitleClassName, className)} {...props} />;
}

/** Required. Say what will happen, for example "You cannot undo this." */
function AlertDialogDescription({ className, ...props }: Omit<BaseAlertDialog.Description.Props, "className"> & { className?: string }) {
  return <BaseAlertDialog.Description data-slot="alert-dialog-description" className={cn(modalDescriptionClassName, className)} {...props} />;
}

/** The safe choice. Put it first in the footer, so it gets focus when the dialog opens. */
function AlertDialogCancel({ className, variant = "secondary", size, ...props }: ButtonPartProps<BaseAlertDialog.Close.Props>) {
  return <BaseAlertDialog.Close data-slot="alert-dialog-cancel" className={buttonClassName({ variant, size, className })} {...props} />;
}

/** The action being confirmed. Its text says what it does ("Delete file"), not just "OK". */
function AlertDialogAction({ className, variant = "danger", size, ...props }: ButtonPartProps<BaseAlertDialog.Close.Props>) {
  return <BaseAlertDialog.Close data-slot="alert-dialog-action" className={buttonClassName({ variant, size, className })} {...props} />;
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
};
