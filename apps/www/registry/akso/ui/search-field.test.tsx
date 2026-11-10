import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AksoLocaleProvider } from "@/registry/akso/lib/akso-locale";
import { SearchField } from "./search-field";

afterEach(() => vi.useRealTimers());

function Demo() {
  const [q, setQ] = React.useState("");
  const items = ["Apple", "Banana", "Cherry"].filter((i) => i.toLowerCase().includes(q.toLowerCase()));
  return <SearchField label="Search fruit" value={q} onValueChange={setQ} resultCount={items.length} />;
}

describe("SearchField", () => {
  describe("axe", () => {
    it("has no violations, empty and with text", async () => {
      const user = userEvent.setup();
      render(
        <main>
          <Demo />
        </main>,
      );
      await expectNoA11yViolations(document.body);
      await user.type(screen.getByRole("searchbox"), "an");
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("a search landmark with a labelled search box", () => {
      render(<Demo />);
      expect(screen.getByRole("search")).toBeInTheDocument();
      expect(screen.getByRole("searchbox", { name: "Search fruit" })).toHaveAttribute("enterkeyhint", "search");
    });

    it("the default label is translated and can be hidden visually", () => {
      render(
        <AksoLocaleProvider locale="es">
          <SearchField hideLabel />
        </AksoLocaleProvider>,
      );
      expect(screen.getByRole("searchbox", { name: "Buscar" })).toBeInTheDocument();
      expect(screen.getByText("Buscar")).toHaveClass("sr-only");
    });

    it("the result count is announced after it changes, once typing pauses", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<Demo />);
      await user.type(screen.getByRole("searchbox"), "an");
      await act(() => vi.advanceTimersByTimeAsync(800));
      expect(document.querySelector('[data-slot="announcer"]')).toHaveTextContent("1 result");
    });
  });

  describe("keyboard", () => {
    it("Clear search empties the field and puts focus back in it; Enter calls onSearch", async () => {
      const user = userEvent.setup();
      const onSearch = vi.fn();
      render(<SearchField label="Search" onSearch={onSearch} />);
      const box = screen.getByRole("searchbox", { name: "Search" });
      await user.type(box, "dialog{Enter}");
      expect(onSearch).toHaveBeenCalledWith("dialog");
      await user.tab();
      expectFocused(screen.getByRole("button", { name: "Clear search" }));
      await user.keyboard("{Enter}");
      expect(box).toHaveValue("");
      expectFocused(box);
      expect(screen.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();
    });
  });

  describe("styles that e2e tests check further", () => {
    it("44px field and button; nothing animated", async () => {
      const user = userEvent.setup();
      render(<SearchField />);
      await user.type(screen.getByRole("searchbox"), "x");
      expect(screen.getByRole("searchbox").className).toContain("min-h-11");
      expect(screen.getByRole("button", { name: "Clear search" }).className).toContain("min-h-11");
      for (const el of document.querySelectorAll<HTMLElement>('[data-slot^="search-field"]')) {
        for (const token of el.className.split(/\s+/)) {
          if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
        }
      }
    });
  });
});
