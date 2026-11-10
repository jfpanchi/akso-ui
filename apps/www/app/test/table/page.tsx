import type { Metadata } from "next";
import { TableDemo } from "@/components/table-demo";

export const metadata: Metadata = { title: "Table test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function TableTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Table test page</h1>
      <TableDemo />
    </div>
  );
}
