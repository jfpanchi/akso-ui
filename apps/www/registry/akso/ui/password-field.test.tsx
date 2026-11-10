import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AksoLocaleProvider } from "@/registry/akso/lib/akso-locale";
import { Field, FieldDescription, FieldLabel } from "./field";
import { PasswordField } from "./password-field";

afterEach(() => vi.restoreAllMocks());

function Demo(props: { onSubmit?: () => void }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit?.();
      }}
    >
      <Field required>
        <FieldLabel>Password</FieldLabel>
        <FieldDescription>At least 8 characters.</FieldDescription>
        <PasswordField />
      </Field>
      <button type="submit">Sign in</button>
    </form>
  );
}

const input = () => screen.getByLabelText(/^Password/) as HTMLInputElement;

describe("PasswordField", () => {
  describe("axe", () => {
    it("has no violations, hidden and shown", async () => {
      const user = userEvent.setup();
      render(
        <main>
          <Demo />
        </main>,
      );
      await expectNoA11yViolations(document.body);
      await user.click(screen.getByRole("button", { name: "Show password" }));
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("a password input named by the label, with autocomplete and no spellcheck", () => {
      render(<Demo />);
      expect(input()).toHaveAttribute("type", "password");
      expect(input()).toHaveAttribute("autocomplete", "current-password");
      expect(input()).toHaveAttribute("spellcheck", "false");
      expect(input()).toBeRequired();
      expect(input()).toHaveAccessibleDescription("At least 8 characters.");
    });

    it("the button shows and hides the password, says so, and controls the input", async () => {
      const user = userEvent.setup();
      render(<Demo />);
      const button = screen.getByRole("button", { name: "Show password" });
      expect(button).toHaveTextContent("Show");
      await waitFor(() => expect(button).toHaveAttribute("aria-controls", input().id));
      await user.click(button);
      expect(input()).toHaveAttribute("type", "text");
      expect(screen.getByRole("button", { name: "Hide password" })).toHaveTextContent("Hide");
      await waitFor(() => expect(document.querySelector('[data-slot="announcer"]')).toHaveTextContent("Your password is shown"));
    });

    it("hides the password again when the form is submitted", async () => {
      const user = userEvent.setup();
      render(<Demo />);
      await user.click(screen.getByRole("button", { name: "Show password" }));
      fireEvent.submit(input().form!);
      expect(input()).toHaveAttribute("type", "password");
    });

    it("uses the AksoLocaleProvider texts", () => {
      render(
        <AksoLocaleProvider locale="es">
          <Demo />
        </AksoLocaleProvider>,
      );
      expect(screen.getByRole("button", { name: "Mostrar contraseña" })).toHaveTextContent("Mostrar");
    });

    it("logs an error in development without a label", () => {
      const error = vi.spyOn(console, "error").mockImplementation(() => {});
      render(<PasswordField />);
      expect(error).toHaveBeenCalledWith(expect.stringContaining("PasswordField has no accessible name"));
    });
  });

  describe("keyboard", () => {
    it("Tab goes from the input to the button; Enter on the button toggles, focus stays", async () => {
      const user = userEvent.setup();
      render(<Demo />);
      await user.tab();
      expectFocused(input());
      await user.keyboard("secret12");
      await user.tab();
      const button = screen.getByRole("button", { name: "Show password" });
      expectFocused(button);
      await user.keyboard("{Enter}");
      expect(input()).toHaveAttribute("type", "text");
      expectFocused(screen.getByRole("button", { name: "Hide password" }));
      expect(input()).toHaveValue("secret12");
    });

    it("paste is never blocked", async () => {
      const user = userEvent.setup();
      render(<Demo />);
      await user.click(input());
      await user.paste("from-manager");
      expect(input()).toHaveValue("from-manager");
    });
  });

  describe("styles that e2e tests check further", () => {
    it("44px input and button with focus rings; nothing animated", () => {
      render(<Demo />);
      expect(input().className).toContain("min-h-11");
      expect(screen.getByRole("button", { name: "Show password" }).className).toContain("focus-visible:outline-2");
      for (const el of document.querySelectorAll<HTMLElement>('[data-slot^="password-field"]')) {
        for (const token of el.className.split(/\s+/)) {
          if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
        }
      }
    });
  });
});
