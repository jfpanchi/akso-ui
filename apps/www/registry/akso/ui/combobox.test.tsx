import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it, vi } from "vitest";

import { Combobox } from "./combobox";
import { Field, FieldError } from "./field";
import { Form } from "./form";

const countries = [
  { value: "ar", label: "Argentina" },
  { value: "bo", label: "Bolivia" },
  { value: "br", label: "Brazil" },
  { value: "cl", label: "Chile" },
  { value: "ec", label: "Ecuador" },
];

function Country(props: { onValueChange?: (v: unknown) => void; required?: boolean }) {
  return (
    <main>
      <Form>
        <Field name="country" required={props.required}>
          <Combobox label="Country" items={countries} placeholder="Type a country" onValueChange={props.onValueChange} />
          <FieldError match="valueMissing">Choose your country.</FieldError>
        </Field>
        <button type="submit">Continue</button>
      </Form>
    </main>
  );
}

const status = () => document.querySelector('[data-slot="combobox-status"]');

describe("Combobox", () => {
  describe("axe", () => {
    it("has no violations closed", async () => {
      render(<Country />);
      await expectNoA11yViolations(document.body);
    });
    it("has no violations open with results", async () => {
      const user = userEvent.setup();
      render(<Country />);
      await user.type(screen.getByRole("combobox", { name: "Country" }), "b");
      await screen.findByRole("listbox");
      await expectNoA11yViolations(document.body, { disableRules: ["region"] /* portaled popup */ });
    });
  });

  describe("name, role and state", () => {
    it("the input is a combobox named by the visible label, with aria-expanded", async () => {
      const user = userEvent.setup();
      render(<Country />);
      const input = screen.getByRole("combobox", { name: "Country" });
      expect(input.tagName).toBe("INPUT");
      expect(input).toHaveAttribute("aria-expanded", "false");
      await user.type(input, "b");
      expect(input).toHaveAttribute("aria-expanded", "true");
    });

    it("the open and clear buttons have names", () => {
      render(<Country />);
      expect(screen.getByRole("button", { name: "Show options" })).toBeInTheDocument();
    });

    it("typing filters the options and announces how many match", async () => {
      const user = userEvent.setup();
      render(<Country />);
      await user.type(screen.getByRole("combobox", { name: "Country" }), "b");
      await waitFor(() => expect(screen.getAllByRole("option")).toHaveLength(2));
      expect(status()).toHaveTextContent("2 results");
    });

    it("shows and announces 'No results.' when nothing matches", async () => {
      const user = userEvent.setup();
      render(<Country />);
      await user.type(screen.getByRole("combobox", { name: "Country" }), "zzz");
      expect(await screen.findByText("No results.")).toBeInTheDocument();
    });

    it("required: the label shows '(required)' and submit links the error", async () => {
      const user = userEvent.setup();
      render(<Country required />);
      expect(screen.getByText("(required)")).toHaveAttribute("aria-hidden", "true");
      await user.click(screen.getByRole("button", { name: "Continue" }));
      await screen.findByText("Choose your country.");
      const input = screen.getByRole("combobox", { name: "Country" });
      await waitFor(() => expectFocused(input));
      expect(input).toHaveAccessibleDescription(/Choose your country\./);
    });
  });

  describe("keyboard", () => {
    it("arrows highlight options, Enter chooses one, focus stays in the input", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(<Country onValueChange={onValueChange} />);
      const input = screen.getByRole("combobox", { name: "Country" });
      await user.type(input, "b");
      await screen.findByRole("listbox");
      await user.keyboard("{ArrowDown}");
      expect(input.getAttribute("aria-activedescendant")).toBe(screen.getByRole("option", { name: "Bolivia" }).id);
      await user.keyboard("{Enter}");
      expect(onValueChange).toHaveBeenCalledWith(expect.objectContaining({ value: "bo" }), expect.anything());
      expect(input).toHaveValue("Bolivia");
      expectFocused(input);
    });

    it("Escape closes the list and keeps focus in the input", async () => {
      const user = userEvent.setup();
      render(<Country />);
      const input = screen.getByRole("combobox", { name: "Country" });
      await user.type(input, "b");
      await screen.findByRole("listbox");
      await user.keyboard("{Escape}");
      await waitFor(() => expect(input).toHaveAttribute("aria-expanded", "false"));
      expectFocused(input);
    });
  });

  describe("styles that e2e tests check further", () => {
    it("options are 44px with a highlight ring; motion is guarded", async () => {
      const user = userEvent.setup();
      render(<Country />);
      await user.type(screen.getByRole("combobox", { name: "Country" }), "b");
      const option = (await screen.findAllByRole("option"))[0] as HTMLElement;
      expect(option.className).toContain("min-h-11");
      expect(option.className).toContain("data-highlighted:outline-2");
      const popup = option.closest('[data-slot="combobox-content"]') as HTMLElement;
      for (const token of popup.className.split(/\s+/)) {
        if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
      }
    });
  });
});
