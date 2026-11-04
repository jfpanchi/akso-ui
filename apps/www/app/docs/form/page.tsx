import type { Metadata } from "next";
import { FormDemo } from "@/components/form-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Form", description: "A form that validates its fields accessibly." };

const usage = `<Form
  errors={serverErrors}
  onFormSubmit={async (values) => { … }}
>
  <Field name="email" required>
    <FieldLabel>Email</FieldLabel>
    <Input type="email" autoComplete="email" />
    <FieldError match="valueMissing">Enter your email.</FieldError>
    {serverErrors.email ? <FieldError /> : null}
  </Field>
  <Button type="submit" variant="primary" loading={sending} loadingText="Sending">
    Send message
  </Button>
</Form>`;

export default function FormDocsPage() {
  return (
    <DocPage title="Form" intro={<p>A form that checks its fields when it is sent. If something is wrong, focus moves to the first field with an error, and screen readers hear how many fields need attention.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <FormDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="form" adds={<>This adds <code>components/ui/form.tsx</code> and <code>lib/akso-form.ts</code>, and installs <code>@base-ui/react</code>. Use it with Field, Input, Textarea and Button.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>The browser&apos;s own error bubbles are turned off (<code>novalidate</code>): they cannot be styled, are not always read by screen readers and disappear quickly. Each Field shows its own message instead.</li>
          <li>On submit with errors, focus moves to the first invalid field in page order, and a polite message says how many need attention (&quot;2 fields need attention.&quot;). Translate it with <code>invalidMessage</code>.</li>
          <li>Use <code>onFormSubmit</code> to get the values as an object. Show errors from your server with the <code>errors</code> prop (keys are the Field <code>name</code>s).</li>
          <li>While sending, use a loading Button so focus stays where it is. When it finishes, say what happened with a status message (<code>LiveRegion</code>).</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Enter (in a field)", "Submits the form."],
            ["Tab / Shift + Tab", "Moves between fields in page order."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations, before and after a submit with errors", "Vitest + vitest-axe, Playwright"],
            ["Native bubbles off (novalidate); no submit while there are errors", "Vitest"],
            ["Focus moves to the first invalid field", "Vitest, Playwright"],
            ["Number of fields needing attention is announced", "Vitest, Playwright"],
            ["Server errors appear on the right field and are linked", "Vitest, Playwright"],
            ["No horizontal scroll at 320px wide", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
