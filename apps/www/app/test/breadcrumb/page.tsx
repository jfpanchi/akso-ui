import type { Metadata } from "next";
import { BreadcrumbDemo } from "@/components/breadcrumb-demo";

export const metadata: Metadata = { title: "Breadcrumb test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function BreadcrumbTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Breadcrumb test page</h1>
      <BreadcrumbDemo />
    </div>
  );
}
