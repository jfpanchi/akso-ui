import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it } from "vitest";

import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "./accordion";

function Faq({ multiple = false }: { multiple?: boolean }) {
  return (
    <main>
      <h2>Questions</h2>
      <Accordion multiple={multiple}>
        <AccordionItem value="ship">
          <AccordionTrigger>How long does shipping take?</AccordionTrigger>
          <AccordionPanel>Between 3 and 5 working days.</AccordionPanel>
        </AccordionItem>
        <AccordionItem value="return">
          <AccordionTrigger>Can I return an item?</AccordionTrigger>
          <AccordionPanel>Yes, within 30 days.</AccordionPanel>
        </AccordionItem>
      </Accordion>
    </main>
  );
}

describe("Accordion", () => {
  describe("axe", () => {
    it("has no violations closed and open", async () => {
      const user = userEvent.setup();
      render(<Faq />);
      await expectNoA11yViolations(document.body);
      await user.click(screen.getByRole("button", { name: "Can I return an item?" }));
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("each trigger is a button inside a level-3 heading, with aria-expanded and aria-controls", () => {
      render(<Faq />);
      const trigger = screen.getByRole("button", { name: "How long does shipping take?" });
      expect(trigger.closest("h3")).not.toBeNull();
      expect(screen.getByRole("heading", { level: 3, name: "How long does shipping take?" })).toBeInTheDocument();
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("an open trigger points to its panel with aria-controls (Base UI sets it only while open)", async () => {
      const user = userEvent.setup();
      render(<Faq />);
      const trigger = screen.getByRole("button", { name: "How long does shipping take?" });
      await user.click(trigger);
      const panel = screen.getByText("Between 3 and 5 working days.").closest('[data-slot="accordion-panel"]') as HTMLElement;
      expect(trigger.getAttribute("aria-controls")).toBe(panel.id);
    });

    it("the heading level can be changed to fit the page outline", () => {
      render(
        <Accordion>
          <AccordionItem value="a">
            <AccordionTrigger level={2}>Question</AccordionTrigger>
            <AccordionPanel>Answer</AccordionPanel>
          </AccordionItem>
        </Accordion>,
      );
      expect(screen.getByRole("heading", { level: 2, name: "Question" })).toBeInTheDocument();
    });

    it("closed panels stay findable by the browser (hidden=until-found)", () => {
      render(<Faq />);
      const panel = screen.getByText("Between 3 and 5 working days.").closest('[data-slot="accordion-panel"]');
      expect(panel).toHaveAttribute("hidden", "until-found");
    });
  });

  describe("keyboard", () => {
    it("Enter and Space open and close; the panel content is shown", async () => {
      const user = userEvent.setup();
      render(<Faq />);
      await user.tab();
      const trigger = screen.getByRole("button", { name: "How long does shipping take?" });
      expectFocused(trigger);
      await user.keyboard("{Enter}");
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(screen.getByText("Between 3 and 5 working days.")).toBeVisible();
      await user.keyboard(" ");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("Tab moves between triggers (no arrow-key roving, per the current ARIA APG guidance)", async () => {
      const user = userEvent.setup();
      render(<Faq />);
      await user.tab();
      await user.tab();
      expectFocused(screen.getByRole("button", { name: "Can I return an item?" }));
    });
  });

  describe("styles that e2e tests check further", () => {
    it("the arrow shows the state, and motion is guarded", () => {
      render(<Faq />);
      const trigger = screen.getByRole("button", { name: "How long does shipping take?" });
      const icon = trigger.querySelector("svg");
      expect(icon?.getAttribute("class")).toContain("group-data-panel-open:rotate-180");
      for (const el of [trigger, icon as Element, document.querySelector('[data-slot="accordion-panel"]') as Element]) {
        for (const token of (el.getAttribute("class") ?? "").split(/\s+/)) {
          if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
        }
      }
    });
  });
});
