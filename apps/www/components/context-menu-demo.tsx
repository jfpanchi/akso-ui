"use client";

import * as React from "react";
import { LiveRegion } from "akso-ui";

import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/registry/akso/ui/context-menu";
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "@/registry/akso/ui/menu";

const actions = ["Open", "Rename", "Download"] as const;

/** Demo used by the docs page and by the e2e tests. */
export function ContextMenuDemo() {
  const [status, setStatus] = React.useState("");
  return (
    <div className="flex max-w-md flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3 rounded-md border border-akso-border bg-akso-surface p-3">
        {/* Right-click, long press, or Shift+F10 on the link opens the context menu. */}
        <ContextMenu>
          <ContextMenuTrigger className="min-w-0 flex-1">
            <a href="#report" className="font-medium text-akso-primary underline underline-offset-2">
              Annual report.pdf
            </a>
            <p className="text-sm text-akso-muted-foreground">PDF, 2.4 MB</p>
          </ContextMenuTrigger>
          <ContextMenuContent>
            {actions.map((action) => (
              <ContextMenuItem key={action} onClick={() => setStatus(`${action} chosen.`)}>
                {action}
              </ContextMenuItem>
            ))}
            <ContextMenuSeparator />
            <ContextMenuItem onClick={() => setStatus("Delete chosen.")}>Delete</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        {/* The same actions with a visible button: a context menu is never the only way. */}
        <Menu>
          <MenuTrigger aria-label="Actions for Annual report.pdf">Actions</MenuTrigger>
          <MenuContent align="end">
            {actions.map((action) => (
              <MenuItem key={action} onClick={() => setStatus(`${action} chosen.`)}>
                {action}
              </MenuItem>
            ))}
            <MenuSeparator />
            <MenuItem onClick={() => setStatus("Delete chosen.")}>Delete</MenuItem>
          </MenuContent>
        </Menu>
      </div>
      <LiveRegion message={status} visible />
    </div>
  );
}
