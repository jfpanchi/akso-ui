import type { Metadata } from "next";
import { StepperDemo } from "@/components/stepper-demo";

export const metadata: Metadata = { title: "Stepper test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function StepperTestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Stepper test page</h1>
      <StepperDemo />
    </div>
  );
}
