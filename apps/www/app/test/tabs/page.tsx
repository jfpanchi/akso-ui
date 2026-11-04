import type { Metadata } from "next";
import { TabsDemo } from "@/components/tabs-demo";

export const metadata: Metadata = { title: "Tabs test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function TabsTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Tabs test page</h1>
      <TabsDemo />
    </div>
  );
}
