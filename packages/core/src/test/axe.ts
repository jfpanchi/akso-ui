import type { AxeResults, Result, RunOptions } from "axe-core";
import { configureAxe } from "vitest-axe";

export interface A11yCheckOptions extends RunOptions {
  /** Rule ids to skip. Every skipped rule must have a written reason in the test. */
  disableRules?: string[];
}

const defaultTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

function formatViolations(violations: Result[]): string {
  return violations
    .map((violation) => {
      const nodes = violation.nodes
        .map((node) => `    - ${node.target.join(" ")}\n      ${node.failureSummary?.replace(/\n/g, "\n      ") ?? ""}`)
        .join("\n");
      return `• [${violation.impact ?? "unknown"}] ${violation.id}: ${violation.help}\n  ${violation.helpUrl}\n${nodes}`;
    })
    .join("\n\n");
}

/**
 * Runs axe-core (WCAG 2.0–2.2 A/AA + best practices) and throws a readable
 * error listing every violation. Works in Vitest/jsdom.
 *
 * Note: jsdom does not compute layout or colors, so `color-contrast` cannot be
 * checked here. Cover contrast with token tests and Playwright e2e tests.
 *
 * @example
 *   const { container } = render(<MyComponent />);
 *   await expectNoA11yViolations(container);
 */
export async function expectNoA11yViolations(
  element: Element | Document = document.body,
  { disableRules = [], ...options }: A11yCheckOptions = {},
): Promise<AxeResults> {
  const run = configureAxe({
    runOnly: { type: "tag", values: defaultTags },
    ...options,
    rules: {
      // jsdom has no layout engine: this rule always returns "incomplete" or wrong results.
      "color-contrast": { enabled: false },
      ...Object.fromEntries(disableRules.map((id) => [id, { enabled: false }])),
      ...options.rules,
    },
  });
  const root = element instanceof Document ? element.documentElement : element;
  const results = await run(root);
  if (results.violations.length > 0) {
    throw new Error(`Expected no accessibility violations, found ${results.violations.length}:\n\n${formatViolations(results.violations)}`);
  }
  return results;
}
