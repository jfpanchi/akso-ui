import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AksoLocaleProvider } from "@/registry/akso/lib/akso-locale";
import { Field, FieldDescription, FieldLabel } from "./field";
import { OtpField } from "./otp-field";

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

function Code(props: Partial<React.ComponentProps<typeof OtpField>>) {
  return (
    <Field>
      <FieldLabel>Verification code</FieldLabel>
      <FieldDescription>Enter the 6-digit code.</FieldDescription>
      <OtpField length={6} {...props} />
    </Field>
  );
}

const boxes = () => screen.getAllByRole("textbox");

describe("OtpField", () => {
  describe("axe", () => {
    it("has no violations, empty, grouped, filled and disabled", async () => {
      render(
        <main>
          <Code groupSize={3} />
          <Field>
            <FieldLabel>Backup code</FieldLabel>
            <OtpField length={4} validationType="alphanumeric" defaultValue="AB12" />
          </Field>
          <Field disabled>
            <FieldLabel>PIN</FieldLabel>
            <OtpField length={4} disabled />
          </Field>
        </main>,
      );
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("is a group named by the label; the first box uses the label, the others say which digit they are", () => {
      render(<Code />);
      const group = screen.getByRole("group", { name: "Verification code" });
      expect(group).toHaveAccessibleDescription("Enter the 6-digit code.");
      expect(boxes()).toHaveLength(6);
      expect(boxes()[0]).toHaveAccessibleName("Verification code");
      expect(boxes()[0]).toHaveAttribute("autocomplete", "one-time-code");
      expect(boxes()[1]).toHaveAccessibleName("Digit 2 of 6");
      expect(boxes()[5]).toHaveAccessibleName("Digit 6 of 6");
    });

    it("says 'Character' for codes with letters, and uses the AksoLocaleProvider texts", () => {
      render(
        <AksoLocaleProvider locale="es">
          <Code validationType="alphanumeric" />
        </AksoLocaleProvider>,
      );
      expect(boxes()[1]).toHaveAccessibleName("Carácter 2 de 6");
    });

    it("slotLabel overrides the box names", () => {
      render(<Code slotLabel={(n, total) => `Box ${n}/${total}`} />);
      expect(boxes()[2]).toHaveAccessibleName("Box 3/6");
    });

    it("groupSize adds a separator between groups", () => {
      render(<Code groupSize={3} />);
      expect(screen.getAllByRole("separator")).toHaveLength(1);
    });

    it("required inside a Field: the boxes are required", () => {
      render(
        <Field required>
          <FieldLabel>Code</FieldLabel>
          <OtpField length={4} />
        </Field>,
      );
      expect(boxes()[0]).toBeRequired();
    });

    it("logs an error in development without a label", () => {
      const error = vi.spyOn(console, "error").mockImplementation(() => {});
      render(<OtpField length={4} />);
      expect(error).toHaveBeenCalledWith(expect.stringContaining("OtpField has no accessible name"));
    });
  });

  describe("typing and announcements", () => {
    it("typing fills the boxes and moves to the next one; a letter is rejected and announced", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Code onValueChange={onValueChange} />);
      await user.click(boxes()[0]!);
      await user.keyboard("12");
      expect(onValueChange).toHaveBeenLastCalledWith("12", expect.anything());
      expectFocused(boxes()[2]!);
      await user.keyboard("a");
      expect(boxes()[2]).toHaveValue("");
      await act(() => new Promise((r) => setTimeout(r, 150)));
      expect(document.querySelector('[data-slot="announcer"]')).toHaveTextContent("Only numbers are allowed.");
    });

    it("rejectedMessage overrides the announcement", async () => {
      const user = userEvent.setup();
      render(<Code rejectedMessage="Numbers only, please." />);
      await user.click(boxes()[0]!);
      await user.keyboard("x");
      await act(() => new Promise((r) => setTimeout(r, 150)));
      expect(document.querySelector('[data-slot="announcer"]')).toHaveTextContent("Numbers only, please.");
    });

    it("pasting the whole code fills every box", async () => {
      const user = userEvent.setup();
      const onValueComplete = vi.fn();
      render(<Code onValueComplete={onValueComplete} />);
      await user.click(boxes()[0]!);
      await user.paste("123456");
      expect(boxes().map((b) => (b as HTMLInputElement).value).join("")).toBe("123456");
      expect(onValueComplete).toHaveBeenCalledWith("123456", expect.anything());
    });
  });

  describe("keyboard", () => {
    it("one Tab stop; arrows and Home move between boxes; End goes to the next empty box; Backspace goes back", async () => {
      const user = userEvent.setup();
      render(
        <>
          <Code defaultValue="123" />
          <button type="button">After</button>
        </>,
      );
      await user.tab();
      const focused = document.activeElement as HTMLElement;
      expect(boxes()).toContain(focused);
      await user.keyboard("{Home}");
      expectFocused(boxes()[0]!);
      await user.keyboard("{ArrowRight}");
      expectFocused(boxes()[1]!);
      await user.keyboard("{ArrowLeft}");
      expectFocused(boxes()[0]!);
      await user.keyboard("{End}");
      expectFocused(boxes()[3]!);
      await user.keyboard("{Backspace}");
      expectFocused(boxes()[2]!);
      expect(boxes()[2]).toHaveValue("");
      await user.tab();
      expectFocused(screen.getByRole("button", { name: "After" }));
    });
  });

  describe("styles that e2e tests check further", () => {
    it("44px tall boxes with a focus ring; nothing animated", () => {
      render(<Code groupSize={3} />);
      for (const box of boxes()) {
        expect(box.className).toContain("h-11");
        expect(box.className).toContain("focus-visible:outline-2");
      }
      for (const el of document.querySelectorAll<HTMLElement>('[data-slot^="otp-field"]')) {
        for (const token of el.className.split(/\s+/)) {
          if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
        }
      }
    });
  });
});
