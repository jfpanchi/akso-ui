import type { ReactNode } from "react";
import { REGISTRY_BASE_URL } from "@/lib/registry";

/*
 * Building blocks for component documentation pages.
 * Every page uses the same sections in the same order, so people who rely on
 * headings to navigate (screen reader users, cognitive disabilities) find things in the same place.
 */

const cell = "border border-akso-border px-3 py-2 text-left align-top";
const code = "rounded-md border border-akso-border p-4 text-sm whitespace-pre-wrap break-words";

export function DocPage({ title, intro, children }: { title: string; intro: ReactNode; children: ReactNode }) {
  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="text-lg">{intro}</div>
      </header>
      {children}
    </article>
  );
}

export function DocSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h2 id={id} className="text-2xl font-semibold">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function Example({ children }: { children: ReactNode }) {
  return <div className="rounded-lg border border-akso-border p-6">{children}</div>;
}

export function CodeBlock({ children }: { children: string }) {
  return (
    <pre className={code}>
      <code>{children}</code>
    </pre>
  );
}

export function InstallCommand({ name, adds }: { name: string; adds: ReactNode }) {
  return (
    <>
      <p>From the GitHub repository:</p>
      <CodeBlock>{`npx shadcn@latest add ${REGISTRY_BASE_URL}/${name}.json`}</CodeBlock>
      <p>{adds}</p>
    </>
  );
}

function Table({ caption, headers, rows }: { caption: string; headers: [string, string]; rows: [ReactNode, ReactNode][] }) {
  return (
    <table className="w-full border-collapse">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr>
          {headers.map((h) => (
            <th key={h} scope="col" className={cell}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(([a, b], i) => (
          <tr key={i}>
            <td className={cell}>{a}</td>
            <td className={cell}>{b}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function KeyboardTable({ rows }: { rows: [key: string, action: string][] }) {
  return <Table caption="Keyboard shortcuts" headers={["Key", "Action"]} rows={rows} />;
}

export function AutomatedTestsTable({ rows }: { rows: [what: string, tool: string][] }) {
  return <Table caption="Automated tests and tools" headers={["What is checked", "Tool"]} rows={rows} />;
}

/** Assistive technologies every component is checked with by hand. Keep in sync with ACCESSIBILITY.md. */
export const MANUAL_TEST_TARGETS = [
  "NVDA + Chrome",
  "NVDA + Firefox",
  "JAWS + Chrome",
  "VoiceOver + Safari (macOS)",
  "VoiceOver + Safari (iOS)",
  "TalkBack + Chrome (Android)",
  "Voice Control (macOS / iOS)",
] as const;

export type ManualStatus = "pending" | "pass" | "issues";

const statusText: Record<ManualStatus, { icon: string; text: string }> = {
  pending: { icon: "⏳", text: "Pending" },
  pass: { icon: "✅", text: "Works" },
  issues: { icon: "⚠️", text: "Problems found" },
};

/** Status is always written as text; the icon is decorative (color/icon is never the only signal). */
export function ManualTestsTable({ status = {} }: { status?: Partial<Record<(typeof MANUAL_TEST_TARGETS)[number], ManualStatus>> }) {
  return (
    <>
      <p>
        Automated tools find only part of the problems. Manual tests marked &quot;Pending&quot; have <strong>not been done yet</strong>. If
        you use one of these tools, please{" "}
        <a href="https://github.com/jfpanchi/akso-ui/issues/new?template=accessibility-barrier.yml">tell us what happens</a>.
      </p>
      <Table
        caption="Manual test status"
        headers={["Assistive technology", "Status"]}
        rows={MANUAL_TEST_TARGETS.map((at) => {
          const { icon, text } = statusText[status[at] ?? "pending"];
          return [
            at,
            <>
              <span aria-hidden="true">{icon} </span>
              {text}
            </>,
          ];
        })}
      />
    </>
  );
}
