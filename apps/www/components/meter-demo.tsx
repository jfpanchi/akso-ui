"use client";

import { Meter } from "@/registry/akso/ui/meter";

/** Demo used by the docs page and by the e2e tests. */
export function MeterDemo() {
  return (
    <div className="flex max-w-md flex-col gap-6">
      <Meter label="Storage used" value={30} getAriaValueText={() => "3 GB of 10 GB"} />
      <Meter label="Battery" value={80} />
    </div>
  );
}
