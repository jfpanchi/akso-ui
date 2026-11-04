import type { Metadata } from "next";
import { DialogDemo } from "@/components/dialog-demo";

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

const code = "rounded-md border border-akso-border p-4 text-sm whitespace-pre-wrap break-words";
const cell = "border border-akso-border px-3 py-2 text-left align-top";

const automated: [string, string][] = [
  ["No axe violations, open and closed", "Vitest + vitest-axe, Playwright + @axe-core/playwright"],
  ["Escape closes the dialog", "Vitest, Playwright"],
  ["Focus stays inside while open (Tab and Shift+Tab)", "Vitest, Playwright"],
  ["Focus returns to the trigger on close", "Vitest, Playwright"],
  ["Accessible name from the title; optional description", "Vitest"],
  ["Visible focus ring with at least 3:1 contrast", "Playwright (computed colors) + token tests"],
  ["No animation with prefers-reduced-motion", "Playwright"],
  ["No horizontal scroll at 320px wide", "Playwright"],
  ["Buttons at least 24×24px", "Playwright (actual size: 44×44px)"],
];

const manual = [
  "NVDA + Chrome",
  "NVDA + Firefox",
  "JAWS + Chrome",
  "VoiceOver + Safari (macOS)",
  "VoiceOver + Safari (iOS)",
  "TalkBack + Chrome (Android)",
  "Voice Control (macOS / iOS)",
];

export default function DialogDocsPage() {
  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Dialog</h1>
        <p className="text-lg">
          A window that opens on top of the page and blocks the rest of it until it is closed. Use it for short tasks that need
          full attention. For non-blocking messages, use a status message instead.
        </p>
      </header>

      <section aria-labelledby="demo" className="flex flex-col gap-3">
        <h2 id="demo" className="text-2xl font-semibold">
          Example
        </h2>
        <div className="rounded-lg border border-akso-border p-6">
          <DialogDemo />
        </div>
      </section>

      <section aria-labelledby="install" className="flex flex-col gap-3">
        <h2 id="install" className="text-2xl font-semibold">
          Install
        </h2>
        <p>From the GitHub repository:</p>
        <pre className={code}>
          <code>npx shadcn@latest add https://raw.githubusercontent.com/jfpanchi/akso-ui/main/apps/www/public/r/dialog.json</code>
        </pre>
        <p>
          This adds <code>components/ui/dialog.tsx</code>, installs <code>@base-ui/react</code> and adds the Akso UI color tokens
          (<code>--akso-*</code>) to your CSS. The tokens use their own prefix, so they do not change your existing theme.
        </p>
      </section>

      <section aria-labelledby="usage" className="flex flex-col gap-3">
        <h2 id="usage" className="text-2xl font-semibold">
          Usage
        </h2>
        <pre className={code}>
          <code>{usage}</code>
        </pre>
        <ul className="list-disc pl-6">
          <li>
            <strong>Always add a <code>DialogTitle</code>.</strong> It is the name a screen reader announces. To hide it visually,
            use <code>className=&quot;sr-only&quot;</code>. In development, a missing title logs an error.
          </li>
          <li>
            Translate the <code>×</code> button name with <code>closeLabel</code> (default: &quot;Close&quot;).
          </li>
          <li>
            To focus a specific element when the dialog opens (for example, &quot;Cancel&quot; in a destructive dialog), pass a ref
            to <code>initialFocus</code> on <code>DialogContent</code>.
          </li>
        </ul>
      </section>

      <section aria-labelledby="keyboard" className="flex flex-col gap-3">
        <h2 id="keyboard" className="text-2xl font-semibold">
          Keyboard
        </h2>
        <table className="w-full border-collapse">
          <caption className="sr-only">Keyboard shortcuts</caption>
          <thead>
            <tr>
              <th scope="col" className={cell}>
                Key
              </th>
              <th scope="col" className={cell}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={cell}>Enter / Space</td>
              <td className={cell}>On the trigger: opens the dialog. Focus moves to the first button or field inside.</td>
            </tr>
            <tr>
              <td className={cell}>Tab / Shift + Tab</td>
              <td className={cell}>Moves between elements inside the dialog. Focus does not leave it.</td>
            </tr>
            <tr>
              <td className={cell}>Escape</td>
              <td className={cell}>Closes the dialog. Focus returns to the trigger.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section aria-labelledby="a11y" className="flex flex-col gap-3">
        <h2 id="a11y" className="text-2xl font-semibold">
          Accessibility
        </h2>
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <table className="w-full border-collapse">
          <caption className="sr-only">Automated tests and tools</caption>
          <thead>
            <tr>
              <th scope="col" className={cell}>
                What is checked
              </th>
              <th scope="col" className={cell}>
                Tool
              </th>
            </tr>
          </thead>
          <tbody>
            {automated.map(([what, tool]) => (
              <tr key={what}>
                <td className={cell}>{what}</td>
                <td className={cell}>{tool}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <p>
          Automated tools find only part of the problems. These manual tests have <strong>not been done yet</strong>. If you use
          one of these tools, please{" "}
          <a href="https://github.com/jfpanchi/akso-ui/issues/new?template=accessibility-barrier.yml">tell us what happens</a>.
        </p>
        <table className="w-full border-collapse">
          <caption className="sr-only">Manual test status</caption>
          <thead>
            <tr>
              <th scope="col" className={cell}>
                Assistive technology
              </th>
              <th scope="col" className={cell}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {manual.map((at) => (
              <tr key={at}>
                <td className={cell}>{at}</td>
                <td className={cell}>
                  <span aria-hidden="true">⏳ </span>Pending
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </article>
  );
}
