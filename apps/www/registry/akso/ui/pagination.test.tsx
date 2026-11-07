import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it, vi } from "vitest";

import { AksoLocaleProvider } from "@/registry/akso/lib/akso-locale";
import { Pagination, paginationRange } from "./pagination";

describe("paginationRange", () => {
  it("shows the first, the last and the neighbors of the current page", () => {
    expect(paginationRange(5, 12)).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 12]);
    expect(paginationRange(1, 12)).toEqual([1, 2, "ellipsis", 12]);
    expect(paginationRange(3, 5)).toEqual([1, 2, 3, 4, 5]);
    // A single hidden page is shown instead of "…".
    expect(paginationRange(4, 12)).toEqual([1, 2, 3, 4, 5, "ellipsis", 12]);
  });
});

describe("Pagination", () => {
  describe("axe", () => {
    it("has no violations on the first, a middle and the last page", async () => {
      render(
        <main>
          <Pagination page={1} pageCount={12} getHref={(p) => `?p=${p}`} label="Results, top" />
          <Pagination page={5} pageCount={12} getHref={(p) => `?p=${p}`} label="Results" />
          <Pagination page={12} pageCount={12} onPageChange={() => {}} label="Results, bottom" />
        </main>,
      );
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("is a navigation with a list; numbers are named 'Page n'; the current page has aria-current", () => {
      render(<Pagination page={5} pageCount={12} getHref={(p) => `?p=${p}`} />);
      const nav = screen.getByRole("navigation", { name: "Pagination" });
      expect(within(nav).getByRole("list")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Page 4" })).toHaveAttribute("href", "?p=4");
      expect(screen.getByRole("link", { name: "Previous" })).toHaveAttribute("rel", "prev");
      expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute("href", "?p=6");
      const current = nav.querySelector('[aria-current="page"]');
      expect(current).toHaveTextContent("Page 5");
      expect(screen.queryByRole("link", { name: "Page 5" })).toBeNull();
    });

    it("the visible number is part of the name (voice control can say '4')", () => {
      render(<Pagination page={5} pageCount={12} getHref={(p) => `?p=${p}`} />);
      const link = screen.getByRole("link", { name: "Page 4" });
      expect(link.getAttribute("aria-label")).toContain(link.textContent!);
    });

    it("leaves out Previous on the first page and Next on the last one", () => {
      const { rerender } = render(<Pagination page={1} pageCount={3} getHref={(p) => `?p=${p}`} />);
      expect(screen.queryByRole("link", { name: "Previous" })).toBeNull();
      rerender(<Pagination page={3} pageCount={3} getHref={(p) => `?p=${p}`} />);
      expect(screen.queryByRole("link", { name: "Next" })).toBeNull();
    });

    it("renders nothing with a single page", () => {
      const { container } = render(<Pagination page={1} pageCount={1} />);
      expect(container).toBeEmptyDOMElement();
    });

    it("the ellipsis is hidden from screen readers", () => {
      render(<Pagination page={5} pageCount={12} getHref={(p) => `?p=${p}`} />);
      for (const el of document.querySelectorAll('[data-slot="pagination-ellipsis"]')) expect(el).toHaveAttribute("aria-hidden", "true");
    });

    it("uses the AksoLocaleProvider texts", () => {
      render(
        <AksoLocaleProvider locale="es">
          <Pagination page={2} pageCount={3} getHref={(p) => `?p=${p}`} />
        </AksoLocaleProvider>,
      );
      expect(screen.getByRole("navigation", { name: "Paginación" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Anterior" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Siguiente" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Página 1" })).toBeInTheDocument();
    });

    it("renderLink renders router links", () => {
      render(<Pagination page={2} pageCount={3} getHref={(p) => `/r/${p}`} renderLink={({ children, ...props }) => <a data-router="yes" {...props}>{children}</a>} />);
      expect(screen.getByRole("link", { name: "Page 3" })).toHaveAttribute("data-router", "yes");
    });
  });

  describe("keyboard", () => {
    it("buttons mode: Tab reaches each control; Enter calls onPageChange", async () => {
      const onPageChange = vi.fn();
      const user = userEvent.setup();
      render(<Pagination page={2} pageCount={3} onPageChange={onPageChange} />);
      await user.tab();
      expectFocused(screen.getByRole("button", { name: "Previous" }));
      await user.tab();
      expectFocused(screen.getByRole("button", { name: "Page 1" }));
      await user.tab();
      // The current page is not a Tab stop.
      expectFocused(screen.getByRole("button", { name: "Page 3" }));
      await user.keyboard("{Enter}");
      expect(onPageChange).toHaveBeenCalledWith(3);
    });
  });

  describe("styles that e2e tests check further", () => {
    it("44px controls with a focus ring; the current page is bold with a thicker border", () => {
      render(<Pagination page={2} pageCount={3} getHref={(p) => `?p=${p}`} />);
      const link = screen.getByRole("link", { name: "Page 1" });
      expect(link.className).toContain("min-h-11");
      expect(link.className).toContain("min-w-11");
      expect(link.className).toContain("focus-visible:outline-2");
      const current = document.querySelector('[aria-current="page"]')!;
      expect(current.className).toContain("font-bold");
      expect(current.className).toContain("border-2");
    });
  });
});
