import type { Metadata } from "next";
import { AvatarDemo } from "@/components/avatar-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Avatar", description: "Accessible avatar with a picture or initials, built on Base UI." };

const usage = `import { Avatar } from "@/components/ui/avatar";

// On its own: screen readers hear "Laura Torres, image".
<Avatar name="Laura Torres" src="/people/laura.jpg" />

// Next to the written name: hidden, so the name is not read twice.
<span className="flex items-center gap-3">
  <Avatar name="Laura Torres" src="/people/laura.jpg" decorative />
  Laura Torres
</span>`;

export default function AvatarDocsPage() {
  return (
    <DocPage
      title="Avatar"
      intro={<p>A person’s picture, or their initials when there is no picture or it does not load.</p>}
    >
      <DocSection id="example" title="Example">
        <Example>
          <AvatarDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand
          name="avatar"
          adds={
            <>
              This adds <code>components/ui/avatar.tsx</code> and the shared files in <code>lib/</code>, and installs <code>@base-ui/react</code>.
            </>
          }
        />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>
            Always pass <code>name</code>. It names the avatar and gives the initials. Screen readers hear the same name whether the picture has loaded or not.
          </li>
          <li>
            When the name is written next to the avatar (lists, comments, menus), add <code>decorative</code> so the name is not read twice.
          </li>
          <li>
            Inside a link or button with no other text, leave out <code>decorative</code>: the avatar’s name becomes the link’s name. Make sure the link itself is at
            least 24×24px.
          </li>
          <li>Do not use the avatar alone to show status (online, busy): add text too.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable rows={[["—", "The avatar is not interactive and is never in the Tab order. Put it inside a link or button to make it one."]]} />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations: with a picture, a failed picture, initials and decorative", "Vitest + vitest-axe, Playwright"],
            ["One name (role=\"img\") that stays the same while the picture loads or fails; the initials are hidden", "Vitest, Playwright"],
            ["decorative hides the avatar; inside a link, the avatar names the link", "Vitest, Playwright"],
            ["Not in the Tab order", "Vitest, Playwright"],
            ["Initials with at least 4.5:1 contrast (light and dark)", "Playwright (axe)"],
            ["No motion with prefers-reduced-motion; no horizontal scroll at 320px", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
