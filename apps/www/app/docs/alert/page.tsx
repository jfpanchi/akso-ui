import type { Metadata } from "next";
import { AlertDemo } from "@/components/alert-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Alert", description: "Accessible inline message: info, success, warning or error." };

const usage = `import { Alert } from "@/components/ui/alert";

<Alert status="warning" title="Your session ends in 5 minutes">
  Save your work to avoid losing it.
</Alert>

{/* A message that appears after an action */}
<Alert status="error" title="We could not save your changes" live="assertive" />`;

export default function AlertDocsPage() {
  return (
    <DocPage title="Alert" intro={<p>A message inside the page about something important: information, a success, a warning or an error.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <AlertDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="alert" adds={<>This adds <code>components/ui/alert.tsx</code> and <code>lib/akso-status.tsx</code>. It does not need Base UI.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>Each status has its own icon shape and a hidden word read before the title (“Warning: …”), so the meaning does not depend on color. Translate it with <code>statusLabel</code>.</li>
          <li>An Alert is <strong>not announced</strong> by default: a message that is there when the page loads should not interrupt. If it appears after something the person did, set <code>live=&quot;polite&quot;</code> (or <code>&quot;assertive&quot;</code> for urgent errors), and render it before its content changes.</li>
          <li>Write the title as the main message and the text as what to do next.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["—", "An Alert is not interactive. Links or buttons inside it work as usual."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations in every status", "Vitest + vitest-axe, Playwright"],
            ["Hidden status word before the title; different icon per status", "Vitest, Playwright"],
            ["Not a live region by default; live sets role=status or role=alert", "Vitest"],
            ["Text has at least 4.5:1 contrast in light and dark mode", "Playwright (axe) + token tests"],
            ["No horizontal scroll at 320px wide", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
