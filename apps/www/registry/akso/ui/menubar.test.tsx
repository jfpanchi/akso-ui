import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "./menubar";

afterEach(() => vi.restoreAllMocks());

function Editor({ onCopy = () => {} }: { onCopy?: () => void }) {
  return (
    <Menubar aria-label="Editor">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New</MenubarItem>
          <MenubarItem>Open</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={onCopy}>Copy</MenubarItem>
          <MenubarCheckboxItem defaultChecked>Wrap lines</MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

describe("Menubar", () => {
  describe("axe", () => {
    it("has no violations closed and with a menu open", async () => {
      const user = userEvent.setup();
      render(
        <main>
          <Editor />
        </main>,
      );
      await expectNoA11yViolations(document.body);
      await user.click(screen.getByRole("menuitem", { name: "File" }));
      await screen.findByRole("menu");
      await expectNoA11yViolations(document.body, { disableRules: ["region"] /* portaled popup */ });
    });
  });

  describe("name, role and state", () => {
    it("is a named menubar whose top-level items are menuitems with aria-haspopup", () => {
      render(<Editor />);
      const bar = screen.getByRole("menubar", { name: "Editor" });
      expect(bar).toHaveAttribute("aria-orientation", "horizontal");
      const file = screen.getByRole("menuitem", { name: "File" });
      expect(file).toHaveAttribute("aria-haspopup", "menu");
      expect(file).toHaveAttribute("aria-expanded", "false");
    });

    it("logs an error in development when the menubar has no name", () => {
      const error = vi.spyOn(console, "error").mockImplementation(() => {});
      render(
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
          </MenubarMenu>
        </Menubar>,
      );
      expect(error).toHaveBeenCalledWith(expect.stringContaining("Menubar has no accessible name"));
    });
  });

  describe("keyboard", () => {
    it("one Tab stop; → moves between menus; ↓ opens one; Enter runs an item; focus returns", async () => {
      const onCopy = vi.fn();
      const user = userEvent.setup();
      render(
        <>
          <Editor onCopy={onCopy} />
          <button type="button">After</button>
        </>,
      );
      await user.tab();
      expectFocused(screen.getByRole("menuitem", { name: "File" }));
      await user.keyboard("{ArrowRight}");
      const edit = screen.getByRole("menuitem", { name: "Edit" });
      expectFocused(edit);
      await user.keyboard("{ArrowDown}");
      await screen.findByRole("menu");
      expect(edit).toHaveAttribute("aria-expanded", "true");
      expectFocused(screen.getByRole("menuitem", { name: "Copy" }));
      await user.keyboard("{Enter}");
      expect(onCopy).toHaveBeenCalled();
      expect(screen.queryByRole("menu")).toBeNull();
      expectFocused(edit);
      await user.tab();
      expectFocused(screen.getByRole("button", { name: "After" }));
    });

    it("Escape closes the open menu and focus returns to its trigger", async () => {
      const user = userEvent.setup();
      render(<Editor />);
      await user.tab();
      await user.keyboard("{ArrowDown}");
      await screen.findByRole("menu");
      await user.keyboard("{Escape}");
      expect(screen.queryByRole("menu")).toBeNull();
      expectFocused(screen.getByRole("menuitem", { name: "File" }));
    });
  });

  describe("styles that e2e tests check further", () => {
    it("44px triggers with a focus ring; the bar wraps; motion is guarded", () => {
      render(<Editor />);
      const file = screen.getByRole("menuitem", { name: "File" });
      expect(file.className).toContain("min-h-11");
      expect(file.className).toContain("focus-visible:outline-2");
      expect(screen.getByRole("menubar").className).toContain("flex-wrap");
      for (const el of document.querySelectorAll<HTMLElement>('[data-slot^="menubar"]')) {
        for (const token of el.className.split(/\s+/)) {
          if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
        }
      }
    });
  });
});
