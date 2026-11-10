import type { Metadata } from "next";
import { PaginationDemo } from "@/components/pagination-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Pagination", description: "Accessible pagination: a named nav with a list, visible Previous/Next and aria-current." };

const usage = `import { Pagination } from "@/components/ui/pagination";

// Links (recommended): they work without JavaScript and can open in a new tab.
<Pagination page={page} pageCount={12} getHref={(p) => \`/results?page=\${p}\`} />

// Router links
<Pagination page={page} pageCount={12} getHref={(p) => \`?page=\${p}\`} renderLink={(props) => <Link {...props} />} />

// Buttons, when the list changes without a new URL
<Pagination page={page} pageCount={12} onPageChange={setPage} />`;

export default function PaginationDocsPage() {
  return (
    <DocPage
      title="Pagination"
      intro={<p>Links to move between the pages of a long list, like search results. It follows the GOV.UK pagination pattern, which was tested with users.</p>}
    >
      <DocSection id="example" title="Example">
        <Example>
          <PaginationDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="pagination" adds={<>This adds <code>components/ui/pagination.tsx</code> and the shared files in <code>lib/</code>.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>Prefer links (<code>getHref</code>). Use buttons (<code>onPageChange</code> alone) only when the page does not change its URL.</li>
          <li>
            Say what is on the page near the list, like “Showing results 41 to 50 of 120”. When the list changes without a page load, announce it (for
            example with <code>LiveRegion</code>) and consider moving focus to the top of the list.
          </li>
          <li>With two paginations on a page (top and bottom), give each a different <code>label</code>.</li>
          <li>
            “Previous” and “Next” are left out on the first and last page. Numbers are read as “Page 3”; the current page is shown with a fill, bold text
            and a thicker border.
          </li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Tab / Shift + Tab", "Moves between Previous, the page numbers and Next. The current page is not a Tab stop."],
            ["Enter", "Follows the link (or presses the button)."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations on the first, a middle and the last page", "Vitest + vitest-axe, Playwright"],
            ["nav named “Pagination” (translated) with a list; pages named “Page n”; aria-current=page", "Vitest, Playwright"],
            ["The visible number is part of the name (voice control)", "Vitest"],
            ["Previous/Next left out at the ends; the “…” is hidden from screen readers", "Vitest"],
            ["Tab reaches every control with a visible focus ring with at least 3:1 contrast", "Vitest, Playwright"],
            ["Current page: fill, bold, 2px border, text with at least 4.5:1 contrast", "Playwright"],
            ["44×44px targets; wraps at 320px wide", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
