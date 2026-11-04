import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it } from "vitest";

import { Tooltip, TooltipProvider } from "./tooltip";

function Toolbar() {
  return (
    <main>
      <TooltipProvider delay={0}>
        <Tooltip content="Bold">
          <button type="button">
            <svg aria-hidden="true" />
          </button>
        </Tooltip>
        <Tooltip content="Save your changes">
          <button type="button">Save</button>
        </Tooltip>
        <Tooltip content="Print">
          <button type="button" aria-label="Print this page">
            <svg aria-hidden="true" />
          </button>
        </Tooltip>
      </TooltipProvider>
    </main>
  );
}

describe("Tooltip", () => {
  describe("axe", () => {
    it("has no violations, closed and open", async () => {
      const user = userEvent.setup();
      render(<Toolbar />);
      await expectNoA11yViolations(document.body);
      await user.tab();
      await screen.findByText("Bold", { selector: '[data-slot="tooltip-content"]' });
      await expectNoA11yViolations(document.body, { disableRules: ["region"] /* portaled popup */ });
    });
  });

  describe("name, role and state", () => {
    it("an icon-only trigger without a name gets the tooltip text as its name", () => {
      render(<Toolbar />);
      expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument();
    });

    it("a trigger with visible text keeps its own name (WCAG 2.5.3 Label in Name)", () => {
      render(<Toolbar />);
      const save = screen.getByRole("button", { name: "Save" });
      expect(save).not.toHaveAttribute("aria-label");
    });

    it("an explicit aria-label is kept", () => {
      render(<Toolbar />);
      expect(screen.getByRole("button", { name: "Print this page" })).toBeInTheDocument();
    });
  });

  describe("keyboard", () => {
    it("appears on keyboard focus and Escape closes it without moving focus", async () => {
      const user = userEvent.setup();
      render(<Toolbar />);
      await user.tab();
      const tip = await screen.findByText("Bold", { selector: '[data-slot="tooltip-content"]' });
      expect(tip).toBeVisible();
      await user.keyboard("{Escape}");
      await waitFor(() => expect(screen.queryByText("Bold", { selector: '[data-slot="tooltip-content"]' })).not.toBeInTheDocument());
      expect(screen.getByRole("button", { name: "Bold" })).toHaveFocus();
    });
  });

  describe("styles that e2e tests check further", () => {
    it("motion is guarded", async () => {
      const user = userEvent.setup();
      render(<Toolbar />);
      await user.tab();
      const tip = await screen.findByText("Bold", { selector: '[data-slot="tooltip-content"]' });
      for (const token of tip.className.split(/\s+/)) {
        if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
      }
    });
  });
});
