import type { Metadata } from "next";
import { CheckboxDemo } from "@/components/checkbox-demo";

export const metadata: Metadata = { title: "Checkbox test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function CheckboxTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Checkbox test page</h1>
      <CheckboxDemo />
    </div>
  );
}
