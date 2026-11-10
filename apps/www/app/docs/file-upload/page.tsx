import type { Metadata } from "next";
import { FileUploadDemo } from "@/components/file-upload-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "File upload", description: "Accessible file picker with an optional drop zone." };

const usage = `import { FileUpload } from "@/components/ui/file-upload";

<FileUpload
  name="documents"
  label="Documents"
  description="PDF or PNG, up to 1 MB each."
  accept=".pdf,image/png"
  maxSize={1024 * 1024}
  multiple
/>`;

export default function FileUploadDocsPage() {
  return (
    <DocPage
      title="File upload"
      intro={<p>Choose files with the browser’s file button, or drop them on the box. Chosen files are listed, and each one can be removed.</p>}
    >
      <DocSection id="example" title="Example">
        <Example>
          <FileUploadDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand
          name="file-upload"
          adds={
            <>
              This adds <code>components/ui/file-upload.tsx</code> and the shared files in <code>lib/</code>.
            </>
          }
        />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>Say the allowed types and size in the description, before people choose a file.</li>
          <li>
            The file button is the browser’s own, so it works with every keyboard, screen reader and phone. Dropping files is only an extra: never make it the only
            way.
          </li>
          <li>Refused files are not added, and the reason is shown, linked to the input and announced.</li>
          <li>
            Inside a <code>&lt;form&gt;</code>, the input keeps the chosen files and sends them on submit. Check the files on the server too.
          </li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Tab", "Moves to the file button, then to each file’s Remove button."],
            ["Enter / Space", "On the file button: opens the browser’s file picker. On Remove: removes that file; focus moves to the next file, or back to the file button."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations: empty, with files and with an error", "Vitest + vitest-axe, Playwright"],
            ["Native file input named by its label and described by the help text", "Vitest, Playwright"],
            ["Files listed with a Remove button named after each file; added and removed files announced (translated)", "Vitest, Playwright"],
            ["Too big or wrong type: refused, reason shown with an icon, linked (aria-describedby, aria-invalid) and announced", "Vitest, Playwright"],
            ["Dropping files adds them; the input keeps the files for a form submit", "Vitest, Playwright"],
            ["After Remove, focus moves to the next file or back to the input", "Vitest, Playwright"],
            ["File button and Remove buttons 44px tall with focus rings of at least 3:1", "Playwright"],
            ["No motion; no horizontal scroll at 320px, even with long file names", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
