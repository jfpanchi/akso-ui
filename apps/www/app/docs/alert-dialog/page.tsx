import type { Metadata } from "next";
import { AlertDialogDemo } from "@/components/alert-dialog-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Alert dialog", description: "Accessible confirmation dialog built on Base UI." };

const usage = `<AlertDialog>
  <AlertDialogTrigger variant="danger">Delete account</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete your account?</AlertDialogTitle>
      <AlertDialogDescription>You cannot undo this.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Keep my account</AlertDialogCancel>
      <AlertDialogAction onClick={deleteAccount}>Delete account</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`;

export default function AlertDialogDocsPage() {
  return (
    <DocPage title="Alert dialog" intro={<p>Asks people to confirm an action that cannot be undone, like deleting an account. It blocks the page until they choose, and clicking outside does not close it.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <AlertDialogDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="alert-dialog" adds={<>This adds <code>components/ui/alert-dialog.tsx</code> and <code>lib/akso-styles.ts</code>, and installs <code>@base-ui/react</code>.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li><strong>Put AlertDialogCancel first</strong> in the footer. Base UI focuses the first button, so the safe choice has focus when the dialog opens and pressing Enter by habit does not destroy anything.</li>
          <li>Button texts say what they do: “Delete account” and “Keep my account”, not “OK” and “Cancel”.</li>
          <li>Always add a title (a question) and a description (what will happen). Screen readers read both when it opens.</li>
          <li>Use it only for important decisions. For other content, use a <a href="/docs/dialog">Dialog</a>.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Enter / Space", "On the trigger: opens it. Focus moves to the first button (Cancel)."],
            ["Tab / Shift + Tab", "Moves between the buttons. Focus does not leave the dialog."],
            ["Escape", "Cancels. Focus returns to the trigger."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations, open and closed", "Vitest + vitest-axe, Playwright"],
            ["role=alertdialog named by the title and described by the description", "Vitest"],
            ["Focus starts on Cancel; trapped inside; returns to the trigger", "Vitest, Playwright"],
            ["Escape cancels; clicking outside does not close it", "Vitest, Playwright"],
            ["Visible focus ring with at least 3:1 contrast; buttons 44px", "Playwright"],
            ["No animation with prefers-reduced-motion; works at 320px wide", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
