import type { Metadata } from "next";
import { CheckboxGroupDemo } from "@/components/checkbox-group-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Checkbox group", description: "A group of checkboxes named by a legend." };

const usage = `<CheckboxGroup legend="How should we contact you?" defaultValue={["email"]}>
  <Checkbox value="email">Email</Checkbox>
  <Checkbox value="sms">Text message</Checkbox>
  <Checkbox value="phone">Phone call</Checkbox>
</CheckboxGroup>`;

export default function CheckboxGroupDocsPage() {
  return (
    <DocPage title="Checkbox group" intro={<p>Several checkboxes that answer one question, like “How should we contact you?”. The question is the legend, and screen readers announce it when focus enters the group.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <CheckboxGroupDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="checkbox-group" adds={<>This adds <code>components/ui/checkbox-group.tsx</code> and <code>components/ui/checkbox.tsx</code>, and installs <code>@base-ui/react</code>.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li><code>legend</code> is required. Write it as the question the options answer.</li>
          <li>Each Checkbox needs a <code>value</code>. <code>onValueChange</code> receives the list of ticked values.</li>
          <li>Each checkbox is its own Tab stop (unlike radio buttons).</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Tab / Shift + Tab", "Moves from one checkbox to the next."],
            ["Space", "Ticks or unticks the focused checkbox."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations, enabled and disabled", "Vitest + vitest-axe, Playwright"],
            ["A group named by its legend", "Vitest, Playwright"],
            ["Reports the ticked values", "Vitest"],
            ["Each checkbox is a Tab stop; Space toggles", "Vitest, Playwright"],
            ["Visible focus ring with at least 3:1 contrast", "Playwright"],
            ["No horizontal scroll at 320px wide", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
