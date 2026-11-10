"use client";

import * as React from "react";

import { SearchField } from "@/registry/akso/ui/search-field";

const components = ["Accordion", "Alert", "Avatar", "Badge", "Button", "Carousel", "Checkbox", "Dialog", "Link", "Menu", "Select", "Table", "Tabs", "Toast"];

/** Demo used by the docs page and by the e2e tests. */
export function SearchFieldDemo() {
  const [query, setQuery] = React.useState("");
  const results = components.filter((c) => c.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <div className="flex max-w-sm flex-col gap-3">
      <SearchField label="Search components" value={query} onValueChange={setQuery} resultCount={results.length} />
      <ul aria-label="Components" className="flex flex-col gap-1">
        {results.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      {results.length === 0 ? <p>No components match “{query}”.</p> : null}
    </div>
  );
}
