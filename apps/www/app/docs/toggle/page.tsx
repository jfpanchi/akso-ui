import type { Metadata } from "next";
import { ToggleDemo } from "@/components/toggle-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Toggle", description: "Accessible on/off button built on Base UI." };

const usage = `import { Toggle } from "@/components/ui/toggle";

<Toggle pressed={muted} onPressedChange={setMuted}>
  Mute notifications
</Toggle>

<Toggle size="icon" aria-label="Bold">
  <BoldIcon aria-hidden="true" />
</Toggle>`;

export default function ToggleDocsPage() {
  return (
    <DocPage
      title="Toggle"
      intro={<p>A button that stays on or off, like “Bold” in a text editor or “Mute”. For a setting in a list or a form, a Switch is usually clearer.</p>}
    >
      <DocSection id="example" title="Example">
        <Example>
          <ToggleDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="toggle" adds={<>This adds <code>components/ui/toggle.tsx</code> and <code>lib/akso-styles.ts</code>, and installs <code>@base-ui/react</code>.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>Keep the same name when it is pressed (“Mute”, not “Mute on” / “Mute off”). Screen readers already say “pressed” or “not pressed”.</li>
          <li>Icon-only toggles (<code>size=&quot;icon&quot;</code>) need an <code>aria-label</code>. In development, a toggle without a name logs an error.</li>
          <li>Pressed is shown two ways: the button fills with color and a bar appears along the bottom. In Windows high contrast it uses the system highlight color.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Tab / Shift + Tab", "Moves to and from the toggle. Disabled toggles are skipped."],
            ["Space / Enter", "Presses or releases it."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations: off, pressed, icon-only and disabled", "Vitest + vitest-axe, Playwright"],
            ["Native button with aria-pressed; the name does not change", "Vitest, Playwright"],
            ["Space and Enter press it; disabled toggles are skipped", "Vitest, Playwright"],
            ["Pressed is shown with a fill and a bar, not only color; the fill has 3:1 contrast with the page", "Vitest, Playwright"],
            ["Pressed and off stay visible in Windows high contrast", "Playwright (forced colors)"],
            ["44×44px targets; visible focus ring with at least 3:1 contrast", "Playwright"],
            ["Error in development when it has no name", "Vitest"],
            ["No motion with prefers-reduced-motion; no horizontal scroll at 320px", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
