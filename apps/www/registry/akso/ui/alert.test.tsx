import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it } from "vitest";

import { Alert } from "./alert";

describe("Alert", () => {
  describe("axe", () => {
    it("has no violations in every status", async () => {
      render(
        <main>
          <Alert status="info" title="New version">Reload to update.</Alert>
          <Alert status="success" title="Saved" />
          <Alert status="warning" title="Your session ends in 5 minutes" />
          <Alert status="error" title="Payment failed" live="assertive">
            Check your card details.
          </Alert>
        </main>,
      );
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("reads a status word before the title, so the meaning is not only in the color", () => {
      render(<Alert status="warning" title="Your session ends soon" />);
      expect(screen.getByText("Your session ends soon").closest("p")).toHaveTextContent("Warning: Your session ends soon");
      expect(screen.getByText("Warning:", { exact: false })).toHaveClass("sr-only");
    });

    it("each status has its own icon shape, hidden from assistive technology", () => {
      const { container } = render(
        <>
          <Alert status="info" title="a" />
          <Alert status="error" title="b" />
        </>,
      );
      const icons = container.querySelectorAll("svg[data-status-icon]");
      expect([...icons].map((i) => i.getAttribute("data-status-icon"))).toEqual(["info", "error"]);
      expect(icons[0]?.innerHTML).not.toBe(icons[1]?.innerHTML);
      for (const icon of icons) expect(icon).toHaveAttribute("aria-hidden", "true");
    });

    it("is not a live region by default; live sets status or alert", () => {
      render(
        <>
          <Alert title="Static" />
          <Alert title="Polite" live="polite" />
          <Alert title="Urgent" live="assertive" />
        </>,
      );
      expect(screen.getByText("Static").closest('[data-slot="alert"]')).not.toHaveAttribute("role");
      expect(screen.getByRole("status")).toHaveTextContent("Polite");
      expect(screen.getByRole("alert")).toHaveTextContent("Urgent");
    });

    it("the status word can be translated", () => {
      render(<Alert status="error" statusLabel="Error" title="Pago rechazado" />);
      render(<Alert status="error" statusLabel="Error grave" title="Sin conexión" />);
      expect(screen.getByText("Sin conexión").closest("p")).toHaveTextContent("Error grave: Sin conexión");
    });
  });

  describe("keyboard", () => {
    it("is not focusable itself (it is not interactive)", () => {
      render(<Alert title="Saved" />);
      expect(screen.getByText("Saved").closest('[data-slot="alert"]')).not.toHaveAttribute("tabindex");
    });
  });

  describe("styles that e2e tests check further", () => {
    it("has a thick status border and no motion", () => {
      render(<Alert status="success" title="Saved" />);
      const alert = screen.getByText("Saved").closest('[data-slot="alert"]') as HTMLElement;
      expect(alert.className).toContain("border-l-4");
      expect(alert.className).not.toMatch(/(^|\s)(transition|animate)/);
    });
  });
});
