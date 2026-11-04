import type { Metadata } from "next";
import { CollapsibleDemo } from "@/components/collapsible-demo";

export const metadata: Metadata = { title: "Collapsible test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function CollapsibleTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Collapsible test page</h1>
      <CollapsibleDemo />
    </div>
  );
}
