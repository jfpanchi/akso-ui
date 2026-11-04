"use client";

import { Button } from "@/registry/akso/ui/button";
import { Tooltip, TooltipProvider } from "@/registry/akso/ui/tooltip";

const icon = (d: string) => (
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

/** Demo used by the docs page and by the e2e tests. */
export function TooltipDemo() {
  return (
    <TooltipProvider>
      <div role="toolbar" aria-label="Text formatting" className="flex gap-2">
        <Tooltip content="Bold">
          <Button size="icon" variant="ghost">
            {icon("M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z")}
          </Button>
        </Tooltip>
        <Tooltip content="Italic">
          <Button size="icon" variant="ghost">
            {icon("M10 5h8M6 19h8M14 5l-4 14")}
          </Button>
        </Tooltip>
        <Tooltip content="Save your changes">
          <Button>Save</Button>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
