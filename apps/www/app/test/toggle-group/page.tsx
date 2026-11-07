import type { Metadata } from "next";
import { ToggleGroupDemo } from "@/components/toggle-group-demo";

export const metadata: Metadata = { title: "Toggle group test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function ToggleGroupTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Toggle group test page</h1>
      <ToggleGroupDemo />
    </div>
  );
}
