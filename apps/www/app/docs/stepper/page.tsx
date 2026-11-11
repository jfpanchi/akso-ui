import type { Metadata } from "next";
import { StepperDemo } from "@/components/stepper-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Stepper", description: "Accessible progress steps for tasks split into steps." };

const usage = `import { Stepper } from "@/components/ui/stepper";

<Stepper
  label="Checkout steps"
  current={2}
  steps={[
    { label: "Cart", href: "/checkout/cart" },
    { label: "Shipping", href: "/checkout/shipping" },
    { label: "Payment" },
    { label: "Review" },
  ]}
/>`;

export default function StepperDocsPage() {
  return (
    <DocPage title="Stepper" intro={<p>Shows where you are in a task split into steps, like checkout or sign-up, and lets you go back to finished steps.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <StepperDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand
          name="stepper"
          adds={
            <>
              This adds <code>components/ui/stepper.tsx</code> and the shared files in <code>lib/</code>.
            </>
          }
        />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>
            Give it a <code>label</code> when there is more than one navigation on the page (“Checkout steps”).
          </li>
          <li>
            Give completed steps an <code>href</code>, so people can go back and change their answers. Use <code>renderLink</code> for your router’s link.
          </li>
          <li>
            When the step changes, move focus to the new step’s heading (as in the example). The stepper shows the change but does not announce it.
          </li>
          <li>Use short step names. Keep the answers people gave when they go back.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Tab", "Moves through the links of completed steps. The current and later steps are not focusable."],
            ["Enter", "Goes back to a completed step."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations at the start, in the middle and at the end", "Vitest + vitest-axe, Playwright"],
            ["A named navigation with an ordered list; aria-current=\"step\"", "Vitest, Playwright"],
            ["Each step says its number and state in words (translated)", "Vitest, Playwright"],
            ["State shown without color: check mark, thick ring and bold, numbers", "Vitest"],
            ["Only completed steps are links; links 44px tall with a focus ring of at least 3:1", "Vitest, Playwright"],
            ["Markers at least 3:1 against the page", "Playwright"],
            ["No motion with prefers-reduced-motion; a column at 320px with no horizontal scroll", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
