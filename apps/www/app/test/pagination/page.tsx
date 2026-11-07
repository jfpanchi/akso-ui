import type { Metadata } from "next";
import { PaginationDemo } from "@/components/pagination-demo";

export const metadata: Metadata = { title: "Pagination test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function PaginationTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Pagination test page</h1>
      <PaginationDemo />
    </div>
  );
}
