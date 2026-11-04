import type { Metadata } from "next";
import { ToastDemo } from "@/components/toast-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Toast", description: "Accessible toast notifications built on Base UI." };

const usage = `// Once, around your app
<ToastProvider>{children}</ToastProvider>

// Anywhere inside
const toast = useToast();
toast.add({ type: "success", title: "Changes saved" });
toast.add({
  title: "Message archived",
  actionProps: { children: "Undo", onClick: undo },
});
toast.add({ type: "error", title: "Upload failed", description: "Check your connection." });`;

export default function ToastDocsPage() {
  return (
    <DocPage title="Toast" intro={<p>Short messages that appear in a corner after something happens, like “Changes saved”. They are announced by screen readers without moving focus.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <ToastDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="toast" adds={<>This adds <code>components/ui/toast.tsx</code>, <code>lib/akso-styles.ts</code> and <code>lib/akso-status.tsx</code>, and installs <code>@base-ui/react</code>.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li><strong>Do not put information people need only in a toast.</strong> It can be missed. Show important results on the page too.</li>
          <li>Errors and toasts with an action stay until they are dismissed. Other toasts stay 6 seconds. Base UI pauses the timer while a toast has the pointer or focus, and when the window is not active.</li>
          <li>Press <kbd>F6</kbd> to jump to the notifications and use the action or close buttons with the keyboard. Focus returns where it was afterwards.</li>
          <li>Each type has an icon shape and a hidden status word (“Error:”), so the meaning does not depend on color. Errors are announced urgently; others politely.</li>
          <li>Toasts are listed one under another, all fully visible, instead of piled on top of each other.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["F6", "Moves focus to the notifications region (Base UI)."],
            ["Tab / Shift + Tab", "Moves between the action and close buttons of the toasts."],
            ["Enter / Space", "Uses the focused button."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations with toasts shown", "Vitest + vitest-axe, Playwright"],
            ["Labeled notifications region; errors announced with role=alert", "Vitest"],
            ["Status word and icon for each type", "Vitest, Playwright"],
            ["Info closes after 6 s; errors and actions stay", "Vitest"],
            ["F6 reaches the toasts; buttons work with the keyboard", "Vitest, Playwright"],
            ["Visible focus ring with at least 3:1 contrast", "Playwright"],
            ["No motion with prefers-reduced-motion; fits at 320px wide", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
