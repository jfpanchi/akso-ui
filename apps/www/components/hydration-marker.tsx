"use client";

import { useEffect } from "react";

/**
 * Marks <html data-hydrated> once React has hydrated the page. The e2e tests wait for it
 * (see e2e/fixtures.ts), so they never type or click before React is listening.
 */
export function HydrationMarker() {
  useEffect(() => {
    document.documentElement.dataset.hydrated = "true";
  }, []);
  return null;
}
