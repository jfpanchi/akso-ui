import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

afterEach(() => vi.restoreAllMocks());

function Alignment(props: { multiple?: boolean; onValueChange?: (value: string[]) => void }) {
  return (
    <ToggleGroup aria-label="Text alignment" defaultValue={["left"]} {...props}>
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right" disabled>
        Right
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

describe("ToggleGroup", () => {
  describe("axe", () => {
    it("has no violations, single and multiple", async () => {
      render(
        <main>
          <Alignment />
          <ToggleGroup aria-label="Text style" multiple defaultValue={["bold", "italic"]}>
            <ToggleGroupItem value="bold" size="icon" aria-label="Bold" />
            <ToggleGroupItem value="italic" size="icon" aria-label="Italic" />
          </ToggleGroup>
        </main>,
      );
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("is a named group of buttons with aria-pressed", () => {
      render(<Alignment />);
      const group = screen.getByRole("group", { name: "Text alignment" });
      expect(group).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Left", pressed: true })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Center", pressed: false })).toBeInTheDocument();
    });

    it("without multiple, pressing one releases the other", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Alignment onValueChange={onValueChange} />);
      await user.click(screen.getByRole("button", { name: "Center" }));
      expect(screen.getByRole("button", { name: "Center" })).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByRole("button", { name: "Left" })).toHaveAttribute("aria-pressed", "false");
      expect(onValueChange).toHaveBeenLastCalledWith(["center"], expect.anything());
    });

    it("with multiple, several can be pressed", async () => {
      const user = userEvent.setup();
      render(<Alignment multiple />);
      await user.click(screen.getByRole("button", { name: "Center" }));
      expect(screen.getByRole("button", { name: "Left" })).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByRole("button", { name: "Center" })).toHaveAttribute("aria-pressed", "true");
    });

    it("logs an error in development when the group has no name", () => {
      const error = vi.spyOn(console, "error").mockImplementation(() => {});
      render(
        <ToggleGroup>
          <ToggleGroupItem value="a">A</ToggleGroupItem>
        </ToggleGroup>,
      );
      expect(error).toHaveBeenCalledWith(expect.stringContaining("ToggleGroup has no accessible name"));
    });
  });

  describe("keyboard", () => {
    it("Tab enters on one button and leaves the group; arrows move between buttons", async () => {
      const user = userEvent.setup();
      render(
        <>
          <Alignment />
          <button type="button">After</button>
        </>,
      );
      await user.tab();
      expectFocused(screen.getByRole("button", { name: "Left" }));
      await user.keyboard("{ArrowRight}");
      expectFocused(screen.getByRole("button", { name: "Center" }));
      await user.keyboard(" ");
      expect(screen.getByRole("button", { name: "Center" })).toHaveAttribute("aria-pressed", "true");
      await user.tab();
      expectFocused(screen.getByRole("button", { name: "After" }));
    });
  });

  describe("styles that e2e tests check further", () => {
    it("items are 44px with a focus ring; the group wraps on narrow screens", () => {
      render(<Alignment />);
      const item = screen.getByRole("button", { name: "Left" });
      expect(item.className).toContain("min-h-11");
      expect(item.className).toContain("focus-visible:outline-2");
      expect(screen.getByRole("group").className).toContain("flex-wrap");
    });
  });
});
