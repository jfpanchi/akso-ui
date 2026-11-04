import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it, vi } from "vitest";

import { Field, FieldError, FieldLabel } from "./field";
import { Form, type FormProps } from "./form";
import { Input } from "./input";

const announcer = () => document.getElementById("akso-announcer");

function SignUp(props: Partial<FormProps>) {
  return (
    <main>
      <Form {...props}>
        <Field name="name" required>
          <FieldLabel>Name</FieldLabel>
          <Input autoComplete="name" />
          <FieldError match="valueMissing">Enter your name.</FieldError>
        </Field>
        <Field name="email" required>
          <FieldLabel>Email</FieldLabel>
          <Input type="email" autoComplete="email" />
          <FieldError match="valueMissing">Enter your email.</FieldError>
        </Field>
        <button type="submit">Create account</button>
      </Form>
    </main>
  );
}

describe("Form", () => {
  describe("axe", () => {
    it("has no violations in its default state", async () => {
      render(<SignUp />);
      await expectNoA11yViolations(document.body);
    });

    it("has no violations after a submit with errors", async () => {
      const user = userEvent.setup();
      render(<SignUp />);
      await user.click(screen.getByRole("button", { name: "Create account" }));
      await screen.findByText("Enter your name.");
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("turns off native error bubbles, so only the accessible Field errors are shown", () => {
      render(<SignUp />);
      expect(screen.getByRole("button", { name: "Create account" }).closest("form")).toHaveAttribute("novalidate");
    });

    it("does not submit while there are errors, and submits values when valid", async () => {
      const onFormSubmit = vi.fn();
      const user = userEvent.setup();
      render(<SignUp onFormSubmit={onFormSubmit} />);
      await user.click(screen.getByRole("button", { name: "Create account" }));
      await screen.findByText("Enter your name.");
      expect(onFormSubmit).not.toHaveBeenCalled();

      await user.type(screen.getByRole("textbox", { name: "Name" }), "Ada");
      await user.type(screen.getByRole("textbox", { name: "Email" }), "ada@example.com");
      await user.click(screen.getByRole("button", { name: "Create account" }));
      await waitFor(() => expect(onFormSubmit).toHaveBeenCalledWith({ name: "Ada", email: "ada@example.com" }, expect.anything()));
    });

    it("shows server errors from the errors prop on the right field (FieldError without match)", async () => {
      render(
        <main>
          <Form errors={{ email: "This email already has an account." }}>
            <Field name="email">
              <FieldLabel>Email</FieldLabel>
              <Input type="email" defaultValue="ada@example.com" />
              <FieldError />
            </Field>
          </Form>
        </main>,
      );
      const email = screen.getByRole("textbox", { name: "Email" });
      expect(await screen.findByText("This email already has an account.")).toBeInTheDocument();
      expect(email).toHaveAccessibleDescription(/already has an account/);
    });
  });

  describe("announcements", () => {
    it("announces how many fields need attention after a submit with errors", async () => {
      const user = userEvent.setup();
      render(<SignUp />);
      await user.click(screen.getByRole("button", { name: "Create account" }));
      await waitFor(() => expect(announcer()).toHaveTextContent("2 fields need attention."));
    });

    it("uses the singular for one field, and the message can be translated", async () => {
      const user = userEvent.setup();
      render(<SignUp invalidMessage={(n) => (n === 1 ? "Revisa 1 campo." : `Revisa ${n} campos.`)} />);
      await user.type(screen.getByRole("textbox", { name: "Name" }), "Ada");
      await user.click(screen.getByRole("button", { name: "Create account" }));
      await waitFor(() => expect(announcer()).toHaveTextContent("Revisa 1 campo."));
    });
  });

  describe("keyboard", () => {
    it("submit moves focus to the first invalid field, in page order", async () => {
      const user = userEvent.setup();
      render(<SignUp />);
      await user.type(screen.getByRole("textbox", { name: "Name" }), "Ada");
      await user.click(screen.getByRole("button", { name: "Create account" }));
      await screen.findByText("Enter your email.");
      expectFocused(screen.getByRole("textbox", { name: "Email" }));
    });

    it("Enter in a field submits the form", async () => {
      const user = userEvent.setup();
      render(<SignUp />);
      await user.tab();
      await user.keyboard("{Enter}");
      expect(await screen.findByText("Enter your name.")).toBeInTheDocument();
    });
  });

  describe("styles that e2e tests check further", () => {
    it("the form uses no un-guarded motion", () => {
      render(<SignUp />);
      const form = screen.getByRole("button").closest("form") as HTMLElement;
      for (const token of form.className.split(/\s+/)) {
        if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
      }
    });
  });

  describe("error summary (errorSummary)", () => {
    function Summary() {
      return (
        <main>
          <Form errorSummary>
            <Field name="name" required>
              <FieldLabel>Name</FieldLabel>
              <Input />
              <FieldError match="valueMissing">Enter your name.</FieldError>
            </Field>
            <Field name="email" required>
              <FieldLabel>Email</FieldLabel>
              <Input type="email" />
              <FieldError match="valueMissing">Enter your email.</FieldError>
            </Field>
            <button type="submit">Create account</button>
          </Form>
        </main>
      );
    }

    it("after a submit with errors, shows a named summary with one link per field and moves focus to it", async () => {
      const user = userEvent.setup();
      render(<Summary />);
      await user.click(screen.getByRole("button", { name: "Create account" }));
      const summary = await screen.findByRole("group", { name: "There is a problem" });
      await waitFor(() => expectFocused(summary));
      expect(screen.getByRole("link", { name: "Name: Enter your name." })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Email: Enter your email." })).toBeInTheDocument();
      await expectNoA11yViolations(document.body);
    });

    it("a link moves focus to its field", async () => {
      const user = userEvent.setup();
      render(<Summary />);
      await user.click(screen.getByRole("button", { name: "Create account" }));
      await user.click(await screen.findByRole("link", { name: "Email: Enter your email." }));
      expectFocused(screen.getByRole("textbox", { name: "Email" }));
    });

    it("does not also announce the count (the summary is read instead)", async () => {
      const user = userEvent.setup();
      render(<Summary />);
      await user.click(screen.getByRole("button", { name: "Create account" }));
      await screen.findByRole("group", { name: "There is a problem" });
      await new Promise((r) => setTimeout(r, 300));
      expect(announcer()?.textContent ?? "").toBe("");
    });

    it("is not shown when the form is valid", async () => {
      const user = userEvent.setup();
      render(<Summary />);
      await user.type(screen.getByRole("textbox", { name: "Name" }), "Ada");
      await user.type(screen.getByRole("textbox", { name: "Email" }), "ada@example.com");
      await user.click(screen.getByRole("button", { name: "Create account" }));
      await new Promise((r) => setTimeout(r, 100));
      expect(screen.queryByRole("group", { name: "There is a problem" })).not.toBeInTheDocument();
    });
  });
});
