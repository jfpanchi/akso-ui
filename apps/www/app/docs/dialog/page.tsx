import type { Metadata } from "next";
import { DialogDemo } from "@/components/dialog-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = {
  title: "Dialog",
  description: "Accessible modal dialog built on Base UI.",
};

const usage = `import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger>Delete file</DialogTrigger>
  <DialogContent closeLabel="Close">
    <DialogHeader>
      <DialogTitle>Delete this file?</DialogTitle>
      <DialogDescription>You cannot undo this.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose>Cancel</DialogClose>
      <DialogClose variant="danger" onClick={deleteFile}>Delete</DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>`;

export default function DialogDocsPage() {
  return (
    <DocPage
      title="Dialog"
      intro={
        <p>
          A window that opens on top of the page and blocks the rest of it until it is closed. Use it for short tasks that need full
          attention. For non-blocking messages, use a status message instead.
        </p>
      }
    >
      <DocSection id="example" title="Example">
        <Example>
          <DialogDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand
          name="dialog"
          adds={
            <>
              This adds <code>components/ui/dialog.tsx</code> and <code>lib/akso-styles.ts</code> (shared styles), installs{" "}
              <code>@base-ui/react</code> and adds the Akso UI color tokens (<code>--akso-*</code>) to your CSS. The tokens use their own
              prefix, so they do not change your existing theme. It does not replace your <code>components/ui/button.tsx</code>.
            </>
          }
        />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>
            <strong>
              Always add a <code>DialogTitle</code>.
            </strong>{" "}
            It is the name a screen reader announces. To hide it visually, use <code>className=&quot;sr-only&quot;</code>. In development, a
            missing title logs an error.
          </li>
          <li>
            Translate the <code>×</code> button name with <code>closeLabel</code> (default: &quot;Close&quot;).
          </li>
          <li>
            <code>DialogTrigger</code> and <code>DialogClose</code> accept the same <code>variant</code> and <code>size</code> as{" "}
            <a href="/docs/button">Button</a>.
          </li>
          <li>
            To focus a specific element when the dialog opens (for example, &quot;Cancel&quot; in a destructive dialog), pass a ref to{" "}
            <code>initialFocus</code> on <code>DialogContent</code>.
          </li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Enter / Space", "On the trigger: opens the dialog. Focus moves to the first button or field inside."],
            ["Tab / Shift + Tab", "Moves between elements inside the dialog. Focus does not leave it."],
            ["Escape", "Closes the dialog. Focus returns to the trigger."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations, open and closed", "Vitest + vitest-axe, Playwright + @axe-core/playwright"],
            ["Escape closes the dialog", "Vitest, Playwright"],
            ["Focus stays inside while open (Tab and Shift+Tab)", "Vitest, Playwright"],
            ["Focus returns to the trigger on close", "Vitest, Playwright"],
            ["Accessible name from the title; optional description", "Vitest"],
            ["Visible focus ring with at least 3:1 contrast", "Playwright (computed colors) + token tests"],
            ["No animation with prefers-reduced-motion", "Playwright"],
            ["No horizontal scroll at 320px wide", "Playwright"],
            ["Buttons at least 24×24px", "Playwright (actual size: 44×44px)"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
