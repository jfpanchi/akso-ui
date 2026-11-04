import type { Metadata } from "next";
import { InputDemo } from "@/components/input-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Input", description: "Accessible single-line text field." };

const usage = `<Field name="phone">
  <FieldLabel>Phone number</FieldLabel>
  <Input type="tel" autoComplete="tel" inputMode="tel" />
</Field>`;

export default function InputDocsPage() {
  return (
    <DocPage title="Input" intro={<p>A single-line text field. Use it inside a Field, so it has a visible label and its errors are linked.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <InputDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="input" adds={<>This adds <code>components/ui/input.tsx</code>, <code>lib/akso-styles.ts</code> and <code>lib/akso-form.ts</code>, and installs <code>@base-ui/react</code>.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>Set <code>type</code> and <code>autoComplete</code> (<code>email</code>, <code>name</code>, <code>tel</code>, <code>street-address</code>…). Browsers and password managers can then fill the field, which helps people with motor and memory disabilities (WCAG 1.3.5).</li>
          <li>The field is 44px tall with 16px text, so it is easy to tap and iOS does not zoom in when it gets focus.</li>
          <li>An invalid field gets a thicker red border. The error message under it adds an icon and text, so the state does not depend on color.</li>
          <li>Disabled fields cannot be focused and screen readers may skip them. If people need to read the value, show it as text instead.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Tab / Shift + Tab", "Moves to and from the field. Disabled fields are skipped."],
            ["Enter", "Submits the form."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations: default, invalid and disabled", "Vitest + vitest-axe, Playwright"],
            ["Native input, named by the Field label; autocomplete passed through", "Vitest"],
            ["Required from Field; an explicit prop wins", "Vitest"],
            ["Invalid: aria-invalid and a thicker border, plus icon and text", "Vitest, Playwright"],
            ["44px tall; visible focus ring with at least 3:1 contrast", "Playwright"],
            ["No horizontal scroll at 320px wide", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
