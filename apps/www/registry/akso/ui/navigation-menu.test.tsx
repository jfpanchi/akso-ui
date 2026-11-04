import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it } from "vitest";

import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "./navigation-menu";

function SiteNav() {
  return (
    <>
      <NavigationMenu aria-label="Main">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="/phones">Phones</NavigationMenuLink>
              <NavigationMenuLink href="/laptops">Laptops</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/help" active>
              Help
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <main>Content</main>
    </>
  );
}

describe("Navigation menu", () => {
  describe("axe", () => {
    it("has no violations closed and open", async () => {
      const user = userEvent.setup();
      render(<SiteNav />);
      await expectNoA11yViolations(document.body);
      await user.click(screen.getByRole("button", { name: "Products" }));
      await screen.findByRole("link", { name: "Phones" });
      await expectNoA11yViolations(document.body, { disableRules: ["region"] /* portaled popup */ });
    });
  });

  describe("name, role and state", () => {
    it("is a named navigation landmark with a button (aria-expanded) and real links", async () => {
      const user = userEvent.setup();
      render(<SiteNav />);
      expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
      const trigger = screen.getByRole("button", { name: "Products" });
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(await screen.findByRole("link", { name: "Phones" })).toHaveAttribute("href", "/phones");
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("the current page has aria-current=page and is shown with an underline and bold text", () => {
      render(<SiteNav />);
      const help = screen.getByRole("link", { name: "Help" });
      expect(help).toHaveAttribute("aria-current", "page");
      expect(help.className).toContain("data-active:underline");
      expect(help.className).toContain("data-active:font-semibold");
    });
  });

  describe("keyboard", () => {
    it("Enter opens a section and focus can move into its links; Escape closes it and returns focus", async () => {
      const user = userEvent.setup();
      render(<SiteNav />);
      await user.tab();
      const trigger = screen.getByRole("button", { name: "Products" });
      expectFocused(trigger);
      await user.keyboard("{Enter}");
      await screen.findByRole("link", { name: "Phones" });
      await user.tab();
      await waitFor(() => expectFocused(screen.getByRole("link", { name: "Phones" })));
      await user.keyboard("{Escape}");
      await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "false"));
      expectFocused(trigger);
    });
  });

  describe("styles that e2e tests check further", () => {
    it("items are 44px with focus rings; motion is guarded", () => {
      render(<SiteNav />);
      for (const el of [screen.getByRole("button", { name: "Products" }), screen.getByRole("link", { name: "Help" })]) {
        expect(el.className).toContain("min-h-11");
        expect(el.className).toContain("focus-visible:outline-2");
        for (const token of el.className.split(/\s+/)) {
          if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
        }
      }
    });
  });
});
