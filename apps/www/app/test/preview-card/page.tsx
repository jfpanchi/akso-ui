import type { Metadata } from "next";
import { PreviewCardDemo } from "@/components/preview-card-demo";

export const metadata: Metadata = { title: "Preview card test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function PreviewCardTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Preview card test page</h1>
      <PreviewCardDemo />
    </div>
  );
}
