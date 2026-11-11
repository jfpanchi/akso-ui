import type { Metadata } from "next";
import { BadgeDemo } from "@/components/badge-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Badge", description: "Short labels whose meaning never depends on color alone." };

const usage = `import { Badge } from "@/components/ui/badge";

Order 1042 <Badge status="success">Shipped</Badge>
Release notes <Badge>New</Badge>`;

export default function BadgeDocsPage() {
  return (
    <DocPage title="Badge" intro={<p>A short label, like “New” or the status of an order.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <BadgeDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand
          name="badge"
          adds={
            <>
              This adds <code>components/ui/badge.tsx</code> and the shared files in <code>lib/</code>.
            </>
          }
        />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>
            Write the meaning in the text (“Shipped”, “Cancelled”). <code>status</code> only adds an icon and a colored border.
          </li>
          <li>A badge is not a button or a link. To make it do something, use a Button or a Toggle.</li>
          <li>When a badge changes while people use the page, announce the change too (for example with a toast).</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable rows={[["—", "Badges are not interactive and are never in the Tab order."]]} />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations, with and without a status", "Vitest + vitest-axe, Playwright"],
            ["Read as its text; the status icon is hidden", "Vitest, Playwright"],
            ["Each status has its own icon shape and a thicker border, not only a color", "Vitest"],
            ["Text at least 4.5:1 (axe); status borders at least 3:1; borders visible in forced colors", "Playwright"],
            ["Not focusable; no motion; no horizontal scroll at 320px", "Vitest, Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
