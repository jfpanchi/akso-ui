import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectFocusTrapped, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it, vi } from "vitest";

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
} from "./alert-dialog";

function DeleteFile({ onDelete = () => {} }: { onDelete?: () => void }) {
  return (
    <main>
      <AlertDialog>
        <AlertDialogTrigger variant="danger">Delete file</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this file?</AlertDialogTitle>
            <AlertDialogDescription>You cannot undo this.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep file</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Delete file</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

async function open(onDelete?: () => void) {
  const user = userEvent.setup();
  render(<DeleteFile onDelete={onDelete} />);
  const trigger = screen.getByRole("button", { name: "Delete file" });
  await user.click(trigger);
  const dialog = await screen.findByRole("alertdialog");
  return { user, trigger, dialog };
}

describe("Alert dialog", () => {
  describe("axe", () => {
    it("has no violations closed", async () => {
      render(<DeleteFile />);
      await expectNoA11yViolations(document.body);
    });
    it("has no violations open", async () => {
      await open();
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("is an alertdialog named by its title and described by its description", async () => {
      const { dialog } = await open();
      expect(dialog).toHaveAccessibleName("Delete this file?");
      expect(dialog).toHaveAccessibleDescription("You cannot undo this.");
    });

    it("the action button says what it does and uses the danger style with text", async () => {
      const { dialog } = await open();
      const action = screen.getAllByRole("button", { name: "Delete file" }).find((b) => dialog.contains(b));
      expect(action?.className).toContain("bg-akso-danger");
    });
  });

  describe("keyboard", () => {
    it("focus starts on the safe choice (Cancel)", async () => {
      await open();
      await waitFor(() => expectFocused(screen.getByRole("button", { name: "Keep file" })));
    });

    it("traps focus with Tab and Shift+Tab", async () => {
      const { user, dialog } = await open();
      await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));
      await expectFocusTrapped(user, dialog);
    });

    it("Escape cancels and focus returns to the trigger", async () => {
      const onDelete = vi.fn();
      const { user, trigger } = await open(onDelete);
      await user.keyboard("{Escape}");
      await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument());
      expectFocused(trigger);
      expect(onDelete).not.toHaveBeenCalled();
    });

    it("clicking outside does not close it", async () => {
      const { user } = await open();
      await user.click(document.body);
      expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    });

    it("the action runs and closes the dialog; focus returns to the trigger", async () => {
      const onDelete = vi.fn();
      const { user, trigger, dialog } = await open(onDelete);
      const action = screen.getAllByRole("button", { name: "Delete file" }).find((b) => dialog.contains(b)) as HTMLElement;
      await user.click(action);
      expect(onDelete).toHaveBeenCalledTimes(1);
      await waitFor(() => expectFocused(trigger));
    });
  });

  describe("styles that e2e tests check further", () => {
    it("motion is guarded and buttons have focus rings", async () => {
      const { dialog } = await open();
      for (const el of [dialog, ...dialog.querySelectorAll("*")]) {
        for (const token of (el.getAttribute("class") ?? "").split(/\s+/)) {
          if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
        }
      }
      for (const b of dialog.querySelectorAll("button")) expect(b.className).toContain("focus-visible:outline-2");
    });
  });
});
