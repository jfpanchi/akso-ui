"use client";

import * as React from "react";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, type TableSortDirection } from "@/registry/akso/ui/table";

const orders = [
  { id: "A-1042", customer: "Lucía Pérez", date: "2026-10-02", total: 128.5, status: "Shipped" },
  { id: "A-1043", customer: "Mateo Quispe", date: "2026-10-05", total: 42, status: "Pending" },
  { id: "A-1044", customer: "Ana Silva", date: "2026-09-28", total: 310.25, status: "Delivered" },
];

type Column = "customer" | "date" | "total";

/** Demo used by the docs page and by the e2e tests. */
export function TableDemo() {
  const [sort, setSort] = React.useState<{ column: Column; direction: Exclude<TableSortDirection, "none"> }>({ column: "date", direction: "descending" });
  const sorted = [...orders].sort((a, b) => {
    const order = a[sort.column] < b[sort.column] ? -1 : a[sort.column] > b[sort.column] ? 1 : 0;
    return sort.direction === "ascending" ? order : -order;
  });
  const toggle = (column: Column) => () =>
    setSort((s) => ({ column, direction: s.column === column && s.direction === "ascending" ? "descending" : "ascending" }));
  const direction = (column: Column): TableSortDirection => (sort.column === column ? sort.direction : "none");

  return (
    <Table>
      <TableCaption>Recent orders</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead onSort={toggle("customer")} sortDirection={direction("customer")}>
            Customer
          </TableHead>
          <TableHead onSort={toggle("date")} sortDirection={direction("date")}>
            Date
          </TableHead>
          <TableHead onSort={toggle("total")} sortDirection={direction("total")} className="text-right">
            Total
          </TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((order) => (
          <TableRow key={order.id}>
            <TableHead scope="row">{order.id}</TableHead>
            <TableCell>{order.customer}</TableCell>
            <TableCell>{order.date}</TableCell>
            <TableCell className="text-right tabular-nums">${order.total.toFixed(2)}</TableCell>
            <TableCell>{order.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
