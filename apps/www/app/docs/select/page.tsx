import type { Metadata } from "next";
import { SelectDemo } from "@/components/select-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Select", description: "Accessible select built on Base UI." };

const usage = `import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger } from "@/components/ui/select";

<Field name="timezone" required>
  <Select items={items}>
    <SelectLabel>Time zone</SelectLabel>
    <SelectTrigger placeholder="Choose a time zone" />
    <SelectContent>
      {items.map((item) => (
        <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
      ))}
    </SelectContent>
  </Select>
  <FieldError match="valueMissing">Choose a time zone.</FieldError>
</Field>`;

export default function SelectDocsPage() {
  return (
    <DocPage title="Select" intro={<p>Lets people choose one option from a list. Use it for short lists (up to about 15 options). For long lists that people need to search, use a combobox.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <SelectDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="select" adds={<>This adds <code>components/ui/select.tsx</code>, <code>lib/akso-styles.ts</code> and <code>lib/akso-form.ts</code>, and installs <code>@base-ui/react</code>.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>Always add a <code>SelectLabel</code>. Inside a required Field it shows “(required)”.</li>
          <li>Pass <code>items</code> to Select so the trigger can show the chosen label before the list has been opened.</li>
          <li>The highlighted option has a ring with at least 3:1 contrast, and the chosen one has a check mark and bold text, so neither depends on color.</li>
          <li>Options are at least 44px tall. Long option text wraps instead of being cut off.</li>
          <li>By default the list opens on top of the trigger, with the chosen option aligned to it (Base UI). Set <code>alignItemWithTrigger=&#123;false&#125;</code> on SelectContent to open it below.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Enter / Space / Arrow Down / Arrow Up", "On the trigger: opens the list on the chosen option."],
            ["Arrow Down / Arrow Up", "Moves the highlight. Home and End go to the first and last option."],
            ["A letter", "Jumps to the next option that starts with it."],
            ["Enter / Space", "Chooses the highlighted option and closes the list. Focus returns to the trigger."],
            ["Escape", "Closes the list without changing the value. Focus returns to the trigger."],
            ["Tab", "Closes the list and moves on."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations: closed, open, invalid", "Vitest + vitest-axe, Playwright"],
            ["Trigger named by the visible label; aria-expanded", "Vitest, Playwright"],
            ["Options named, chosen one aria-selected with a check mark", "Vitest, Playwright"],
            ["Arrows, Enter, Escape, typeahead; focus returns to the trigger", "Vitest, Playwright"],
            ["Required: error linked and focus moves to the trigger", "Vitest"],
            ["Highlight ring with at least 3:1 contrast; options at least 44px", "Playwright"],
            ["No motion with prefers-reduced-motion", "Playwright"],
            ["No horizontal scroll at 320px wide, closed and open", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
