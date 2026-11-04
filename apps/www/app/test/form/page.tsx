import type { Metadata } from "next";
import { FormDemo } from "@/components/form-demo";

export const metadata: Metadata = { title: "Form test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function FormTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Form test page</h1>
      <FormDemo />
    </div>
  );
}
