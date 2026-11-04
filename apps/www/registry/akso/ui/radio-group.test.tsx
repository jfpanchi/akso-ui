import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it, vi } from "vitest";

import { Field, FieldError } from "./field";
import { Form } from "./form";
import { Radio, RadioGroup } from "./radio-group";

function Delivery(props: { onValueChange?: (v: unknown) => void; defaultValue?: string; required?: boolean }) {
  return (
    <main>
      <Form>
        <Field name="delivery">
          <RadioGroup legend="Delivery speed" defaultValue={props.defaultValue} onValueChange={props.onValueChange} required={props.required}>
            <Radio value="standard">Standard (3–5 days)</Radio>
            <Radio value="express">Express (1–2 days)</Radio>
            <Radio value="pickup" disabled>
              Pick up in store (not available)
            </Radio>
          </RadioGroup>
          <FieldError match="valueMissing">Choose a delivery speed.</FieldError>
        </Field>
        <button type="submit">Continue</button>
      </Form>
    </main>
  );
}

describe("Radio group", () => {
  describe("axe", () => {
    it("has no violations with and without a choice", async () => {
      const { unmount } = render(<Delivery />);
      await expectNoA11yViolations(document.body);
      unmount();
      render(<Delivery defaultValue="express" />);
      await expectNoA11yViolations(document.body);
    });

    it("has no violations when required and invalid", async () => {
      const user = userEvent.setup();
      render(<Delivery required />);
      await user.click(screen.getByRole("button", { name: "Continue" }));
      await screen.findByText("Choose a delivery speed.");
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("is a radiogroup named by its legend, with named radios", () => {
      render(<Delivery defaultValue="express" />);
      const group = screen.getByRole("radiogroup", { name: "Delivery speed" });
      expect(group).toContainElement(screen.getByRole("radio", { name: "Standard (3–5 days)" }));
      expect(screen.getByRole("radio", { name: "Express (1–2 days)" })).toHaveAttribute("aria-checked", "true");
    });

    it("clicking an option's text chooses it", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(<Delivery onValueChange={onValueChange} />);
      await user.click(screen.getByText("Express (1–2 days)"));
      expect(onValueChange).toHaveBeenCalledWith("express", expect.anything());
    });

    it("required: submit without a choice marks the group invalid and links the error", async () => {
      const user = userEvent.setup();
      render(<Delivery required />);
      await user.click(screen.getByRole("button", { name: "Continue" }));
      await screen.findByText("Choose a delivery speed.");
      const first = screen.getByRole("radio", { name: "Standard (3–5 days)" });
      await waitFor(() => expect(document.activeElement?.closest('[role="radiogroup"]')).not.toBeNull());
      expect(first.closest('[role="radiogroup"]')).toHaveAttribute("aria-invalid", "true");
    });
  });

  describe("keyboard", () => {
    it("Tab enters the group once; arrow keys move and choose; disabled options are skipped", async () => {
      const user = userEvent.setup();
      render(<Delivery defaultValue="standard" />);
      await user.tab();
      const standard = screen.getByRole("radio", { name: "Standard (3–5 days)" });
      expectFocused(standard);
      await user.keyboard("{ArrowDown}");
      const express = screen.getByRole("radio", { name: "Express (1–2 days)" });
      expectFocused(express);
      expect(express).toHaveAttribute("aria-checked", "true");
      await user.keyboard("{ArrowDown}");
      expectFocused(standard); // wraps around, skipping the disabled option
      await user.tab();
      expectFocused(screen.getByRole("button", { name: "Continue" }));
    });
  });

  describe("styles that e2e tests check further", () => {
    it("the circle has a focus ring and nothing uses un-guarded motion", () => {
      render(<Delivery />);
      const radio = screen.getByRole("radio", { name: "Standard (3–5 days)" });
      expect(radio.className).toContain("focus-visible:outline-2");
      for (const el of [radio, radio.closest("label") as HTMLElement]) {
        for (const token of el.className.split(/\s+/)) {
          if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
        }
      }
    });
  });
});
