import type { Metadata } from "next";
import { ButtonDemo } from "@/components/button-demo";

export const metadata: Metadata = { title: "Button test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function ButtonTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Button test page</h1>
      <ButtonDemo />
    </div>
  );
}
