import type { Metadata } from "next";
import { SeparatorDemo } from "@/components/separator-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Separator", description: "Accessible separator line, announced or decorative, built on Base UI." };

const usage = `import { Separator } from "@/components/ui/separator";

// Between groups of content: screen readers hear "separator".
<Separator />

// Only visual: hidden from screen readers.
<Separator decorative />
<Separator orientation="vertical" decorative />`;

export default function SeparatorDocsPage() {
  return (
    <DocPage title="Separator" intro={<p>A line between groups of content.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <SeparatorDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand
          name="separator"
          adds={
            <>
              This adds <code>components/ui/separator.tsx</code> and installs <code>@base-ui/react</code>.
            </>
          }
        />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>Use the default separator when it marks the end of a group that has no heading of its own. Screen readers hear “separator”.</li>
          <li>
            Add <code>decorative</code> when the line is only visual, for example between sections that already have headings, or between links. Too many
            announced separators are noise.
          </li>
          <li>A line does not replace a heading. Give each section a heading so people can jump between them.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable rows={[["—", "The separator is not interactive and is never in the Tab order."]]} />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations: horizontal, vertical and decorative", "Vitest + vitest-axe, Playwright"],
            ["role=\"separator\" with aria-orientation; decorative ones are hidden", "Vitest, Playwright"],
            ["Not in the Tab order", "Vitest, Playwright"],
            ["Line at least 1px with at least 3:1 contrast; still visible in forced colors", "Playwright"],
            ["No motion with prefers-reduced-motion; no horizontal scroll at 320px", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
