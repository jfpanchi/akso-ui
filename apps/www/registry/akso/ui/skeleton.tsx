"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { announce, useAnnouncerRegion } from "@/registry/akso/lib/akso-form";
import { useAksoMessages } from "@/registry/akso/lib/akso-locale";

/*
 * Akso UI · Skeleton
 *
 * Grey shapes that hold the place of content while it loads. There is no Base UI part for this.
 *
 * Shapes say nothing to screen readers, so the shapes are hidden and the loading state is
 * given in words instead:
 * - <SkeletonContainer loading> marks the area with aria-busy="true" and holds a visually hidden
 *   text ("Loading", or your `label`, like "Loading orders") that screen readers can find.
 * - If loading takes more than a second, the label is announced once, and "Loaded" is announced
 *   when the content is ready. Quick loads stay silent, so there is no noise.
 * - <Skeleton> is always aria-hidden. Its pulse uses motion-safe:, so it stops with
 *   prefers-reduced-motion, and it keeps a border in Windows high contrast.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

const ANNOUNCE_AFTER_MS = 1000;

/** A grey shape that holds the place of content. Hidden from screen readers. */
function Skeleton({ className, ...props }: Omit<React.ComponentProps<"div">, "children">) {
  return (
    <div
      aria-hidden="true"
      data-slot="skeleton"
      className={cn("rounded-md bg-akso-surface-hover motion-safe:animate-pulse forced-colors:border", className)}
      {...props}
    />
  );
}

export interface SkeletonContainerProps extends React.ComponentProps<"div"> {
  /** True while the content loads: show `fallback` (the skeletons) instead of `children`. */
  loading: boolean;
  /** The skeletons to show while loading. */
  fallback: React.ReactNode;
  /** What is loading, for screen readers. Default: "Loading" (or the AksoLocaleProvider text). */
  label?: string;
  /** Announced when loading ends (only if loading was announced). Default: "Loaded". */
  loadedLabel?: string;
}

/** Shows skeletons while `loading`, and tells screen readers what is happening. */
function SkeletonContainer({ loading, fallback, label, loadedLabel, children, className, ...props }: SkeletonContainerProps) {
  const messages = useAksoMessages();
  const text = label ?? messages.loading;
  const doneText = loadedLabel ?? messages.loaded;
  const announced = React.useRef(false);
  useAnnouncerRegion();

  React.useEffect(() => {
    if (loading) {
      announced.current = false;
      const timer = setTimeout(() => {
        announced.current = true;
        announce(text);
      }, ANNOUNCE_AFTER_MS);
      return () => clearTimeout(timer);
    }
    if (announced.current) {
      announced.current = false;
      announce(doneText);
    }
    return undefined;
  }, [loading, text, doneText]);

  return (
    <div data-slot="skeleton-container" aria-busy={loading || undefined} className={className} {...props}>
      {loading ? (
        <>
          <span className="sr-only">{text}</span>
          {fallback}
        </>
      ) : (
        children
      )}
    </div>
  );
}

export { Skeleton, SkeletonContainer };
