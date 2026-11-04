"use client";

import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@/registry/akso/ui/collapsible";

/** Demo used by the docs page and by the e2e tests. */
export function CollapsibleDemo() {
  return (
    <Collapsible>
      <CollapsibleTrigger>Show order details</CollapsibleTrigger>
      <CollapsiblePanel>
        <ul className="list-disc pl-6">
          <li>1 × Notebook, $12</li>
          <li>2 × Pens, $6</li>
        </ul>
      </CollapsiblePanel>
    </Collapsible>
  );
}
