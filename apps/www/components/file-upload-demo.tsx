"use client";

import * as React from "react";

import { FileUpload } from "@/registry/akso/ui/file-upload";

/** Demo used by the docs page and by the e2e tests. */
export function FileUploadDemo() {
  const [names, setNames] = React.useState<string[]>([]);
  return (
    <div className="flex max-w-lg flex-col gap-3">
      <FileUpload
        name="documents"
        label="Documents"
        description="PDF or PNG, up to 1 MB each."
        accept=".pdf,image/png"
        maxSize={1024 * 1024}
        multiple
        onFilesChange={(files) => setNames(files.map((f) => f.name))}
      />
      <p className="text-sm text-akso-muted-foreground">
        Files to send: <output data-testid="file-names">{names.length ? names.join(", ") : "none"}</output>
      </p>
    </div>
  );
}
