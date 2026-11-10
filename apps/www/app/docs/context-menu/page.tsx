import type { Metadata } from "next";
import { ContextMenuDemo } from "@/components/context-menu-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Context menu", description: "Accessible right-click menu built on Base UI, always paired with visible controls." };

const usage = `import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";

<ContextMenu>
  <ContextMenuTrigger>
    <a href="/files/report.pdf">Annual report.pdf</a>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem onClick={rename}>Rename</ContextMenuItem>
    <ContextMenuItem onClick={download}>Download</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>

{/* Always offer the same actions with a visible control, for example a Menu: */}
<MenuTrigger aria-label="Actions for Annual report.pdf">Actions</MenuTrigger>`;

export default function ContextMenuDocsPage() {
  return (
    <DocPage
      title="Context menu"
      intro={
        <p>
          A menu that opens with a right-click or a long press, like the one on a file. It is a shortcut: the same actions must also be available with
          visible buttons.
        </p>
      }
    >
      <DocSection id="example" title="Example">
        <Example>
          <ContextMenuDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand
          name="context-menu"
          adds={<>This adds <code>components/ui/context-menu.tsx</code> and <code>lib/akso-styles.ts</code>, and installs <code>@base-ui/react</code>.</>}
        />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>
            <strong>Never make it the only way.</strong> Many people never open a context menu: screen reader and keyboard users, voice control users, and
            many people on touch screens. Put the same actions in a visible Menu or buttons next to the item.
          </li>
          <li>
            Keep focusable content inside the trigger (a link or a button). Shift + F10, or the Menu key, on that content opens the menu in Chrome and
            Firefox on Windows and Linux. Safari on macOS has no keyboard shortcut for context menus.
          </li>
          <li>The parts are the same as in Menu: items, check items, radio items, groups, separators and submenus.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Shift + F10 / Menu key", "Opens the menu on the focused content inside the trigger (not in Safari on macOS)."],
            ["↓ / ↑", "Moves between the items."],
            ["Enter / Space", "Chooses the item and closes the menu."],
            ["Escape", "Closes the menu."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations, closed and open", "Vitest + vitest-axe, Playwright"],
            ["role=menu with menuitem / menuitemcheckbox (aria-checked) and separators", "Vitest"],
            ["A real Shift + F10 opens it (verified in Chromium only)", "Playwright"],
            ["The contextmenu event on the focused link opens it; arrows, Enter and Escape work (Chromium, Firefox, WebKit)", "Vitest, Playwright"],
            ["The same actions work with a visible button in the demo", "Playwright"],
            ["Items at least 44px tall; no motion with prefers-reduced-motion; no horizontal scroll at 320px", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
