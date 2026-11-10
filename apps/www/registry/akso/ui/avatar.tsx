"use client";

import * as React from "react";
import { Avatar as BaseAvatar } from "@base-ui/react/avatar";

import { cn } from "@/lib/utils";
import { warnIfUnnamed } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Avatar
 *
 * A person's picture, or their initials when there is no picture or it fails to load.
 * Built on @base-ui/react/avatar, which loads the image and swaps in the fallback.
 *
 * Base UI gives the avatar no role and no name: with the image the screen reader reads its
 * alt text, and with the fallback it reads the initials ("L T"), which mean little. This file
 * gives the avatar one name that does not change with the loading state:
 * - By default: role="img" and aria-label={name}. The image and the initials are hidden from
 *   screen readers, so they hear "Laura Torres, image" either way.
 * - With `decorative` (the name is already written next to it): the whole avatar is hidden
 *   from screen readers, so the name is not read twice.
 *
 * Initials use text colors with at least 4.5:1 contrast, and the circle keeps a border in
 * Windows high contrast. No animation.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface AvatarProps extends Omit<BaseAvatar.Root.Props, "className" | "children"> {
  className?: string;
  /** The person's name. It names the avatar and gives the initials. */
  name: string;
  /** Picture URL. Without it (or if it fails to load) the initials are shown. */
  src?: string;
  /** Initials to show instead of the ones taken from `name`. */
  initials?: string;
  /** The name is already written next to the avatar: hide the avatar from screen readers. */
  decorative?: boolean;
  /** 32px, 40px (default) or 56px. */
  size?: "sm" | "md" | "lg";
}

const sizeClassName = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-lg",
} as const;

/** First letter of the first and last words: "Laura Torres Díaz" → "LD". */
export function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const firstLetter = (word: string | undefined) => (word ? (Array.from(word)[0] ?? "") : "");
  const first = firstLetter(words[0]);
  const last = words.length > 1 ? firstLetter(words.at(-1)) : "";
  return (first + last).toLocaleUpperCase();
}

/** A person's picture, or their initials. Pass `decorative` when the name is written next to it. */
function Avatar({ className, name, src, initials, decorative = false, size = "md", ...props }: AvatarProps) {
  const ref = React.useRef<HTMLSpanElement | null>(null);
  React.useEffect(() => {
    if (!decorative) warnIfUnnamed(ref.current, "Avatar", "Pass the person's name in `name`, or `decorative` if it is written next to the avatar.");
  }, [decorative]);

  const text = initials ?? getInitials(name);

  return (
    <BaseAvatar.Root
      ref={ref}
      data-slot="avatar"
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": name.trim() || undefined })}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full align-middle select-none",
        "bg-akso-surface-hover font-semibold text-akso-foreground forced-colors:border",
        sizeClassName[size],
        className,
      )}
      {...props}
    >
      {src ? <BaseAvatar.Image data-slot="avatar-image" src={src} alt="" aria-hidden="true" className="size-full object-cover" /> : null}
      <BaseAvatar.Fallback data-slot="avatar-fallback" delay={src ? 600 : 0} aria-hidden="true" className="flex size-full items-center justify-center">
        {text || (
          <svg viewBox="0 0 24 24" focusable="false" className="size-3/5" fill="currentColor">
            <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4.4 0-8 2.5-8 5.5V21h16v-1.5c0-3-3.6-5.5-8-5.5Z" />
          </svg>
        )}
      </BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
}

export { Avatar };
