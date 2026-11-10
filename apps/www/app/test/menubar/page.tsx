import type { Metadata } from "next";
import { MenubarDemo } from "@/components/menubar-demo";

export const metadata: Metadata = { title: "Menubar test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function MenubarTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Menubar test page</h1>
      <MenubarDemo />
    </div>
  );
}
