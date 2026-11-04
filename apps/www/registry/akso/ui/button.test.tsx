import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Button, type ButtonSize, type ButtonVariant } from "./button";

const variants: ButtonVariant[] = ["primary", "secondary", "danger", "ghost"];
const sizes: ButtonSize[] = ["default", "sm"];

function SaveButton({ onSave }: { onSave: () => void }) {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      variant="primary"
      loading={loading}
      loadingText="Saving"
      onClick={() => {
        onSave();
        setLoading(true);
      }}
    >
      Save
    </Button>
  );
}

describe("Button", () => {
  describe("axe", () => {
    it("has no violations in every variant and size", async () => {
      render(
        <div>
          {variants.flatMap((variant) =>
            sizes.map((size) => (
              <Button key={`${variant}-${size}`} variant={variant} size={size}>
                {variant} {size}
              </Button>
            )),
          )}
          <Button size="icon" aria-label="Settings">
            <svg aria-hidden="true" />
          </Button>
          <Button disabled>Disabled</Button>
          <Button loading>Save</Button>
        </div>,
      );
      await expectNoA11yViolations(document.body);
    });
  });

  describe("semantics", () => {
    it("is a native button with type=button by default, so it does not submit forms", async () => {
      const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
      const user = userEvent.setup();
      render(
        <form onSubmit={onSubmit}>
          <Button>Plain</Button>
          <Button type="submit">Send</Button>
        </form>,
      );
      const plain = screen.getByRole("button", { name: "Plain" });
      expect(plain.tagName).toBe("BUTTON");
      expect(plain).toHaveAttribute("type", "button");
      await user.click(plain);
      expect(onSubmit).not.toHaveBeenCalled();
      await user.click(screen.getByRole("button", { name: "Send" }));
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it("warns in development when an icon-only button has no name", async () => {
      const error = vi.spyOn(console, "error").mockImplementation(() => {});
      render(
        <Button size="icon">
          <svg aria-hidden="true" />
        </Button>,
      );
      await waitFor(() => expect(error).toHaveBeenCalledWith(expect.stringContaining("Button has no accessible name")));
      error.mockRestore();
    });

    it("does not warn when the icon-only button has an aria-label", () => {
      const error = vi.spyOn(console, "error").mockImplementation(() => {});
      render(
        <Button size="icon" aria-label="Settings">
          <svg aria-hidden="true" />
        </Button>,
      );
      expect(error).not.toHaveBeenCalled();
      error.mockRestore();
    });
  });

  describe("keyboard", () => {
    it("activates with Enter and Space", async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(<Button onClick={onClick}>Go</Button>);
      await user.tab();
      expectFocused(screen.getByRole("button", { name: "Go" }));
      await user.keyboard("{Enter}");
      await user.keyboard(" ");
      expect(onClick).toHaveBeenCalledTimes(2);
    });

    it("a disabled button is skipped by Tab", async () => {
      const user = userEvent.setup();
      render(
        <>
          <Button disabled>Off</Button>
          <Button>On</Button>
        </>,
      );
      await user.tab();
      expectFocused(screen.getByRole("button", { name: "On" }));
    });
  });

  describe("loading", () => {
    it("keeps focus, announces the loading text and ignores further clicks", async () => {
      const onSave = vi.fn();
      const user = userEvent.setup();
      render(<SaveButton onSave={onSave} />);
      await user.tab();
      const button = screen.getByRole("button", { name: "Save" });
      await user.keyboard("{Enter}");

      // Same element, still focused, now named by the loading text.
      expect(button).toHaveAccessibleName("Saving");
      expectFocused(button);
      expect(button).toHaveAttribute("aria-disabled", "true");

      await user.keyboard("{Enter}");
      await user.click(button);
      expect(onSave).toHaveBeenCalledTimes(1);
      await expectNoA11yViolations(document.body);
    });

    it("the spinner is hidden from assistive technology and only spins with motion-safe", () => {
      render(<Button loading>Save</Button>);
      const svg = screen.getByRole("button").querySelector("svg");
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg?.getAttribute("class")).toContain("motion-safe:animate-spin");
    });

    it("respects an explicit aria-label instead of replacing it", () => {
      render(
        <Button loading aria-label="Upload photo" size="icon">
          <svg aria-hidden="true" />
        </Button>,
      );
      expect(screen.getByRole("button")).toHaveAccessibleName("Upload photo");
    });
  });

  describe("styles that e2e tests check further", () => {
    it("has a focus-visible outline and no animated outline or un-guarded motion", () => {
      render(<Button>Styled</Button>);
      const classes = screen.getByRole("button").className.split(/\s+/);
      expect(classes).toContain("focus-visible:outline-2");
      for (const token of classes) {
        if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
      }
      expect(classes.join(" ")).not.toMatch(/transition-(colors|all)/);
    });
  });
});
