"use client";

import { useState } from "react";
import { LiveRegion } from "akso-ui";
import { Switch } from "@/registry/akso/ui/switch";

/** Demo used by the docs page and by the e2e tests. */
export function SwitchDemo() {
  const [status, setStatus] = useState("");
  return (
    <div className="flex flex-col items-start gap-1">
      <Switch onCheckedChange={(on) => setStatus(on ? "Email notifications on." : "Email notifications off.")}>Email notifications</Switch>
      <Switch defaultChecked>Show captions on videos</Switch>
      <Switch disabled>Beta features (not available)</Switch>
      <LiveRegion message={status} />
    </div>
  );
}
