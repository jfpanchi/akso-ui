import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarLink, ToolbarSeparator, ToolbarToggle, ToolbarToggleGroup } from "./toolbar";

afterEach(() => vi.restoreAllMocks());

function Formatting() {
  return (
    <Toolbar aria-label="Text formatting">
      <ToolbarToggleGroup aria-label="Text style" multiple>
        <ToolbarToggle value="bold" size="icon" aria-label="Bold" />
        <ToolbarToggle value="italic" size="icon" aria-label="Italic" />
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

describe("Toolbar", () => {
  describe("axe", () => {
    it("has no violations", async () => {
      render(
        <main>
          <Formatting />
        </main>,
      );
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("is a named toolbar with groups, separators, toggles and buttons", () => {
      render(<Formatting />);
      expect(screen.getByRole("toolbar", { name: "Text formatting" })).toHaveAttribute("aria-orientation", "horizontal");
      expect(screen.getByRole("group", { name: "Text style" })).toBeInTheDocument();
      expect(screen.getAllByRole("separator")).toHaveLength(2);
      expect(screen.getByRole("button", { name: "Bold", pressed: false })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Help" })).toBeInTheDocument();
    });

    it("a disabled button stays focusable and says it is unavailable", () => {
      render(<Formatting />);
      const undo = screen.getByRole("button", { name: "Undo" });
      expect(undo).toHaveAttribute("aria-disabled", "true");
      expect(undo).not.toHaveAttribute("disabled");
    });

    it("toggles use the Akso pressed style (not color alone)", async () => {
      const user = userEvent.setup();
      render(<Formatting />);
      const bold = screen.getByRole("button", { name: "Bold" });
      await user.click(bold);
      expect(bold).toHaveAttribute("aria-pressed", "true");
      expect(bold.className).toContain("data-pressed:after:h-0.5");
    });

    it("logs an error in development when the toolbar has no name", () => {
      const error = vi.spyOn(console, "error").mockImplementation(() => {});
      render(
        <Toolbar>
          <ToolbarButton>Save</ToolbarButton>
        </Toolbar>,
      );
      expect(error).toHaveBeenCalledWith(expect.stringContaining("Toolbar has no accessible name"));
    });
  });

  describe("keyboard", () => {
    it("is one Tab stop; arrows move through every control, across groups", async () => {
      const user = userEvent.setup();
      render(
        <>
          <Formatting />
          <button type="button">After</button>
        </>,
      );
      await user.tab();
      expectFocused(screen.getByRole("button", { name: "Bold" }));
      await user.keyboard("{ArrowRight}");
      expectFocused(screen.getByRole("button", { name: "Italic" }));
      await user.keyboard("{ArrowRight}");
      expectFocused(screen.getByRole("button", { name: "Undo" }));
      await user.keyboard("{ArrowRight}{ArrowRight}");
      expectFocused(screen.getByRole("link", { name: "Help" }));
      await user.keyboard("{ArrowRight}");
      // loopFocus: from the last control back to the first.
      expectFocused(screen.getByRole("button", { name: "Bold" }));
      await user.keyboard(" ");
      expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute("aria-pressed", "true");
      await user.tab();
      expectFocused(screen.getByRole("button", { name: "After" }));
    });
  });

  describe("styles that e2e tests check further", () => {
    it("44px controls with focus rings; wraps on narrow screens; nothing animated without motion-safe", () => {
      render(<Formatting />);
      expect(screen.getByRole("toolbar").className).toContain("flex-wrap");
      for (const name of ["Bold", "Redo"]) {
        const el = screen.getByRole("button", { name });
        expect(el.className).toMatch(/min-h-11|size-11/);
        expect(el.className).toContain("focus-visible:outline-2");
      }
      expect(screen.getByRole("link").className).toContain("min-h-11");
      for (const el of document.querySelectorAll<HTMLElement>('[data-slot^="toolbar"]')) {
        for (const token of el.className.split(/\s+/)) {
          if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
        }
      }
    });
  });
});
