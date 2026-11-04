import type { Metadata } from "next";
import { TooltipDemo } from "@/components/tooltip-demo";

export const metadata: Metadata = { title: "Tooltip test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function TooltipTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Tooltip test page</h1>
      <TooltipDemo />
    </div>
  );
}
