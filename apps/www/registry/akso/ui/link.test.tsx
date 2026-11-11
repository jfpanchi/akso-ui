import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it } from "vitest";

import { AksoLocaleProvider } from "@/registry/akso/lib/akso-locale";
import { Link } from "./link";

describe("Link", () => {
  describe("axe", () => {
    it("has no violations, normal and new tab", async () => {
      render(
        <main>
          <p>
            Read the <Link href="#notes">notes</Link>.
          </p>
          <p>
            <Link href="https://base-ui.com" newTab>
              Base UI
            </Link>
          </p>
        </main>,
      );
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("a real link named by its text", () => {
      render(<Link href="#notes">notes</Link>);
      expect(screen.getByRole("link", { name: "notes" })).toHaveAttribute("href", "#notes");
      expect(screen.getByRole("link")).not.toHaveAttribute("target");
    });

    it("newTab: target, rel and '(opens in a new tab)' in the name; translated", () => {
      const { rerender } = render(
        <Link href="https://base-ui.com" newTab>
          Base UI
        </Link>,
      );
      const link = screen.getByRole("link", { name: /^Base UI\s*\(opens in a new tab\)$/ });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      rerender(
        <AksoLocaleProvider locale="es">
          <Link href="https://base-ui.com" newTab>
            Base UI
          </Link>
        </AksoLocaleProvider>,
      );
      expect(screen.getByRole("link", { name: /^Base UI\s*\(se abre en una pestaña nueva\)$/ })).toBeInTheDocument();
    });

    it("render uses your router's link with the same props", () => {
      render(
        <Link href="/docs" render={({ children, ...props }) => (
            <a {...props} data-router>
              {children}
            </a>
          )}>
          Docs
        </Link>,
      );
      expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("data-router");
      expect(screen.getByRole("link").className).toContain("underline");
    });
  });

  describe("keyboard", () => {
    it("is reached with Tab", async () => {
      const user = userEvent.setup();
      render(<Link href="#notes">notes</Link>);
      await user.tab();
      expectFocused(screen.getByRole("link", { name: "notes" }));
    });
  });

  describe("styles that e2e tests check further", () => {
    it("always underlined, with a focus ring; nothing animated", () => {
      render(<Link href="#a">a</Link>);
      const link = screen.getByRole("link");
      expect(link.className).toContain("underline");
      expect(link.className).toContain("focus-visible:outline-2");
      for (const token of link.className.split(/\s+/)) {
        if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
      }
    });
  });
});
