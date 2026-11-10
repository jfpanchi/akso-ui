import type { Metadata } from "next";
import { TableDemo } from "@/components/table-demo";
import { TableSelectionDemo } from "@/components/table-selection-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Table", description: "Accessible data table with caption, row and column headers, and announced sorting." };

const usage = `import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

<Table>
  <TableCaption>Recent orders</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Order</TableHead>
      <TableHead onSort={sortByCustomer} sortDirection={customerSort}>Customer</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableHead scope="row">A-1042</TableHead>
      <TableCell>Lucía Pérez</TableCell>
    </TableRow>
  </TableBody>
</Table>`;

const selectionUsage = `const selection = useTableSelection(people.map((p) => p.id));

<TableHead className="w-14 p-0 text-center">
  <TableSelectAll selection={selection} />
</TableHead>
…
<TableRow selected={selection.isSelected(person.id)}>
  <TableCell className="p-0 text-center">
    <TableRowCheckbox selection={selection} id={person.id} rowName={person.name} />
  </TableCell>
  <TableHead scope="row">{person.name}</TableHead>
</TableRow>`;

export default function TableDocsPage() {
  return (
    <DocPage
      title="Table"
      intro={<p>A table for data with rows and columns, like a list of orders. Use it for data, not for page layout.</p>}
    >
      <DocSection id="example" title="Example">
        <Example>
          <TableDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="table" adds={<>This adds <code>components/ui/table.tsx</code> and the shared files in <code>lib/</code>.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>
            Always add a <code>TableCaption</code>: it names the table for screen readers. To hide it visually, use <code>className=&quot;sr-only&quot;</code>.
          </li>
          <li>
            Use <code>TableHead</code> for column headers and <code>{`TableHead scope="row"`}</code> for the first cell of each row when it identifies the row.
            Screen readers then read each cell with its headers.
          </li>
          <li>
            For sortable columns, pass <code>onSort</code> and <code>sortDirection</code>. The header becomes a button, the sorted column gets{" "}
            <code>aria-sort</code>, an arrow shows the direction, and “Sorted by Customer, ascending” is announced (translated with{" "}
            <code>AksoLocaleProvider</code>).
          </li>
          <li>
            Wide tables scroll inside their frame, not the page. When the table does not fit, the frame becomes a focusable region named by the caption, so
            keyboard users can scroll it with the arrow keys.
          </li>
        </ul>
      </DocSection>

      <DocSection id="selection" title="Row selection">
        <Example>
          <TableSelectionDemo />
        </Example>
        <CodeBlock>{selectionUsage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>
            Each row checkbox is named after the row (<code>rowName</code>): “Select Laura Torres”, not just “Select”. The “select all” checkbox shows a dash when
            only some rows are selected.
          </li>
          <li>Every change is announced: “2 rows selected”. The selected rows also get a background, but the check mark is what shows the state.</li>
          <li>The checkboxes are 44×44px targets. Show the count somewhere on the page too, near the actions that use it.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Tab", "Moves to the sort buttons, links and controls inside the table. When the table is wider than the screen, also to the table frame."],
            ["Enter / Space", "On a sort button: sorts by that column; pressing again reverses the order."],
            ["← / →", "On the focused table frame: scrolls it sideways."],
            ["Space", "On a row checkbox: selects or unselects the row. On “Select all rows”: selects or unselects every row."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations, unsorted and sorted", "Vitest + vitest-axe, Playwright"],
            ["Table named by its caption; column headers and row headers (scope)", "Vitest"],
            ["Sort button in the header; aria-sort only on the sorted column; the arrow changes with the direction", "Vitest, Playwright"],
            ["Sorting is announced (not on first render)", "Vitest, Playwright"],
            ["Row selection: checkboxes named after the row; select all is checked, mixed or not checked; the count is announced", "Vitest, Playwright"],
            ["Sort buttons 44px tall with a visible focus ring with at least 3:1 contrast", "Playwright"],
            ["At 320px: no page scroll; the table frame is a named, focusable region that scrolls with the arrow keys", "Vitest, Playwright"],
            ["When the table fits, the frame is not a Tab stop", "Vitest, Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
