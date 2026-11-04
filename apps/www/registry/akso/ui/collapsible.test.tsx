import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it } from "vitest";

import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "./collapsible";

function Order() {
  return (
    <main>
      <Collapsible>
        <CollapsibleTrigger>Show order details</CollapsibleTrigger>
        <CollapsiblePanel>2 items, total $40.</CollapsiblePanel>
      </Collapsible>
    </main>
  );
}

describe("Collapsible", () => {
  describe("axe", () => {
    it("has no violations closed and open", async () => {
      const user = userEvent.setup();
      render(<Order />);
      await expectNoA11yViolations(document.body);
      await user.click(screen.getByRole("button", { name: "Show order details" }));
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("the trigger is a button with aria-expanded linked to the panel", async () => {
      const user = userEvent.setup();
      render(<Order />);
      const trigger = screen.getByRole("button", { name: "Show order details" });
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      const panel = screen.getByText("2 items, total $40.").closest('[data-slot="collapsible-panel"]') as HTMLElement;
      expect(trigger.getAttribute("aria-controls")).toBe(panel.id);
    });

    it("the closed panel is findable by the browser (hidden=until-found)", () => {
      render(<Order />);
      expect(screen.getByText("2 items, total $40.").closest('[data-slot="collapsible-panel"]')).toHaveAttribute("hidden", "until-found");
    });
  });

  describe("keyboard", () => {
    it("Enter and Space toggle it", async () => {
      const user = userEvent.setup();
      render(<Order />);
      await user.tab();
      const trigger = screen.getByRole("button", { name: "Show order details" });
      expectFocused(trigger);
      await user.keyboard("{Enter}");
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      await user.keyboard(" ");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("styles that e2e tests check further", () => {
    it("the arrow shows the state, the trigger is 44px, and motion is guarded", () => {
      render(<Order />);
      const trigger = screen.getByRole("button");
      expect(trigger.className).toContain("min-h-11");
      expect(trigger.querySelector("svg")?.getAttribute("class")).toContain("group-data-panel-open:rotate-90");
      for (const el of [trigger, document.querySelector('[data-slot="collapsible-panel"]') as Element]) {
        for (const token of (el.getAttribute("class") ?? "").split(/\s+/)) {
          if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
        }
      }
    });
  });
});
