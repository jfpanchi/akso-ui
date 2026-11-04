import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectFocusTrapped, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it, vi } from "vitest";

import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "./drawer";

function Filters({ side }: { side?: "right" | "left" | "bottom" }) {
  return (
    <main>
      <Drawer side={side}>
        <DrawerTrigger>Filters</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>Narrow down the list.</DrawerDescription>
          <label>
            <input type="checkbox" /> In stock only
          </label>
          <DrawerClose>Apply</DrawerClose>
        </DrawerContent>
      </Drawer>
    </main>
  );
}

async function open(side?: "right" | "left" | "bottom") {
  const user = userEvent.setup();
  render(<Filters side={side} />);
  const trigger = screen.getByRole("button", { name: "Filters" });
  await user.click(trigger);
  const dialog = await screen.findByRole("dialog");
  return { user, trigger, dialog };
}

describe("Drawer", () => {
  describe("axe", () => {
    it("has no violations closed and open", async () => {
      render(<Filters />);
      await expectNoA11yViolations(document.body);
      cleanup();
      await open();
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("is a dialog named by its title and described", async () => {
      const { dialog } = await open();
      expect(dialog).toHaveAccessibleName("Filters");
      expect(dialog).toHaveAccessibleDescription("Narrow down the list.");
    });

    it("always has a close button, so swiping is never required", async () => {
      for (const side of ["right", "left", "bottom"] as const) {
        cleanup();
        await open(side);
        expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
      }
    });
  });

  describe("keyboard", () => {
    it("traps focus; Escape closes and returns focus to the trigger", async () => {
      const { user, trigger, dialog } = await open();
      await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));
      await expectFocusTrapped(user, dialog);
      await user.keyboard("{Escape}");
      await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
      expectFocused(trigger);
    });

    it("the close button closes and returns focus", async () => {
      const { user, trigger } = await open();
      await user.click(screen.getByRole("button", { name: "Close" }));
      await waitFor(() => expectFocused(trigger));
    });
  });

  describe("styles that e2e tests check further", () => {
    it("the slide only runs with motion-safe", async () => {
      const { dialog } = await open();
      for (const token of dialog.className.split(/\s+/)) {
        if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
      }
    });
  });

  describe("snap points (bottom drawer)", () => {
    function Sheet({ onSnapPointChange }: { onSnapPointChange?: (p: unknown) => void }) {
      return (
        <main>
          <Drawer side="bottom" snapPoints={[0.4, 1]} onSnapPointChange={onSnapPointChange}>
            <DrawerTrigger>Order summary</DrawerTrigger>
            <DrawerContent>
              <DrawerTitle>Order summary</DrawerTitle>
              <DrawerDescription>3 items.</DrawerDescription>
            </DrawerContent>
          </Drawer>
        </main>
      );
    }

    it("a button changes the height without dragging, and says whether it is at its largest", async () => {
      const onSnapPointChange = vi.fn();
      const user = userEvent.setup();
      render(<Sheet onSnapPointChange={onSnapPointChange} />);
      await user.click(screen.getByRole("button", { name: "Order summary" }));
      const toggle = await screen.findByRole("button", { name: "Show more" });
      expect(toggle).toHaveAttribute("aria-expanded", "false");
      await user.click(toggle);
      expect(onSnapPointChange).toHaveBeenLastCalledWith(1);
      const less = screen.getByRole("button", { name: "Show less" });
      expect(less).toHaveAttribute("aria-expanded", "true");
      await user.click(less);
      expect(onSnapPointChange).toHaveBeenLastCalledWith(0.4);
    });

    it("side drawers do not show the button", async () => {
      const user = userEvent.setup();
      render(
        <Drawer side="right" snapPoints={[0.4, 1]}>
          <DrawerTrigger>Open</DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Panel</DrawerTitle>
          </DrawerContent>
        </Drawer>,
      );
      await user.click(screen.getByRole("button", { name: "Open" }));
      await screen.findByRole("dialog");
      expect(screen.queryByRole("button", { name: "Show more" })).not.toBeInTheDocument();
    });
  });
});
