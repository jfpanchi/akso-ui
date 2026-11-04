import type { Metadata } from "next";
import { AccordionDemo } from "@/components/accordion-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Accordion", description: "Accessible accordion built on Base UI." };

const usage = `<Accordion>
  <AccordionItem value="ship">
    <AccordionTrigger>How long does shipping take?</AccordionTrigger>
    <AccordionPanel>Between 3 and 5 working days.</AccordionPanel>
  </AccordionItem>
</Accordion>`;

export default function AccordionDocsPage() {
  return (
    <DocPage title="Accordion" intro={<p>A list of headings that each show or hide a section, like a list of questions and answers.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <AccordionDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="accordion" adds={<>This adds <code>components/ui/accordion.tsx</code> and <code>lib/akso-styles.ts</code>, and installs <code>@base-ui/react</code>.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>Each trigger is a real heading (level 3 by default). Change it with <code>level</code> so it fits the headings of your page: screen reader users jump between headings.</li>
          <li>Closed sections stay searchable: the browser's find-in-page (Ctrl/Cmd+F) opens the section that contains the match (<code>hidden=&quot;until-found&quot;</code>).</li>
          <li>The arrow points down when closed and up when open, so the state does not depend on color.</li>
          <li>Use <code>multiple</code> to let several sections be open at once.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Tab / Shift + Tab", "Moves between the section headings and the content inside open sections."],
            ["Enter / Space", "Opens or closes the focused section."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations, closed and open", "Vitest + vitest-axe, Playwright"],
            ["Triggers are buttons inside headings, with aria-expanded and aria-controls", "Vitest, Playwright"],
            ["Closed panels use hidden=until-found", "Vitest"],
            ["Enter and Space toggle; Tab moves between triggers", "Vitest, Playwright"],
            ["Arrow direction shows the state", "Vitest, Playwright"],
            ["No height animation with prefers-reduced-motion", "Playwright"],
            ["No horizontal scroll at 320px wide", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
