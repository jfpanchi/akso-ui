"use client";

import { Slider } from "@/registry/akso/ui/slider";

/** Demo used by the docs page and by the e2e tests. */
export function SliderDemo() {
  return (
    <div className="flex max-w-md flex-col gap-8">
      <Slider label="Volume" defaultValue={40} step={5} />
      <Slider label="Room temperature" defaultValue={21} min={16} max={28} getValueText={(v) => `${v} degrees`} />
    </div>
  );
}
