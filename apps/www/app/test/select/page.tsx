import type { Metadata } from "next";
import { SelectDemo } from "@/components/select-demo";

export const metadata: Metadata = { title: "Select test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function SelectTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Select test page</h1>
      <SelectDemo />
    </div>
  );
}
