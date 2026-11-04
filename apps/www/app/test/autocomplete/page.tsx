import type { Metadata } from "next";
import { AutocompleteDemo } from "@/components/autocomplete-demo";

export const metadata: Metadata = { title: "Autocomplete test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function AutocompleteTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Autocomplete test page</h1>
      <AutocompleteDemo />
    </div>
  );
}
