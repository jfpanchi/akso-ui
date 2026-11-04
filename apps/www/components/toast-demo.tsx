"use client";

import { Button } from "@/registry/akso/ui/button";
import { ToastProvider, useToast } from "@/registry/akso/ui/toast";

function Buttons() {
  const toast = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={() => toast.add({ type: "success", title: "Changes saved", description: "Your profile is up to date." })}>Save</Button>
      <Button
        onClick={() =>
          toast.add({
            type: "info",
            title: "Message archived",
            actionProps: { children: "Undo", onClick: () => toast.add({ type: "info", title: "Message restored" }) },
          })
        }
      >
        Archive message
      </Button>
      <Button onClick={() => toast.add({ type: "error", title: "Upload failed", description: "Check your connection and try again." })}>
        Upload
      </Button>
    </div>
  );
}

/** Demo used by the docs page and by the e2e tests. */
export function ToastDemo() {
  return (
    <ToastProvider>
      <Buttons />
    </ToastProvider>
  );
}
