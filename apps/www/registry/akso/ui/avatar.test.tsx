import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Avatar, getInitials } from "./avatar";

afterEach(() => vi.restoreAllMocks());

describe("Avatar", () => {
  describe("axe", () => {
    it("has no violations: named, decorative, with and without a picture", async () => {
      render(
        <main>
          <Avatar name="Laura Torres" src="/demo/avatar.svg" />
          <Avatar name="Mateo Ruiz" />
          <p>
            <Avatar name="Sam Lee" decorative /> Sam Lee
          </p>
        </main>,
      );
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("is an image named by the person's name; the initials are hidden from screen readers", () => {
      render(<Avatar name="Laura Torres" />);
      const avatar = screen.getByRole("img", { name: "Laura Torres" });
      expect(avatar).toHaveTextContent("LT");
      expect(avatar.querySelector('[data-slot="avatar-fallback"]')).toHaveAttribute("aria-hidden", "true");
    });

    it("keeps the same name while the picture loads", () => {
      render(<Avatar name="Laura Torres" src="/demo/avatar.svg" />);
      expect(screen.getByRole("img", { name: "Laura Torres" })).toBeInTheDocument();
      expect(screen.getAllByRole("img")).toHaveLength(1);
    });

    it("decorative: hidden from screen readers, so the written name is read once", () => {
      render(
        <p>
          <Avatar name="Sam Lee" decorative /> Sam Lee
        </p>,
      );
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
      expect(document.querySelector('[data-slot="avatar"]')).toHaveAttribute("aria-hidden", "true");
    });

    it("initials can be set; without letters a person icon is shown", () => {
      const { rerender } = render(<Avatar name="Laura Torres" initials="LaT" />);
      expect(screen.getByRole("img", { name: "Laura Torres" })).toHaveTextContent("LaT");
      rerender(<Avatar name="Laura Torres" initials="" />);
      expect(document.querySelector('[data-slot="avatar-fallback"] svg')).not.toBeNull();
    });

    it("getInitials takes the first and last words", () => {
      expect(getInitials("Laura Torres Díaz")).toBe("LD");
      expect(getInitials("  ana  ")).toBe("A");
      expect(getInitials("Élise Ørsted")).toBe("ÉØ");
      expect(getInitials("")).toBe("");
    });

    it("logs an error in development without a name", () => {
      const error = vi.spyOn(console, "error").mockImplementation(() => {});
      render(<Avatar name="  " />);
      expect(error).toHaveBeenCalledWith(expect.stringContaining("Avatar has no accessible name"));
    });
  });

  describe("keyboard", () => {
    it("is not focusable; inside a link, the link is named by the avatar", async () => {
      const user = userEvent.setup();
      render(
        <>
          <a href="/profile">
            <Avatar name="Laura Torres" />
          </a>
          <button type="button">After</button>
        </>,
      );
      await user.tab();
      expectFocused(screen.getByRole("link", { name: "Laura Torres" }));
      await user.tab();
      expectFocused(screen.getByRole("button", { name: "After" }));
    });
  });

  describe("styles that e2e tests check further", () => {
    it("sizes, a border in forced colors, nothing animated", () => {
      render(<Avatar name="Laura Torres" size="lg" />);
      const avatar = screen.getByRole("img");
      expect(avatar.className).toContain("size-14");
      expect(avatar.className).toContain("forced-colors:border");
      for (const el of document.querySelectorAll<HTMLElement>('[data-slot^="avatar"]')) {
        for (const token of el.className.split(/\s+/)) {
          if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
        }
      }
    });
  });
});
