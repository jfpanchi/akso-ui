import type { Metadata } from "next";
import { AccordionDemo } from "@/components/accordion-demo";

export const metadata: Metadata = { title: "Accordion test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function AccordionTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Accordion test page</h1>
      <AccordionDemo />
    </div>
  );
}
