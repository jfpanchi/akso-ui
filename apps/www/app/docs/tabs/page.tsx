import type { Metadata } from "next";
import { TabsDemo } from "@/components/tabs-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Tabs", description: "Accessible tabs built on Base UI." };

const usage = `<Tabs defaultValue="profile">
  <TabsList aria-label="Account settings">
    <TabsTrigger value="profile">Profile</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsPanel value="profile">…</TabsPanel>
  <TabsPanel value="password">…</TabsPanel>
</Tabs>`;

export default function TabsDocsPage() {
  return (
    <DocPage title="Tabs" intro={<p>Splits related content into panels and shows one at a time. Use tabs when people need to switch between views of the same thing, not for steps of a process.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <TabsDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="tabs" adds={<>This adds <code>components/ui/tabs.tsx</code> and <code>lib/akso-styles.ts</code>, and installs <code>@base-ui/react</code>.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>Give the TabsList an <code>aria-label</code> (or <code>aria-labelledby</code>) when there is no heading right above it.</li>
          <li>The selected tab has a thick underline and bold text, not only a different color.</li>
          <li>The arrow keys move focus between tabs, and Enter or Space opens one (manual activation, Base UI default). This avoids loading content while people move. Set <code>activateOnFocus</code> on TabsList if panels are instant.</li>
          <li>Each panel can receive focus, so keyboard users can reach its content even when it has no links or buttons.</li>
          <li>Disabled tabs can still be reached with the arrows (ARIA Authoring Practices), so screen reader users know they exist, but they cannot be opened.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Tab", "Moves into the tab list (to the selected tab), then to the panel."],
            ["Arrow Left / Arrow Right", "Moves between tabs (Up/Down when vertical)."],
            ["Home / End", "Moves to the first or last tab."],
            ["Enter / Space", "Opens the focused tab."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations", "Vitest + vitest-axe, Playwright"],
            ["Named tablist; tabs with aria-selected linked to panels", "Vitest, Playwright"],
            ["One Tab stop; arrows move; Enter activates; panel is focusable", "Vitest, Playwright"],
            ["Selected tab: thick underline and bold text", "Vitest, Playwright"],
            ["Visible focus ring with at least 3:1 contrast; tabs 44px tall", "Playwright"],
            ["No horizontal scroll at 320px wide (tabs wrap)", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
