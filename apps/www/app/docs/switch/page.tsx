import type { Metadata } from "next";
import { SwitchDemo } from "@/components/switch-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Switch", description: "Accessible on/off switch built on Base UI." };

const usage = `import { Switch } from "@/components/ui/switch";

<Switch checked={enabled} onCheckedChange={setEnabled}>
  Email notifications
</Switch>`;

export default function SwitchDocsPage() {
  return (
    <DocPage title="Switch" intro={<p>Turns a setting on or off right away, like “Email notifications”. For a choice that is sent with a form button, use a Checkbox instead.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <SwitchDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="switch" adds={<>This adds <code>components/ui/switch.tsx</code> and <code>lib/akso-styles.ts</code>, and installs <code>@base-ui/react</code>.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>The children are the visible label: the name of the setting. Do not change the label when it is switched (“On”/“Off”); screen readers already say the state.</li>
          <li>“On” is shown three ways: the thumb moves, the track fills and a check mark appears.</li>
          <li>The change applies at once. If it can fail or take time, tell people the result with a status message.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Tab / Shift + Tab", "Moves to and from the switch. Disabled switches are skipped."],
            ["Space / Enter", "Turns it on or off."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations: off, on and disabled", "Vitest + vitest-axe, Playwright"],
            ["role=switch named by its text; aria-checked", "Vitest, Playwright"],
            ["Clicking the text toggles it; Space and Enter toggle it", "Vitest, Playwright"],
            ["On is shown with a check mark and position, not only color", "Vitest, Playwright"],
            ["44×24px track; visible focus ring with at least 3:1 contrast", "Playwright"],
            ["No movement with prefers-reduced-motion", "Playwright"],
            ["No horizontal scroll at 320px wide", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
