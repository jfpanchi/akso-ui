"use client";

import { useState } from "react";
import { LiveRegion } from "akso-ui";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/akso/ui/dialog";
import { focusRingClassName } from "@/registry/akso/lib/akso-styles";
import { Button } from "@/registry/akso/ui/button";

/** Demo used by the docs page and by the e2e tests. */
export function DialogDemo() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Ada Lovelace");
  const [status, setStatus] = useState("");

  return (
    <div className="flex flex-col items-start gap-3">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>Edit profile</DialogTrigger>
        <DialogContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              setName(String(data.get("name") ?? ""));
              setStatus("Profile saved.");
              setOpen(false);
            }}
          >
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>Change your name and press Save.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="profile-name" className="font-medium">
                Name
              </label>
              <input
                id="profile-name"
                name="name"
                defaultValue={name}
                autoComplete="name"
                className={"min-h-11 w-full rounded-md border border-akso-border bg-akso-surface px-3 text-base text-akso-foreground " + focusRingClassName}
              />
            </div>
            <DialogFooter>
              <DialogClose>Cancel</DialogClose>
              <Button type="submit" variant="primary">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <p>
        Current name: <strong>{name}</strong>
      </p>
      <LiveRegion message={status} />
    </div>
  );
}
