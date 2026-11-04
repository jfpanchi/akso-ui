import type { Metadata } from "next";
import { ButtonDemo } from "@/components/button-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = {
  title: "Button",
  description: "Accessible button built on Base UI.",
};

const usage = `import { Button } from "@/components/ui/button";

<Button variant="primary" type="submit">Save</Button>

{/* Icon-only buttons need a name */}
<Button size="icon" aria-label="Settings">
  <SettingsIcon aria-hidden="true" />
</Button>

{/* Loading: keeps focus and announces "Saving" */}
<Button variant="primary" loading={isSaving} loadingText="Saving">
  Save changes
</Button>`;

export default function ButtonDocsPage() {
  return (
    <DocPage
      title="Button"
      intro={
        <p>
          Starts an action, like saving or opening a dialog. To go to another page, use a link (<code>&lt;a&gt;</code>) instead. If it must look
          like a button, style the link with <code>buttonClassName()</code>.
        </p>
      }
    >
      <DocSection id="example" title="Example">
        <Example>
          <ButtonDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand
          name="button"
          adds={
            <>
              This adds <code>components/ui/button.tsx</code> and <code>lib/akso-styles.ts</code>, installs <code>@base-ui/react</code> and
              adds the Akso UI color tokens (<code>--akso-*</code>) to your CSS. If your project already has a{" "}
              <code>components/ui/button.tsx</code> (for example, shadcn&apos;s), the command asks before replacing it. Check where it is
              used first: the Akso Button has different variant names.
            </>
          }
        />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>
            The default <code>type</code> is <code>&quot;button&quot;</code>. Use <code>type=&quot;submit&quot;</code> for form submit buttons.
          </li>
          <li>
            <strong>Icon-only buttons need a name</strong>: an <code>aria-label</code> or visually hidden text. In development, a button
            without a name logs an error.
          </li>
          <li>
            Variants: <code>primary</code>, <code>secondary</code>, <code>danger</code>, <code>ghost</code>. The danger variant must always say
            what it does (&quot;Delete file&quot;), because color alone does not explain the risk.
          </li>
          <li>
            Sizes: <code>default</code> (44px), <code>sm</code> (36px) and <code>icon</code> (44×44px). All are above the 24px minimum.
          </li>
          <li>
            While <code>loading</code>, the button stays focusable but cannot be pressed, and its name changes to <code>loadingText</code>{" "}
            (default: &quot;Loading&quot;). This follows the Base UI loading pattern. When the work finishes, announce the result with a
            status message.
          </li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Tab / Shift + Tab", "Moves focus to and from the button. Disabled buttons are skipped; loading buttons are not."],
            ["Enter / Space", "Presses the button. Does nothing while it is loading or disabled."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations in every variant, size and state", "Vitest + vitest-axe, Playwright + @axe-core/playwright"],
            ["Native button, type=button by default", "Vitest"],
            ["Enter and Space press it; disabled buttons are skipped by Tab", "Vitest"],
            ["Loading keeps focus, is announced and ignores presses", "Vitest, Playwright"],
            ["Icon-only buttons without a name log an error", "Vitest"],
            ["Visible focus ring with at least 3:1 contrast, appearing at once", "Playwright"],
            ["Spinner does not move with prefers-reduced-motion", "Playwright"],
            ["At least 24×24px in every size", "Playwright"],
            ["No horizontal scroll at 320px wide", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
