import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it } from "vitest";

import { Badge } from "./badge";

describe("Badge", () => {
  describe("axe", () => {
    it("has no violations, with and without a status", async () => {
      render(
        <main>
          <p>
            Order 1042 <Badge status="success">Shipped</Badge>
          </p>
          <p>
            Order 1043 <Badge status="warning">Payment pending</Badge>
          </p>
          <p>
            Notes <Badge>New</Badge>
          </p>
        </main>,
      );
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("is read as its text; the status icon is hidden", () => {
      render(
        <p>
          Order 1042 <Badge status="success">Shipped</Badge>
        </p>,
      );
      expect(screen.getByText("Shipped")).toHaveAttribute("data-slot", "badge");
      expect(document.querySelector("[data-status-icon]")).toHaveAttribute("aria-hidden", "true");
      expect(screen.getByText("Order 1042", { exact: false })).toHaveTextContent("Order 1042 Shipped");
    });

    it("each status has its own icon shape and border, not only a color", () => {
      render(
        <>
          <Badge status="success">A</Badge>
          <Badge status="error">B</Badge>
        </>,
      );
      const icons = document.querySelectorAll("[data-status-icon]");
      expect(icons[0]!.innerHTML).not.toBe(icons[1]!.innerHTML);
      expect(screen.getByText("A").className).toContain("border-2");
    });
  });

  describe("keyboard", () => {
    it("is not focusable", async () => {
      const user = userEvent.setup();
      render(
        <>
          <Badge status="info">Processing</Badge>
          <button type="button">After</button>
        </>,
      );
      await user.tab();
      expectFocused(screen.getByRole("button", { name: "After" }));
    });
  });

  describe("styles that e2e tests check further", () => {
    it("main text color; nothing animated", () => {
      render(<Badge status="warning">Pending</Badge>);
      const badge = screen.getByText("Pending");
      expect(badge.className).toContain("text-akso-foreground");
      for (const token of badge.className.split(/\s+/)) {
        if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
      }
    });
  });
});
