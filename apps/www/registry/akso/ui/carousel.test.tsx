import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AksoLocaleProvider } from "@/registry/akso/lib/akso-locale";
import { Carousel, CarouselSlide } from "./carousel";

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function Tips(props: { autoplay?: boolean; label?: string }) {
  return (
    <Carousel label={props.label ?? "Tips"} autoplay={props.autoplay} interval={1000}>
      <CarouselSlide>
        <p>First tip</p>
        <a href="#one">Read one</a>
      </CarouselSlide>
      <CarouselSlide>
        <p>Second tip</p>
      </CarouselSlide>
      <CarouselSlide>
        <p>Third tip</p>
      </CarouselSlide>
    </Carousel>
  );
}

const slides = () => document.querySelectorAll<HTMLElement>('[data-slot="carousel-slide"]');
const visibleSlide = () => [...slides()].find((s) => !s.hidden)!;

describe("Carousel", () => {
  describe("axe", () => {
    it("has no violations, with and without autoplay", async () => {
      render(
        <main>
          <Tips />
          <Tips autoplay label="News" />
        </main>,
      );
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("a named carousel; slides are named groups; only the current one is shown", () => {
      render(<Tips />);
      const carousel = screen.getByRole("region", { name: "Tips" });
      expect(carousel).toHaveAttribute("aria-roledescription", "carousel");
      expect(slides()).toHaveLength(3);
      expect(slides()[1]).toHaveAttribute("aria-roledescription", "slide");
      expect(slides()[1]).toHaveAttribute("aria-label", "2 of 3");
      expect(within(carousel).getByRole("group", { name: "1 of 3" })).toHaveTextContent("First tip");
      expect(slides()[1]).not.toBeVisible();
    });

    it("Previous / Next and the slide buttons change the slide; aria-current marks the current one", async () => {
      const user = userEvent.setup();
      render(<Tips />);
      await user.click(screen.getByRole("button", { name: "Next slide" }));
      expect(visibleSlide()).toHaveTextContent("Second tip");
      expect(screen.getByRole("button", { name: "Slide 2" })).toHaveAttribute("aria-current", "true");
      await user.click(screen.getByRole("button", { name: "Previous slide" }));
      await user.click(screen.getByRole("button", { name: "Previous slide" }));
      expect(visibleSlide()).toHaveTextContent("Third tip");
      await user.click(screen.getByRole("button", { name: "Slide 1" }));
      expect(visibleSlide()).toHaveTextContent("First tip");
    });

    it("the slide area is a polite live region when not rotating", () => {
      render(<Tips />);
      expect(document.querySelector('[data-slot="carousel-slides"]')).toHaveAttribute("aria-live", "polite");
    });

    it("uses the AksoLocaleProvider texts", () => {
      render(
        <AksoLocaleProvider locale="es">
          <Tips autoplay />
        </AksoLocaleProvider>,
      );
      expect(screen.getByRole("button", { name: "Diapositiva siguiente" })).toBeInTheDocument();
      expect(slides()[0]).toHaveAttribute("aria-label", "1 de 3");
      expect(screen.getByRole("button", { name: "Pausar" })).toBeInTheDocument();
    });
  });

  describe("autoplay", () => {
    it("rotates with a Pause button; silent while rotating; Pause stops it", async () => {
      vi.useFakeTimers();
      render(<Tips autoplay />);
      expect(document.querySelector('[data-slot="carousel-slides"]')).toHaveAttribute("aria-live", "off");
      await act(() => vi.advanceTimersByTimeAsync(1100));
      expect(visibleSlide()).toHaveTextContent("Second tip");
      fireEvent.click(screen.getByRole("button", { name: "Pause" }));
      await act(() => vi.advanceTimersByTimeAsync(3000));
      expect(visibleSlide()).toHaveTextContent("Second tip");
      expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
    });

    it("stops when the pointer is over it, and for good when focus moves inside", async () => {
      vi.useFakeTimers();
      render(<Tips autoplay />);
      const carousel = screen.getByRole("region", { name: "Tips" });
      fireEvent.mouseEnter(carousel);
      await act(() => vi.advanceTimersByTimeAsync(2500));
      expect(visibleSlide()).toHaveTextContent("First tip");
      fireEvent.mouseLeave(carousel);
      fireEvent.focus(screen.getByRole("button", { name: "Next slide" }));
      await act(() => vi.advanceTimersByTimeAsync(2500));
      expect(visibleSlide()).toHaveTextContent("First tip");
      expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
    });

    it("never starts with prefers-reduced-motion", () => {
      const original = window.matchMedia;
      window.matchMedia = ((query: string) => ({ matches: query.includes("reduce"), media: query })) as typeof window.matchMedia;
      try {
        render(<Tips autoplay />);
        expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
      } finally {
        window.matchMedia = original;
      }
    });
  });

  describe("keyboard", () => {
    it("Tab order: Previous, Next, the current slide's links only, then the slide buttons", async () => {
      const user = userEvent.setup();
      render(<Tips />);
      await user.tab();
      expectFocused(screen.getByRole("button", { name: "Previous slide" }));
      await user.tab();
      expectFocused(screen.getByRole("button", { name: "Next slide" }));
      await user.tab();
      expectFocused(screen.getByRole("link", { name: "Read one" }));
      await user.tab();
      expectFocused(screen.getByRole("button", { name: "Slide 1" }));
      await user.click(screen.getByRole("button", { name: "Next slide" }));
      expect(screen.queryByRole("link", { name: "Read one" })).not.toBeInTheDocument();
    });
  });

  describe("styles that e2e tests check further", () => {
    it("44px buttons; nothing animated", () => {
      render(<Tips autoplay />);
      for (const button of screen.getAllByRole("button")) expect(button.className).toMatch(/size-11|min-h-11/);
      for (const el of document.querySelectorAll<HTMLElement>('[data-slot^="carousel"]')) {
        for (const token of el.className.split(/\s+/)) {
          if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
        }
      }
    });
  });
});
