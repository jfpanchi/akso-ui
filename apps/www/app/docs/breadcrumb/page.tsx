import type { Metadata } from "next";
import { BreadcrumbDemo } from "@/components/breadcrumb-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Breadcrumb", description: "Accessible breadcrumb trail: a named nav with an ordered list and aria-current." };

const usage = `import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb";
import Link from "next/link";

<Breadcrumb>
  <BreadcrumbItem>
    <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbLink render={<Link href="/store" />}>Store</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbItem>
    <BreadcrumbPage>Phones</BreadcrumbPage>
  </BreadcrumbItem>
</Breadcrumb>`;

export default function BreadcrumbDocsPage() {
  return (
    <DocPage
      title="Breadcrumb"
      intro={<p>Shows where the current page is in the site, like “Home › Store › Phones”, with links to the pages above it.</p>}
    >
      <DocSection id="example" title="Example">
        <Example>
          <BreadcrumbDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand
          name="breadcrumb"
          adds={<>This adds <code>components/ui/breadcrumb.tsx</code> and the shared files in <code>lib/</code>, and installs <code>@base-ui/react</code> (for <code>render</code>).</>}
        />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>
            Put it near the top of the page, before the main heading. The landmark is named “Breadcrumb” (or the <code>AksoLocaleProvider</code> text), so
            screen reader users can find it or skip it. Change it with <code>label</code>.
          </li>
          <li>
            Use <code>BreadcrumbPage</code> for the last item. It is plain text with <code>aria-current=&quot;page&quot;</code>, not a link to the same page.
          </li>
          <li>Use the same words as the page titles, so people recognize where each link goes.</li>
          <li>
            For router links, pass the link with <code>render</code>. The separators (›) are hidden from screen readers. On narrow screens the trail wraps.
          </li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Tab / Shift + Tab", "Moves between the links. The current page is not a Tab stop."],
            ["Enter", "Follows the focused link."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations", "Vitest + vitest-axe, Playwright"],
            ["nav named “Breadcrumb” (translated); ordered list; aria-current=page on the current page", "Vitest, Playwright"],
            ["Separators hidden from screen readers; none before the first item", "Vitest, Playwright"],
            ["Tab reaches every link with a visible focus ring with at least 3:1 contrast", "Vitest, Playwright"],
            ["Links underlined (not color alone), with at least 4.5:1 contrast; 44px tall", "Playwright"],
            ["router links through render keep the styles", "Vitest"],
            ["No horizontal scroll at 320px; long names wrap", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
