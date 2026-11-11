import type { Metadata } from "next";
import { SearchFieldDemo } from "@/components/search-field-demo";

export const metadata: Metadata = { title: "Search field test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function SearchFieldTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Search field test page</h1>
      <SearchFieldDemo />
    </div>
  );
}
