import type { Metadata } from "next";
import { SeparatorDemo } from "@/components/separator-demo";

export const metadata: Metadata = { title: "Separator test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function SeparatorTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Separator test page</h1>
      <SeparatorDemo />
    </div>
  );
}
