import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it, vi } from "vitest";

import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "./menu";

function FileMenu({ onRename = () => {} }: { onRename?: () => void }) {
  return (
    <main>
      <Menu>
        <MenuTrigger>File</MenuTrigger>
        <MenuContent>
          <MenuItem onClick={onRename}>Rename</MenuItem>
          <MenuItem>Duplicate</MenuItem>
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
    </main>
  );
}

async function openWithKeyboard(onRename?: () => void) {
  const user = userEvent.setup();
  render(<FileMenu onRename={onRename} />);
  const trigger = screen.getByRole("button", { name: "File" });
  trigger.focus();
  await user.keyboard("{Enter}");
  const menu = await screen.findByRole("menu");
  return { user, trigger, menu };
}

describe("Menu", () => {
  describe("axe", () => {
    it("has no violations closed and open", async () => {
      render(<FileMenu />);
      await expectNoA11yViolations(document.body);
      cleanup();
      await openWithKeyboard();
      await expectNoA11yViolations(document.body, { disableRules: ["region"] /* portaled popup */ });
    });
  });

  describe("name, role and state", () => {
    it("exposes menu, menuitem, menuitemcheckbox and menuitemradio with their states", async () => {
      const { trigger } = await openWithKeyboard();
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(screen.getByRole("menuitem", { name: "Rename" })).toBeInTheDocument();
      expect(screen.getByRole("menuitemcheckbox", { name: "Show hidden files" })).toHaveAttribute("aria-checked", "true");
      expect(screen.getByRole("menuitemradio", { name: "Name" })).toHaveAttribute("aria-checked", "true");
      expect(screen.getByRole("group", { name: "Sort by" })).toBeInTheDocument();
    });

    it("checked items show a check mark or dot, not only color", async () => {
      await openWithKeyboard();
      expect(screen.getByRole("menuitemcheckbox").querySelector("svg")).toHaveAttribute("aria-hidden", "true");
      expect(screen.getByRole("menuitemradio", { name: "Name" }).querySelector(".rounded-full")).not.toBeNull();
    });
  });

  describe("keyboard", () => {
    it("Enter opens it on the first item; arrows move; disabled items are reachable (ARIA APG) but marked", async () => {
      const { user } = await openWithKeyboard();
      await waitFor(() => expectFocused(screen.getByRole("menuitem", { name: "Rename" })));
      await user.keyboard("{ArrowDown}");
      expectFocused(screen.getByRole("menuitem", { name: "Duplicate" }));
      await user.keyboard("{ArrowDown}");
      const move = screen.getByRole("menuitem", { name: "Move (not available)" });
      expectFocused(move);
      expect(move).toHaveAttribute("aria-disabled", "true");
      await user.keyboard("{Enter}");
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("Enter on an item runs it, closes the menu and returns focus to the trigger", async () => {
      const onRename = vi.fn();
      const { user, trigger } = await openWithKeyboard(onRename);
      await waitFor(() => expectFocused(screen.getByRole("menuitem", { name: "Rename" })));
      await user.keyboard("{Enter}");
      expect(onRename).toHaveBeenCalledTimes(1);
      await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
      expectFocused(trigger);
    });

    it("Escape closes it and returns focus to the trigger", async () => {
      const { user, trigger } = await openWithKeyboard();
      await user.keyboard("{Escape}");
      await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
      expectFocused(trigger);
    });

    it("typing a letter jumps to the matching item", async () => {
      const { user } = await openWithKeyboard();
      await user.keyboard("d");
      await waitFor(() => expectFocused(screen.getByRole("menuitem", { name: "Duplicate" })));
    });
  });

  describe("styles that e2e tests check further", () => {
    it("items are 44px, highlight with a ring, and motion is guarded", async () => {
      const { menu } = await openWithKeyboard();
      const item = screen.getByRole("menuitem", { name: "Rename" });
      expect(item.className).toContain("min-h-11");
      expect(item.className).toContain("data-highlighted:outline-2");
      for (const token of menu.className.split(/\s+/)) {
        if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
      }
    });
  });
});
