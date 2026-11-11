import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it } from "vitest";

import { AksoLocaleProvider } from "@/registry/akso/lib/akso-locale";
import { Stepper } from "./stepper";

const steps = [
  { label: "Cart", href: "#cart" },
  { label: "Shipping", href: "#shipping" },
  { label: "Payment", href: "#payment" },
  { label: "Review" },
];

describe("Stepper", () => {
  describe("axe", () => {
    it("has no violations at the start, in the middle and at the end", async () => {
      render(
        <main>
          <Stepper steps={steps} current={0} label="Start" />
          <Stepper steps={steps} current={2} label="Middle" />
          <Stepper steps={steps} current={3} label="End" />
        </main>,
      );
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("a named navigation with an ordered list of steps", () => {
      render(<Stepper steps={steps} current={2} label="Checkout steps" />);
      const nav = screen.getByRole("navigation", { name: "Checkout steps" });
      const items = within(within(nav).getByRole("list")).getAllByRole("listitem");
      expect(items).toHaveLength(4);
    });

    it("each step says its number and state in words; the current one has aria-current", () => {
      render(<Stepper steps={steps} current={2} />);
      expect(screen.getByRole("link", { name: "Cart, Step 1 of 4, completed" })).toHaveAttribute("href", "#cart");
      const current = screen.getByText("Payment").closest("li");
      expect(current).toHaveAttribute("aria-current", "step");
      expect(current).toHaveTextContent("Payment, Step 3 of 4, current step");
      expect(screen.getByText("Review").closest("li")).toHaveTextContent("Review, Step 4 of 4");
    });

    it("only completed steps are links", () => {
      render(<Stepper steps={steps} current={1} />);
      expect(screen.getAllByRole("link")).toHaveLength(1);
    });

    it("uses the AksoLocaleProvider texts", () => {
      render(
        <AksoLocaleProvider locale="es">
          <Stepper steps={steps} current={1} />
        </AksoLocaleProvider>,
      );
      expect(screen.getByRole("navigation", { name: "Pasos" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Cart, Paso 1 de 4, completado" })).toBeInTheDocument();
    });

    it("renderLink uses your router's link", () => {
      render(<Stepper steps={steps} current={1} renderLink={({ href, className, children }) => <a href={`/app${href}`} className={className} data-router>{children}</a>} />);
      expect(screen.getByRole("link")).toHaveAttribute("data-router");
    });
  });

  describe("keyboard", () => {
    it("Tab goes through the links of completed steps only", async () => {
      const user = userEvent.setup();
      render(
        <>
          <Stepper steps={steps} current={2} />
          <button type="button">After</button>
        </>,
      );
      await user.tab();
      expectFocused(screen.getByRole("link", { name: /^Cart/ }));
      await user.tab();
      expectFocused(screen.getByRole("link", { name: /^Shipping/ }));
      await user.tab();
      expectFocused(screen.getByRole("button", { name: "After" }));
    });
  });

  describe("styles that e2e tests check further", () => {
    it("state not shown by color alone: check mark, ring and bold; 44px rows; nothing animated", () => {
      render(<Stepper steps={steps} current={1} />);
      const markers = document.querySelectorAll<HTMLElement>('[data-slot="stepper-marker"]');
      expect(markers[0]!.querySelector("svg")).not.toBeNull();
      expect(markers[1]!.className).toContain("border-[3px]");
      expect(markers[2]).toHaveTextContent("3");
      expect(screen.getByText("Shipping").className).toContain("font-semibold");
      expect(screen.getByRole("link").className).toContain("min-h-11");
      for (const el of document.querySelectorAll<HTMLElement>('[data-slot^="stepper"]')) {
        for (const token of el.className.split(/\s+/)) {
          if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
        }
      }
    });
  });
});
