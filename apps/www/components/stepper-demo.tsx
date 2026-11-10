"use client";

import * as React from "react";

import { Stepper } from "@/registry/akso/ui/stepper";

const steps = [
  { label: "Cart", href: "#cart" },
  { label: "Shipping", href: "#shipping" },
  { label: "Payment", href: "#payment" },
  { label: "Review", href: "#review" },
];

/** Demo used by the docs page and by the e2e tests. */
export function StepperDemo() {
  const [current, setCurrent] = React.useState(2);
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const go = (next: number) => {
    setCurrent(next);
    // Move focus to the new step's heading, so keyboard and screen reader users start there.
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  return (
    <div className="flex flex-col gap-4">
      <Stepper steps={steps} current={current} label="Checkout steps" />
      <h2 ref={headingRef} tabIndex={-1} className="text-lg font-semibold outline-none">
        {steps[current]?.label}
      </h2>
      <div className="flex gap-3">
        <button
          type="button"
          disabled={current === 0}
          onClick={() => go(current - 1)}
          className="min-h-11 rounded-md border border-akso-border px-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-akso-focus-ring disabled:opacity-60"
        >
          Back
        </button>
        <button
          type="button"
          disabled={current === steps.length - 1}
          onClick={() => go(current + 1)}
          className="min-h-11 rounded-md bg-akso-primary px-4 text-akso-primary-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-akso-focus-ring disabled:opacity-60"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
