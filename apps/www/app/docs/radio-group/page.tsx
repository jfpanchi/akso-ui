import type { Metadata } from "next";
import { RadioGroupDemo } from "@/components/radio-group-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Radio group", description: "Accessible radio buttons named by a legend." };

const usage = `import { Radio, RadioGroup } from "@/components/ui/radio-group";

<Field name="delivery" required>
  <RadioGroup legend="Delivery speed">
    <Radio value="standard">Standard: 3 to 5 days, free</Radio>
    <Radio value="express">Express: 1 to 2 days, $5</Radio>
  </RadioGroup>
  <FieldError match="valueMissing">Choose a delivery speed.</FieldError>
</Field>`;

export default function RadioGroupDocsPage() {
  return (
    <DocPage title="Radio group" intro={<p>A set of options where only one can be chosen. The question is the legend. Tab enters the group once, and the arrow keys move between options.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <RadioGroupDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="radio-group" adds={<>This adds <code>components/ui/radio-group.tsx</code>, <code>lib/akso-styles.ts</code> and <code>lib/akso-form.ts</code>, and installs <code>@base-ui/react</code>.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li><code>legend</code> is required. Each Radio needs a <code>value</code> and visible text.</li>
          <li>The chosen option shows a filled dot, not only a color.</li>
          <li>Inside a Field, each option gets its own label scope (Base UI <code>Field.Item</code>), so options never share a name.</li>
          <li>Put the important information in the option text (“Express: 1 to 2 days, $5”), not in a separate place.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Tab / Shift + Tab", "Moves into the group (to the chosen option, or the first one) and out of it."],
            ["Arrow Down / Arrow Right", "Moves to the next option and chooses it. Disabled options are skipped."],
            ["Arrow Up / Arrow Left", "Moves to the previous option and chooses it."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations: no choice, a choice, invalid", "Vitest + vitest-axe, Playwright"],
            ["role=radiogroup named by its legend; radios named by their text", "Vitest, Playwright"],
            ["Each option has its own label inside a Field", "Vitest"],
            ["Arrow keys move and choose; one Tab stop; disabled skipped", "Vitest, Playwright"],
            ["Required: submit marks the group invalid and focus moves into it", "Vitest, Playwright"],
            ["Visible focus ring with at least 3:1 contrast; rows at least 44px", "Playwright"],
            ["No horizontal scroll at 320px wide", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
