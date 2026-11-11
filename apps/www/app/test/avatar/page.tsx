import type { Metadata } from "next";
import { AvatarDemo } from "@/components/avatar-demo";

export const metadata: Metadata = { title: "Avatar test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function AvatarTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Avatar test page</h1>
      <AvatarDemo />
    </div>
  );
}
