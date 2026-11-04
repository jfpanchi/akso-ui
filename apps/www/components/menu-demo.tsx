"use client";

import { useState } from "react";
import { LiveRegion } from "akso-ui";
import { Menu, MenuCheckboxItem, MenuContent, MenuGroup, MenuGroupLabel, MenuItem, MenuRadioGroup, MenuRadioItem, MenuSeparator, MenuTrigger } from "@/registry/akso/ui/menu";

/** Demo used by the docs page and by the e2e tests. */
export function MenuDemo() {
  const [status, setStatus] = useState("");
  return (
    <div className="flex flex-col items-start gap-3">
      <Menu>
        <MenuTrigger>File actions</MenuTrigger>
        <MenuContent>
          <MenuItem onClick={() => setStatus("Rename chosen.")}>Rename</MenuItem>
          <MenuItem onClick={() => setStatus("Duplicate chosen.")}>Duplicate</MenuItem>
          <MenuItem disabled>Move (not available)</MenuItem>
          <MenuSeparator />
          <MenuCheckboxItem defaultChecked>Show hidden files</MenuCheckboxItem>
          <MenuGroup>
            <MenuGroupLabel>Sort by</MenuGroupLabel>
            <MenuRadioGroup defaultValue="name">
              <MenuRadioItem value="name">Name</MenuRadioItem>
              <MenuRadioItem value="date">Date</MenuRadioItem>
            </MenuRadioGroup>
          </MenuGroup>
        </MenuContent>
      </Menu>
      <LiveRegion message={status} visible />
    </div>
  );
}
