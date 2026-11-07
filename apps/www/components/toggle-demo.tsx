"use client";

import { Toggle } from "@/registry/akso/ui/toggle";

/** Demo used by the docs page and by the e2e tests. */
export function ToggleDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Toggle>Mute notifications</Toggle>
      <Toggle size="icon" aria-label="Bold" defaultPressed>
        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" />
        </svg>
      </Toggle>
      <Toggle disabled>Autoplay (not available)</Toggle>
    </div>
  );
}
