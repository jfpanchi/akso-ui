import type { Metadata } from "next";
import { LinkDemo } from "@/components/link-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Link", description: "Accessible text link that is always underlined and says when it opens a new tab." };

const usage = `import { Link } from "@/components/ui/link";

<Link href="/docs/accessibility">accessibility notes</Link>

<Link href="https://base-ui.com" newTab>Base UI</Link>

// With your router's link:
<Link href="/docs" render={(props) => <NextLink {...props} />}>Docs</Link>`;

export default function LinkDocsPage() {
  return (
    <DocPage title="Link" intro={<p>A text link: always underlined, with a visible focus ring, and honest about new tabs.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <LinkDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand
          name="link"
          adds={
            <>
              This adds <code>components/ui/link.tsx</code> and the shared files in <code>lib/</code>.
            </>
          }
        />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>Write link text that says where the link goes (“accessibility notes”), not “click here” or “read more”.</li>
          <li>
            Avoid new tabs. When you must use one (people would lose work), add <code>newTab</code>: the link shows an icon and screen readers hear “opens in a
            new tab”.
          </li>
          <li>Use a Button, not a link, for actions that do not go somewhere.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Tab", "Moves to the link."],
            ["Enter", "Follows the link."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations (including link color contrast)", "Vitest + vitest-axe, Playwright"],
            ["A real link named by its text; new-tab links add “(opens in a new tab)” (translated) and rel=\"noopener noreferrer\"", "Vitest, Playwright"],
            ["Always underlined; focus ring with at least 3:1 contrast", "Vitest, Playwright"],
            ["Works with your router's link through render", "Vitest"],
            ["No motion; no horizontal scroll at 320px", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
