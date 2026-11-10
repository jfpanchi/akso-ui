import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it } from "vitest";

import { Separator } from "./separator";

describe("Separator", () => {
  describe("axe", () => {
    it("has no violations: horizontal, vertical and decorative", async () => {
      render(
        <main>
          <p>Account</p>
          <Separator />
          <p>Billing</p>
          <Separator decorative />
          <div className="flex">
            <a href="#a">Help</a>
            <Separator orientation="vertical" />
            <a href="#b">Privacy</a>
          </div>
        </main>,
      );
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("is a separator with its orientation", () => {
      render(
        <>
          <Separator />
          <Separator orientation="vertical" />
        </>,
      );
      const [horizontal, vertical] = screen.getAllByRole("separator");
      expect(horizontal).not.toHaveAttribute("aria-orientation", "vertical");
      expect(vertical).toHaveAttribute("aria-orientation", "vertical");
    });

    it("decorative: hidden from screen readers", () => {
      render(<Separator decorative />);
      expect(screen.queryByRole("separator")).not.toBeInTheDocument();
      expect(document.querySelector('[data-slot="separator"]')).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("keyboard", () => {
    it("is not focusable", async () => {
      const user = userEvent.setup();
      render(
        <>
          <button type="button">Before</button>
          <Separator />
          <button type="button">After</button>
        </>,
      );
      await user.tab();
      await user.tab();
      expectFocused(screen.getByRole("button", { name: "After" }));
    });
  });

  describe("styles that e2e tests check further", () => {
    it("drawn with a border (visible in forced colors); nothing animated", () => {
      render(
        <>
          <Separator />
          <Separator orientation="vertical" decorative />
        </>,
      );
      const lines = document.querySelectorAll<HTMLElement>('[data-slot="separator"]');
      expect(lines[0]!.className).toContain("border-t");
      expect(lines[1]!.className).toContain("border-l");
      for (const el of lines) {
        for (const token of el.className.split(/\s+/)) {
          if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
        }
      }
    });
  });
});
