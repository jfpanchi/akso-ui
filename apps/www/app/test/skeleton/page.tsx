import type { Metadata } from "next";
import { SkeletonDemo } from "@/components/skeleton-demo";

export const metadata: Metadata = { title: "Skeleton test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function SkeletonTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Skeleton test page</h1>
      <SkeletonDemo />
    </div>
  );
}
