import type { Metadata } from "next";
import { NavigationMenuDemo } from "@/components/navigation-menu-demo";

export const metadata: Metadata = { title: "Navigation menu test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function NavigationMenuTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Navigation menu test page</h1>
      <NavigationMenuDemo />
    </div>
  );
}
