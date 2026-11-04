import type { Metadata } from "next";
import { MenuDemo } from "@/components/menu-demo";

export const metadata: Metadata = { title: "Menu test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function MenuTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Menu test page</h1>
      <MenuDemo />
    </div>
  );
}
