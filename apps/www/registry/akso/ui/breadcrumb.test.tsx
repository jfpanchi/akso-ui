import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it } from "vitest";

import { AksoLocaleProvider } from "@/registry/akso/lib/akso-locale";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "./breadcrumb";

function Trail() {
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="/store">Store</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbPage>Phones</BreadcrumbPage>
      </BreadcrumbItem>
    </Breadcrumb>
  );
}

describe("Breadcrumb", () => {
  describe("axe", () => {
    it("has no violations", async () => {
      render(
        <main>
          <Trail />
        </main>,
      );
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("is a navigation named Breadcrumb with an ordered list of levels", () => {
      render(<Trail />);
      const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
      const list = within(nav).getByRole("list");
      expect(list.tagName).toBe("OL");
      expect(within(list).getAllByRole("listitem")).toHaveLength(3);
    });

    it("the current page is text with aria-current=page, not a link", () => {
      render(<Trail />);
      expect(screen.getByText("Phones")).toHaveAttribute("aria-current", "page");
      expect(screen.queryByRole("link", { name: "Phones" })).toBeNull();
      expect(screen.getAllByRole("link").map((a) => a.textContent)).toEqual(["Home", "Store"]);
    });

    it("separators are hidden from screen readers and not drawn before the first item", () => {
      render(<Trail />);
      const icons = document.querySelectorAll('[data-slot="breadcrumb-item"] svg');
      expect(icons).toHaveLength(3);
      for (const icon of icons) expect(icon).toHaveAttribute("aria-hidden", "true");
      expect(icons[0]!.getAttribute("class")).toContain("group-first/breadcrumb-item:hidden");
    });

    it("uses the AksoLocaleProvider name, or the label prop", () => {
      const { unmount } = render(
        <AksoLocaleProvider locale="es">
          <Trail />
        </AksoLocaleProvider>,
      );
      expect(screen.getByRole("navigation", { name: "Ruta de navegación" })).toBeInTheDocument();
      unmount();
      render(<Breadcrumb label="You are here" />);
      expect(screen.getByRole("navigation", { name: "You are here" })).toBeInTheDocument();
    });

    it("BreadcrumbLink can render a router link and keeps its styles", () => {
      function RouterLink({ children, ...props }: React.ComponentProps<"a">) {
        return (
          <a data-router="yes" {...props}>
            {children}
          </a>
        );
      }
      render(
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink render={<RouterLink href="/shop" />}>Shop</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>,
      );
      const link = screen.getByRole("link", { name: "Shop" });
      expect(link).toHaveAttribute("data-router", "yes");
      expect(link).toHaveAttribute("href", "/shop");
      expect(link.className).toContain("underline");
    });
  });

  describe("keyboard", () => {
    it("Tab reaches each link in order; the current page is not a Tab stop", async () => {
      const user = userEvent.setup();
      render(
        <>
          <Trail />
          <button type="button">After</button>
        </>,
      );
      await user.tab();
      expectFocused(screen.getByRole("link", { name: "Home" }));
      await user.tab();
      expectFocused(screen.getByRole("link", { name: "Store" }));
      await user.tab();
      expectFocused(screen.getByRole("button", { name: "After" }));
    });
  });

  describe("styles that e2e tests check further", () => {
    it("links are underlined, 44px tall, with a focus ring; the list wraps", () => {
      render(<Trail />);
      const link = screen.getByRole("link", { name: "Home" });
      expect(link.className).toContain("underline");
      expect(link.className).toContain("min-h-11");
      expect(link.className).toContain("focus-visible:outline-2");
      expect(screen.getByRole("list").className).toContain("flex-wrap");
    });
  });
});
