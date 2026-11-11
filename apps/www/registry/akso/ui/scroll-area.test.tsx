import { render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "akso-ui/test";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ScrollArea } from "./scroll-area";

afterEach(() => vi.restoreAllMocks());

describe("ScrollArea", () => {
  describe("axe", () => {
    it("has no violations, named by a label or by a heading", async () => {
      render(
        <main>
          <ScrollArea aria-label="Terms">
            <p>Long text.</p>
          </ScrollArea>
          <h2 id="notes">Notes</h2>
          <ScrollArea aria-labelledby="notes" orientation="both">
            <p>More text.</p>
          </ScrollArea>
        </main>,
      );
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("the viewport is a region named by aria-label or aria-labelledby", () => {
      render(
        <>
          <ScrollArea aria-label="Terms">
            <p>Long text.</p>
          </ScrollArea>
          <h2 id="notes">Notes</h2>
          <ScrollArea aria-labelledby="notes">
            <p>More text.</p>
          </ScrollArea>
        </>,
      );
      expect(screen.getByRole("region", { name: "Terms" })).toHaveAttribute("data-slot", "scroll-area-viewport");
      expect(screen.getByRole("region", { name: "Notes" })).toHaveTextContent("More text.");
    });

    it("logs an error in development without a name", () => {
      const error = vi.spyOn(console, "error").mockImplementation(() => {});
      render(
        <ScrollArea>
          <p>Text</p>
        </ScrollArea>,
      );
      expect(error).toHaveBeenCalledWith(expect.stringContaining("ScrollArea has no accessible name"));
    });
  });

  describe("keyboard", () => {
    it("the viewport is focusable only when it can scroll (jsdom: no layout, so not scrollable)", () => {
      render(
        <ScrollArea aria-label="Terms">
          <p>Text</p>
        </ScrollArea>,
      );
      // Base UI sets tabIndex from the measured overflow; the real check runs in Playwright.
      expect(screen.getByRole("region", { name: "Terms" })).toHaveAttribute("tabindex");
    });
  });

  describe("styles that e2e tests check further", () => {
    it("focus ring inside the box; scrollbars do not fade; nothing animated", () => {
      render(
        <ScrollArea aria-label="Terms" orientation="both">
          <p>Text</p>
        </ScrollArea>,
      );
      expect(screen.getByRole("region").className).toContain("focus-visible:-outline-offset-2");
      for (const el of document.querySelectorAll<HTMLElement>('[data-slot^="scroll-area"]')) {
        for (const token of el.className.split(/\s+/)) {
          if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
          if (/opacity-0/.test(token)) throw new Error(`"${token}": scrollbars must stay visible`);
        }
      }
    });
  });
});
