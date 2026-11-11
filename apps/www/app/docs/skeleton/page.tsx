import type { Metadata } from "next";
import { SkeletonDemo } from "@/components/skeleton-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Skeleton", description: "Loading placeholders that tell screen readers what is loading." };

const usage = `import { Skeleton, SkeletonContainer } from "@/components/ui/skeleton";

<SkeletonContainer
  loading={isLoading}
  label="Loading orders"
  loadedLabel="Orders loaded"
  fallback={<Skeleton className="h-4 w-1/2" />}
>
  <OrderList orders={orders} />
</SkeletonContainer>`;

export default function SkeletonDocsPage() {
  return (
    <DocPage
      title="Skeleton"
      intro={<p>Grey shapes that hold the place of content while it loads, with the loading state also given in words for screen readers.</p>}
    >
      <DocSection id="example" title="Example">
        <Example>
          <SkeletonDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand
          name="skeleton"
          adds={
            <>
              This adds <code>components/ui/skeleton.tsx</code> and the shared files in <code>lib/</code>.
            </>
          }
        />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>
            Wrap the area in <code>SkeletonContainer</code> and say what is loading in <code>label</code> (“Loading orders”). The shapes are hidden from screen
            readers; the label is not.
          </li>
          <li>Loads longer than a second are announced once, and so is their end. Quick loads stay silent.</li>
          <li>Keep headings and buttons outside the container, so people can still find their way while it loads.</li>
          <li>Make the shapes about the size of the real content, so the page does not jump when it appears.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable rows={[["—", "Nothing in a skeleton is focusable. Focus stays where it was while content loads."]]} />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations, loading and loaded", "Vitest + vitest-axe, Playwright"],
            ["aria-busy while loading; a hidden text that says what is loading; shapes hidden", "Vitest, Playwright"],
            ["Slow loads announced (start and end); quick loads silent; texts translated", "Vitest, Playwright"],
            ["Nothing focusable; focus stays on the button that reloads", "Vitest, Playwright"],
            ["Pulse stops with prefers-reduced-motion; shapes visible in forced colors", "Vitest, Playwright"],
            ["No horizontal scroll at 320px", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
