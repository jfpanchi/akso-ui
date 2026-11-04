"use client";

import * as React from "react";
import { Toast as BaseToast } from "@base-ui/react/toast";

import { cn } from "@/lib/utils";
import { defaultStatusLabels, StatusIcon, statusBorderClassName, type Status } from "@/registry/akso/lib/akso-status";
import { buttonClassName } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Toast
 *
 * Built on @base-ui/react/toast. Base UI announces toasts (politely, or urgently with
 * priority "high"), pauses the timers while a toast has focus or the pointer, or when the
 * window loses focus, and lets people press F6 to jump to the notifications region.
 *
 * This file adds safer defaults (WCAG 2.2.1 Timing Adjustable):
 * - errors and toasts with an action button do not disappear on their own;
 * - other toasts stay 6 seconds, longer than the 5-second Base UI default;
 * - toasts are listed one under another, all visible, instead of stacked on top of each other;
 * - each status has an icon shape and a hidden status word, not only a color.
 *
 * Do not put information that people need only in a toast: it can be missed.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Time in ms before info, success and warning toasts close. Default: 6000. */
  timeout?: number;
  /** Maximum number of toasts shown at once. Default: 3. */
  limit?: number;
  /** Accessible name of the close button on each toast. Default: "Dismiss". */
  closeLabel?: string;
  /** Hidden status words read before each toast title. */
  statusLabels?: Partial<Record<Status, string>>;
}

const ToastSettings = React.createContext<{ closeLabel: string; statusLabels: Record<Status, string> }>({
  closeLabel: "Dismiss",
  statusLabels: defaultStatusLabels,
});

/** Wrap your app once. Toasts added with `useToast()` appear in its notifications region. */
function ToastProvider({ children, timeout = 6000, limit = 3, closeLabel = "Dismiss", statusLabels }: ToastProviderProps) {
  const settings = React.useMemo(() => ({ closeLabel, statusLabels: { ...defaultStatusLabels, ...statusLabels } }), [closeLabel, statusLabels]);
  return (
    <BaseToast.Provider timeout={timeout} limit={limit}>
      <ToastSettings.Provider value={settings}>
        {children}
        <BaseToast.Portal>
          <BaseToast.Viewport
            data-slot="toast-viewport"
            className="fixed right-4 bottom-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col-reverse gap-3 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-akso-focus-ring"
          >
            <ToastList />
          </BaseToast.Viewport>
        </BaseToast.Portal>
      </ToastSettings.Provider>
    </BaseToast.Provider>
  );
}

function ToastList() {
  const { toasts } = BaseToast.useToastManager();
  const { closeLabel, statusLabels } = React.useContext(ToastSettings);
  return toasts.map((toast) => {
    const status = (toast.type as Status | undefined) ?? "info";
    return (
      <BaseToast.Root
        key={toast.id}
        toast={toast}
        data-slot="toast"
        data-status={status}
        className={cn(
          "relative w-full rounded-md border border-l-4 border-akso-border bg-akso-surface text-akso-foreground shadow-lg",
          statusBorderClassName[status] ?? statusBorderClassName.info,
          "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-akso-focus-ring",
          "data-limited:hidden",
          "motion-safe:transition-[opacity,translate] motion-safe:duration-200",
          "data-starting-style:translate-y-2 data-starting-style:opacity-0 data-ending-style:opacity-0",
        )}
      >
        <BaseToast.Content data-slot="toast-content" className="flex items-start gap-3 p-4 pr-14">
          <StatusIcon status={statusLabels[status] ? status : "info"} className="mt-0.5" />
          <div className="flex min-w-0 flex-1 flex-col gap-1 break-words">
            <p className="font-semibold">
              <span className="sr-only">{statusLabels[status] ?? statusLabels.info}: </span>
              <BaseToast.Title data-slot="toast-title" render={<span />} />
            </p>
            <BaseToast.Description data-slot="toast-description" className="text-base text-akso-muted-foreground" />
            {toast.actionProps ? (
              <div className="mt-2">
                <BaseToast.Action data-slot="toast-action" className={buttonClassName({ variant: "secondary", size: "sm" })} />
              </div>
            ) : null}
          </div>
          <BaseToast.Close
            data-slot="toast-close"
            aria-label={closeLabel}
            className={buttonClassName({ variant: "ghost", size: "icon", className: "absolute top-1.5 right-1.5 text-akso-muted-foreground" })}
          >
            <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </BaseToast.Close>
        </BaseToast.Content>
      </BaseToast.Root>
    );
  });
}

type BaseAddOptions = Parameters<ReturnType<typeof BaseToast.useToastManager>["add"]>[0];

export interface ToastOptions extends Omit<BaseAddOptions, "type"> {
  /** Default: "info". Errors are announced urgently and stay until dismissed. */
  type?: Status;
}

/**
 * Shows toasts. `toast.add({ title, description, type })` returns the toast id.
 * Errors and toasts with `actionProps` stay until dismissed unless you pass `timeout`.
 */
function useToast() {
  const manager = BaseToast.useToastManager();
  const add = React.useCallback(
    (options: ToastOptions) => {
      const type = options.type ?? "info";
      const stays = type === "error" || options.actionProps !== undefined;
      return manager.add({
        priority: type === "error" ? "high" : "low",
        ...(stays ? { timeout: 0 } : {}),
        ...options,
        type,
      });
    },
    [manager],
  );
  return { ...manager, add };
}

export { ToastProvider, useToast };
