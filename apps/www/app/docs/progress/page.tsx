import type { Metadata } from "next";
import { ProgressDemo } from "@/components/progress-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Progress", description: "Accessible progress bar built on Base UI." };

const usage = `<Progress label="Uploading photo" value={40} />
<Progress label="Step 2 of 4" value={2} max={4} getAriaValueText={(_, v) => \`Step \${v} of 4\`} />
<Progress label="Preparing your download" value={null} />`;

export default function ProgressDocsPage() {
  return (
    <DocPage title="Progress" intro={<p>Shows how much of a task is done, like an upload. When the amount is unknown, it shows that the task is still running.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <ProgressDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="progress" adds={<>This adds <code>components/ui/progress.tsx</code> and installs <code>@base-ui/react</code>.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li><code>label</code> is required: it names the bar for screen readers.</li>
          <li>The value is also shown as text (“40%”), so it does not depend on the length of the bar.</li>
          <li>Use <code>getAriaValueText</code> for friendlier words (“Step 2 of 4”).</li>
          <li>With <code>value=&#123;null&#125;</code> (unknown amount), the bar pulses. With reduced motion, it stays still.</li>
          <li>When the task finishes, tell people with a status message; screen readers do not always announce progress changes.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["—", "A progress bar is not interactive and is not a Tab stop."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations: value, complete, unknown", "Vitest + vitest-axe, Playwright"],
            ["role=progressbar named by its label, with aria-valuenow/min/max", "Vitest, Playwright"],
            ["Value shown as text; friendly aria-valuetext", "Vitest"],
            ["Bar has at least 3:1 contrast against its track", "Playwright + token tests"],
            ["No motion with prefers-reduced-motion", "Playwright"],
            ["No horizontal scroll at 320px wide", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
