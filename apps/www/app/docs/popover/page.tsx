import type { Metadata } from "next";
import { PopoverDemo } from "@/components/popover-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Popover", description: "Accessible popover built on Base UI." };

const usage = `<Popover>
  <PopoverTrigger openOnHover variant="ghost" size="icon" aria-label="About delivery times">
    <InfoIcon aria-hidden="true" />
  </PopoverTrigger>
  <PopoverContent>
    <PopoverTitle>Delivery times</PopoverTitle>
    <PopoverDescription>Orders placed before 2 pm ship the same day.</PopoverDescription>
    <PopoverClose>Close</PopoverClose>
  </PopoverContent>
</Popover>`;

export default function PopoverDocsPage() {
  return (
    <DocPage title="Popover" intro={<p>A small panel that opens next to a button with extra information or a few controls. It is the accessible choice for “info” icons.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <PopoverDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="popover" adds={<>This adds <code>components/ui/popover.tsx</code> and <code>lib/akso-styles.ts</code>, and installs <code>@base-ui/react</code>.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>For an info icon, use a Popover, not a Tooltip: it opens on click, tap and keyboard too, so touch and screen reader users can read it. <code>openOnHover</code> on the trigger also opens it on hover.</li>
          <li>Add a <code>PopoverTitle</code>: screen readers announce it when focus moves into the popover.</li>
          <li>When it opens, focus moves inside. Escape closes it and focus returns to the button.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Enter / Space", "On the trigger: opens it. Focus moves inside."],
            ["Tab / Shift + Tab", "Moves between elements inside."],
            ["Escape", "Closes it. Focus returns to the trigger."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations, open and closed", "Vitest + vitest-axe, Playwright"],
            ["Trigger aria-expanded; popup named and described", "Vitest, Playwright"],
            ["Focus moves in; Escape and Close return focus", "Vitest, Playwright"],
            ["Visible focus ring with at least 3:1 contrast", "Playwright"],
            ["No motion with prefers-reduced-motion; fits at 320px wide", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
