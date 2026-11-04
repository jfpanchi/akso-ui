import type { Metadata } from "next";
import { AlertDialogDemo } from "@/components/alert-dialog-demo";

export const metadata: Metadata = { title: "Alert dialog test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function AlertDialogTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Alert dialog test page</h1>
      <AlertDialogDemo />
    </div>
  );
}
