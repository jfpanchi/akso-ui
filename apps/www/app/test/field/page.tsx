import type { Metadata } from "next";
import { FieldDemo } from "@/components/field-demo";

export const metadata: Metadata = { title: "Field test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function FieldTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Field test page</h1>
      <FieldDemo />
    </div>
  );
}
