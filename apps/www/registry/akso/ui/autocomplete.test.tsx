import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it } from "vitest";

import { Autocomplete } from "./autocomplete";

const cities = ["Bogotá", "Buenos Aires", "Lima", "Quito", "Santiago"];

function City() {
  return (
    <main>
      <Autocomplete label="City" items={cities} placeholder="Type a city" />
    </main>
  );
}

describe("Autocomplete", () => {
  describe("axe", () => {
    it("has no violations closed and with suggestions open", async () => {
      const user = userEvent.setup();
      render(<City />);
      await expectNoA11yViolations(document.body);
      await user.type(screen.getByRole("combobox", { name: "City" }), "b");
      await screen.findByRole("listbox");
      await expectNoA11yViolations(document.body, { disableRules: ["region", "aria-hidden-focus"] /* portaled popup; Base UI hides outside while open */ });
    });
  });

  describe("name, role and state", () => {
    it("the input is a combobox named by its visible label", () => {
      render(<City />);
      expect(screen.getByRole("combobox", { name: "City" })).toHaveAttribute("aria-expanded", "false");
    });

    it("typing shows matching suggestions and announces how many", async () => {
      const user = userEvent.setup();
      render(<City />);
      await user.type(screen.getByRole("combobox", { name: "City" }), "b");
      await waitFor(() => expect(screen.getAllByRole("option")).toHaveLength(2));
      expect(document.querySelector('[data-slot="autocomplete-status"]')).toHaveTextContent("2 suggestions");
    });

    it("free text is allowed: a value that is not a suggestion stays", async () => {
      const user = userEvent.setup();
      render(<City />);
      const input = screen.getByRole("combobox", { name: "City" });
      await user.type(input, "Cuenca");
      expect(await screen.findByText("No suggestions.")).toBeInTheDocument();
      await user.keyboard("{Escape}");
      expect(input).toHaveValue("Cuenca");
    });
  });

  describe("keyboard", () => {
    it("arrows highlight a suggestion and Enter puts it in the input; focus stays there", async () => {
      const user = userEvent.setup();
      render(<City />);
      const input = screen.getByRole("combobox", { name: "City" });
      await user.type(input, "qu");
      await screen.findByRole("listbox");
      await user.keyboard("{ArrowDown}{Enter}");
      expect(input).toHaveValue("Quito");
      expectFocused(input);
    });
  });

  describe("styles that e2e tests check further", () => {
    it("suggestions are 44px with a highlight ring; motion is guarded", async () => {
      const user = userEvent.setup();
      render(<City />);
      await user.type(screen.getByRole("combobox", { name: "City" }), "b");
      const option = (await screen.findAllByRole("option"))[0] as HTMLElement;
      expect(option.className).toContain("min-h-11");
      expect(option.className).toContain("data-highlighted:outline-2");
      const popup = option.closest('[data-slot="autocomplete-content"]') as HTMLElement;
      for (const token of popup.className.split(/\s+/)) {
        if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
      }
    });
  });
});
