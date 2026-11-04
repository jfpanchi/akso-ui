import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it, vi } from "vitest";

import { Switch } from "./switch";

describe("Switch", () => {
  describe("axe", () => {
    it("has no violations off, on and disabled", async () => {
      render(
        <main>
          <Switch>Off</Switch>
          <Switch defaultChecked>On</Switch>
          <Switch disabled>Disabled</Switch>
        </main>,
      );
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("is a switch named by its visible text, with aria-checked", () => {
      render(<Switch defaultChecked>Dark mode</Switch>);
      expect(screen.getByRole("switch", { name: "Dark mode" })).toHaveAttribute("aria-checked", "true");
    });

    it("clicking the text toggles it", async () => {
      const onCheckedChange = vi.fn();
      const user = userEvent.setup();
      render(<Switch onCheckedChange={onCheckedChange}>Notifications</Switch>);
      await user.click(screen.getByText("Notifications"));
      expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
    });

    it("'on' is shown with a check mark, not only a color", () => {
      render(<Switch defaultChecked>Dark mode</Switch>);
      const icon = screen.getByRole("switch").querySelector("svg");
      expect(icon).toHaveAttribute("aria-hidden", "true");
      expect(icon?.getAttribute("class")).toContain("group-data-checked:block");
    });
  });

  describe("keyboard", () => {
    it("Tab focuses it; Space and Enter toggle it", async () => {
      const user = userEvent.setup();
      render(<Switch>Dark mode</Switch>);
      await user.tab();
      const sw = screen.getByRole("switch", { name: "Dark mode" });
      expectFocused(sw);
      await user.keyboard(" ");
      expect(sw).toHaveAttribute("aria-checked", "true");
      await user.keyboard("{Enter}");
      expect(sw).toHaveAttribute("aria-checked", "false");
    });

    it("a disabled switch is skipped by Tab", async () => {
      const user = userEvent.setup();
      render(
        <>
          <Switch disabled>Off</Switch>
          <Switch>On</Switch>
        </>,
      );
      await user.tab();
      expectFocused(screen.getByRole("switch", { name: "On" }));
    });
  });

  describe("styles that e2e tests check further", () => {
    it("the track is 44×24px, has a focus ring, and its motion is guarded", () => {
      render(<Switch>Styled</Switch>);
      const sw = screen.getByRole("switch");
      expect(sw.className).toEqual(expect.stringContaining("h-6"));
      expect(sw.className).toEqual(expect.stringContaining("w-11"));
      expect(sw.className).toContain("focus-visible:outline-2");
      for (const el of [sw, sw.querySelector('[data-slot="switch-thumb"]') as HTMLElement]) {
        for (const token of el.className.split(/\s+/)) {
          if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
        }
      }
    });
  });
});
