import type { Metadata } from "next";
import { CheckboxGroupDemo } from "@/components/checkbox-group-demo";

export const metadata: Metadata = { title: "Checkbox group test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function CheckboxGroupTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Checkbox group test page</h1>
      <CheckboxGroupDemo />
    </div>
  );
}
