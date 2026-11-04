import type { Metadata } from "next";
import { ComboboxDemo } from "@/components/combobox-demo";

export const metadata: Metadata = { title: "Combobox test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function ComboboxTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Combobox test page</h1>
      <ComboboxDemo />
    </div>
  );
}
