import type { Metadata } from "next";
import { BadgeDemo } from "@/components/badge-demo";

export const metadata: Metadata = { title: "Badge test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function BadgeTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Badge test page</h1>
      <BadgeDemo />
    </div>
  );
}
