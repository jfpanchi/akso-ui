import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it, vi } from "vitest";

import * as akso from "@/registry/akso/lib/akso-form";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, type TableSortDirection } from "./table";

function Orders({ direction = "none" as TableSortDirection, onSort = () => {} }) {
  return (
    <Table>
      <TableCaption>Recent orders</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead onSort={onSort} sortDirection={direction}>
            Customer
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableHead scope="row">A-1</TableHead>
          <TableCell>Ana</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

describe("Table", () => {
  describe("axe", () => {
    it("has no violations, unsorted and sorted", async () => {
      const { rerender } = render(
        <main>
          <Orders />
        </main>,
      );
      await expectNoA11yViolations(document.body);
      rerender(
        <main>
          <Orders direction="ascending" />
        </main>,
      );
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("is a table named by its caption, with column and row headers", () => {
      render(<Orders />);
      const table = screen.getByRole("table", { name: "Recent orders" });
      expect(within(table).getAllByRole("columnheader").map((h) => h.textContent)).toEqual(["Order", "Customer"]);
      expect(within(table).getByRole("rowheader", { name: "A-1" })).toHaveAttribute("scope", "row");
      expect(within(table).getByRole("cell", { name: "Ana" })).toBeInTheDocument();
    });

    it("a sortable header has a button; aria-sort is set only when the column is sorted", () => {
      const { rerender } = render(<Orders />);
      const header = screen.getByRole("columnheader", { name: "Customer" });
      expect(within(header).getByRole("button", { name: "Customer" })).toBeInTheDocument();
      expect(header).not.toHaveAttribute("aria-sort");
      rerender(<Orders direction="descending" />);
      expect(header).toHaveAttribute("aria-sort", "descending");
      expect(screen.getByRole("columnheader", { name: "Order" })).not.toHaveAttribute("aria-sort");
    });

    it("pressing the header button calls onSort; a new sort is announced, the first render is not", async () => {
      const spy = vi.spyOn(akso, "announce");
      const onSort = vi.fn();
      const user = userEvent.setup();
      const { rerender } = render(<Orders direction="ascending" onSort={onSort} />);
      expect(spy).not.toHaveBeenCalled();
      await user.click(screen.getByRole("button", { name: "Customer" }));
      expect(onSort).toHaveBeenCalled();
      rerender(<Orders direction="descending" onSort={onSort} />);
      expect(spy).toHaveBeenCalledWith("Sorted by Customer, descending", expect.anything());
      spy.mockRestore();
    });

    it("the arrow shows the direction (not color) and is hidden from screen readers", () => {
      const { rerender } = render(<Orders direction="ascending" />);
      const icon = () => screen.getByRole("button", { name: "Customer" }).querySelector("svg")!;
      expect(icon()).toHaveAttribute("aria-hidden", "true");
      const up = icon().innerHTML;
      rerender(<Orders direction="descending" />);
      expect(icon().innerHTML).not.toBe(up);
    });
  });

  describe("keyboard", () => {
    it("the scroll container is a named, focusable region only when the table does not fit", () => {
      const sizes = { scrollWidth: 300, clientWidth: 300 };
      const scroll = vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockImplementation(() => sizes.scrollWidth);
      const client = vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(() => sizes.clientWidth);
      const { unmount } = render(<Orders />);
      const container = () => document.querySelector('[data-slot="table-container"]')!;
      expect(container()).not.toHaveAttribute("tabindex");
      unmount();
      sizes.scrollWidth = 900;
      render(<Orders />);
      act(() => {});
      expect(container()).toHaveAttribute("tabindex", "0");
      expect(screen.getByRole("region", { name: "Recent orders" })).toBe(container());
      scroll.mockRestore();
      client.mockRestore();
    });
  });

  describe("styles that e2e tests check further", () => {
    it("sort buttons are 44px with a focus ring; the container scrolls and has a focus ring", () => {
      render(<Orders />);
      const button = screen.getByRole("button", { name: "Customer" });
      expect(button.className).toContain("min-h-11");
      expect(button.className).toContain("focus-visible:outline-2");
      const container = document.querySelector('[data-slot="table-container"]')!;
      expect(container.className).toContain("overflow-x-auto");
      expect(container.className).toContain("focus-visible:outline-2");
    });
  });
});
