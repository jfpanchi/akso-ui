import type { Metadata } from "next";
import { FileUploadDemo } from "@/components/file-upload-demo";

export const metadata: Metadata = { title: "File upload test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function FileUploadTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">File upload test page</h1>
      <FileUploadDemo />
    </div>
  );
}
