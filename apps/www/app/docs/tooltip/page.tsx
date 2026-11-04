import type { Metadata } from "next";
import { TooltipDemo } from "@/components/tooltip-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Tooltip", description: "Accessible tooltip built on Base UI." };

const usage = `<TooltipProvider>
  <Tooltip content="Bold">
    <Button size="icon" variant="ghost"><BoldIcon aria-hidden="true" /></Button>
  </Tooltip>
</TooltipProvider>`;

export default function TooltipDocsPage() {
  return (
    <DocPage title="Tooltip" intro={<p>A short visual label that appears when the pointer or keyboard focus is on an icon, like “Bold”. It is extra help for sighted people, not the main way to give information.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <TooltipDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="tooltip" adds={<>This adds <code>components/ui/tooltip.tsx</code> and installs <code>@base-ui/react</code>.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li><strong>Never put information people need only in a tooltip.</strong> Tooltips do not appear on touch screens, and screen readers do not depend on them. For explanations, use a <a href="/docs/popover">Popover</a> or text on the page.</li>
          <li>An icon-only trigger without a name gets the tooltip text as its <code>aria-label</code>. A trigger with visible text keeps it as its name, so voice control users can say what they see.</li>
          <li>It appears on hover and on keyboard focus, stays while the pointer is over it, and Escape hides it (WCAG 1.4.13).</li>
          <li>Wrap your app (or a toolbar) in <code>TooltipProvider</code> so moving between icons does not wait again.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Tab", "Focusing the trigger shows the tooltip."],
            ["Escape", "Hides the tooltip. Focus stays on the trigger."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations, closed and open", "Vitest + vitest-axe, Playwright"],
            ["Icon-only triggers are named by the tooltip text; visible text is kept", "Vitest, Playwright"],
            ["Shows on focus; Escape hides it without moving focus", "Vitest, Playwright"],
            ["Stays open while hovered (hoverable)", "Playwright"],
            ["Text has at least 4.5:1 contrast", "Playwright (axe)"],
            ["No motion with prefers-reduced-motion", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
