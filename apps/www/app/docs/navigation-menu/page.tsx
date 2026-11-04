import type { Metadata } from "next";
import { NavigationMenuDemo } from "@/components/navigation-menu-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Navigation menu", description: "Accessible site navigation built on Base UI." };

const usage = `<NavigationMenu aria-label="Main">
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Products</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink href="/phones">Phones</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="/offers" active>Offers</NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`;

export default function NavigationMenuDocsPage() {
  return (
    <DocPage title="Navigation menu" intro={<p>The main navigation of a site, where some sections open a panel of links. Links stay links, so screen readers list them as navigation.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <NavigationMenuDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="navigation-menu" adds={<>This adds <code>components/ui/navigation-menu.tsx</code> and <code>lib/akso-styles.ts</code>, and installs <code>@base-ui/react</code>.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>Give it an <code>aria-label</code> (“Main”) when the page has more than one navigation.</li>
          <li>Set <code>active</code> on the link to the current page: it gets <code>aria-current=&quot;page&quot;</code> and is shown with an underline and bold text.</li>
          <li>Section buttons say <code>expanded</code>/<code>collapsed</code>; the arrow also turns.</li>
          <li>Items are at least 44px tall and wrap on narrow screens.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Tab / Shift + Tab", "Moves between section buttons, links, and the links inside an open panel."],
            ["Enter / Space", "On a section button: opens or closes its panel."],
            ["Escape", "Closes the panel. Focus returns to its button."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations, closed and open", "Vitest + vitest-axe, Playwright"],
            ["Named navigation landmark; buttons with aria-expanded; real links (no role=menu)", "Vitest, Playwright"],
            ["Current page: aria-current=page, underline and bold", "Vitest, Playwright"],
            ["Enter opens; Tab reaches the links; Escape closes and returns focus", "Vitest, Playwright"],
            ["Visible focus ring with at least 3:1 contrast; items 44px", "Playwright"],
            ["Fits at 320px wide", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
