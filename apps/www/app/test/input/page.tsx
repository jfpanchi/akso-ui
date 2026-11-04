import type { Metadata } from "next";
import { InputDemo } from "@/components/input-demo";

export const metadata: Metadata = { title: "Input test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function InputTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Input test page</h1>
      <InputDemo />
    </div>
  );
}
