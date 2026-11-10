"use client";

import * as React from "react";

import { Skeleton, SkeletonContainer } from "@/registry/akso/ui/skeleton";

const orders = [
  { id: "1042", customer: "Laura Torres", total: "$120.00" },
  { id: "1041", customer: "Mateo Ruiz", total: "$64.50" },
  { id: "1040", customer: "Ana Gómez", total: "$310.00" },
];

/** Demo used by the docs page and by the e2e tests. */
export function SkeletonDemo() {
  const [loading, setLoading] = React.useState(true);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const reload = () => {
    setLoading(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setLoading(false), 2500);
  };

  React.useEffect(() => {
    timer.current = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer.current);
  }, []);

  return (
    <section aria-labelledby="orders-heading" className="flex max-w-md flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 id="orders-heading" className="text-lg font-semibold">
          Recent orders
        </h2>
        <button
          type="button"
          onClick={reload}
          className="min-h-11 rounded-md border border-akso-border px-3 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-akso-focus-ring"
        >
          Reload
        </button>
      </div>
      <SkeletonContainer
        loading={loading}
        label="Loading orders"
        loadedLabel="Orders loaded"
        fallback={
          <ul className="flex flex-col gap-3">
            {orders.map((o) => (
              <li key={o.id} className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </li>
            ))}
          </ul>
        }
      >
        <ul className="flex flex-col gap-3">
          {orders.map((o) => (
            <li key={o.id} className="flex min-h-10 flex-col justify-center">
              <span className="font-semibold">
                Order {o.id} · {o.customer}
              </span>
              <span className="text-sm text-akso-muted-foreground">{o.total}</span>
            </li>
          ))}
        </ul>
      </SkeletonContainer>
    </section>
  );
}
