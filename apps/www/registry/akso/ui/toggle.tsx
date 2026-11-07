"use client";

import * as React from "react";
import { Toggle as BaseToggle } from "@base-ui/react/toggle";

import { toggleClassName, warnIfUnnamed, type ToggleSize } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Toggle
 *
 * Built on @base-ui/react/toggle: a native <button> with aria-pressed, which Base UI
 * keeps in sync. Screen readers say "pressed" or "not pressed".
 * This file adds:
 * - a pressed style that does not depend on color alone (fill + a bar along the bottom),
 *   and system colors in Windows high contrast;
 * - 44×44px targets by default;
 * - an error in development when the toggle has no accessible name (icon-only toggles).
 *
 * Keep the name the same when the state changes ("Bold", not "Bold on" / "Bold off"):
 * aria-pressed already says the state.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface ToggleProps extends Omit<BaseToggle.Props, "className"> {
  className?: string;
  /** `icon` is a 44×44px square: give it an `aria-label`. */
  size?: ToggleSize;
}

/** A button that stays on or off, like "Bold" in a text editor or "Mute". */
function Toggle({ size = "default", className, ref, ...props }: ToggleProps) {
  const innerRef = React.useRef<HTMLButtonElement | null>(null);
  const setRefs = React.useCallback(
    (node: HTMLButtonElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );
  React.useEffect(() => {
    warnIfUnnamed(innerRef.current, "Toggle", 'Add text, or an aria-label for icon-only toggles (size="icon").');
  }, []);

  return <BaseToggle ref={setRefs} data-slot="toggle" className={toggleClassName({ size, className })} {...props} />;
}

export { Toggle };
