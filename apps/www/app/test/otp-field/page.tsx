import type { Metadata } from "next";
import { OtpFieldDemo } from "@/components/otp-field-demo";

export const metadata: Metadata = { title: "OTP field test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function OtpFieldTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">OTP field test page</h1>
      <OtpFieldDemo />
    </div>
  );
}
