import type { Metadata } from "next";
import { SliderDemo } from "@/components/slider-demo";

export const metadata: Metadata = { title: "Slider test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function SliderTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Slider test page</h1>
      <SliderDemo />
    </div>
  );
}
