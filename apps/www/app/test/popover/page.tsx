import type { Metadata } from "next";
import { PopoverDemo } from "@/components/popover-demo";

export const metadata: Metadata = { title: "Popover test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function PopoverTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Popover test page</h1>
      <PopoverDemo />
    </div>
  );
}
