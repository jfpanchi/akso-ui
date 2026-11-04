import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it, vi } from "vitest";

import { Field, FieldError } from "./field";
import { Form } from "./form";
import { Select, SelectContent, SelectGroup, SelectGroupLabel, SelectItem, SelectLabel, SelectTrigger } from "./select";

const countries = [
  { value: "ar", label: "Argentina" },
  { value: "cl", label: "Chile" },
  { value: "ec", label: "Ecuador" },
  { value: "pe", label: "Peru" },
];

function CountrySelect(props: { onValueChange?: (v: unknown) => void; required?: boolean; defaultValue?: string }) {
  return (
    <main>
      <Form>
        <Field name="country" required={props.required}>
          <Select items={countries} defaultValue={props.defaultValue} onValueChange={props.onValueChange}>
            <SelectLabel>Country</SelectLabel>
            <SelectTrigger placeholder="Choose a country" />
            <SelectContent>
              <SelectGroup>
                <SelectGroupLabel>South America</SelectGroupLabel>
                {countries.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldError match="valueMissing">Choose your country.</FieldError>
        </Field>
        <button type="submit">Continue</button>
      </Form>
    </main>
  );
}

async function open() {
  const user = userEvent.setup();
  render(<CountrySelect defaultValue="cl" />);
  const trigger = screen.getByRole("combobox", { name: "Country" });
  trigger.focus();
  await user.keyboard("{ArrowDown}");
  const listbox = await screen.findByRole("listbox");
  return { user, trigger, listbox };
}

describe("Select", () => {
  describe("axe", () => {
    it("has no violations closed", async () => {
      render(<CountrySelect />);
      await expectNoA11yViolations(document.body);
    });

    it("has no violations open", async () => {
      await open();
      // "region" (best practice, not WCAG): the list is rendered in a portal at the end of <body>,
      // outside the page landmarks, like every popup. The e2e axe run (WCAG tags only) covers the rest.
      await expectNoA11yViolations(document.body, { disableRules: ["region"] });
    });

    it("has no violations when required and invalid", async () => {
      const user = userEvent.setup();
      render(<CountrySelect required />);
      await user.click(screen.getByRole("button", { name: "Continue" }));
      await screen.findByText("Choose your country.");
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("the trigger is named by the visible label and shows the placeholder", () => {
      render(<CountrySelect />);
      const trigger = screen.getByRole("combobox", { name: "Country" });
      expect(trigger).toHaveTextContent("Choose a country");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("in a required Field the label shows '(required)' as text, hidden from the name", () => {
      render(<CountrySelect required />);
      expect(screen.getByText("(required)")).toHaveAttribute("aria-hidden", "true");
      expect(screen.getByRole("combobox", { name: "Country" })).toBeInTheDocument();
    });

    it("the open list has named options and marks the chosen one as selected", async () => {
      const { trigger } = await open();
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(screen.getByRole("option", { name: "Chile" })).toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("option", { name: "Peru" })).not.toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("group", { name: "South America" })).toBeInTheDocument();
    });

    it("the chosen option shows a check mark (an icon, not only color)", async () => {
      await open();
      const chosen = screen.getByRole("option", { name: "Chile" });
      expect(chosen.querySelector('[data-slot="select-item-indicator"] svg')).toHaveAttribute("aria-hidden", "true");
    });

    it("required: submitting without a choice links the error and moves focus to the trigger", async () => {
      const user = userEvent.setup();
      render(<CountrySelect required />);
      await user.click(screen.getByRole("button", { name: "Continue" }));
      await screen.findByText("Choose your country.");
      const trigger = screen.getByRole("combobox", { name: "Country" });
      await waitFor(() => expectFocused(trigger));
      expect(trigger).toHaveAccessibleDescription(/Choose your country\./);
    });
  });

  describe("keyboard", () => {
    it("arrows move the highlight, Enter chooses, and focus returns to the trigger", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(<CountrySelect defaultValue="cl" onValueChange={onValueChange} />);
      const trigger = screen.getByRole("combobox", { name: "Country" });
      trigger.focus();
      await user.keyboard("{ArrowDown}");
      await screen.findByRole("listbox");
      await waitFor(() => expectFocused(screen.getByRole("option", { name: "Chile" })));
      await user.keyboard("{ArrowDown}");
      expectFocused(screen.getByRole("option", { name: "Ecuador" }));
      await user.keyboard("{Enter}");
      expect(onValueChange).toHaveBeenCalledWith("ec", expect.anything());
      await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
      expectFocused(trigger);
      expect(trigger).toHaveTextContent("Ecuador");
    });

    it("typing a letter jumps to the matching option (typeahead)", async () => {
      const { user } = await open();
      await user.keyboard("p");
      await waitFor(() => expectFocused(screen.getByRole("option", { name: "Peru" })));
    });

    it("Escape closes without changing the value, and focus returns to the trigger", async () => {
      const { user, trigger } = await open();
      await user.keyboard("{ArrowDown}{Escape}");
      await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
      expectFocused(trigger);
      expect(trigger).toHaveTextContent("Chile");
    });
  });

  describe("styles that e2e tests check further", () => {
    it("options are at least 44px tall, highlight with a ring, and motion is guarded", async () => {
      await open();
      const option = screen.getByRole("option", { name: "Peru" });
      expect(option.className).toEqual(expect.stringContaining("min-h-11"));
      expect(option.className).toContain("data-highlighted:outline-2");
      const popup = option.closest('[data-slot="select-content"]') as HTMLElement;
      for (const el of [popup, option, screen.getByRole("combobox")]) {
        for (const token of el.className.split(/\s+/)) {
          if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
        }
      }
    });
  });
});
