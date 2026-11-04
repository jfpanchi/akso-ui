"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/registry/akso/ui/progress";

/** Demo used by the docs page and by the e2e tests. */
export function ProgressDemo() {
  const [value, setValue] = useState(20);
  useEffect(() => {
    const id = setInterval(() => setValue((v) => (v >= 100 ? 100 : v + 10)), 800);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex max-w-md flex-col gap-6">
      <Progress label="Uploading photo" value={value} />
      <Progress label="Step 2 of 4" value={2} max={4} getAriaValueText={(_, v) => `Step ${v} of 4`} showValue={false} />
      <Progress label="Preparing your download" value={null} />
    </div>
  );
}
