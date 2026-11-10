import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it, vi } from "vitest";

import { AksoLocaleProvider } from "@/registry/akso/lib/akso-locale";
import { DatePicker, parseTypedDate } from "./date-picker";
import { Field, FieldError, FieldLabel } from "./field";

function Appointment({ onValueChange = () => {}, defaultValue = "2026-03-05" }: { onValueChange?: (v: string) => void; defaultValue?: string }) {
  return (
    <Field validationMode="onBlur">
      <FieldLabel>Appointment date</FieldLabel>
      <DatePicker defaultValue={defaultValue} onValueChange={onValueChange} min="2026-01-01" max="2026-12-31" />
      <FieldError />
    </Field>
  );
}

describe("parseTypedDate", () => {
  it("reads month/day/year and day/month/year, and rejects impossible dates", () => {
    expect(parseTypedDate("03/25/2026", "mdy")).toEqual({ y: 2026, m: 2, d: 25 });
    expect(parseTypedDate("25-03-2026", "dmy")).toEqual({ y: 2026, m: 2, d: 25 });
    expect(parseTypedDate("02/30/2026", "mdy")).toBeNull();
    expect(parseTypedDate("3/25/26", "mdy")).toBeNull();
  });
});

describe("DatePicker", () => {
  describe("axe", () => {
    it("has no violations closed and with the calendar open", async () => {
      const user = userEvent.setup();
      render(
        <main>
          <Appointment />
        </main>,
      );
      await expectNoA11yViolations(document.body);
      await user.click(screen.getByRole("button", { name: "Choose date" }));
      await screen.findByRole("grid");
      await expectNoA11yViolations(document.body, { disableRules: ["region"] /* portaled popup */ });
    });
  });

  describe("name, role and state", () => {
    it("the text field is named by the label and described by the format hint", () => {
      render(<Appointment />);
      const input = screen.getByRole("textbox", { name: "Appointment date" });
      expect(input).toHaveValue("03/05/2026");
      expect(input).toHaveAccessibleDescription(/mm\/dd\/yyyy/);
    });

    it("an impossible date shows an error linked to the field", async () => {
      const user = userEvent.setup();
      render(<Appointment />);
      const input = screen.getByRole("textbox", { name: "Appointment date" });
      await user.clear(input);
      await user.type(input, "02/30/2026");
      await user.tab();
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input).toHaveAccessibleDescription(/Enter a real date/);
    });

    it("a typed date is normalized and reported as YYYY-MM-DD", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(<Appointment onValueChange={onValueChange} defaultValue="" />);
      const input = screen.getByRole("textbox", { name: "Appointment date" });
      await user.type(input, "4-7-2026");
      await user.tab();
      expect(onValueChange).toHaveBeenLastCalledWith("2026-04-07");
      expect(input).toHaveValue("04/07/2026");
    });

    it("the calendar is a grid named by its month; days have full names; the selected day is aria-selected", async () => {
      const user = userEvent.setup();
      render(<Appointment />);
      await user.click(screen.getByRole("button", { name: "Choose date" }));
      const grid = await screen.findByRole("grid", { name: "March 2026" });
      const day = within(grid).getByRole("button", { name: "Thursday, March 5, 2026" });
      expect(day.closest("td")).toHaveAttribute("aria-selected", "true");
      expect(within(grid).getAllByRole("columnheader")[0]).toHaveAttribute("abbr", "Sunday");
    });

    it("uses the AksoLocaleProvider format, week start and texts", async () => {
      const user = userEvent.setup();
      render(
        <AksoLocaleProvider locale="es">
          <Appointment />
        </AksoLocaleProvider>,
      );
      expect(screen.getByRole("textbox")).toHaveValue("05/03/2026");
      expect(screen.getByRole("textbox")).toHaveAccessibleDescription(/dd\/mm\/aaaa/);
      await user.click(screen.getByRole("button", { name: "Elegir fecha" }));
      const grid = await screen.findByRole("grid");
      expect(within(grid).getAllByRole("columnheader")[0]).toHaveAttribute("abbr", "lunes");
    });
  });

  describe("keyboard", () => {
    it("opens on the selected day; arrows, Page Down and Home move; Enter picks; focus returns to the button", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(<Appointment onValueChange={onValueChange} />);
      const trigger = screen.getByRole("button", { name: "Choose date" });
      await user.click(trigger);
      const grid = await screen.findByRole("grid");
      expectFocused(within(grid).getByRole("button", { name: "Thursday, March 5, 2026" }));
      await user.keyboard("{ArrowRight}");
      expectFocused(screen.getByRole("button", { name: "Friday, March 6, 2026" }));
      await user.keyboard("{ArrowDown}");
      expectFocused(screen.getByRole("button", { name: "Friday, March 13, 2026" }));
      await user.keyboard("{PageDown}");
      expectFocused(screen.getByRole("button", { name: "Monday, April 13, 2026" }));
      expect(screen.getByRole("grid", { name: "April 2026" })).toBeInTheDocument();
      await user.keyboard("{Home}");
      expectFocused(screen.getByRole("button", { name: "Sunday, April 12, 2026" }));
      await user.keyboard("{Enter}");
      expect(onValueChange).toHaveBeenLastCalledWith("2026-04-12");
      expect(screen.queryByRole("grid")).toBeNull();
      expect(screen.getByRole("textbox")).toHaveValue("04/12/2026");
      expectFocused(trigger);
    });

    it("cannot move outside min and max", async () => {
      const user = userEvent.setup();
      render(<Appointment defaultValue="2026-12-30" />);
      await user.click(screen.getByRole("button", { name: "Choose date" }));
      await screen.findByRole("grid");
      await user.keyboard("{ArrowDown}");
      expectFocused(screen.getByRole("button", { name: "Thursday, December 31, 2026" }));
    });

    it("Escape closes the calendar and focus returns to the button", async () => {
      const user = userEvent.setup();
      render(<Appointment />);
      const trigger = screen.getByRole("button", { name: "Choose date" });
      await user.click(trigger);
      await screen.findByRole("grid");
      await user.keyboard("{Escape}");
      expect(screen.queryByRole("grid")).toBeNull();
      expectFocused(trigger);
    });
  });

  describe("styles that e2e tests check further", () => {
    it("the input and button are 44px; the selected day is bold and filled (not color alone)", async () => {
      const user = userEvent.setup();
      render(<Appointment />);
      expect(screen.getByRole("textbox").className).toContain("min-h-11");
      expect(screen.getByRole("button", { name: "Choose date" }).className).toContain("size-11");
      await user.click(screen.getByRole("button", { name: "Choose date" }));
      const day = await screen.findByRole("button", { name: "Thursday, March 5, 2026" });
      expect(day.className).toContain("font-bold");
      expect(day.className).toContain("focus-visible:outline-2");
    });
  });
});
