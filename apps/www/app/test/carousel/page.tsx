import type { Metadata } from "next";
import { CarouselDemo } from "@/components/carousel-demo";

export const metadata: Metadata = { title: "Carousel test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function CarouselTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Carousel test page</h1>
      <CarouselDemo />
    </div>
  );
}
