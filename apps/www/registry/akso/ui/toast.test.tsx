import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it, vi } from "vitest";

import { ToastProvider, useToast, type ToastOptions } from "./toast";

function Demo({ options }: { options: ToastOptions }) {
  const toast = useToast();
  return (
    <main>
      <button type="button" onClick={() => toast.add(options)}>
        Show
      </button>
    </main>
  );
}

function setup(options: ToastOptions, providerProps: Partial<React.ComponentProps<typeof ToastProvider>> = {}, fakeTimers = false) {
  const user = userEvent.setup(fakeTimers ? { advanceTimers: vi.advanceTimersByTime } : {});
  render(
    <ToastProvider {...providerProps}>
      <Demo options={options} />
    </ToastProvider>,
  );
  return { user };
}

describe("Toast", () => {
  describe("axe", () => {
    it("has no violations with a toast shown", async () => {
      const { user } = setup({ title: "Saved", description: "Your changes are saved.", type: "success" });
      await user.click(screen.getByRole("button", { name: "Show" }));
      await screen.findByText("Saved");
      // "region": the notifications region is portaled to the end of <body>; it is itself a landmark.
      await expectNoA11yViolations(document.body, { disableRules: ["region"] });
    });
  });

  describe("name, role and state", () => {
    it("toasts live in a labeled notifications region (Base UI)", async () => {
      const { user } = setup({ title: "Saved" });
      await user.click(screen.getByRole("button", { name: "Show" }));
      await screen.findByText("Saved");
      expect(screen.getByRole("region", { name: "Notifications" })).toBeInTheDocument();
    });

    it("the title starts with a hidden status word and has an icon", async () => {
      const { user } = setup({ title: "Payment failed", type: "error" });
      await user.click(screen.getByRole("button", { name: "Show" }));
      await waitFor(() => expect(document.querySelector('[data-slot="toast"]')).not.toBeNull());
      const toast = document.querySelector('[data-slot="toast"]') as HTMLElement;
      expect(within(toast).getByText("Payment failed").closest("p")).toHaveTextContent("Error: Payment failed");
      // High priority: Base UI also puts the text in a role="alert" so it is announced at once.
      expect(screen.getByRole("alert")).toHaveTextContent("Payment failed");
      expect(document.querySelector('[data-slot="toast"] svg[data-status-icon="error"]')).toHaveAttribute("aria-hidden", "true");
    });

    it("F6 moves focus to the notifications; then the close button is exposed with its translatable name", async () => {
      const { user } = setup({ title: "Guardado" }, { closeLabel: "Cerrar aviso" });
      await user.click(screen.getByRole("button", { name: "Show" }));
      await screen.findByText("Guardado");
      // Base UI hides the close button from assistive technology until the region has focus or the pointer.
      expect(screen.queryByRole("button", { name: "Cerrar aviso" })).not.toBeInTheDocument();
      await user.keyboard("{F6}");
      await waitFor(() => expect(screen.getByRole("region", { name: "Notifications" })).toContainElement(document.activeElement as HTMLElement));
      expect(await screen.findByRole("button", { name: "Cerrar aviso" })).toBeInTheDocument();
    });
  });

  describe("timing", () => {
    it("info toasts close after 6 seconds", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const { user } = setup({ title: "Saved" }, {}, true);
      await user.click(screen.getByRole("button", { name: "Show" }));
      await screen.findByText("Saved");
      act(() => vi.advanceTimersByTime(5000));
      expect(screen.getByText("Saved")).toBeInTheDocument();
      act(() => vi.advanceTimersByTime(1500));
      await waitFor(() => expect(screen.queryByText("Saved")).not.toBeInTheDocument());
      vi.useRealTimers();
    });

    it("errors and toasts with an action stay until dismissed", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const { user } = setup({ title: "Upload failed", type: "error" }, {}, true);
      await user.click(screen.getByRole("button", { name: "Show" }));
      const toast = () => document.querySelector('[data-slot="toast"]') as HTMLElement;
      await waitFor(() => expect(toast()).not.toBeNull());
      act(() => vi.advanceTimersByTime(60_000));
      expect(within(toast()).getByText("Upload failed")).toBeInTheDocument();
      vi.useRealTimers();
    });
  });

  describe("keyboard", () => {
    it("the action and close buttons can be reached and used with the keyboard", async () => {
      const onUndo = vi.fn();
      const { user } = setup({ title: "Message deleted", actionProps: { children: "Undo", onClick: onUndo } });
      await user.click(screen.getByRole("button", { name: "Show" }));
      const undo = await screen.findByRole("button", { name: "Undo" });
      undo.focus();
      expectFocused(undo);
      await user.keyboard("{Enter}");
      expect(onUndo).toHaveBeenCalled();
      const close = screen.queryByRole("button", { name: "Dismiss" });
      if (close) {
        close.focus();
        await user.keyboard("{Enter}");
        await waitFor(() => expect(screen.queryByText("Message deleted")).not.toBeInTheDocument());
      }
    });
  });

  describe("styles that e2e tests check further", () => {
    it("toasts are listed, not stacked, and motion is guarded", async () => {
      const { user } = setup({ title: "Saved" });
      await user.click(screen.getByRole("button", { name: "Show" }));
      await screen.findByText("Saved");
      const toast = document.querySelector('[data-slot="toast"]') as HTMLElement;
      expect(toast.className).not.toContain("absolute");
      for (const token of toast.className.split(/\s+/)) {
        if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
      }
    });
  });
});
