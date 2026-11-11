"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useAksoMessages } from "@/registry/akso/lib/akso-locale";
import { buttonClassName, warnIfUnnamed } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · Carousel
 *
 * A set of slides shown one at a time. There is no Base UI part for this. It follows the
 * WAI-ARIA APG "carousel" pattern (basic version):
 * - A <section> with aria-roledescription="carousel" and a name (`label`).
 * - Each slide is a group with aria-roledescription="slide" and a name like "2 of 4". Only the
 *   current slide is shown; the others are hidden from everyone (and their links are not in
 *   the Tab order).
 * - Previous / Next buttons, and a button for each slide ("Slide 2", aria-current on the
 *   current one). All 44px.
 * - The slide area is a polite live region while the carousel is not rotating by itself, so
 *   the new slide is read after Previous / Next. While it rotates, it is silent.
 * - Autoplay is off by default. When on, a Pause / Play button comes first; rotation stops when
 *   the pointer is over the carousel, stops for good when focus moves inside it (until Play is
 *   pressed), and never starts with prefers-reduced-motion (WCAG 2.2.2).
 * - Slides change at once, with no animation.
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

export interface CarouselProps extends Omit<React.ComponentProps<"section">, "aria-label"> {
  /** Name of the carousel, like "Featured products". Required. */
  label: string;
  /** Change slides by themselves every `interval` ms, with a Pause button. Default: false. */
  autoplay?: boolean;
  /** Time per slide when autoplay is on. Default: 6000ms. */
  interval?: number;
  /** Show a button for each slide. Default: true. */
  showSlidePicker?: boolean;
}

/** One slide. Put any content in it. */
function CarouselSlide({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="carousel-slide-content" className={cn("flex flex-col gap-2", className)} {...props} />;
}

const arrow = (direction: "previous" | "next") => (
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={direction === "previous" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
  </svg>
);

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/** True when the user asks for reduced motion. On the server, true: autoplay starts only in the browser. */
function useReducedMotion() {
  return React.useSyncExternalStore(
    (onChange) => {
      const query = typeof window !== "undefined" ? window.matchMedia?.(REDUCED_MOTION) : undefined;
      query?.addEventListener?.("change", onChange);
      return () => query?.removeEventListener?.("change", onChange);
    },
    () => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia(REDUCED_MOTION).matches : false),
    () => true,
  );
}

/** Slides shown one at a time, with Previous / Next buttons. */
function Carousel({ label, autoplay = false, interval = 6000, showSlidePicker = true, className, children, ...props }: CarouselProps) {
  const messages = useAksoMessages();
  const slides = React.Children.toArray(children).filter(React.isValidElement);
  const total = slides.length;
  const [index, setIndex] = React.useState(0);
  const reduceMotion = useReducedMotion();
  // null until the user presses Pause / Play (or focus moves inside): then their choice wins.
  const [userPlaying, setUserPlaying] = React.useState<boolean | null>(null);
  const playing = userPlaying ?? (autoplay && !reduceMotion);
  const setPlaying = (next: boolean | ((current: boolean) => boolean)) => setUserPlaying(typeof next === "function" ? next(playing) : next);
  const [paused, setPaused] = React.useState(false); // pointer over the carousel
  const rootRef = React.useRef<HTMLElement | null>(null);
  const slidesId = React.useId();

  React.useEffect(() => {
    warnIfUnnamed(rootRef.current, "Carousel", "Pass a `label`, like label=\"Featured products\".");
  }, []);

  const rotating = playing && !paused && total > 1;
  React.useEffect(() => {
    if (!rotating) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % total), interval);
    return () => clearInterval(timer);
  }, [rotating, interval, total]);

  const go = (next: number) => setIndex(((next % total) + total) % total);

  return (
    // The pointer and focus handlers only pause autoplay; every action is on real buttons inside.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <section
      ref={rootRef}
      data-slot="carousel"
      aria-roledescription={messages.carousel}
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      // Focus inside stops rotation until the Play button is pressed (APG). The Play button itself is the exception.
      onFocus={(event) => {
        if (!(event.target as HTMLElement).matches('[data-slot="carousel-play"]')) setPlaying(false);
      }}
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      <div className="flex flex-wrap items-center gap-2">
        {autoplay ? (
          <button
            type="button"
            data-slot="carousel-play"
            onClick={() => setPlaying((p) => !p)}
            className={buttonClassName({ variant: "secondary", className: "min-h-11 px-4" })}
          >
            {playing ? messages.stopAutoplay : messages.startAutoplay}
          </button>
        ) : null}
        <button
          type="button"
          data-slot="carousel-previous"
          aria-controls={slidesId}
          aria-label={messages.previousSlide}
          onClick={() => go(index - 1)}
          className={buttonClassName({ variant: "secondary", className: "size-11 p-0" })}
        >
          {arrow("previous")}
        </button>
        <button
          type="button"
          data-slot="carousel-next"
          aria-controls={slidesId}
          aria-label={messages.nextSlide}
          onClick={() => go(index + 1)}
          className={buttonClassName({ variant: "secondary", className: "size-11 p-0" })}
        >
          {arrow("next")}
        </button>
      </div>

      <div id={slidesId} data-slot="carousel-slides" aria-live={rotating ? "off" : "polite"} className="rounded-md border border-akso-border bg-akso-surface p-4">
        {slides.map((slide, i) => (
          <div
            key={slide.key ?? i}
            role="group"
            aria-roledescription={messages.slide}
            aria-label={messages.slideOf(i + 1, total)}
            data-slot="carousel-slide"
            hidden={i !== index}
          >
            {slide}
          </div>
        ))}
      </div>

      {showSlidePicker && total > 1 ? (
        <div data-slot="carousel-picker" className="flex flex-wrap gap-1">
          {slides.map((slide, i) => (
            <button
              key={slide.key ?? i}
              type="button"
              aria-controls={slidesId}
              aria-current={i === index ? "true" : undefined}
              onClick={() => go(i)}
              className={buttonClassName({
                variant: "ghost",
                className: "group size-11 p-0",
              })}
            >
              <span className="sr-only">{messages.goToSlide(i + 1)}</span>
              <span
                aria-hidden="true"
                className="size-3 rounded-full border-2 border-akso-foreground group-aria-current:size-4 group-aria-current:bg-akso-foreground forced-colors:group-aria-current:bg-[CanvasText]"
              />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export { Carousel, CarouselSlide };
