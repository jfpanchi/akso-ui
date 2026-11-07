import type { Metadata } from "next";
import { ToggleGroupDemo } from "@/components/toggle-group-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Toggle group", description: "Accessible group of toggle buttons built on Base UI." };

const usage = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

<p id="alignment-label">Text alignment</p>
<ToggleGroup aria-labelledby="alignment-label" value={align} onValueChange={setAlign}>
  <ToggleGroupItem value="left">Left</ToggleGroupItem>
  <ToggleGroupItem value="center">Center</ToggleGroupItem>
  <ToggleGroupItem value="right">Right</ToggleGroupItem>
</ToggleGroup>`;

export default function ToggleGroupDocsPage() {
  return (
    <DocPage
      title="Toggle group"
      intro={
        <p>
          A set of toggle buttons that belong together, like text alignment (one at a time) or bold, italic and underline (several at once). In a form,
          prefer a Radio group or a Checkbox group: they are more familiar.
        </p>
      }
    >
      <DocSection id="example" title="Example">
        <Example>
          <ToggleGroupDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand
          name="toggle-group"
          adds={<>This adds <code>components/ui/toggle-group.tsx</code> and <code>lib/akso-styles.ts</code>, and installs <code>@base-ui/react</code>.</>}
        />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>
            Name the group: point <code>aria-labelledby</code> at a visible label, or use <code>aria-label</code>. Screen readers say the name when focus
            enters the group. In development, a group without a name logs an error.
          </li>
          <li>
            Without <code>multiple</code>, pressing a button releases the others. With <code>multiple</code>, several can be pressed. <code>value</code> is
            always an array.
          </li>
          <li>Icon-only items need an <code>aria-label</code>. On narrow screens, the buttons wrap to the next line.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Tab / Shift + Tab", "Moves into the group (to one button) and out of it."],
            ["← / →", "Moves between the buttons. ↑ / ↓ when the group is vertical."],
            ["Home / End", "Moves to the first or last button."],
            ["Space / Enter", "Presses or releases the focused button."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations: single and multiple groups", "Vitest + vitest-axe, Playwright"],
            ["role=group named by its label; buttons with aria-pressed", "Vitest, Playwright"],
            ["One at a time without multiple; several with multiple", "Vitest, Playwright"],
            ["Tab enters on one button, arrows move, Space presses, Tab leaves", "Vitest, Playwright"],
            ["Same pressed style as Toggle (fill and bar, not only color)", "Vitest"],
            ["44×44px targets; visible focus ring with at least 3:1 contrast", "Playwright"],
            ["Error in development when the group has no name", "Vitest"],
            ["No motion with prefers-reduced-motion; no horizontal scroll at 320px", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
