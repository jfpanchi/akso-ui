import type { Metadata } from "next";
import { OtpFieldDemo } from "@/components/otp-field-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "OTP field", description: "Accessible one-time code field split into boxes, built on Base UI." };

const usage = `import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { OtpField } from "@/components/ui/otp-field";

<Field name="code" required>
  <FieldLabel>Verification code</FieldLabel>
  <FieldDescription>Enter the 6-digit code we sent to your email.</FieldDescription>
  <OtpField length={6} groupSize={3} />
  <FieldError match="valueMissing">Enter the code.</FieldError>
  <FieldError match="patternMismatch">Enter all 6 digits.</FieldError>
</Field>`;

export default function OtpFieldDocsPage() {
  return (
    <DocPage
      title="OTP field"
      intro={
        <p>
          A field for a one-time code, like the verification code sent by email or text message. Each character has its own box. You can type the code, paste it, or
          let your phone fill it in.
        </p>
      }
    >
      <DocSection id="example" title="Example">
        <Example>
          <OtpFieldDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand
          name="otp-field"
          adds={
            <>
              This adds <code>components/ui/otp-field.tsx</code> and the shared files in <code>lib/</code>, and installs <code>@base-ui/react</code>. Install
              the Field too, for the label and errors.
            </>
          }
        />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>Always put it inside a Field with a FieldLabel. The label names the whole field and the first box. In development, a field without a label logs an error.</li>
          <li>Say how long the code is and where it was sent in the description. People who cannot see the boxes still learn how many characters to enter.</li>
          <li>
            The other boxes are named “Digit 2 of 6” (or “Character 2 of 6” for codes with letters). The names come from <code>AksoLocaleProvider</code>; change them
            with <code>slotLabel</code>.
          </li>
          <li>
            A character that is not allowed (a letter in a number code) is not entered, and screen readers hear “Only numbers are allowed.” Change the text with{" "}
            <code>rejectedMessage</code>.
          </li>
          <li>
            Do not add a time limit you cannot extend, and do not submit on your own when the last box is filled unless people expect it (<code>autoSubmit</code>). Give a
            way to send a new code.
          </li>
          <li>
            Use <code>mask</code> only for secrets like a PIN: a hidden code is harder to check.
          </li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Tab / Shift + Tab", "Moves to and from the field. The field is one stop, not one per box."],
            ["Typing", "Enters the character and moves to the next box."],
            ["← / →", "Moves to the previous or next box."],
            ["Home / ↑", "Goes to the first box."],
            ["End / ↓", "Goes to the first empty box (or the last box)."],
            ["Backspace", "Deletes the character and moves back one box."],
            ["Ctrl/⌘ + V", "Pastes the whole code into every box."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations: empty, grouped, filled, disabled and with an error", "Vitest + vitest-axe, Playwright"],
            ["A group named by the FieldLabel and described by the FieldDescription; every box has a name (translated)", "Vitest, Playwright"],
            ["autocomplete=\"one-time-code\" on the first box; paste fills every box", "Vitest, Playwright"],
            ["One Tab stop; arrows, Home, End and Backspace", "Vitest, Playwright"],
            ["Rejected characters are announced", "Vitest, Playwright"],
            ["Error linked with aria-describedby and aria-invalid", "Playwright"],
            ["Boxes 44px tall and at least 24px wide; focus ring with at least 3:1 contrast", "Playwright"],
            ["No motion with prefers-reduced-motion; no horizontal scroll at 320px", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
