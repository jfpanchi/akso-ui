import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Toggle } from "./toggle";

afterEach(() => vi.restoreAllMocks());

function expectMotionSafe(el: HTMLElement) {
  for (const token of el.className.split(/\s+/)) {
    if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
  }
}

describe("Toggle", () => {
  describe("axe", () => {
    it("has no violations off, pressed, icon-only and disabled", async () => {
      render(
        <main>
          <Toggle>Mute</Toggle>
          <Toggle defaultPressed>Captions</Toggle>
          <Toggle size="icon" aria-label="Bold">
            <svg aria-hidden="true" />
          </Toggle>
          <Toggle disabled>Autoplay</Toggle>
        </main>,
      );
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("is a button named by its text, with aria-pressed", () => {
      render(<Toggle defaultPressed>Captions</Toggle>);
      expect(screen.getByRole("button", { name: "Captions", pressed: true })).toBeInTheDocument();
    });

    it("keeps the same name when pressed; only aria-pressed changes", async () => {
      const user = userEvent.setup();
      render(<Toggle>Mute</Toggle>);
      const toggle = screen.getByRole("button", { name: "Mute", pressed: false });
      await user.click(toggle);
      expect(screen.getByRole("button", { name: "Mute", pressed: true })).toBe(toggle);
    });

    it("pressed is shown with a bar, not only a color", () => {
      render(<Toggle defaultPressed>Captions</Toggle>);
      const toggle = screen.getByRole("button");
      expect(toggle).toHaveAttribute("data-pressed");
      expect(toggle.className).toContain("data-pressed:after:h-0.5");
      expect(toggle.className).toContain("forced-colors:data-pressed:bg-[Highlight]");
    });

    it("logs an error in development when an icon-only toggle has no name", () => {
      const error = vi.spyOn(console, "error").mockImplementation(() => {});
      render(
        <Toggle size="icon">
          <svg aria-hidden="true" />
        </Toggle>,
      );
      expect(error).toHaveBeenCalledWith(expect.stringContaining("Toggle has no accessible name"));
    });

    it("does not log an error when it has a name", () => {
      const error = vi.spyOn(console, "error").mockImplementation(() => {});
      render(<Toggle size="icon" aria-label="Bold" />);
      expect(error).not.toHaveBeenCalled();
    });
  });

  describe("keyboard", () => {
    it("Tab focuses it; Space and Enter press and release it", async () => {
      const onPressedChange = vi.fn();
      const user = userEvent.setup();
      render(<Toggle onPressedChange={onPressedChange}>Mute</Toggle>);
      await user.tab();
      const toggle = screen.getByRole("button", { name: "Mute" });
      expectFocused(toggle);
      await user.keyboard(" ");
      expect(toggle).toHaveAttribute("aria-pressed", "true");
      await user.keyboard("{Enter}");
      expect(toggle).toHaveAttribute("aria-pressed", "false");
      expect(onPressedChange).toHaveBeenCalledTimes(2);
    });

    it("a disabled toggle cannot be pressed", async () => {
      const user = userEvent.setup();
      render(<Toggle disabled>Autoplay</Toggle>);
      await user.click(screen.getByRole("button", { name: "Autoplay" }));
      expect(screen.getByRole("button", { name: "Autoplay" })).toHaveAttribute("aria-pressed", "false");
    });
  });

  describe("styles that e2e tests check further", () => {
    it("is 44px, has a focus ring, and its transitions are motion-safe", () => {
      render(<Toggle>Mute</Toggle>);
      const toggle = screen.getByRole("button");
      expect(toggle.className).toContain("min-h-11");
      expect(toggle.className).toContain("focus-visible:outline-2");
      expect(toggle.className).not.toMatch(/transition-(all|colors)\b/);
      expectMotionSafe(toggle);
    });
  });
});
