import type { Metadata } from "next";
import { SearchFieldDemo } from "@/components/search-field-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Search field", description: "Accessible search box with a search landmark, a Clear button and an announced result count." };

const usage = `import { SearchField } from "@/components/ui/search-field";

<SearchField
  label="Search components"
  value={query}
  onValueChange={setQuery}
  resultCount={results.length}
/>`;

export default function SearchFieldDocsPage() {
  return (
    <DocPage title="Search field" intro={<p>A search box for a page or a list, with a Clear button. The number of results is announced after each search.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <SearchFieldDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand
          name="search-field"
          adds={
            <>
              This adds <code>components/ui/search-field.tsx</code> and the shared files in <code>lib/</code>, and installs <code>@base-ui/react</code>.
            </>
          }
        />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>
            Give it a <code>label</code> that says what is searched. Hide it visually with <code>hideLabel</code> only when the page makes it obvious.
          </li>
          <li>
            Pass <code>resultCount</code> when results update as people type, so screen reader users hear how many there are.
          </li>
          <li>When there are no results, say so in text on the page too, and suggest what to try.</li>
          <li>For suggestions in a list under the field, use Autocomplete or Combobox instead.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Enter", "Searches (calls onSearch)."],
            ["Escape", "Clears the field (browser default)."],
            ["Tab", "Moves to the Clear search button when there is text."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations, empty and with text", "Vitest + vitest-axe, Playwright"],
            ["Search landmark; search box named by a visible label (translated)", "Vitest, Playwright"],
            ["Result count announced after it changes, once typing pauses", "Vitest, Playwright"],
            ["Clear search empties the field and puts focus back in it", "Vitest, Playwright"],
            ["Field and button 44px tall with focus rings of at least 3:1", "Playwright"],
            ["No motion; no horizontal scroll at 320px", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
