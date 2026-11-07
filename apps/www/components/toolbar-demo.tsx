"use client";

import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarLink, ToolbarSeparator, ToolbarToggle, ToolbarToggleGroup } from "@/registry/akso/ui/toolbar";

function Icon({ d }: { d: string }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

/** Demo used by the docs page and by the e2e tests. */
export function ToolbarDemo() {
  return (
    <Toolbar aria-label="Text formatting">
      <ToolbarToggleGroup aria-label="Text style" multiple>
        <ToolbarToggle value="bold" size="icon" aria-label="Bold">
          <Icon d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" />
        </ToolbarToggle>
        <ToolbarToggle value="italic" size="icon" aria-label="Italic">
          <Icon d="M14 5h-4M14 19h-4M14 5l-4 14" />
        </ToolbarToggle>
      </ToolbarToggleGroup>
      <ToolbarSeparator />
      <ToolbarToggleGroup aria-label="Alignment" defaultValue={["left"]}>
        <ToolbarToggle value="left">Left</ToolbarToggle>
        <ToolbarToggle value="center">Center</ToolbarToggle>
      </ToolbarToggleGroup>
      <ToolbarSeparator />
      <ToolbarGroup aria-label="History">
        <ToolbarButton disabled>Undo</ToolbarButton>
        <ToolbarButton>Redo</ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarLink href="#help">Help</ToolbarLink>
    </Toolbar>
  );
}
