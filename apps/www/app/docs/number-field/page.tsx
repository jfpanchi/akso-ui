import type { Metadata } from "next";
import { NumberFieldDemo } from "@/components/number-field-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Number field", description: "Accessible number input with − and + buttons, built on Base UI." };

const usage = `import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { NumberField } from "@/components/ui/number-field";

<Field required>
  <FieldLabel>Guests</FieldLabel>
  <FieldDescription>From 1 to 8 people.</FieldDescription>
  <NumberField name="guests" defaultValue={2} min={1} max={8} />
  <FieldError match="valueMissing">Enter the number of guests.</FieldError>
</Field>`;

export default function NumberFieldDocsPage() {
  return (
    <DocPage
      title="Number field"
      intro={
        <p>
          A field for a number, like the number of guests or a price, with − and + buttons. For numbers that are not amounts, like a phone or card number, use an
          Input instead.
        </p>
      }
    >
      <DocSection id="example" title="Example">
        <Example>
          <NumberFieldDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand
          name="number-field"
          adds={
            <>
              This adds <code>components/ui/number-field.tsx</code> and the shared files in <code>lib/</code>, and installs <code>@base-ui/react</code>. Install
              the Field too, for the label and errors.
            </>
          }
        />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>Always put it inside a Field with a FieldLabel. In development, a number field without a name logs an error.</li>
          <li>Say the allowed range in the description (“From 1 to 8 people”). Typed values outside it are corrected when the field loses focus.</li>
          <li>
            Use <code>format</code> for currencies or units, so the value is read with them. The − and + names and the role description come from{" "}
            <code>AksoLocaleProvider</code>; change them with <code>decreaseLabel</code>, <code>increaseLabel</code> and <code>roleDescription</code>.
          </li>
          <li>The − and + buttons are not in the Tab order: the arrow keys do the same. Touch screen readers can still reach them.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Tab / Shift + Tab", "Moves to and from the field (not to the − and + buttons)."],
            ["↑ / ↓", "Adds or subtracts one step."],
            ["Shift + ↑ / ↓", "Big step (10 by default)."],
            ["Home / End", "Goes to the minimum or maximum, when set."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations: normal, disabled and with an error", "Vitest + vitest-axe, Playwright"],
            ["Named by the FieldLabel; error linked with aria-describedby and aria-invalid", "Vitest, Playwright"],
            ["Arrows, Shift + arrows, Home and End; Tab skips the − and + buttons", "Vitest, Playwright"],
            ["− and + have names (translated); + is disabled at the maximum", "Vitest"],
            ["Field and buttons 44×44px; focus ring on the whole field with at least 3:1 contrast", "Playwright"],
            ["Error in development without a label", "Vitest"],
            ["No motion with prefers-reduced-motion; no horizontal scroll at 320px", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
