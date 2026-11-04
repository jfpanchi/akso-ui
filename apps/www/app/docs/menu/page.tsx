import type { Metadata } from "next";
import { MenuDemo } from "@/components/menu-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Menu", description: "Accessible action menu built on Base UI." };

const usage = `<Menu>
  <MenuTrigger>File actions</MenuTrigger>
  <MenuContent>
    <MenuItem onClick={rename}>Rename</MenuItem>
    <MenuItem onClick={duplicate}>Duplicate</MenuItem>
    <MenuSeparator />
    <MenuCheckboxItem defaultChecked>Show hidden files</MenuCheckboxItem>
  </MenuContent>
</Menu>`;

export default function MenuDocsPage() {
  return (
    <DocPage title="Menu" intro={<p>A list of actions that opens from a button, like “Rename” or “Duplicate”. For navigation between pages, use links instead.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <MenuDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="menu" adds={<>This adds <code>components/ui/menu.tsx</code> and <code>lib/akso-styles.ts</code>, and installs <code>@base-ui/react</code>.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>The highlighted item has a ring with at least 3:1 contrast, not only a background. Ticked items show a check mark; the chosen radio item shows a dot.</li>
          <li>Items are at least 44px tall.</li>
          <li>Submenus: put a <code>MenuSub</code> with a <code>MenuSubTrigger</code> and a <code>MenuContent</code> inside the menu. Keep them to one level: deep menus are hard to use with a keyboard or a screen reader.</li>
          <li>Disabled items can be reached with the arrows (ARIA Authoring Practices) so people know they exist, but they do nothing. Say why in the text when you can (“Move (not available)”).</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Enter / Space / Arrow Down", "On the trigger: opens the menu on the first item."],
            ["Arrow Down / Arrow Up", "Moves between items. Home and End go to the first and last item."],
            ["A letter", "Jumps to the next item that starts with it."],
            ["Enter / Space", "Runs the item (or ticks it) and closes the menu. Focus returns to the trigger."],
            ["Escape", "Closes the menu. Focus returns to the trigger."],
            ["Arrow Right / Arrow Left", "On a submenu item: opens the submenu / closes it and returns to the item."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations, closed and open", "Vitest + vitest-axe, Playwright"],
            ["menu, menuitem, menuitemcheckbox, menuitemradio with states", "Vitest, Playwright"],
            ["Arrows, typeahead, Enter, Escape; focus returns to the trigger", "Vitest, Playwright"],
            ["Highlight ring with at least 3:1 contrast; items 44px", "Playwright"],
            ["Check mark and dot, not only color", "Vitest"],
            ["No motion with prefers-reduced-motion; fits at 320px wide", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
