import type { Metadata } from "next";
import { DatePickerDemo } from "@/components/date-picker-demo";

export const metadata: Metadata = { title: "Date picker test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function DatePickerTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Date picker test page</h1>
      <DatePickerDemo />
    </div>
  );
}
