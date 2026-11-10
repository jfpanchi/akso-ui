import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it } from "vitest";

import { PreviewCard, PreviewCardContent, PreviewCardTrigger } from "./preview-card";

function Demo() {
  return (
    <main>
      <p>
        Built on{" "}
        <PreviewCard>
          <PreviewCardTrigger href="https://base-ui.com" delay={0} closeDelay={0}>
            Base UI
          </PreviewCardTrigger>
          <PreviewCardContent>
            <p>Unstyled React components.</p>
          </PreviewCardContent>
        </PreviewCard>{" "}
        and <a href="#next">more</a>.
      </p>
    </main>
  );
}

describe("PreviewCard", () => {
  describe("axe", () => {
    it("has no violations, closed and open", async () => {
      const user = userEvent.setup();
      render(<Demo />);
      await expectNoA11yViolations(document.body);
      await user.tab();
      await screen.findByText("Unstyled React components.");
      // The open card is portaled outside <main>.
      await expectNoA11yViolations(document.body, { disableRules: ["region"] });
    });
  });

  describe("name, role and state", () => {
    it("the trigger is a plain link with its own text as name", () => {
      render(<Demo />);
      const link = screen.getByRole("link", { name: "Base UI" });
      expect(link).toHaveAttribute("href", "https://base-ui.com");
      expect(link).not.toHaveAttribute("aria-expanded");
    });
  });

  describe("keyboard", () => {
    it("focus opens the preview; Escape closes it; the preview is never in the Tab order", async () => {
      const user = userEvent.setup();
      render(<Demo />);
      await user.tab();
      expectFocused(screen.getByRole("link", { name: "Base UI" }));
      await screen.findByText("Unstyled React components.");
      await user.keyboard("{Escape}");
      await waitFor(() => expect(screen.queryByText("Unstyled React components.")).not.toBeInTheDocument());
      expectFocused(screen.getByRole("link", { name: "Base UI" }));
      await user.tab();
      expectFocused(screen.getByRole("link", { name: "more" }));
    });
  });

  describe("styles that e2e tests check further", () => {
    it("underlined link with a focus ring; motion only with motion-safe", async () => {
      const user = userEvent.setup();
      render(<Demo />);
      const link = screen.getByRole("link", { name: "Base UI" });
      expect(link.className).toContain("underline");
      expect(link.className).toContain("focus-visible:outline-2");
      await user.tab();
      await screen.findByText("Unstyled React components.");
      for (const el of document.querySelectorAll<HTMLElement>('[data-slot^="preview-card"]')) {
        for (const token of el.className.split(/\s+/)) {
          if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
        }
      }
    });
  });
});
