import type { Metadata } from "next";
import { CheckboxDemo } from "@/components/checkbox-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Checkbox", description: "Accessible checkbox built on Base UI." };

const usage = `import { Checkbox } from "@/components/ui/checkbox";

<Checkbox name="remember">Remember me on this device</Checkbox>

{/* Required, inside a Form */}
<Field name="terms">
  <Checkbox required>I accept the terms</Checkbox>
  <FieldError match="valueMissing">Accept the terms to continue.</FieldError>
</Field>`;

export default function CheckboxDocsPage() {
  return (
    <DocPage title="Checkbox" intro={<p>A box people can tick or untick, with its label next to it. The box and the text are one target: clicking either one ticks the box.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <CheckboxDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="checkbox" adds={<>This adds <code>components/ui/checkbox.tsx</code>, <code>lib/akso-styles.ts</code> and <code>lib/akso-form.ts</code>, and installs <code>@base-ui/react</code>.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>The children are the visible label. Say what ticking the box means: “Send me the newsletter”, not “Newsletter”.</li>
          <li>Ticked shows a check mark, partly ticked (<code>indeterminate</code>) shows a dash, so the state does not depend on color.</li>
          <li>The whole row is at least 44px tall. Clicking the text toggles the box.</li>
          <li>For several options that answer one question, use a <a href="/docs/checkbox-group">Checkbox group</a>.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Tab / Shift + Tab", "Moves to and from the checkbox. Disabled checkboxes are skipped."],
            ["Space", "Ticks or unticks it."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations: unchecked, checked, partly checked, disabled, invalid", "Vitest + vitest-axe, Playwright"],
            ["role=checkbox named by its visible text; aria-checked true / false / mixed", "Vitest"],
            ["Clicking the text toggles it", "Vitest, Playwright"],
            ["Required: aria-invalid and the error as description", "Vitest"],
            ["Space toggles; disabled is skipped by Tab", "Vitest, Playwright"],
            ["Check mark or dash, not only color", "Vitest, Playwright"],
            ["Row at least 44px; visible focus ring with at least 3:1 contrast", "Playwright"],
            ["No horizontal scroll at 320px wide", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
