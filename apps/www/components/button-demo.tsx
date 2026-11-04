"use client";

import { useState } from "react";
import { LiveRegion } from "akso-ui";
import { Button } from "@/registry/akso/ui/button";

/** Demo used by the docs page and by the e2e tests. */
export function ButtonDemo() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Delete</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm">Small</Button>
        <Button size="icon" aria-label="Settings">
          <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" />
          </svg>
        </Button>
        <Button disabled>Disabled</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="primary"
          loading={loading}
          loadingText="Saving"
          onClick={() => {
            setLoading(true);
            setStatus("");
            setTimeout(() => {
              setLoading(false);
              setStatus("Changes saved.");
            }, 1500);
          }}
        >
          Save changes
        </Button>
      </div>
      <LiveRegion message={status} />
    </div>
  );
}
