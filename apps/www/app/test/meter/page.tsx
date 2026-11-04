import type { Metadata } from "next";
import { MeterDemo } from "@/components/meter-demo";

export const metadata: Metadata = { title: "Meter test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function MeterTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Meter test page</h1>
      <MeterDemo />
    </div>
  );
}
