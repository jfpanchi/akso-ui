import type { UserEvent } from "@testing-library/user-event";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "audio[controls]",
  "video[controls]",
  "[contenteditable]:not([contenteditable='false'])",
  "[tabindex]",
].join(",");

/** Elements reachable with Tab inside `container`, in DOM order (ignores positive tabindex ordering). */
export function getTabbableElements(container: Element): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((el) => {
    if (el.tabIndex < 0) return false;
    if (el.closest("[inert]")) return false;
    if (el.hidden || el.closest("[hidden]")) return false;
    // Focus-guard elements used by focus-trap libraries are tabbable but not meaningful.
    if (el.getAttribute("data-base-ui-focus-guard") !== null) return false;
    return true;
  });
}

const nextFrame = () =>
  new Promise<void>((resolve) => {
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(() => resolve());
    else setTimeout(resolve, 16);
  });

/**
 * Waits until focus stops moving. Focus-trap libraries (including Base UI) place
 * invisible "focus guard" elements around the dialog and, when one of them receives
 * focus, move focus back inside on the next animation frame.
 */
export async function waitForFocusToSettle(maxFrames = 5): Promise<Element | null> {
  let previous = document.activeElement;
  for (let i = 0; i < maxFrames; i++) {
    await nextFrame();
    const current = document.activeElement;
    const onGuard = current?.hasAttribute("data-base-ui-focus-guard") ?? false;
    if (current === previous && !onGuard) return current;
    previous = current;
  }
  return document.activeElement;
}

/** Presses Tab `times` times (Shift+Tab when `backwards`). */
export async function tab(user: UserEvent, times = 1, { backwards = false } = {}): Promise<void> {
  for (let i = 0; i < times; i++) {
    await user.tab({ shift: backwards });
  }
}

export async function pressEscape(user: UserEvent): Promise<void> {
  await user.keyboard("{Escape}");
}

function describeElement(el: Element | null): string {
  if (!el) return "nothing";
  const name = el.getAttribute("aria-label") ?? el.textContent?.trim().slice(0, 40) ?? "";
  return `<${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ""}> "${name}"`;
}

/**
 * Asserts that keyboard focus cannot leave `container`.
 * Presses Tab, then Shift+Tab, enough times to wrap around twice,
 * and checks after every press that `document.activeElement` is still inside.
 * Also checks that every tabbable element inside was visited going forwards.
 */
export async function expectFocusTrapped(user: UserEvent, container: Element): Promise<void> {
  const tabbables = getTabbableElements(container);
  if (tabbables.length === 0) {
    throw new Error("expectFocusTrapped: the container has no tabbable elements.");
  }
  const presses = tabbables.length * 2 + 1;

  for (const backwards of [false, true]) {
    const visited = new Set<Element>();
    for (let i = 0; i < presses; i++) {
      await user.tab({ shift: backwards });
      const active = await waitForFocusToSettle();
      if (!active || !container.contains(active)) {
        throw new Error(
          `Focus escaped the container after ${i + 1} ${backwards ? "Shift+Tab" : "Tab"} press(es). Focus is on ${describeElement(active)}.`,
        );
      }
      visited.add(active);
    }
    const missed = tabbables.filter((el) => !visited.has(el));
    if (missed.length > 0) {
      throw new Error(
        `Focus never reached these elements with ${backwards ? "Shift+Tab" : "Tab"}: ${missed.map(describeElement).join(", ")}`,
      );
    }
  }
}

/** Asserts that `element` currently has focus, with a readable error message. */
export function expectFocused(element: Element | null): void {
  if (!element) throw new Error("expectFocused: element is null.");
  if (document.activeElement !== element) {
    throw new Error(`Expected ${describeElement(element)} to have focus, but focus is on ${describeElement(document.activeElement)}.`);
  }
}
