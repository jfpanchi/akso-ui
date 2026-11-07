import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AksoLocaleProvider } from "@/registry/akso/lib/akso-locale";
import { Field, FieldError, FieldLabel } from "./field";
import { NumberField } from "./number-field";

afterEach(() => vi.restoreAllMocks());

function Guests(props: { required?: boolean }) {
  return (
    <Field required={props.required}>
      <FieldLabel>Guests</FieldLabel>
      <NumberField defaultValue={2} min={1} max={3} />
      <FieldError match="valueMissing">Enter the number of guests.</FieldError>
    </Field>
  );
}

describe("NumberField", () => {
  describe("axe", () => {
    it("has no violations, enabled and disabled", async () => {
      render(
        <main>
          <Guests required />
          <Field disabled>
            <FieldLabel>Rooms</FieldLabel>
            <NumberField defaultValue={1} disabled />
          </Field>
        </main>,
      );
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("the input is named by the FieldLabel and described as a number field", () => {
      render(<Guests />);
      const input = screen.getByRole("textbox", { name: "Guests" });
      expect(input).toHaveAttribute("aria-roledescription", "Number field");
      expect(input).toHaveValue("2");
    });

    it("the − and + buttons have names and stay out of the Tab order", () => {
      render(<Guests />);
      expect(screen.getByRole("button", { name: "Decrease" })).toHaveAttribute("tabindex", "-1");
      expect(screen.getByRole("button", { name: "Increase" })).toHaveAttribute("tabindex", "-1");
    });

    it("uses the AksoLocaleProvider texts", () => {
      render(
        <AksoLocaleProvider locale="es">
          <Guests />
        </AksoLocaleProvider>,
      );
      expect(screen.getByRole("button", { name: "Disminuir" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Aumentar" })).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-roledescription", "Campo numérico");
    });

    it("the + button is disabled at the maximum", async () => {
      const user = userEvent.setup();
      render(<Guests />);
      await user.click(screen.getByRole("button", { name: "Increase" }));
      expect(screen.getByRole("textbox")).toHaveValue("3");
      expect(screen.getByRole("button", { name: "Increase" })).toBeDisabled();
    });

    it("required inside a Field: the input is required", () => {
      render(<Guests required />);
      expect(screen.getByRole("textbox", { name: "Guests" })).toBeRequired();
    });

    it("logs an error in development without a label", () => {
      const error = vi.spyOn(console, "error").mockImplementation(() => {});
      render(<NumberField defaultValue={1} />);
      expect(error).toHaveBeenCalledWith(expect.stringContaining("NumberField has no accessible name"));
    });
  });

  describe("keyboard", () => {
    it("Tab reaches the input only; arrows change the value; Home and End go to min and max", async () => {
      const user = userEvent.setup();
      render(
        <>
          <Guests />
          <button type="button">After</button>
        </>,
      );
      await user.tab();
      const input = screen.getByRole("textbox", { name: "Guests" });
      expectFocused(input);
      await user.keyboard("{ArrowUp}");
      expect(input).toHaveValue("3");
      await user.keyboard("{ArrowDown}{ArrowDown}");
      expect(input).toHaveValue("1");
      await user.keyboard("{End}");
      expect(input).toHaveValue("3");
      await user.keyboard("{Home}");
      expect(input).toHaveValue("1");
      await user.tab();
      expectFocused(screen.getByRole("button", { name: "After" }));
    });
  });

  describe("styles that e2e tests check further", () => {
    it("44px tall with 44px buttons; a focus ring on the whole field; nothing animated", () => {
      render(<Guests />);
      const group = document.querySelector('[data-slot="number-field-group"]') as HTMLElement;
      expect(group.className).toContain("min-h-11");
      expect(group.className).toContain("focus-within:outline-2");
      expect(screen.getByRole("button", { name: "Increase" }).className).toContain("w-11");
      for (const el of document.querySelectorAll<HTMLElement>('[data-slot^="number-field"]')) {
        for (const token of el.className.split(/\s+/)) {
          if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
        }
      }
    });
  });
});
