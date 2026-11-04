import type { Metadata } from "next";
import { ToastDemo } from "@/components/toast-demo";

export const metadata: Metadata = { title: "Toast test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function ToastTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Toast test page</h1>
      <ToastDemo />
    </div>
  );
}
