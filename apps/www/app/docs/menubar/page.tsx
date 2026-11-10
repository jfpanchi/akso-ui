import type { Metadata } from "next";
import { MenubarDemo } from "@/components/menubar-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Menubar", description: "Accessible desktop-style menubar (File · Edit · View) built on Base UI." };

const usage = `import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

<Menubar aria-label="Editor">
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem onClick={newFile}>New</MenubarItem>
      <MenubarItem onClick={open}>Open</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu>
    <MenubarTrigger>Edit</MenubarTrigger>
    <MenubarContent>…</MenubarContent>
  </MenubarMenu>
</Menubar>`;

export default function MenubarDocsPage() {
  return (
    <DocPage
      title="Menubar"
      intro={
        <p>
          A bar of menus like “File · Edit · View” in a desktop app. Use it in app-like interfaces such as editors. For site navigation, use a Navigation
          menu or links instead: a menubar works differently from the links people expect on a website.
        </p>
      }
    >
      <DocSection id="example" title="Example">
        <Example>
          <MenubarDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="menubar" adds={<>This adds <code>components/ui/menubar.tsx</code> and <code>lib/akso-styles.ts</code>, and installs <code>@base-ui/react</code>.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>Name the menubar with <code>aria-label</code>. In development, a menubar without a name logs an error.</li>
          <li>Inside each menu you have the same parts as in Menu: items, check items, radio items, groups, separators and submenus.</li>
          <li>Keep the important actions also available outside the menubar (for example a visible Save button). Menus hide options until opened.</li>
          <li>On narrow screens the menus wrap to the next line.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Tab / Shift + Tab", "Moves into the menubar (one stop) and out of it."],
            ["← / →", "Moves between the menus. While a menu is open, opens the previous or next one."],
            ["↓ / Enter / Space", "Opens the focused menu and moves to its first item."],
            ["↑ / ↓ inside a menu", "Moves between the items. → opens a submenu, ← closes it."],
            ["Enter / Space", "Chooses the item and closes the menu."],
            ["Escape", "Closes the menu; focus goes back to its name in the bar."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations, closed and with a menu open", "Vitest + vitest-axe, Playwright"],
            ["role=menubar named, with aria-orientation; top items are menuitems with aria-haspopup and aria-expanded", "Vitest"],
            ["One Tab stop; ← / → between menus with a visible focus ring with at least 3:1 contrast", "Vitest, Playwright"],
            ["↓ opens; ← / → move between open menus; Enter runs an item; Escape returns focus", "Vitest, Playwright"],
            ["Submenus open with → and run with Enter", "Playwright"],
            ["Triggers and items at least 44px tall; no motion with prefers-reduced-motion; no horizontal scroll at 320px", "Playwright"],
            ["Error in development when the menubar has no name", "Vitest"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
