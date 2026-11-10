import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectFocusTrapped, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it, vi } from "vitest";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

function Example({ withDescription = true, withTitle = true }: { withDescription?: boolean; withTitle?: boolean }) {
  return (
    <main>
      <button type="button">Before</button>
      <Dialog>
        <DialogTrigger>Edit profile</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            {withTitle ? <DialogTitle>Edit profile</DialogTitle> : null}
            {withDescription ? <DialogDescription>Changes are saved when you press Save.</DialogDescription> : null}
          </DialogHeader>
          <label htmlFor="name">Name</label>
          <input id="name" />
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            <DialogClose variant="primary">Save</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <button type="button">After</button>
    </main>
  );
}

async function openDialog() {
  const user = userEvent.setup();
  render(<Example />);
  const trigger = screen.getByRole("button", { name: "Edit profile" });
  await user.click(trigger);
  const dialog = await screen.findByRole("dialog");
  return { user, trigger, dialog };
}

describe("Dialog", () => {
  describe("axe", () => {
    it("has no violations when closed", async () => {
      render(<Example />);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      await expectNoA11yViolations(document.body);
    });

    it("has no violations when open", async () => {
      await openDialog();
      await expectNoA11yViolations(document.body);
    });
  });

  describe("accessible name and description", () => {
    it("is a dialog named by its title", async () => {
      const { dialog } = await openDialog();
      expect(dialog).toHaveAccessibleName("Edit profile");
      expect(screen.getByRole("heading", { level: 2, name: "Edit profile" })).toBeInTheDocument();
    });

    it("hides the rest of the page from assistive technology while open (modal)", async () => {
      await openDialog();
      // Base UI marks content outside the dialog as hidden instead of using aria-modal.
      expect(screen.queryByRole("button", { name: "Before" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "After" })).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Before", hidden: true })).toBeInTheDocument();
    });

    it("is described by the description when present", async () => {
      const { dialog } = await openDialog();
      expect(dialog).toHaveAccessibleDescription("Changes are saved when you press Save.");
    });

    it("works without a description", async () => {
      const user = userEvent.setup();
      render(<Example withDescription={false} />);
      await user.click(screen.getByRole("button", { name: "Edit profile" }));
      const dialog = await screen.findByRole("dialog");
      expect(dialog).toHaveAccessibleName("Edit profile");
      expect(dialog).not.toHaveAttribute("aria-describedby");
      await expectNoA11yViolations(document.body);
    });

    it("warns in development when the title is missing", async () => {
      const error = vi.spyOn(console, "error").mockImplementation(() => {});
      const user = userEvent.setup();
      render(<Example withTitle={false} />);
      await user.click(screen.getByRole("button", { name: "Edit profile" }));
      await screen.findByRole("dialog");
      // The check runs on an animation frame after the popup renders; allow for a busy machine.
      await waitFor(() => expect(error).toHaveBeenCalledWith(expect.stringContaining("Dialog has no accessible name")), { timeout: 3000 });
      error.mockRestore();
    });

    it("the × button has a text name, and the name can be translated", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Abrir</DialogTrigger>
          <DialogContent closeLabel="Cerrar">
            <DialogTitle>Título</DialogTitle>
          </DialogContent>
        </Dialog>,
      );
      await user.click(screen.getByRole("button", { name: "Abrir" }));
      expect(await screen.findByRole("button", { name: "Cerrar" })).toBeInTheDocument();
    });
  });

  describe("keyboard", () => {
    it("opens with Enter and Space from the trigger", async () => {
      const user = userEvent.setup();
      render(<Example />);
      await user.tab();
      await user.tab();
      expectFocused(screen.getByRole("button", { name: "Edit profile" }));
      await user.keyboard("{Enter}");
      expect(await screen.findByRole("dialog")).toBeInTheDocument();
      await user.keyboard("{Escape}");
      await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
      await user.keyboard(" ");
      expect(await screen.findByRole("dialog")).toBeInTheDocument();
    });

    it("moves focus inside the dialog when it opens", async () => {
      const { dialog } = await openDialog();
      await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));
    });

    it("closes with Escape", async () => {
      const { user } = await openDialog();
      await user.keyboard("{Escape}");
      await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    });

    it("traps focus with Tab and Shift+Tab", async () => {
      const { user, dialog } = await openDialog();
      await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));
      await expectFocusTrapped(user, dialog);
    });

    it("returns focus to the trigger after Escape", async () => {
      const { user, trigger } = await openDialog();
      await user.keyboard("{Escape}");
      await waitFor(() => expectFocused(trigger));
    });

    it("returns focus to the trigger after pressing a close button", async () => {
      const { user, trigger } = await openDialog();
      await user.click(screen.getByRole("button", { name: "Cancel" }));
      await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
      await waitFor(() => expectFocused(trigger));
    });

    it("returns focus to the trigger after the × button", async () => {
      const { user, trigger } = await openDialog();
      await user.click(screen.getByRole("button", { name: "Close" }));
      await waitFor(() => expectFocused(trigger));
    });
  });

  describe("styles that tests in a real browser check further (see e2e/)", () => {
    it("every button has a :focus-visible outline class and a minimum size class", async () => {
      await openDialog();
      for (const button of screen.getAllByRole("button")) {
        if (button.closest("[role=dialog]") === null) continue;
        expect(button.className).toMatch(/focus-visible:outline-2/);
        expect(button.className).toMatch(/(min-h-11|size-11)/);
      }
    });

    it("animations only run with motion-safe", async () => {
      const { dialog } = await openDialog();
      const animated = [dialog.className, ...Array.from(dialog.querySelectorAll("*"), (el) => el.getAttribute("class") ?? "")];
      for (const className of animated) {
        for (const token of className.split(/\s+/)) {
          if (/^(transition|duration|ease|animate)/.test(token)) {
            throw new Error(`"${token}" must be prefixed with motion-safe:`);
          }
        }
      }
    });
  });
});
