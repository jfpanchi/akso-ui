import { act, render, screen } from "@testing-library/react";
import { expectNoA11yViolations } from "akso-ui/test";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AksoLocaleProvider } from "@/registry/akso/lib/akso-locale";
import { Skeleton, SkeletonContainer } from "./skeleton";

afterEach(() => vi.useRealTimers());

const announcer = () => document.querySelector('[data-slot="announcer"]');

function Orders({ loading }: { loading: boolean }) {
  return (
    <SkeletonContainer loading={loading} label="Loading orders" loadedLabel="Orders loaded" fallback={<Skeleton className="h-4 w-20" />}>
      <p>Order 1042</p>
    </SkeletonContainer>
  );
}

describe("Skeleton", () => {
  describe("axe", () => {
    it("has no violations, loading and loaded", async () => {
      const { rerender } = render(
        <main>
          <Orders loading />
        </main>,
      );
      await expectNoA11yViolations(document.body);
      rerender(
        <main>
          <Orders loading={false} />
        </main>,
      );
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("while loading: aria-busy, a hidden text that says what is loading, shapes hidden", () => {
      render(<Orders loading />);
      const container = document.querySelector('[data-slot="skeleton-container"]');
      expect(container).toHaveAttribute("aria-busy", "true");
      expect(screen.getByText("Loading orders")).toHaveClass("sr-only");
      expect(document.querySelector('[data-slot="skeleton"]')).toHaveAttribute("aria-hidden", "true");
      expect(screen.queryByText("Order 1042")).not.toBeInTheDocument();
    });

    it("when loaded: the content, no aria-busy", () => {
      render(<Orders loading={false} />);
      expect(screen.getByText("Order 1042")).toBeInTheDocument();
      expect(document.querySelector('[data-slot="skeleton-container"]')).not.toHaveAttribute("aria-busy");
    });

    it("announces a slow load and its end; a quick load stays silent", async () => {
      vi.useFakeTimers();
      const { rerender } = render(<Orders loading />);
      await act(() => vi.advanceTimersByTimeAsync(1200));
      expect(announcer()).toHaveTextContent("Loading orders");
      rerender(<Orders loading={false} />);
      await act(() => vi.advanceTimersByTimeAsync(200));
      expect(announcer()).toHaveTextContent("Orders loaded");

      rerender(<Orders loading />);
      await act(() => vi.advanceTimersByTimeAsync(300));
      rerender(<Orders loading={false} />);
      await act(() => vi.advanceTimersByTimeAsync(1500));
      expect(announcer()).toHaveTextContent("Orders loaded");
      expect(announcer()).not.toHaveTextContent("Loading orders");
    });

    it("uses the AksoLocaleProvider texts", () => {
      render(
        <AksoLocaleProvider locale="es">
          <SkeletonContainer loading fallback={<Skeleton />}>
            <p>Listo</p>
          </SkeletonContainer>
        </AksoLocaleProvider>,
      );
      expect(screen.getByText("Cargando")).toBeInTheDocument();
    });
  });

  describe("keyboard", () => {
    it("nothing in the skeleton is focusable", () => {
      render(<Orders loading />);
      expect(document.querySelectorAll('[data-slot="skeleton-container"] [tabindex], [data-slot="skeleton-container"] a, [data-slot="skeleton-container"] button')).toHaveLength(0);
    });
  });

  describe("styles that e2e tests check further", () => {
    it("the pulse is motion-safe; a border in forced colors", () => {
      render(<Skeleton />);
      const shape = document.querySelector<HTMLElement>('[data-slot="skeleton"]')!;
      expect(shape.className).toContain("motion-safe:animate-pulse");
      expect(shape.className).toContain("forced-colors:border");
      for (const token of shape.className.split(/\s+/)) {
        if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
      }
    });
  });
});
