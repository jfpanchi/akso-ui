import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it } from "vitest";

import { Field, FieldLabel } from "./field";
import { Fieldset, FieldsetLegend } from "./fieldset";
import { Input } from "./input";

function Address({ disabled = false }: { disabled?: boolean }) {
  return (
    <main>
      <Fieldset disabled={disabled}>
        <FieldsetLegend>Delivery address</FieldsetLegend>
        <Field>
          <FieldLabel>Street</FieldLabel>
          <Input autoComplete="street-address" />
        </Field>
        <Field>
          <FieldLabel>City</FieldLabel>
          <Input autoComplete="address-level2" />
        </Field>
      </Fieldset>
    </main>
  );
}

describe("Fieldset", () => {
  describe("axe", () => {
    it("has no violations in its default state", async () => {
      render(<Address />);
      await expectNoA11yViolations(document.body);
    });

    it("has no violations when disabled", async () => {
      render(<Address disabled />);
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("is a group named by its legend", () => {
      render(<Address />);
      const group = screen.getByRole("group", { name: "Delivery address" });
      expect(group.tagName).toBe("FIELDSET");
      expect(group).toContainElement(screen.getByRole("textbox", { name: "Street" }));
    });

    it("disabling the fieldset disables every field inside", () => {
      render(<Address disabled />);
      expect(screen.getByRole("textbox", { name: "Street" })).toBeDisabled();
      expect(screen.getByRole("textbox", { name: "City" })).toBeDisabled();
    });
  });

  describe("keyboard", () => {
    it("Tab moves through the fields in order; the legend is not a tab stop", async () => {
      const user = userEvent.setup();
      render(<Address />);
      await user.tab();
      expectFocused(screen.getByRole("textbox", { name: "Street" }));
      await user.tab();
      expectFocused(screen.getByRole("textbox", { name: "City" }));
    });

    it("a disabled fieldset is skipped by Tab", async () => {
      const user = userEvent.setup();
      render(
        <>
          <Address disabled />
          <button type="button">After</button>
        </>,
      );
      await user.tab();
      expectFocused(screen.getByRole("button", { name: "After" }));
    });
  });

  describe("styles that e2e tests check further", () => {
    it("the legend is visible text and nothing uses un-guarded motion", () => {
      render(<Address />);
      const legend = screen.getByText("Delivery address");
      expect(legend.className).toContain("font-semibold");
      for (const el of [legend, screen.getByRole("group")]) {
        for (const token of el.className.split(/\s+/)) {
          if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
        }
      }
    });
  });
});
