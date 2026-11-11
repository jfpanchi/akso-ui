import type { Metadata } from "next";
import { PasswordFieldDemo } from "@/components/password-field-demo";

export const metadata: Metadata = { title: "Password field test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function PasswordFieldTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Password field test page</h1>
      <PasswordFieldDemo />
    </div>
  );
}
