import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it, vi } from "vitest";

import { Checkbox } from "./checkbox";
import { Field, FieldError } from "./field";
import { Form } from "./form";

describe("Checkbox", () => {
  describe("axe", () => {
    it("has no violations unchecked, checked, partly checked and disabled", async () => {
      render(
        <main>
          <Checkbox>Unchecked</Checkbox>
          <Checkbox defaultChecked>Checked</Checkbox>
          <Checkbox indeterminate>Partly</Checkbox>
          <Checkbox disabled>Disabled</Checkbox>
        </main>,
      );
      await expectNoA11yViolations(document.body);
    });

    it("has no violations when required and invalid", async () => {
      const user = userEvent.setup();
      render(
        <main>
          <Form>
            <Field name="terms">
              <Checkbox required>I accept the terms</Checkbox>
              <FieldError match="valueMissing">Accept the terms to continue.</FieldError>
            </Field>
            <button type="submit">Continue</button>
          </Form>
        </main>,
      );
      await user.click(screen.getByRole("button", { name: "Continue" }));
      await screen.findByText("Accept the terms to continue.");
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("is a checkbox named by its visible text", () => {
      render(<Checkbox>Send me updates</Checkbox>);
      expect(screen.getByRole("checkbox", { name: "Send me updates" })).toHaveAttribute("aria-checked", "false");
    });

    it("exposes checked and mixed states, and shows a different shape for each", () => {
      render(
        <>
          <Checkbox defaultChecked>On</Checkbox>
          <Checkbox indeterminate>Some</Checkbox>
        </>,
      );
      expect(screen.getByRole("checkbox", { name: "On" })).toHaveAttribute("aria-checked", "true");
      const mixed = screen.getByRole("checkbox", { name: "Some" });
      expect(mixed).toHaveAttribute("aria-checked", "mixed");
      for (const svg of document.querySelectorAll('[data-slot="checkbox-indicator"] svg')) expect(svg).toHaveAttribute("aria-hidden", "true");
    });

    it("clicking the text toggles it", async () => {
      const onCheckedChange = vi.fn();
      const user = userEvent.setup();
      render(<Checkbox onCheckedChange={onCheckedChange}>Remember me</Checkbox>);
      await user.click(screen.getByText("Remember me"));
      expect(screen.getByRole("checkbox", { name: "Remember me" })).toHaveAttribute("aria-checked", "true");
      expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
    });

    it("a required checkbox in a Field gets aria-invalid and the error as its description", async () => {
      const user = userEvent.setup();
      render(
        <Form>
          <Field name="terms">
            <Checkbox required>I accept the terms</Checkbox>
            <FieldError match="valueMissing">Accept the terms to continue.</FieldError>
          </Field>
          <button type="submit">Continue</button>
        </Form>,
      );
      await user.click(screen.getByRole("button", { name: "Continue" }));
      const box = screen.getByRole("checkbox", { name: "I accept the terms" });
      await waitFor(() => expect(box).toHaveAttribute("aria-invalid", "true"));
      expect(box).toHaveAccessibleDescription(/Accept the terms to continue\./);
    });
  });

  describe("keyboard", () => {
    it("Tab focuses it and Space toggles it", async () => {
      const user = userEvent.setup();
      render(<Checkbox>Remember me</Checkbox>);
      await user.tab();
      const box = screen.getByRole("checkbox", { name: "Remember me" });
      expectFocused(box);
      await user.keyboard(" ");
      expect(box).toHaveAttribute("aria-checked", "true");
      await user.keyboard(" ");
      expect(box).toHaveAttribute("aria-checked", "false");
    });

    it("a disabled checkbox is skipped by Tab and cannot be toggled", async () => {
      const user = userEvent.setup();
      render(
        <>
          <Checkbox disabled>Off</Checkbox>
          <Checkbox>On</Checkbox>
        </>,
      );
      await user.tab();
      expectFocused(screen.getByRole("checkbox", { name: "On" }));
      await user.click(screen.getByText("Off"));
      expect(screen.getByRole("checkbox", { name: "Off" })).toHaveAttribute("aria-checked", "false");
    });
  });

  describe("styles that e2e tests check further", () => {
    it("the row is at least 44px tall, the box has a focus ring, and nothing uses un-guarded motion", () => {
      render(<Checkbox>Styled</Checkbox>);
      const label = screen.getByText("Styled").closest("label") as HTMLElement;
      expect(label.className).toContain("min-h-11");
      expect(screen.getByRole("checkbox").className).toContain("focus-visible:outline-2");
      for (const el of [label, screen.getByRole("checkbox")]) {
        for (const token of el.className.split(/\s+/)) {
          if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
        }
      }
    });
  });
});
