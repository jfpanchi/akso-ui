import type { Metadata } from "next";
import { ComboboxDemo } from "@/components/combobox-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Combobox", description: "Accessible filterable select built on Base UI." };

const usage = `<Field name="country" required>
  <Combobox label="Country" items={countries} placeholder="Type to search" />
  <FieldError match="valueMissing">Choose your country.</FieldError>
</Field>`;

export default function ComboboxDocsPage() {
  return (
    <DocPage title="Combobox" intro={<p>Lets people choose one option from a long list by typing to filter it, like a country. For short lists, use a Select.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <ComboboxDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="combobox" adds={<>This adds <code>components/ui/combobox.tsx</code>, <code>lib/akso-styles.ts</code> and <code>lib/akso-form.ts</code>, and installs <code>@base-ui/react</code>.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li><code>label</code> is required and always visible. A placeholder is not a label.</li>
          <li>While people type, screen readers hear how many options match (“3 results”). When nothing matches, “No results.” is shown and announced. Translate them with <code>resultsText</code> and <code>emptyText</code>.</li>
          <li>The highlighted option has a ring with at least 3:1 contrast; the chosen option has a check mark and bold text.</li>
          <li>Only options from the list can be chosen. For free text with suggestions, an autocomplete is needed (not built yet).</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Typing", "Filters the options and opens the list."],
            ["Arrow Down / Arrow Up", "Moves the highlight through the options. Focus stays in the text field."],
            ["Enter", "Chooses the highlighted option."],
            ["Escape", "Closes the list."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations, closed and open", "Vitest + vitest-axe, Playwright"],
            ["Input with role=combobox named by the visible label; aria-expanded; aria-activedescendant", "Vitest, Playwright"],
            ["Number of results and “No results.” announced", "Vitest, Playwright"],
            ["Arrows, Enter, Escape; focus stays in the input", "Vitest, Playwright"],
            ["Required: error linked; focus moves to the input on submit", "Vitest"],
            ["Highlight ring with at least 3:1 contrast; options 44px", "Playwright"],
            ["Fits at 320px wide; no motion with reduced motion", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
