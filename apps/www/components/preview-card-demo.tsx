"use client";

import { PreviewCard, PreviewCardContent, PreviewCardTrigger } from "@/registry/akso/ui/preview-card";

/** Demo used by the docs page and by the e2e tests. */
export function PreviewCardDemo() {
  return (
    <p className="max-w-prose">
      Akso UI is built on{" "}
      <PreviewCard>
        <PreviewCardTrigger href="https://base-ui.com">Base UI</PreviewCardTrigger>
        <PreviewCardContent>
          <p className="font-semibold">Base UI</p>
          <p className="text-sm text-akso-muted-foreground">Unstyled React components for building accessible user interfaces.</p>
        </PreviewCardContent>
      </PreviewCard>
      , and its components are shared as a{" "}
      <a href="https://ui.shadcn.com/docs/registry" className="rounded-sm text-akso-primary underline underline-offset-2 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-akso-focus-ring">
        shadcn registry
      </a>
      .
    </p>
  );
}
