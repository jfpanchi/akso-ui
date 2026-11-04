import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it } from "vitest";

import { Popover, PopoverClose, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from "./popover";

function Info() {
  return (
    <main>
      <Popover>
        <PopoverTrigger size="icon" aria-label="About delivery times">
          <svg aria-hidden="true" />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Delivery times</PopoverTitle>
          <PopoverDescription>Orders placed before 2 pm ship the same day.</PopoverDescription>
          <PopoverClose>Close</PopoverClose>
        </PopoverContent>
      </Popover>
    </main>
  );
}

async function open() {
  const user = userEvent.setup();
  render(<Info />);
  const trigger = screen.getByRole("button", { name: "About delivery times" });
  await user.click(trigger);
  const popup = await screen.findByRole("dialog");
  return { user, trigger, popup };
}

describe("Popover", () => {
  describe("axe", () => {
    it("has no violations closed", async () => {
      render(<Info />);
      await expectNoA11yViolations(document.body);
    });
    it("has no violations open", async () => {
      await open();
      // "region": the popup is portaled outside the page landmarks, like every popup.
      await expectNoA11yViolations(document.body, { disableRules: ["region"] });
    });
  });

  describe("name, role and state", () => {
    it("the trigger exposes aria-expanded; the popup is named and described", async () => {
      const { trigger, popup } = await open();
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(popup).toHaveAccessibleName("Delivery times");
      expect(popup).toHaveAccessibleDescription("Orders placed before 2 pm ship the same day.");
    });
  });

  describe("keyboard", () => {
    it("Enter opens it and moves focus inside; Escape closes and returns focus", async () => {
      const user = userEvent.setup();
      render(<Info />);
      await user.tab();
      const trigger = screen.getByRole("button", { name: "About delivery times" });
      await user.keyboard("{Enter}");
      const popup = await screen.findByRole("dialog");
      await waitFor(() => expect(popup).toContainElement(document.activeElement as HTMLElement));
      await user.keyboard("{Escape}");
      await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
      expectFocused(trigger);
    });

    it("the close button closes it and returns focus to the trigger", async () => {
      const { user, trigger } = await open();
      await user.click(screen.getByRole("button", { name: "Close" }));
      await waitFor(() => expectFocused(trigger));
    });
  });

  describe("styles that e2e tests check further", () => {
    it("motion is guarded", async () => {
      const { popup } = await open();
      for (const token of popup.className.split(/\s+/)) {
        if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
      }
    });
  });
});
