import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { expectFocused, expectFocusTrapped, expectNoA11yViolations, getTabbableElements } from "../src/test";

describe("expectNoA11yViolations", () => {
  it("passes for accessible markup", async () => {
    const { container } = render(<button type="button">Save</button>);
    await expect(expectNoA11yViolations(container)).resolves.toBeDefined();
  });

  it("fails with a readable message for inaccessible markup", async () => {
    const { container } = render(
      <button type="button">
        <svg />
      </button>,
    );
    await expect(expectNoA11yViolations(container)).rejects.toThrow(/button-name/);
  });

  it("can skip a rule", async () => {
    const { container } = render(
      <button type="button">
        <svg />
      </button>,
    );
    await expect(expectNoA11yViolations(container, { disableRules: ["button-name"] })).resolves.toBeDefined();
  });
});

describe("keyboard helpers", () => {
  it("finds tabbable elements and skips disabled or tabindex=-1", () => {
    const { container } = render(
      <div>
        <button type="button">A</button>
        <button type="button" disabled>
          B
        </button>
        <div tabIndex={-1}>C</div>
        <a href="/d">D</a>
      </div>,
    );
    expect(getTabbableElements(container).map((el) => el.textContent)).toEqual(["A", "D"]);
  });

  it("expectFocusTrapped fails when focus can leave", async () => {
    const user = userEvent.setup();
    render(
      <>
        <div data-testid="box">
          <button type="button">Inside</button>
        </div>
        <button type="button">Outside</button>
      </>,
    );
    await expect(expectFocusTrapped(user, screen.getByTestId("box"))).rejects.toThrow(/escaped/);
  });

  it("expectFocused explains where focus is", () => {
    render(<button type="button">X</button>);
    expect(() => expectFocused(screen.getByRole("button"))).toThrow(/Expected <button> "X" to have focus/);
  });
});
