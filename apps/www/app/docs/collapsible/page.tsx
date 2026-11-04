import type { Metadata } from "next";
import { CollapsibleDemo } from "@/components/collapsible-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Collapsible", description: "Accessible show/hide section built on Base UI." };

const usage = `<Collapsible>
  <CollapsibleTrigger>Show order details</CollapsibleTrigger>
  <CollapsiblePanel>…</CollapsiblePanel>
</Collapsible>`;

export default function CollapsibleDocsPage() {
  return (
    <DocPage title="Collapsible" intro={<p>A button that shows or hides one section, like extra details of an order.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <CollapsibleDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="collapsible" adds={<>This adds <code>components/ui/collapsible.tsx</code> and <code>lib/akso-styles.ts</code>, and installs <code>@base-ui/react</code>.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>The trigger text says what is inside. Screen readers add “collapsed” or “expanded”.</li>
          <li>The arrow points right when closed and down when open.</li>
          <li>Closed content stays searchable with find-in-page.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Enter / Space", "Shows or hides the section."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations, closed and open", "Vitest + vitest-axe, Playwright"],
            ["Button with aria-expanded and aria-controls", "Vitest, Playwright"],
            ["Closed panel uses hidden=until-found", "Vitest"],
            ["Enter and Space toggle", "Vitest, Playwright"],
            ["Visible focus ring with at least 3:1 contrast; 44px trigger", "Playwright"],
            ["No animation with prefers-reduced-motion", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
