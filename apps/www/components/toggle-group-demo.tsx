"use client";

import { ToggleGroup, ToggleGroupItem } from "@/registry/akso/ui/toggle-group";

function Icon({ d }: { d: string }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

/** Demo used by the docs page and by the e2e tests. */
export function ToggleGroupDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p id="alignment-label" className="font-medium">
          Text alignment
        </p>
        {/* One choice at a time. */}
        <ToggleGroup aria-labelledby="alignment-label" defaultValue={["left"]}>
          <ToggleGroupItem value="left">Left</ToggleGroupItem>
          <ToggleGroupItem value="center">Center</ToggleGroupItem>
          <ToggleGroupItem value="right">Right</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="flex flex-col gap-2">
        <p id="style-label" className="font-medium">
          Text style
        </p>
        {/* Several at once. */}
        <ToggleGroup aria-labelledby="style-label" multiple defaultValue={["bold"]}>
          <ToggleGroupItem value="bold" size="icon" aria-label="Bold">
            <Icon d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" size="icon" aria-label="Italic">
            <Icon d="M14 5h-4M14 19h-4M14 5l-4 14" />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" size="icon" aria-label="Underline">
            <Icon d="M7 5v6a5 5 0 0 0 10 0V5M5 20h14" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
