import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it, vi } from "vitest";

import { Slider } from "./slider";

describe("Slider", () => {
  describe("axe", () => {
    it("has no violations", async () => {
      render(
        <main>
          <Slider label="Volume" defaultValue={40} />
          <Slider label="Temperature" defaultValue={20} min={10} max={30} getValueText={(v) => `${v} degrees`} disabled />
        </main>,
      );
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("is a slider named by its visible label, with its value, also shown as text", () => {
      render(<Slider label="Volume" defaultValue={40} />);
      const slider = screen.getByRole("slider", { name: "Volume" });
      // A native <input type="range">: the limits are its min/max attributes.
      expect(slider.tagName).toBe("INPUT");
      expect(slider).toHaveAttribute("aria-valuenow", "40");
      expect(slider).toHaveAttribute("min", "0");
      expect(slider).toHaveAttribute("max", "100");
      expect(screen.getByText("40")).toBeVisible();
    });

    it("supports friendly value text", () => {
      render(<Slider label="Temperature" defaultValue={20} min={10} max={30} getValueText={(v) => `${v} degrees`} />);
      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuetext", "20 degrees");
    });

    it("the − and + buttons change the value with one tap (no dragging needed)", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(<Slider label="Volume" defaultValue={40} step={5} onValueChange={onValueChange} />);
      await user.click(screen.getByRole("button", { name: "Increase" }));
      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "45");
      await user.click(screen.getByRole("button", { name: "Decrease" }));
      await user.click(screen.getByRole("button", { name: "Decrease" }));
      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "35");
      expect(onValueChange).toHaveBeenLastCalledWith(35);
    });

    it("the buttons are disabled at the limits", () => {
      render(<Slider label="Volume" defaultValue={100} />);
      expect(screen.getByRole("button", { name: "Increase" })).toBeDisabled();
    });
  });

  describe("keyboard", () => {
    it("one Tab stop (the thumb); arrows, Home and End change the value", async () => {
      const user = userEvent.setup();
      render(
        <>
          <Slider label="Volume" defaultValue={40} />
          <button type="button">After</button>
        </>,
      );
      await user.tab();
      const slider = screen.getByRole("slider", { name: "Volume" });
      expectFocused(slider);
      await user.keyboard("{ArrowRight}");
      expect(slider).toHaveAttribute("aria-valuenow", "41");
      await user.keyboard("{End}");
      expect(slider).toHaveAttribute("aria-valuenow", "100");
      await user.keyboard("{Home}");
      expect(slider).toHaveAttribute("aria-valuenow", "0");
      await user.tab();
      expectFocused(screen.getByRole("button", { name: "After" }));
    });
  });

  describe("styles that e2e tests check further", () => {
    it("the thumb is 24px with a focus ring, and nothing uses un-guarded motion", () => {
      render(<Slider label="Volume" defaultValue={40} />);
      const thumb = document.querySelector('[data-slot="slider-thumb"]') as HTMLElement;
      expect(thumb.className).toContain("size-6");
      expect(thumb.className).toContain("has-[:focus-visible]:outline-2");
      for (const el of document.querySelectorAll('[data-slot^="slider"]')) {
        for (const token of (el.getAttribute("class") ?? "").split(/\s+/)) {
          if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
        }
      }
    });
  });
});
