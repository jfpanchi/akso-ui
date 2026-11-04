import type { Metadata } from "next";
import { SwitchDemo } from "@/components/switch-demo";

export const metadata: Metadata = { title: "Switch test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function SwitchTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Switch test page</h1>
      <SwitchDemo />
    </div>
  );
}
