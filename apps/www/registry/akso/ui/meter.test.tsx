import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it } from "vitest";

import { Meter } from "./meter";

describe("Meter", () => {
  describe("axe", () => {
    it("has no violations", async () => {
      render(
        <main>
          <Meter label="Storage used" value={30} getAriaValueText={() => "3 GB of 10 GB"} />
        </main>,
      );
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("is a meter named by its visible label, with its value and friendly text", () => {
      render(<Meter label="Storage used" value={30} getAriaValueText={() => "3 GB of 10 GB"} />);
      const meter = screen.getByRole("meter", { name: "Storage used" });
      expect(meter).toHaveAttribute("aria-valuenow", "30");
      expect(meter).toHaveAttribute("aria-valuetext", "3 GB of 10 GB");
    });

    it("shows the value as text", () => {
      render(<Meter label="Battery" value={75} />);
      expect(screen.getByText("75%")).toBeVisible();
    });
  });

  describe("keyboard", () => {
    it("is not a Tab stop", () => {
      render(<Meter label="Battery" value={75} />);
      expect(screen.getByRole("meter")).not.toHaveAttribute("tabindex");
    });
  });

  describe("styles that e2e tests check further", () => {
    it("motion is guarded", () => {
      render(<Meter label="Battery" value={75} />);
      const indicator = document.querySelector('[data-slot="meter-indicator"]') as HTMLElement;
      for (const token of indicator.className.split(/\s+/)) {
        if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
      }
    });
  });
});
