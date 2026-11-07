import type { Metadata } from "next";
import { ToolbarDemo } from "@/components/toolbar-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Toolbar", description: "Accessible toolbar with buttons, toggles and links, built on Base UI." };

const usage = `import {
  Toolbar, ToolbarButton, ToolbarSeparator, ToolbarToggle, ToolbarToggleGroup,
} from "@/components/ui/toolbar";

<Toolbar aria-label="Text formatting">
  <ToolbarToggleGroup aria-label="Text style" multiple>
    <ToolbarToggle value="bold" size="icon" aria-label="Bold"><BoldIcon aria-hidden="true" /></ToolbarToggle>
    <ToolbarToggle value="italic" size="icon" aria-label="Italic"><ItalicIcon aria-hidden="true" /></ToolbarToggle>
  </ToolbarToggleGroup>
  <ToolbarSeparator />
  <ToolbarButton onClick={undo}>Undo</ToolbarButton>
</Toolbar>`;

export default function ToolbarDocsPage() {
  return (
    <DocPage
      title="Toolbar"
      intro={
        <p>
          A row of related controls, like the buttons above a text editor. The whole toolbar is one stop for the Tab key, so keyboard users do not have to
          go through every button to get past it.
        </p>
      }
    >
      <DocSection id="example" title="Example">
        <Example>
          <ToolbarDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="toolbar" adds={<>This adds <code>components/ui/toolbar.tsx</code> and <code>lib/akso-styles.ts</code>, and installs <code>@base-ui/react</code>.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>
            Name the toolbar with <code>aria-label</code>, and each toggle group too. Icon-only buttons and toggles need an <code>aria-label</code>. In
            development, a missing name logs an error.
          </li>
          <li>Use a toolbar for three or more controls. For one or two buttons, plain buttons are easier.</li>
          <li>
            Disabled buttons stay focusable, so people can find them and hear that they are not available. Explain why nearby when it is not obvious.
          </li>
          <li>On narrow screens the controls wrap to the next line.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Tab / Shift + Tab", "Moves into the toolbar (one stop) and out of it."],
            ["← / →", "Moves between the controls, across groups. At the end, it wraps to the start. ↑ / ↓ in a vertical toolbar."],
            ["Space / Enter", "Activates the focused button, toggle or link."],
            ["Home / End", "Only inside a toggle group: first or last toggle of that group."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations, before and after pressing toggles", "Vitest + vitest-axe, Playwright"],
            ["role=toolbar named; groups, separators, toggles with aria-pressed", "Vitest"],
            ["One Tab stop; arrows reach every control and wrap; visible focus ring with at least 3:1 contrast on each", "Vitest, Playwright"],
            ["Disabled buttons stay focusable with aria-disabled", "Vitest, Playwright"],
            ["Toggles use the Akso pressed style (not color alone)", "Vitest"],
            ["Every control is at least 44×44px; wraps at 320px wide", "Playwright"],
            ["Error in development when the toolbar has no name", "Vitest"],
            ["No motion with prefers-reduced-motion", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
