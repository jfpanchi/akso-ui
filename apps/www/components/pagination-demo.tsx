"use client";

import * as React from "react";
import { LiveRegion } from "akso-ui";

import { Pagination } from "@/registry/akso/ui/pagination";

/** Demo used by the docs page and by the e2e tests. */
export function PaginationDemo() {
  const [page, setPage] = React.useState(5);
  return (
    <div className="flex flex-col gap-4">
      <p>Showing results {page * 10 - 9} to {page * 10} of 120.</p>
      <Pagination page={page} pageCount={12} getHref={(p) => `#page-${p}`} onPageChange={setPage} />
      <LiveRegion message={`Page ${page} of 12.`} />
    </div>
  );
}
