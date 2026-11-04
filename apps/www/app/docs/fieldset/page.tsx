import type { Metadata } from "next";
import { FieldsetDemo } from "@/components/fieldset-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Fieldset", description: "Groups related fields under a legend." };

const usage = `<Fieldset>
  <FieldsetLegend>Delivery address</FieldsetLegend>
  <Field name="street" required>
    <FieldLabel>Street and number</FieldLabel>
    <Input autoComplete="street-address" />
  </Field>
  …
</Fieldset>`;

export default function FieldsetDocsPage() {
  return (
    <DocPage title="Fieldset" intro={<p>Groups related fields, like the parts of an address, under a common name (the legend). Screen readers announce the legend when focus enters the group.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <FieldsetDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="fieldset" adds={<>This adds <code>components/ui/fieldset.tsx</code> and installs <code>@base-ui/react</code>.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>Always add a <code>FieldsetLegend</code>. Keep it short: some screen readers repeat it before every field in the group.</li>
          <li>Use a fieldset when the fields only make sense together (an address, a date split in parts, a group of checkboxes). Do not wrap a whole long form in a single fieldset.</li>
          <li><code>disabled</code> on the fieldset disables every field inside.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Tab / Shift + Tab", "Moves through the fields of the group. The legend is not a tab stop."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations, enabled and disabled", "Vitest + vitest-axe, Playwright"],
            ["A group named by its legend", "Vitest, Playwright"],
            ["Disabled fieldset disables every field and is skipped by Tab", "Vitest"],
            ["No horizontal scroll at 320px wide", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
