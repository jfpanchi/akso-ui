import type { Metadata } from "next";
import { DatePickerDemo } from "@/components/date-picker-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Date picker", description: "Accessible date field: type the date, or choose it in an optional calendar." };

const usage = `import { DatePicker } from "@/components/ui/date-picker";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

<Field name="appointment" validationMode="onBlur">
  <FieldLabel>Appointment date</FieldLabel>
  <DatePicker value={date} onValueChange={setDate} min="2026-01-01" max="2026-12-31" />
  <FieldError />
</Field>

{/* Dates people know by heart: no calendar */}
<DatePicker calendar={false} autoComplete="bday" />`;

export default function DatePickerDocsPage() {
  return (
    <DocPage
      title="Date picker"
      intro={
        <p>
          A field for a date. People can always type it; the calendar is optional help. Typing works for everyone, including people who use screen readers,
          voice control or a keyboard.
        </p>
      }
    >
      <DocSection id="example" title="Example">
        <Example>
          <DatePickerDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand
          name="date-picker"
          adds={<>This adds <code>components/ui/date-picker.tsx</code> and the shared files in <code>lib/</code>, and installs <code>@base-ui/react</code>. Install the Field too.</>}
        />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>
            Put it inside a Field with a FieldLabel and a FieldError. The format (“mm/dd/yyyy”, or “dd/mm/aaaa” with <code>AksoLocaleProvider locale=&quot;es&quot;</code>)
            is shown under the label and read with the field.
          </li>
          <li>
            The value is always <code>YYYY-MM-DD</code>. Dates that cannot be read, or are outside <code>min</code> and <code>max</code>, show an error
            that says what to type.
          </li>
          <li>
            For dates people know by heart, like a date of birth, use <code>calendar={"{false}"}</code> and <code>autoComplete=&quot;bday&quot;</code>:
            typing is faster than going back years in a calendar.
          </li>
          <li>
            In the calendar, each day is read with its full date (“Thursday, March 5, 2026”). Today is underlined and the chosen day is filled and bold,
            so neither depends on color.
          </li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Tab", "Moves from the text field to the calendar button."],
            ["Enter / Space on the button", "Opens the calendar on the chosen day (or today)."],
            ["← / →", "Previous or next day."],
            ["↑ / ↓", "Same day of the previous or next week."],
            ["Home / End", "First or last day of the week."],
            ["Page Up / Page Down", "Previous or next month. With Shift: previous or next year."],
            ["Enter / Space on a day", "Chooses it and closes the calendar."],
            ["Escape", "Closes the calendar. Focus goes back to the button."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations: closed, calendar open, and with an error", "Vitest + vitest-axe, Playwright"],
            ["Text field named by its label and described by the format hint; errors linked with aria-describedby", "Vitest, Playwright"],
            ["Typed dates are read in the locale's order and kept as YYYY-MM-DD; impossible dates are rejected", "Vitest, Playwright"],
            ["Calendar: grid named by the month; days with full names; aria-selected and aria-current=date", "Vitest"],
            ["Arrows, Home/End, Page Up/Down; min and max are respected; Enter picks; Escape closes; focus returns", "Vitest, Playwright"],
            ["Format, week start and texts from AksoLocaleProvider", "Vitest"],
            ["Field and button 44px; days at least 36px (24px minimum); focus ring with at least 3:1 contrast", "Playwright"],
            ["The open calendar fits at 320px wide; no motion with prefers-reduced-motion", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
