import type { Metadata } from "next";
import { ScrollAreaDemo } from "@/components/scroll-area-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Scroll area", description: "Accessible scrolling box with visible scrollbars, built on Base UI." };

const usage = `import { ScrollArea } from "@/components/ui/scroll-area";

<h2 id="release-notes">Release notes</h2>
<ScrollArea aria-labelledby="release-notes" className="h-48">
  …
</ScrollArea>

<ScrollArea aria-label="Monthly visits" orientation="horizontal">
  <table>…</table>
</ScrollArea>`;

export default function ScrollAreaDocsPage() {
  return (
    <DocPage
      title="Scroll area"
      intro={
        <p>
          A box with its own scrollbars, for content that must fit in a fixed height or width. Use it sparingly: content that scrolls inside the page is harder to
          read, zoom and print.
        </p>
      }
    >
      <DocSection id="example" title="Example">
        <Example>
          <ScrollAreaDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand
          name="scroll-area"
          adds={
            <>
              This adds <code>components/ui/scroll-area.tsx</code> and the shared files in <code>lib/</code>, and installs <code>@base-ui/react</code>.
            </>
          }
        />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>
            Always give it a name: <code>aria-labelledby</code> with the id of a visible heading, or <code>aria-label</code>. When the box can scroll, keyboard
            users can Tab to it, and screen readers say this name. In development, a scroll area without a name logs an error.
          </li>
          <li>Prefer letting the page scroll. Do not put a whole page or a long form inside a scroll area.</li>
          <li>Do not use a fixed height in pixels for text. Use a height in rem, so the box grows when people make text bigger.</li>
          <li>The scrollbars stay visible, so people can see that there is more content.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Tab", "Moves to the box when it can scroll (and to the links inside it)."],
            ["↑ / ↓ / ← / →", "Scrolls a little."],
            ["Page Up / Page Down / Space", "Scrolls by a screen."],
            ["Home / End", "Goes to the start or the end."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations (including scrollable-region-focusable)", "Vitest + vitest-axe, Playwright"],
            ["A region named by aria-label or aria-labelledby; error in development without a name", "Vitest, Playwright"],
            ["In the Tab order only when it can scroll; arrows and End scroll it", "Playwright"],
            ["Focus ring with at least 3:1 contrast, drawn inside the box", "Playwright"],
            ["Scrollbars visible without hovering; thumb with at least 3:1 contrast", "Playwright"],
            ["No motion with prefers-reduced-motion; no horizontal scroll at 320px", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
