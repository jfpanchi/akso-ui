import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it } from "vitest";

import { Progress } from "./progress";

describe("Progress", () => {
  describe("axe", () => {
    it("has no violations with a value, complete and indeterminate", async () => {
      render(
        <main>
          <Progress label="Uploading photo" value={40} />
          <Progress label="Done" value={100} />
          <Progress label="Preparing" value={null} />
        </main>,
      );
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("is a progressbar named by its visible label, with its value", () => {
      render(<Progress label="Uploading photo" value={40} />);
      const bar = screen.getByRole("progressbar", { name: "Uploading photo" });
      expect(bar).toHaveAttribute("aria-valuenow", "40");
      expect(bar).toHaveAttribute("aria-valuemin", "0");
      expect(bar).toHaveAttribute("aria-valuemax", "100");
    });

    it("shows the value as text, not only as the bar length", () => {
      render(<Progress label="Uploading photo" value={40} />);
      expect(screen.getByText("40%")).toBeVisible();
    });

    it("indeterminate has no aria-valuenow", () => {
      render(<Progress label="Preparing" value={null} />);
      expect(screen.getByRole("progressbar", { name: "Preparing" })).not.toHaveAttribute("aria-valuenow");
    });

    it("accepts friendlier text for screen readers", () => {
      render(<Progress label="Steps" value={2} max={5} getAriaValueText={(_, v) => `Step ${v} of 5`} />);
      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "Step 2 of 5");
    });
  });

  describe("keyboard", () => {
    it("is not a Tab stop (it is not interactive)", () => {
      render(<Progress label="Uploading" value={10} />);
      expect(screen.getByRole("progressbar")).not.toHaveAttribute("tabindex");
    });
  });

  describe("styles that e2e tests check further", () => {
    it("the pulse and the width change only run with motion-safe", () => {
      render(<Progress label="Preparing" value={null} />);
      const indicator = document.querySelector('[data-slot="progress-indicator"]') as HTMLElement;
      for (const token of indicator.className.split(/\s+/)) {
        if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
      }
      expect(indicator.className).toContain("motion-safe:data-indeterminate:animate-pulse");
    });
  });
});
