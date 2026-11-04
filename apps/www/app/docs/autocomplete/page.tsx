import type { Metadata } from "next";
import { AutocompleteDemo } from "@/components/autocomplete-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Autocomplete", description: "Accessible text field with suggestions, built on Base UI." };

const usage = `<Autocomplete label="City" items={cities} name="city" placeholder="Type any city" />`;

export default function AutocompleteDocsPage() {
  return (
    <DocPage title="Autocomplete" intro={<p>A text field that suggests values while people type, like a city or a search term. Any text is allowed; the suggestions only help. If only listed values are valid, use a Combobox.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <AutocompleteDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="autocomplete" adds={<>This adds <code>components/ui/autocomplete.tsx</code> and the shared <code>lib/</code> files, and installs <code>@base-ui/react</code>.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li><code>label</code> is required and always visible.</li>
          <li>While people type, screen readers hear how many suggestions match (“3 suggestions”). When none match, “No suggestions.” is shown and announced.</li>
          <li>Any text can be submitted, even if it is not a suggestion.</li>
          <li>For values that browsers can fill in (email, address…), prefer an <a href="/docs/input">Input</a> with <code>autoComplete</code>: the browser's own suggestions are more familiar to many people.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Typing", "Shows matching suggestions."],
            ["Arrow Down / Arrow Up", "Moves through the suggestions. Focus stays in the text field."],
            ["Enter", "Puts the highlighted suggestion in the field."],
            ["Escape", "Closes the suggestions and keeps what was typed."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations, closed and open", "Vitest + vitest-axe, Playwright"],
            ["Input with role=combobox named by its label", "Vitest, Playwright"],
            ["Number of suggestions and “No suggestions.” announced", "Vitest, Playwright"],
            ["Free text is kept", "Vitest, Playwright"],
            ["Highlight ring with at least 3:1 contrast; suggestions 44px", "Playwright"],
            ["No horizontal scroll at 320px wide", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
