import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it } from "vitest";

import { Tabs, TabsList, TabsPanel, TabsTrigger } from "./tabs";

function Account() {
  return (
    <main>
      <Tabs defaultValue="profile">
        <TabsList aria-label="Account settings">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="billing" disabled>
            Billing
          </TabsTrigger>
        </TabsList>
        <TabsPanel value="profile">Your public profile.</TabsPanel>
        <TabsPanel value="password">Change your password.</TabsPanel>
        <TabsPanel value="billing">Billing details.</TabsPanel>
      </Tabs>
      <button type="button">After</button>
    </main>
  );
}

describe("Tabs", () => {
  describe("axe", () => {
    it("has no violations", async () => {
      render(<Account />);
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("has a named tablist, tabs with aria-selected, and a panel linked to its tab", () => {
      render(<Account />);
      expect(screen.getByRole("tablist", { name: "Account settings" })).toBeInTheDocument();
      const profile = screen.getByRole("tab", { name: "Profile" });
      expect(profile).toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("tab", { name: "Password" })).toHaveAttribute("aria-selected", "false");
      const panel = screen.getByRole("tabpanel", { name: "Profile" });
      expect(panel).toHaveTextContent("Your public profile.");
      expect(profile.getAttribute("aria-controls")).toBe(panel.id);
    });

    it("the selected tab is shown with a thick underline and bold text, not only color", () => {
      render(<Account />);
      const cls = screen.getByRole("tab", { name: "Profile" }).className;
      expect(cls).toContain("data-active:border-akso-primary");
      expect(cls).toContain("data-active:font-semibold");
      expect(cls).toContain("border-b-4");
    });
  });

  describe("keyboard", () => {
    it("one Tab stop for the list; arrows move focus; Enter activates (manual activation)", async () => {
      const user = userEvent.setup();
      render(<Account />);
      await user.tab();
      const profile = screen.getByRole("tab", { name: "Profile" });
      expectFocused(profile);
      await user.keyboard("{ArrowRight}");
      const password = screen.getByRole("tab", { name: "Password" });
      expectFocused(password);
      expect(password).toHaveAttribute("aria-selected", "false");
      await user.keyboard("{Enter}");
      expect(password).toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("tabpanel", { name: "Password" })).toHaveTextContent("Change your password.");
    });

    it("Tab from the list goes to the panel, then on", async () => {
      const user = userEvent.setup();
      render(<Account />);
      await user.tab();
      await user.tab();
      expectFocused(screen.getByRole("tabpanel", { name: "Profile" }));
      await user.tab();
      expectFocused(screen.getByRole("button", { name: "After" }));
    });

    it("a disabled tab can be reached with the arrows (ARIA APG) but not activated", async () => {
      const user = userEvent.setup();
      render(<Account />);
      await user.tab();
      await user.keyboard("{ArrowRight}{ArrowRight}");
      const billing = screen.getByRole("tab", { name: "Billing" });
      expectFocused(billing);
      expect(billing).toHaveAttribute("aria-disabled", "true");
      await user.keyboard("{Enter}");
      expect(billing).toHaveAttribute("aria-selected", "false");
      expect(screen.getByRole("tab", { name: "Profile" })).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("styles that e2e tests check further", () => {
    it("tabs and panel have focus rings and motion is guarded", () => {
      render(<Account />);
      for (const el of [screen.getByRole("tab", { name: "Profile" }), screen.getByRole("tabpanel")]) {
        expect(el.className).toContain("focus-visible:outline-2");
        for (const token of el.className.split(/\s+/)) {
          if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
        }
      }
    });
  });
});
