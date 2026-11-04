import type { Metadata } from "next";
import { FieldDemo } from "@/components/field-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Field", description: "A label, a control, help text and error messages, linked together for screen readers." };

const usage = `import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

<Field name="email" required validationMode="onBlur">
  <FieldLabel>Email</FieldLabel>
  <Input type="email" autoComplete="email" />
  <FieldDescription>We only use it to reply to you.</FieldDescription>
  <FieldError match="valueMissing">Enter your email.</FieldError>
  <FieldError match="typeMismatch">Enter an email like name@example.com.</FieldError>
</Field>`;

export default function FieldDocsPage() {
  return (
    <DocPage title="Field" intro={<p>Wraps one form control with its visible label, an optional description and its error messages. Field links them for screen readers, shows required fields as text and announces errors as they appear.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <FieldDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="field" adds={<>This adds <code>components/ui/field.tsx</code> and <code>lib/akso-form.ts</code> (shared form helpers), installs <code>@base-ui/react</code> and adds the Akso UI color tokens.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li><strong>Every field needs a visible <code>FieldLabel</code>.</strong> Placeholders are not labels: they disappear when you type and often have low contrast.</li>
          <li><code>required</code> on Field shows &quot;(required)&quot; after the label and makes the control required. Translate the text with <code>requiredText</code>.</li>
          <li>Write one <code>FieldError</code> per problem with <code>match</code> (<code>valueMissing</code>, <code>typeMismatch</code>, <code>tooShort</code>…). Say what to do, not only what is wrong: &quot;Enter an email like name@example.com&quot;.</li>
          <li>For errors from your server (Form <code>errors</code> prop), add a <code>FieldError</code> <strong>without</strong> <code>match</code>, only while that error exists. Without <code>match</code>, it shows for every problem and would repeat your other messages.</li>
          <li>Errors are announced politely when they appear or change while the person fills in the form (for example with <code>validationMode=&quot;onBlur&quot;</code>). After a submit, focus moves to the first invalid field and its error is read with it, so it is not announced twice. Turn announcements off with <code>announceErrors=&#123;false&#125;</code>.</li>
          <li>With <code>validationMode=&quot;onBlur&quot;</code>, a field is only checked on blur after the person has typed in it. Moving through an empty form with Tab does not fill it with errors; empty required fields are reported on submit.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Tab / Shift + Tab", "Moves to and from the control. The label, description and errors are not tab stops."],
            ["Click on the label", "Moves focus to the control."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations, valid and invalid", "Vitest + vitest-axe, Playwright + @axe-core/playwright"],
            ["The control is named by the visible label (without “(required)”)", "Vitest"],
            ["Description and errors are the control’s accessible description; aria-invalid when invalid", "Vitest"],
            ["Errors have an icon and text, not only a color", "Vitest, Playwright"],
            ["Errors are announced on blur, not repeated on submit", "Vitest, Playwright"],
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
