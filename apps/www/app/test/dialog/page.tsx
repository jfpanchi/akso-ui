import type { Metadata } from "next";
import { DialogDemo } from "@/components/dialog-demo";

export const metadata: Metadata = { title: "Dialog test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function DialogTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Dialog test page</h1>
      <button type="button" className="min-h-11 rounded-md border border-akso-border px-4">
        Button before the dialog
      </button>
      <DialogDemo />
    </div>
  );
}
