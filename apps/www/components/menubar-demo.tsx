"use client";

import * as React from "react";
import { LiveRegion } from "akso-ui";

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarGroupLabel,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarSub,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/registry/akso/ui/menubar";

/** Demo used by the docs page and by the e2e tests. */
export function MenubarDemo() {
  const [status, setStatus] = React.useState("");
  const choose = (action: string) => () => setStatus(`${action} chosen.`);
  return (
    <div className="flex flex-col gap-3">
      <Menubar aria-label="Editor">
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={choose("New")}>New</MenubarItem>
            <MenubarItem onClick={choose("Open")}>Open</MenubarItem>
            <MenubarSub>
              <MenubarSubTrigger>Export</MenubarSubTrigger>
              <MenubarContent>
                <MenubarItem onClick={choose("Export as PDF")}>PDF</MenubarItem>
                <MenubarItem onClick={choose("Export as HTML")}>HTML</MenubarItem>
              </MenubarContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem disabled>Undo (nothing to undo)</MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={choose("Copy")}>Copy</MenubarItem>
            <MenubarItem onClick={choose("Paste")}>Paste</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem defaultChecked>Show ruler</MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarGroupLabel>Zoom</MenubarGroupLabel>
              <MenubarRadioGroup defaultValue="100">
                <MenubarRadioItem value="100">100%</MenubarRadioItem>
                <MenubarRadioItem value="150">150%</MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <LiveRegion message={status} visible />
    </div>
  );
}
