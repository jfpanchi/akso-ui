import type { Metadata } from "next";
import { NumberFieldDemo } from "@/components/number-field-demo";

export const metadata: Metadata = { title: "Number field test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function NumberFieldTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Number field test page</h1>
      <NumberFieldDemo />
    </div>
  );
}
