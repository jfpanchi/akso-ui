import type { Metadata } from "next";
import { FieldsetDemo } from "@/components/fieldset-demo";

export const metadata: Metadata = { title: "Fieldset test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function FieldsetTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Fieldset test page</h1>
      <FieldsetDemo />
    </div>
  );
}
