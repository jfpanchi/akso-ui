import type { Metadata } from "next";
import { DrawerDemo } from "@/components/drawer-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Drawer", description: "Accessible drawer built on Base UI." };

const usage = `<Drawer side="right">
  <DrawerTrigger>Show filters</DrawerTrigger>
  <DrawerContent>
    <DrawerTitle>Filters</DrawerTitle>
    <DrawerDescription>Narrow down the list of products.</DrawerDescription>
    …
    <DrawerClose variant="primary">Apply filters</DrawerClose>
  </DrawerContent>
</Drawer>`;

export default function DrawerDocsPage() {
  return (
    <DocPage title="Drawer" intro={<p>A panel that slides in from the side or the bottom of the screen, like a list of filters. It works like a dialog: the rest of the page waits until it is closed.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <DrawerDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="drawer" adds={<>This adds <code>components/ui/drawer.tsx</code> and <code>lib/akso-styles.ts</code>, and installs <code>@base-ui/react</code>.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>Always add a <code>DrawerTitle</code>: it names the panel for screen readers.</li>
          <li>It can be closed by swiping, but swiping is never needed: there is always a close button, and Escape and the backdrop close it too (WCAG 2.5.7).</li>
          <li><code>side</code> chooses the edge: <code>right</code> (default), <code>left</code> or <code>bottom</code>.</li>
          <li>The slide does not run with reduced motion.</li>
          <li>If you do not need swiping, a <a href="/docs/dialog">Dialog</a> is simpler (Base UI guideline).</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Enter / Space", "On the trigger: opens the drawer. Focus moves inside."],
            ["Tab / Shift + Tab", "Moves between elements inside. Focus does not leave the drawer."],
            ["Escape", "Closes it. Focus returns to the trigger."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations, closed and open", "Vitest + vitest-axe, Playwright"],
            ["Dialog named by its title and described", "Vitest, Playwright"],
            ["Focus trapped; Escape and the close button return focus", "Vitest, Playwright"],
            ["Close button on every side; no swipe needed", "Vitest, Playwright"],
            ["No slide with prefers-reduced-motion", "Playwright"],
            ["Fits at 320px wide", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
