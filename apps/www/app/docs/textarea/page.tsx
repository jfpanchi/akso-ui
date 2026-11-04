import type { Metadata } from "next";
import { TextareaDemo } from "@/components/textarea-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Textarea", description: "Accessible multi-line text field." };

const usage = `<Field name="feedback" required>
  <FieldLabel>Your feedback</FieldLabel>
  <Textarea maxLength={500} />
  <FieldDescription>Up to 500 characters.</FieldDescription>
  <FieldError match="valueMissing">Write your feedback.</FieldError>
</Field>`;

export default function TextareaDocsPage() {
  return (
    <DocPage title="Textarea" intro={<p>A multi-line text field for longer answers. Use it inside a Field, like Input.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <TextareaDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="textarea" adds={<>This adds <code>components/ui/textarea.tsx</code>, <code>lib/akso-styles.ts</code> and <code>lib/akso-form.ts</code>, and installs <code>@base-ui/react</code>.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>With <code>maxLength</code>, a counter shows how many characters are left. Screen readers hear it at 20, 10 and 0 left, not on every key. Hide it with <code>showCount=&#123;false&#125;</code>. Also say the limit in a <code>FieldDescription</code>, so people know it before they start typing.</li>
          <li>It shows 4 lines by default (<code>rows</code>) and can be resized vertically.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Tab / Shift + Tab", "Moves to and from the field."],
            ["Enter", "Adds a new line. It does not submit the form."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations, valid and invalid", "Vitest + vitest-axe, Playwright"],
            ["Native textarea, named and described by its Field", "Vitest"],
            ["Validated like Input; focus moves to it on submit with errors", "Vitest"],
            ["Enter adds a line instead of submitting", "Vitest"],
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
