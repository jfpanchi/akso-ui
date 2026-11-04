import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it } from "vitest";

import { Field, FieldDescription, FieldError, FieldLabel } from "./field";
import { Form } from "./form";
import { Input } from "./input";

const announcer = () => document.getElementById("akso-announcer");

function EmailField(props: { validationMode?: "onBlur" | "onSubmit" | "onChange"; announceErrors?: boolean; required?: boolean }) {
  const { required = true, ...rest } = props;
  return (
    <main>
      <Form>
        <Field name="email" required={required} {...rest}>
          <FieldLabel>Email</FieldLabel>
          <Input type="email" autoComplete="email" />
          <FieldDescription>We only use it to reply.</FieldDescription>
          <FieldError match="valueMissing">Enter your email.</FieldError>
          <FieldError match="typeMismatch">Enter an email like name@example.com.</FieldError>
        </Field>
        <button type="submit">Send</button>
      </Form>
    </main>
  );
}

describe("Field", () => {
  describe("axe", () => {
    it("has no violations in its default state", async () => {
      render(<EmailField />);
      await expectNoA11yViolations(document.body);
    });

    it("has no violations when invalid", async () => {
      const user = userEvent.setup();
      render(<EmailField />);
      await user.click(screen.getByRole("button", { name: "Send" }));
      await screen.findByText("Enter your email.");
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("the control is named by its visible label, without the '(required)' suffix", () => {
      render(<EmailField />);
      const input = screen.getByRole("textbox", { name: "Email" });
      expect(input).toBeRequired();
      expect(screen.getByText("(required)")).toBeVisible();
      expect(screen.getByText("(required)")).toHaveAttribute("aria-hidden", "true");
    });

    it("optional fields show no suffix and are not required", () => {
      render(<EmailField required={false} />);
      expect(screen.getByRole("textbox", { name: "Email" })).not.toBeRequired();
      expect(screen.queryByText("(required)")).not.toBeInTheDocument();
    });

    it("the description is the control's accessible description", () => {
      render(<EmailField />);
      expect(screen.getByRole("textbox", { name: "Email" })).toHaveAccessibleDescription("We only use it to reply.");
    });

    it("an error sets aria-invalid and is added to the description", async () => {
      const user = userEvent.setup();
      render(<EmailField />);
      await user.click(screen.getByRole("button", { name: "Send" }));
      const input = screen.getByRole("textbox", { name: "Email" });
      await waitFor(() => expect(input).toHaveAttribute("aria-invalid", "true"));
      expect(input).toHaveAccessibleDescription(/Enter your email\./);
    });

    it("the error has a text message and a decorative icon, not only a color", async () => {
      const user = userEvent.setup();
      render(<EmailField />);
      await user.click(screen.getByRole("button", { name: "Send" }));
      const error = (await screen.findByText("Enter your email.")).closest('[data-slot="field-error"]');
      expect(error?.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    });

    it("the message changes with the problem (match)", async () => {
      const user = userEvent.setup();
      render(<EmailField />);
      const input = screen.getByRole("textbox", { name: "Email" });
      await user.type(input, "not-an-email");
      await user.click(screen.getByRole("button", { name: "Send" }));
      expect(await screen.findByText("Enter an email like name@example.com.")).toBeInTheDocument();
      expect(screen.queryByText("Enter your email.")).not.toBeInTheDocument();
    });
  });

  describe("announcements", () => {
    it("announces an error that appears on blur, with the field name", async () => {
      const user = userEvent.setup();
      render(<EmailField validationMode="onBlur" />);
      await user.type(screen.getByRole("textbox", { name: "Email" }), "nope");
      await user.tab();
      await waitFor(() => expect(announcer()).toHaveTextContent("Email: Enter an email like name@example.com."), { timeout: 2000 });
      expect(announcer()).toHaveAttribute("aria-live", "polite");
    });

    it("does not repeat the error when submit moves focus to the field (it is read as the description)", async () => {
      const user = userEvent.setup();
      render(<EmailField />);
      await user.click(screen.getByRole("button", { name: "Send" }));
      await screen.findByText("Enter your email.");
      await new Promise((r) => setTimeout(r, 800));
      expect(announcer()?.textContent ?? "").not.toContain("Enter your email.");
    });

    it("can be turned off with announceErrors={false}", async () => {
      const user = userEvent.setup();
      render(<EmailField validationMode="onBlur" announceErrors={false} />);
      await user.type(screen.getByRole("textbox", { name: "Email" }), "nope");
      await user.tab();
      await screen.findByText("Enter an email like name@example.com.");
      await new Promise((r) => setTimeout(r, 800));
      expect(announcer()?.textContent ?? "").toBe("");
    });
  });

  describe("keyboard", () => {
    it("Tab reaches the control, and clicking the label focuses it", async () => {
      const user = userEvent.setup();
      render(<EmailField />);
      await user.tab();
      const input = screen.getByRole("textbox", { name: "Email" });
      expectFocused(input);
      input.blur();
      await user.click(screen.getByText("Email"));
      expectFocused(input);
    });
  });

  describe("styles that e2e tests check further", () => {
    it("errors use the danger token and no un-guarded motion", async () => {
      const user = userEvent.setup();
      render(<EmailField />);
      await user.click(screen.getByRole("button", { name: "Send" }));
      const error = (await screen.findByText("Enter your email.")).closest('[data-slot="field-error"]') as HTMLElement;
      expect(error.className).toContain("text-akso-danger");
      for (const token of error.className.split(/\s+/)) {
        if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
      }
    });
  });
});
