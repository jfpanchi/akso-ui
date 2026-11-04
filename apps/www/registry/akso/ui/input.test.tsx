import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it } from "vitest";

import { Field, FieldError, FieldLabel } from "./field";
import { Form } from "./form";
import { Input } from "./input";

function NameForm({ required = true, inputRequired }: { required?: boolean; inputRequired?: boolean }) {
  return (
    <main>
      <Form>
        <Field name="name" required={required}>
          <FieldLabel>Full name</FieldLabel>
          <Input autoComplete="name" required={inputRequired} />
          <FieldError match="valueMissing">Enter your name.</FieldError>
        </Field>
        <button type="submit">Send</button>
      </Form>
    </main>
  );
}

describe("Input", () => {
  describe("axe", () => {
    it("has no violations in its default state", async () => {
      render(<NameForm />);
      await expectNoA11yViolations(document.body);
    });

    it("has no violations when invalid and when disabled", async () => {
      const user = userEvent.setup();
      render(
        <>
          <NameForm />
          <Field disabled>
            <FieldLabel>Locked</FieldLabel>
            <Input />
          </Field>
        </>,
      );
      await user.click(screen.getByRole("button", { name: "Send" }));
      await screen.findByText("Enter your name.");
      await expectNoA11yViolations(document.body, { disableRules: ["region"] /* second field sits outside <main> on purpose */ });
    });
  });

  describe("name, role and state", () => {
    it("is a native text input named by the Field label, with autocomplete passed through", () => {
      render(<NameForm />);
      const input = screen.getByRole("textbox", { name: "Full name" });
      expect(input.tagName).toBe("INPUT");
      expect(input).toHaveAttribute("autocomplete", "name");
    });

    it("is required when the Field is, and an explicit prop wins", () => {
      const { unmount } = render(<NameForm />);
      expect(screen.getByRole("textbox", { name: "Full name" })).toBeRequired();
      unmount();
      render(<NameForm inputRequired={false} />);
      expect(screen.getByRole("textbox", { name: "Full name" })).not.toBeRequired();
    });

    it("gets data-invalid (thicker danger border) and aria-invalid when invalid", async () => {
      const user = userEvent.setup();
      render(<NameForm />);
      await user.click(screen.getByRole("button", { name: "Send" }));
      const input = screen.getByRole("textbox", { name: "Full name" });
      await waitFor(() => expect(input).toHaveAttribute("aria-invalid", "true"));
      expect(input).toHaveAttribute("data-invalid");
      expect(input.className).toContain("data-invalid:border-2");
    });

    it("a disabled Field disables the input", () => {
      render(
        <Field disabled>
          <FieldLabel>Locked</FieldLabel>
          <Input />
        </Field>,
      );
      expect(screen.getByRole("textbox", { name: "Locked" })).toBeDisabled();
    });
  });

  describe("keyboard", () => {
    it("is reached with Tab and accepts typing", async () => {
      const user = userEvent.setup();
      render(<NameForm />);
      await user.tab();
      const input = screen.getByRole("textbox", { name: "Full name" });
      expectFocused(input);
      await user.keyboard("Ada");
      expect(input).toHaveValue("Ada");
    });

    it("Enter submits the form and moves focus to the first invalid field", async () => {
      const user = userEvent.setup();
      render(<NameForm />);
      await user.tab();
      await user.keyboard("{Enter}");
      await screen.findByText("Enter your name.");
      expectFocused(screen.getByRole("textbox", { name: "Full name" }));
    });
  });

  describe("styles that e2e tests check further", () => {
    it("has a 44px minimum height, 16px text, a focus-visible outline and no un-guarded motion", () => {
      render(<NameForm />);
      const classes = screen.getByRole("textbox").className.split(/\s+/);
      expect(classes).toEqual(expect.arrayContaining(["min-h-11", "text-base", "focus-visible:outline-2"]));
      for (const token of classes) {
        if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
      }
    });
  });
});
