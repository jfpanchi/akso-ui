import type { Metadata } from "next";
import { MeterDemo } from "@/components/meter-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Meter", description: "Accessible meter built on Base UI." };

const usage = `<Meter label="Storage used" value={30} getAriaValueText={() => "3 GB of 10 GB"} />`;

export default function MeterDocsPage() {
  return (
    <DocPage title="Meter" intro={<p>Shows a measurement within a known range, like storage used or battery level. For the progress of a task, use Progress.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <MeterDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="meter" adds={<>This adds <code>components/ui/meter.tsx</code> and installs <code>@base-ui/react</code>.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li><code>label</code> is required.</li>
          <li>The value is also shown as text. Use <code>getAriaValueText</code> to say it in words people understand (“3 GB of 10 GB”).</li>
          <li>If a level is good or bad (for example, low battery), say it in text too; the bar color alone is not enough.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["—", "A meter is not interactive and is not a Tab stop."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations", "Vitest + vitest-axe, Playwright"],
            ["role=meter named by its label, with value and friendly text", "Vitest, Playwright"],
            ["Value shown as text", "Vitest"],
            ["No horizontal scroll at 320px wide", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
