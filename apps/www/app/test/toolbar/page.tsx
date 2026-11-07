import type { Metadata } from "next";
import { ToolbarDemo } from "@/components/toolbar-demo";

export const metadata: Metadata = { title: "Toolbar test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function ToolbarTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Toolbar test page</h1>
      <ToolbarDemo />
    </div>
  );
}
