import type { Metadata } from "next";
import { TextareaDemo } from "@/components/textarea-demo";

export const metadata: Metadata = { title: "Textarea test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function TextareaTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Textarea test page</h1>
      <TextareaDemo />
    </div>
  );
}
