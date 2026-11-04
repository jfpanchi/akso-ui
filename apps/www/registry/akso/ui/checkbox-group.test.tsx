import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it, vi } from "vitest";

import { Checkbox } from "./checkbox";
import { CheckboxGroup } from "./checkbox-group";

function Toppings(props: { onValueChange?: (v: string[]) => void; disabled?: boolean }) {
  return (
    <main>
      <CheckboxGroup legend="Toppings" defaultValue={["cheese"]} onValueChange={props.onValueChange} disabled={props.disabled}>
        <Checkbox value="cheese">Cheese</Checkbox>
        <Checkbox value="olives">Olives</Checkbox>
        <Checkbox value="onion">Onion</Checkbox>
      </CheckboxGroup>
    </main>
  );
}

describe("Checkbox group", () => {
  describe("axe", () => {
    it("has no violations in its default state", async () => {
      render(<Toppings />);
      await expectNoA11yViolations(document.body);
    });
    it("has no violations when disabled", async () => {
      render(<Toppings disabled />);
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("is a group named by its legend, containing named checkboxes", () => {
      render(<Toppings />);
      const group = screen.getByRole("group", { name: "Toppings" });
      expect(group).toContainElement(screen.getByRole("checkbox", { name: "Olives" }));
      expect(screen.getByRole("checkbox", { name: "Cheese" })).toHaveAttribute("aria-checked", "true");
    });

    it("reports the ticked values", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(<Toppings onValueChange={onValueChange} />);
      await user.click(screen.getByText("Olives"));
      expect(onValueChange).toHaveBeenLastCalledWith(["cheese", "olives"], expect.anything());
    });

    it("disabling the group disables every checkbox", () => {
      render(<Toppings disabled />);
      for (const box of screen.getAllByRole("checkbox")) expect(box).toHaveAttribute("aria-disabled", "true");
    });
  });

  describe("keyboard", () => {
    it("each checkbox is its own Tab stop and Space toggles it", async () => {
      const user = userEvent.setup();
      render(<Toppings />);
      await user.tab();
      expectFocused(screen.getByRole("checkbox", { name: "Cheese" }));
      await user.tab();
      const olives = screen.getByRole("checkbox", { name: "Olives" });
      expectFocused(olives);
      await user.keyboard(" ");
      expect(olives).toHaveAttribute("aria-checked", "true");
    });
  });

  describe("styles that e2e tests check further", () => {
    it("the legend is visible text and nothing uses un-guarded motion", () => {
      render(<Toppings />);
      const group = screen.getByRole("group");
      for (const el of [group, screen.getByText("Toppings")]) {
        for (const token of el.className.split(/\s+/)) {
          if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
        }
      }
      expect(screen.getByText("Toppings").className).toContain("font-semibold");
    });
  });
});
