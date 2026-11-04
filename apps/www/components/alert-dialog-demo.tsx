"use client";

import { useState } from "react";
import { LiveRegion } from "akso-ui";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/akso/ui/alert-dialog";

/** Demo used by the docs page and by the e2e tests. */
export function AlertDialogDemo() {
  const [status, setStatus] = useState("");
  return (
    <div className="flex flex-col items-start gap-3">
      <AlertDialog>
        <AlertDialogTrigger variant="danger">Delete account</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>All your files will be deleted. You cannot undo this.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep my account</AlertDialogCancel>
            <AlertDialogAction onClick={() => setStatus("Account deleted.")}>Delete account</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <LiveRegion message={status} visible />
    </div>
  );
}
