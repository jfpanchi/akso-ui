import type { Metadata } from "next";
import { PasswordFieldDemo } from "@/components/password-field-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Password field", description: "Accessible password input with a Show / Hide button, built on Base UI." };

const usage = `import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { PasswordField } from "@/components/ui/password-field";

<Field name="password" required>
  <FieldLabel>Password</FieldLabel>
  <FieldDescription>At least 8 characters.</FieldDescription>
  <PasswordField autoComplete="new-password" minLength={8} />
  <FieldError match="tooShort">Use at least 8 characters.</FieldError>
</Field>`;

export default function PasswordFieldDocsPage() {
  return (
    <DocPage
      title="Password field"
      intro={<p>A password input with a button to show what you typed. Seeing the password helps many people type it right.</p>}
    >
      <DocSection id="example" title="Example">
        <Example>
          <PasswordFieldDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand
          name="password-field"
          adds={
            <>
              This adds <code>components/ui/password-field.tsx</code> and the shared files in <code>lib/</code>, and installs <code>@base-ui/react</code>. Install
              the Field too, for the label and errors.
            </>
          }
        />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>Always put it inside a Field with a FieldLabel. Say the rules (length, characters) in the description, before people type.</li>
          <li>
            Use <code>autoComplete=&quot;new-password&quot;</code> for sign-up and password changes, so password managers can suggest a strong one. The default is{" "}
            <code>current-password</code>.
          </li>
          <li>Never block paste, and do not ask people to type the password twice: the Show button is a better way to check it.</li>
          <li>The password is hidden again when the form is submitted.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Tab", "Moves from the input to the Show / Hide button."],
            ["Enter / Space", "On the button: shows or hides the password. Focus stays on the button."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations: hidden, shown and with an error", "Vitest + vitest-axe, Playwright"],
            ["Named by the FieldLabel, described by the FieldDescription; error linked with aria-invalid", "Vitest, Playwright"],
            ["Button named “Show password” / “Hide password” (visible word first), aria-controls the input; translated", "Vitest, Playwright"],
            ["The change is announced; focus stays on the button", "Vitest, Playwright"],
            ["Hidden again after submit; paste works; autocomplete set", "Vitest, Playwright"],
            ["Input and button 44px tall with focus rings of at least 3:1", "Playwright"],
            ["No motion with prefers-reduced-motion; no horizontal scroll at 320px", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
