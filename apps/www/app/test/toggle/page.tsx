import type { Metadata } from "next";
import { ToggleDemo } from "@/components/toggle-demo";

export const metadata: Metadata = { title: "Toggle test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function ToggleTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Toggle test page</h1>
      <ToggleDemo />
    </div>
  );
}
