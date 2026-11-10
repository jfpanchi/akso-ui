import type { Metadata } from "next";
import { PreviewCardDemo } from "@/components/preview-card-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Preview card", description: "Link with a visual preview of its destination, built on Base UI." };

const usage = `import { PreviewCard, PreviewCardContent, PreviewCardTrigger } from "@/components/ui/preview-card";

<PreviewCard>
  <PreviewCardTrigger href="/people/laura">Laura Torres</PreviewCardTrigger>
  <PreviewCardContent>
    <p>Designer at Akso. Joined in 2024.</p>
  </PreviewCardContent>
</PreviewCard>`;

export default function PreviewCardDocsPage() {
  return (
    <DocPage
      title="Preview card"
      intro={
        <p>
          A link that shows a short preview of its destination when you point at it or focus it. The preview is only an extra: everything in it must also be on the
          linked page.
        </p>
      }
    >
      <DocSection id="example" title="Example">
        <Example>
          <PreviewCardDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand
          name="preview-card"
          adds={
            <>
              This adds <code>components/ui/preview-card.tsx</code> and the shared files in <code>lib/</code>, and installs <code>@base-ui/react</code>.
            </>
          }
        />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>
            <strong>Screen reader and touch users do not get the preview.</strong> It is not focusable, and screen readers are not sent into it, so it does not
            interrupt reading. Put nothing in it that is not also on the linked page.
          </li>
          <li>No links, buttons or form fields inside the preview: nobody using a keyboard can reach them. Use a Popover for that.</li>
          <li>The trigger must be a real link with an <code>href</code>. It works like any other link.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Tab", "Focuses the link. After a short delay the preview opens. Tab again moves to the next element and closes it."],
            ["Escape", "Closes the preview. Focus stays on the link."],
            ["Enter", "Follows the link."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations, closed and open", "Vitest + vitest-axe, Playwright"],
            ["The trigger is a plain link; the preview is never in the Tab order", "Vitest, Playwright"],
            ["Focus opens the preview; Escape closes it and focus stays on the link", "Vitest, Playwright"],
            ["The pointer can move onto the preview without it closing (WCAG 1.4.13)", "Playwright"],
            ["Underlined link with a focus ring of at least 3:1 contrast", "Vitest, Playwright"],
            ["No motion with prefers-reduced-motion; fits at 320px", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
