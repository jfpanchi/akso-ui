import type { Metadata } from "next";
import { AlertDemo } from "@/components/alert-demo";

export const metadata: Metadata = { title: "Alert test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function AlertTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Alert test page</h1>
      <AlertDemo />
    </div>
  );
}
