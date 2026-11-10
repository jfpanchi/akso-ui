import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it, vi } from "vitest";

import { ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "./context-menu";

function FileCard({ onRename = () => {} }: { onRename?: () => void }) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <a href="#report">Annual report.pdf</a>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Open</ContextMenuItem>
        <ContextMenuItem onClick={onRename}>Rename</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem defaultChecked>Show details</ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

describe("ContextMenu", () => {
  describe("axe", () => {
    it("has no violations closed and open", async () => {
      render(
        <main>
          <FileCard />
        </main>,
      );
      await expectNoA11yViolations(document.body);
      fireEvent.contextMenu(screen.getByRole("link"));
      await screen.findByRole("menu");
      // The popup is portaled outside <main> in this test; e2e checks the real page.
      await expectNoA11yViolations(document.body, { disableRules: ["region"] /* portaled popup */ });
    });
  });

  describe("name, role and state", () => {
    it("a right-click opens a menu with menuitems; checkbox items say whether they are checked", async () => {
      render(<FileCard />);
      expect(screen.queryByRole("menu")).toBeNull();
      fireEvent.contextMenu(screen.getByRole("link"));
      const menu = await screen.findByRole("menu");
      expect(menu).toBeInTheDocument();
      expect(screen.getAllByRole("menuitem").map((i) => i.textContent)).toEqual(["Open", "Rename"]);
      expect(screen.getByRole("menuitemcheckbox", { name: "Show details" })).toHaveAttribute("aria-checked", "true");
      expect(screen.getByRole("separator")).toBeInTheDocument();
    });
  });

  describe("keyboard", () => {
    it("the contextmenu event from a focused element opens it (Shift+F10 / Menu key); arrows, Enter and Escape work", async () => {
      const onRename = vi.fn();
      const user = userEvent.setup();
      render(<FileCard onRename={onRename} />);
      const link = screen.getByRole("link");
      await user.tab();
      expectFocused(link);
      // Browsers fire "contextmenu" on the focused element for Shift+F10 and the Menu key.
      fireEvent.contextMenu(link);
      await screen.findByRole("menu");
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");
      expectFocused(screen.getByRole("menuitem", { name: "Rename" }));
      await user.keyboard("{Enter}");
      expect(onRename).toHaveBeenCalled();
      expect(screen.queryByRole("menu")).toBeNull();
    });

    it("Escape closes it", async () => {
      const user = userEvent.setup();
      render(<FileCard />);
      fireEvent.contextMenu(screen.getByRole("link"));
      await screen.findByRole("menu");
      await user.keyboard("{Escape}");
      expect(screen.queryByRole("menu")).toBeNull();
    });
  });

  describe("styles that e2e tests check further", () => {
    it("items are 44px with a highlight ring; motion is guarded", async () => {
      render(<FileCard />);
      fireEvent.contextMenu(screen.getByRole("link"));
      const item = await screen.findByRole("menuitem", { name: "Open" });
      expect(item.className).toContain("min-h-11");
      for (const el of document.querySelectorAll<HTMLElement>('[data-slot^="context-menu"]')) {
        for (const token of el.className.split(/\s+/)) {
          if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
        }
      }
    });
  });
});
