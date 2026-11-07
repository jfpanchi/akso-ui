/**
 * Creates every file a new Akso UI component needs, with the required tests laid out.
 *
 *   pnpm new:component <kebab-name> [--base <base-ui-part>]
 *   pnpm new:component radio-group --base radio-group
 *
 * Generated tests that need real work are marked `it.todo` / `test.fixme`, so the
 * component is visibly unfinished until someone writes them (see CONTRIBUTING.md).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith("--"));
const baseIndex = args.indexOf("--base");
const basePart = baseIndex >= 0 ? args[baseIndex + 1] : slug;

if (!slug || !/^[a-z]+(-[a-z]+)*$/.test(slug)) {
  console.error("Usage: pnpm new:component <kebab-name> [--base <base-ui-part>]");
  process.exit(1);
}

const root = resolve(import.meta.dirname, "..");
const www = resolve(root, "apps/www");
const pascal = slug.replace(/(^|-)([a-z])/g, (_, __, c: string) => c.toUpperCase());
const title = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
const baseDocs = resolve(www, `node_modules/@base-ui/react/docs/react/components/${basePart}.md`);

if (!existsSync(baseDocs)) {
  console.warn(`! No Base UI docs at ${baseDocs}. Check the part name with --base, or build this component without a Base UI primitive.`);
}

const created: string[] = [];
function create(path: string, content: string) {
  const full = resolve(www, path);
  if (existsSync(full)) {
    console.error(`✗ ${path} already exists. Nothing was overwritten.`);
    process.exit(1);
  }
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content);
  created.push(`apps/www/${path}`);
}

create(
  `registry/akso/ui/${slug}.tsx`,
  `"use client";

import * as React from "react";
// Read the Base UI docs before writing this file: node_modules/@base-ui/react/docs/react/components/${basePart}.md
// import { ${pascal} as Base${pascal} } from "@base-ui/react/${basePart}";

import { cn } from "@/lib/utils";
import { buttonClassName, focusRingClassName } from "@/registry/akso/lib/akso-styles";

/*
 * Akso UI · ${title}
 *
 * Built on @base-ui/react/${basePart}. Do not override role, aria-* or keyboard
 * handlers provided by Base UI (see CLAUDE.md).
 *
 * Accessibility notes: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md
 */

// TODO: replace this placeholder with the Base UI parts.
function ${pascal}({ className, ...props }: React.ComponentProps<"div">) {
  // Shared styles: buttonClassName() for button-like parts, focusRingClassName for anything focusable.
  // Never import another component file (components/ui/*): shared code belongs in registry/akso/lib.
  void buttonClassName;
  return <div data-slot="${slug}" className={cn("text-akso-foreground", focusRingClassName, className)} {...props} />;
}

export { ${pascal} };
`,
);

create(
  `registry/akso/ui/${slug}.test.tsx`,
  `import { render } from "@testing-library/react";
import { expectNoA11yViolations } from "akso-ui/test";
import { describe, it } from "vitest";

import { ${pascal} } from "./${slug}";

describe("${pascal}", () => {
  describe("axe", () => {
    it("has no violations in its default state", async () => {
      // Render inside a landmark, as on a real page (axe rule "region").
      render(
        <main>
          <${pascal}>${title}</${pascal}>
        </main>,
      );
      await expectNoA11yViolations(document.body);
    });
    it.todo("has no violations in every other state (open, checked, invalid, disabled…)");
  });

  describe("name, role and state", () => {
    it.todo("has the role from the WAI-ARIA pattern and an accessible name");
    it.todo("exposes its state (expanded, checked, selected…) to assistive technology");
  });

  describe("keyboard", () => {
    it.todo("supports every key in the docs keyboard table");
    it.todo("moves focus in a predictable order and returns it where needed");
  });

  describe("styles that e2e tests check further", () => {
    it.todo("every interactive part has focus-visible:outline-2 and motion-safe: on every transition/animation");
  });
});
`,
);

create(
  `components/${slug}-demo.tsx`,
  `"use client";

import { ${pascal} } from "@/registry/akso/ui/${slug}";

/** Demo used by the docs page and by the e2e tests. */
export function ${pascal}Demo() {
  return <${pascal}>${title}</${pascal}>;
}
`,
);

create(
  `app/test/${slug}/page.tsx`,
  `import type { Metadata } from "next";
import { ${pascal}Demo } from "@/components/${slug}-demo";

export const metadata: Metadata = { title: "${title} test page", robots: { index: false } };

/** Stable page for Playwright tests. */
export default function ${pascal}TestPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">${title} test page</h1>
      <${pascal}Demo />
    </div>
  );
}
`,
);

create(
  `app/docs/${slug}/page.tsx`,
  `import type { Metadata } from "next";
import { ${pascal}Demo } from "@/components/${slug}-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "${title}", description: "TODO: one sentence." };

export default function ${pascal}DocsPage() {
  return (
    <DocPage title="${title}" intro={<p>TODO: what it is and when to use it, in plain language.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <${pascal}Demo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="${slug}" adds={<>This adds <code>components/ui/${slug}.tsx</code>.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{\`import { ${pascal} } from "@/components/ui/${slug}";\`}</CodeBlock>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable rows={[["TODO", "TODO"]]} />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable rows={[["TODO", "TODO"]]} />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
`,
);

create(
  `e2e/${slug}.spec.ts`,
  `import { test } from "./fixtures";
import {
  expectMinTargetSize,
  expectNoAnimatedOutline,
  expectNoAxeViolations,
  expectNoHorizontalScroll,
  expectNoMotion,
  expectVisibleFocusRingsWhileTabbing,
  REFLOW_VIEWPORT,
} from "./helpers/a11y";

test.beforeEach(async ({ page }) => {
  await page.goto("/test/${slug}");
});

test.describe("axe", () => {
  test("no violations on the test page", async ({ page }) => {
    await expectNoAxeViolations(page);
  });
  test("no violations on the docs page", async ({ page }) => {
    await page.goto("/docs/${slug}");
    await expectNoAxeViolations(page);
  });
  test.fixme("no violations in every other state (open, invalid…)", async () => {});
});

test.describe("keyboard", () => {
  test.fixme("every key in the keyboard table works", async () => {});
});

test.describe("visual accessibility", () => {
  test.fixme("every interactive part has a visible focus ring with at least 3:1 contrast", async ({ page }) => {
    await expectVisibleFocusRingsWhileTabbing(page, 1);
  });
  test("the focus ring appears immediately", async ({ page }) => {
    await expectNoAnimatedOutline(page.locator("main"));
  });
  test.fixme("targets are at least 24×24px", async ({ page }) => {
    await expectMinTargetSize(await page.locator('[data-slot="${slug}"]').all());
  });
});

test.describe("reduced motion", () => {
  test("no motion with prefers-reduced-motion: reduce", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expectNoMotion(page, page.locator("main"));
  });
});

test.describe("320px wide (equivalent to 400% zoom)", () => {
  test.use({ viewport: REFLOW_VIEWPORT });
  for (const path of ["/test/${slug}", "/docs/${slug}"]) {
    test(\`\${path} has no horizontal scroll\`, async ({ page }) => {
      await page.goto(path);
      await expectNoHorizontalScroll(page);
    });
  }
});
`,
);

// Registry entry.
const registryPath = resolve(www, "registry.json");
const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const { REGISTRY_BASE_URL } = await import(resolve(www, "lib/registry.ts"));
registry.items.push({
  name: slug,
  type: "registry:ui",
  title,
  description: "TODO: one sentence about what it does and its accessibility guarantees.",
  dependencies: ["@base-ui/react@^1.9.0"],
  registryDependencies: ["utils", `${REGISTRY_BASE_URL}/akso-styles.json`],
  files: [{ path: `registry/akso/ui/${slug}.tsx`, type: "registry:ui" }],
  docs: `Akso UI ${title}. Accessibility notes and test status: https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md`,
});
writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
created.push("apps/www/registry.json (entry added)");

// Docs navigation.
const navPath = resolve(www, "lib/components.ts");
const nav = readFileSync(navPath, "utf8");
const entries = [...nav.matchAll(/\{ slug: "([^"]+)", name: "([^"]+)" \}/g)].map((m) => ({ slug: m[1] ?? "", name: m[2] ?? "" }));
entries.push({ slug, name: title });
entries.sort((a, b) => a.slug.localeCompare(b.slug));
writeFileSync(
  navPath,
  nav.replace(/\[\n[\s\S]*?\] as const;/, `[\n${entries.map((e) => `  { slug: "${e.slug}", name: "${e.name}" },`).join("\n")}\n] as const;`),
);
created.push("apps/www/lib/components.ts (entry added)");

// Accessibility statement section, placed with the other components (before "By disability").
const a11ySection = `## ${title}

> Work in progress. Not ready to use.

### Automated checks

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| TODO | | |

### Manual testing with assistive technology

| Assistive technology | Browser / platform | Status | Notes |
| --- | --- | --- | --- |
| NVDA | Chrome (Windows) | ⏳ Pending | |
| NVDA | Firefox (Windows) | ⏳ Pending | |
| JAWS | Chrome (Windows) | ⏳ Pending | |
| VoiceOver | Safari (macOS) | ⏳ Pending | |
| VoiceOver | Safari (iOS) | ⏳ Pending | |
| TalkBack | Chrome (Android) | ⏳ Pending | |
| Voice Control | macOS / iOS | ⏳ Pending | |

`;
const a11yPath = resolve(root, "ACCESSIBILITY.md");
const a11y = readFileSync(a11yPath, "utf8");
const byDisability = a11y.indexOf("\n## By disability");
writeFileSync(
  a11yPath,
  byDisability === -1 ? `${a11y.trimEnd()}\n\n${a11ySection}` : `${a11y.slice(0, byDisability + 1)}${a11ySection}${a11y.slice(byDisability + 1)}`,
);
created.push("ACCESSIBILITY.md (section added)");

console.log(`Created ${title}:\n${created.map((f) => `  + ${f}`).join("\n")}

Next steps:
  1. Read the Base UI docs: ${existsSync(baseDocs) ? baseDocs.replace(`${root}/`, "") : "(not found)"}
  2. Build the component and replace every it.todo / test.fixme with real tests.
  3. pnpm registry:build && pnpm test && pnpm test:e2e && pnpm verify:registry
  4. Fill in the docs page, the keyboard table and the ACCESSIBILITY.md section.
`);
