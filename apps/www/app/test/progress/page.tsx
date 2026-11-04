import type { Metadata } from "next";
import { ProgressDemo } from "@/components/progress-demo";

export const metadata: Metadata = { title: "Progress test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function ProgressTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Progress test page</h1>
      <ProgressDemo />
    </div>
  );
}
