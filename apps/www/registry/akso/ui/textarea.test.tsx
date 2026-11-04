import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it } from "vitest";

import { Field, FieldDescription, FieldError, FieldLabel } from "./field";
import { Form } from "./form";
import { Textarea } from "./textarea";

function MessageForm() {
  return (
    <main>
      <Form>
        <Field name="message" required>
          <FieldLabel>Message</FieldLabel>
          <Textarea />
          <FieldDescription>Up to 500 characters.</FieldDescription>
          <FieldError match="valueMissing">Write a message.</FieldError>
        </Field>
        <button type="submit">Send</button>
      </Form>
    </main>
  );
}

describe("Textarea", () => {
  describe("axe", () => {
    it("has no violations in its default state", async () => {
      render(<MessageForm />);
      await expectNoA11yViolations(document.body);
    });

    it("has no violations when invalid", async () => {
      const user = userEvent.setup();
      render(<MessageForm />);
      await user.click(screen.getByRole("button", { name: "Send" }));
      await screen.findByText("Write a message.");
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("is a native multi-line textarea, named and described by its Field, 4 rows by default", () => {
      render(<MessageForm />);
      const textarea = screen.getByRole("textbox", { name: "Message" });
      expect(textarea.tagName).toBe("TEXTAREA");
      expect(textarea).toHaveAttribute("rows", "4");
      expect(textarea).toBeRequired();
      expect(textarea).toHaveAccessibleDescription("Up to 500 characters.");
    });

    it("is validated like Input: aria-invalid and the error in its description", async () => {
      const user = userEvent.setup();
      render(<MessageForm />);
      await user.click(screen.getByRole("button", { name: "Send" }));
      const textarea = screen.getByRole("textbox", { name: "Message" });
      await waitFor(() => expect(textarea).toHaveAttribute("aria-invalid", "true"));
      expect(textarea).toHaveAccessibleDescription(/Write a message\./);
    });
  });

  describe("keyboard", () => {
    it("Enter adds a new line instead of submitting", async () => {
      const user = userEvent.setup();
      render(<MessageForm />);
      await user.tab();
      const textarea = screen.getByRole("textbox", { name: "Message" });
      expectFocused(textarea);
      await user.keyboard("Hello{Enter}world");
      expect(textarea).toHaveValue("Hello\nworld");
      expect(screen.queryByText("Write a message.")).not.toBeInTheDocument();
    });

    it("on submit with errors, focus moves to the textarea", async () => {
      const user = userEvent.setup();
      render(<MessageForm />);
      await user.click(screen.getByRole("button", { name: "Send" }));
      await screen.findByText("Write a message.");
      expectFocused(screen.getByRole("textbox", { name: "Message" }));
    });
  });

  describe("styles that e2e tests check further", () => {
    it("resizes vertically only, has a focus-visible outline and no un-guarded motion", () => {
      render(<MessageForm />);
      const classes = screen.getByRole("textbox").className.split(/\s+/);
      expect(classes).toEqual(expect.arrayContaining(["resize-y", "focus-visible:outline-2"]));
      for (const token of classes) {
        if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
      }
    });
  });

  describe("character counter (maxLength)", () => {
    const announcer = () => document.getElementById("akso-announcer");

    function Note({ max = 30 }: { max?: number }) {
      return (
        <main>
          <Field name="note">
            <FieldLabel>Note</FieldLabel>
            <Textarea maxLength={max} />
          </Field>
        </main>
      );
    }

    it("shows how many characters are left, and the textarea has maxLength", async () => {
      const user = userEvent.setup();
      render(<Note />);
      expect(screen.getByText("30 characters left")).toBeVisible();
      await user.type(screen.getByRole("textbox", { name: "Note" }), "Hello");
      expect(screen.getByText("25 characters left")).toBeVisible();
      expect(screen.getByRole("textbox", { name: "Note" })).toHaveAttribute("maxlength", "30");
      await expectNoA11yViolations(document.body);
    });

    it("announces only at 20, 10 and 0 left, not on every key", async () => {
      const user = userEvent.setup();
      render(<Note />);
      const box = screen.getByRole("textbox", { name: "Note" });
      await user.type(box, "abcde");
      await new Promise((r) => setTimeout(r, 150));
      expect(announcer()?.textContent ?? "").toBe("");
      await user.type(box, "fghij");
      await waitFor(() => expect(announcer()).toHaveTextContent("20 characters left"));
      await user.type(box, "klmnopqrst");
      await waitFor(() => expect(announcer()).toHaveTextContent("10 characters left"));
      await user.type(box, "uvwxyz1234");
      await waitFor(() => expect(announcer()).toHaveTextContent("0 characters left"));
    });

    it("can be hidden with showCount={false}", () => {
      render(
        <Field>
          <FieldLabel>Short note</FieldLabel>
          <Textarea maxLength={10} showCount={false} />
        </Field>,
      );
      expect(screen.queryByText(/characters left/)).not.toBeInTheDocument();
    });

    it("leaves the description from the Field untouched", () => {
      render(
        <Field>
          <FieldLabel>Bio</FieldLabel>
          <Textarea maxLength={10} />
          <FieldDescription>A few words.</FieldDescription>
        </Field>,
      );
      expect(screen.getByRole("textbox", { name: "Bio" })).toHaveAccessibleDescription("A few words.");
    });
  });
});
