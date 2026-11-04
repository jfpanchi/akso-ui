import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LiveRegion, SkipLink, VisuallyHidden } from "../src";
import { expectNoA11yViolations } from "../src/test";

describe("VisuallyHidden", () => {
  it("keeps text in the accessibility tree", async () => {
    render(
      <button type="button">
        <svg aria-hidden="true" />
        <VisuallyHidden>Close</VisuallyHidden>
      </button>,
    );
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    await expectNoA11yViolations(document.body);
  });

  it("is clipped to 1px", () => {
    render(<VisuallyHidden>Hidden</VisuallyHidden>);
    const el = screen.getByText("Hidden");
    expect(el).toHaveStyle({ position: "absolute", width: "1px", height: "1px" });
  });
});

describe("LiveRegion", () => {
  it("renders an empty polite status region first, then announces the message", () => {
    vi.useFakeTimers();
    const { rerender } = render(<LiveRegion message="" />);
    const region = screen.getByRole("status");
    expect(region).toHaveAttribute("aria-live", "polite");
    expect(region).toHaveAttribute("aria-atomic", "true");
    expect(region).toBeEmptyDOMElement();

    rerender(<LiveRegion message="3 results found" />);
    expect(region).toBeEmptyDOMElement();
    act(() => vi.advanceTimersByTime(100));
    expect(region).toHaveTextContent("3 results found");
    vi.useRealTimers();
  });

  it("uses role=alert when assertive", () => {
    render(<LiveRegion message="Payment failed" politeness="assertive" />);
    expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "assertive");
  });
});

describe("SkipLink", () => {
  it("is the first tab stop and moves focus to the main content", async () => {
    const user = userEvent.setup();
    render(
      <>
        <SkipLink />
        <nav aria-label="Main">
          <a href="/a">A</a>
        </nav>
        <main id="main-content">Content</main>
      </>,
    );
    await user.tab();
    const link = screen.getByRole("link", { name: "Skip to main content" });
    expect(link).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("main")).toHaveFocus();
    await expectNoA11yViolations(document.body);
  });
});
