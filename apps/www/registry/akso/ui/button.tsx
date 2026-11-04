"use client";

import * as React from "react";
import { Button as BaseButton } from "@base-ui/react/button";

import { buttonClassName, isDevelopment, type ButtonSize, type ButtonVariant } from "@/registry/akso/lib/akso-styles";

export { buttonClassName, focusRingClassName, type ButtonSize, type ButtonVariant } from "@/registry/akso/lib/akso-styles";
import { useAksoMessages } from "@/registry/akso/lib/akso-locale";

/*
 * Akso UI · Button
 *
 * Built on @base-ui/react/button. Base UI provides the button semantics,
 * keyboard handling and the disabled state (including `focusableWhenDisabled`).
 * This file adds styles, sizes and a loading state that follows the pattern
 * recommended in the Base UI docs ("Loading states").
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface ButtonProps extends Omit<BaseButton.Props, "className"> {
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /**
   * Shows a spinner and `loadingText`, and disables the button while keeping it focusable,
   * so keyboard and screen reader users do not lose their place.
   */
  loading?: boolean;
  /** Text shown and announced while `loading`. Default: "Loading" (or the AksoLocaleProvider text). */
  loadingText?: string;
}

/**
 * A button. Defaults to `type="button"`: pass `type="submit"` for form submit buttons.
 *
 * Icon-only buttons (`size="icon"`) need a name: add `aria-label` or visually hidden text.
 */
function Button({
  variant = "secondary",
  size = "default",
  loading,
  loadingText,
  disabled,
  focusableWhenDisabled,
  className,
  children,
  type = "button",
  ref,
  ...props
}: ButtonProps) {
  const messages = useAksoMessages();
  const loadingLabel = loadingText ?? messages.loading;
  const labelId = React.useId();
  const innerRef = React.useRef<HTMLButtonElement | null>(null);
  useWarnIfUnnamed(innerRef);

  const setRefs = React.useCallback(
    (node: HTMLButtonElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  // Loading pattern from the Base UI docs: keep focus on the button while it is disabled,
  // and point aria-labelledby at the changing text so every screen reader announces it.
  // Only used when the `loading` prop is set and no name was given explicitly.
  const usesLoadingPattern = loading !== undefined && props["aria-label"] === undefined && props["aria-labelledby"] === undefined;

  return (
    <BaseButton
      ref={setRefs}
      data-slot="button"
      type={type}
      disabled={disabled || loading}
      focusableWhenDisabled={loading ? true : focusableWhenDisabled}
      aria-labelledby={usesLoadingPattern ? labelId : undefined}
      className={buttonClassName({ variant, size, className })}
      {...props}
    >
      {loading ? (
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 24 24"
          className="size-4 shrink-0 motion-safe:animate-spin"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <path d="M12 3a9 9 0 1 0 9 9" />
        </svg>
      ) : null}
      {usesLoadingPattern ? <span id={labelId}>{loading ? loadingLabel : children}</span> : loading ? loadingLabel : children}
    </BaseButton>
  );
}

/** Logs an error in development when the button has no accessible name (for example, an icon without a label). */
function useWarnIfUnnamed(ref: React.RefObject<HTMLElement | null>) {
  const warned = React.useRef(false);
  React.useEffect(() => {
    if (!isDevelopment() || warned.current) return;
    const el = ref.current;
    if (!el) return;
    const labelledBy = el.getAttribute("aria-labelledby");
    const name =
      el.getAttribute("aria-label")?.trim() ||
      (labelledBy ? el.ownerDocument.getElementById(labelledBy)?.textContent?.trim() : "") ||
      el.textContent?.trim();
    if (!name) {
      warned.current = true;
      console.error(
        "[Akso UI] Button has no accessible name. Add text, an aria-label, or visually hidden text (className=\"sr-only\") for icon-only buttons.",
      );
    }
  });
}

export { Button };
