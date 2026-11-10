import type { Metadata } from "next";
import { LinkDemo } from "@/components/link-demo";

export const metadata: Metadata = { title: "Link test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function LinkTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Link test page</h1>
      <LinkDemo />
    </div>
  );
}
