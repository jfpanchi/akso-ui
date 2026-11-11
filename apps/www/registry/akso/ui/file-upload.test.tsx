import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectFocused, expectNoA11yViolations } from "akso-ui/test";
import { describe, expect, it } from "vitest";

import { AksoLocaleProvider } from "@/registry/akso/lib/akso-locale";
import { FileUpload } from "./file-upload";

const pdf = (name = "report.pdf", size = 1000) => new File(["x".repeat(size)], name, { type: "application/pdf" });
const announcer = () => document.querySelector('[data-slot="announcer"]');

function Demo() {
  return <FileUpload label="Documents" description="PDF, up to 2 KB." accept=".pdf" maxSize={2048} multiple />;
}

describe("FileUpload", () => {
  describe("axe", () => {
    it("has no violations: empty, with files and with an error", async () => {
      const user = userEvent.setup({ applyAccept: false });
      render(
        <main>
          <Demo />
        </main>,
      );
      await expectNoA11yViolations(document.body);
      await user.upload(screen.getByLabelText("Documents"), [pdf(), new File(["x"], "virus.exe", { type: "application/x-msdownload" })]);
      await expectNoA11yViolations(document.body);
    });
  });

  describe("name, role and state", () => {
    it("the native file input is named by the label and described by the help text", () => {
      render(<Demo />);
      const input = screen.getByLabelText("Documents");
      expect(input).toHaveAttribute("type", "file");
      expect(input).toHaveAccessibleDescription("PDF, up to 2 KB.");
    });

    it("lists chosen files with a Remove button named after each file; added files are announced", async () => {
      const user = userEvent.setup();
      render(<Demo />);
      await user.upload(screen.getByLabelText("Documents"), [pdf("a.pdf"), pdf("b.pdf")]);
      const list = screen.getByRole("list", { name: "Selected files" });
      expect(list).toHaveTextContent("a.pdf");
      expect(screen.getByRole("button", { name: "Remove b.pdf" })).toHaveTextContent("Remove");
      await waitFor(() => expect(announcer()).toHaveTextContent("2 files added"));
      expect((screen.getByLabelText("Documents") as HTMLInputElement).files).toHaveLength(2);
    });

    it("too big or wrong type: not added; the reason is shown, linked and announced", async () => {
      const user = userEvent.setup({ applyAccept: false });
      render(<Demo />);
      const input = screen.getByLabelText("Documents");
      await user.upload(input, [pdf("huge.pdf", 5000), new File(["x"], "notes.txt", { type: "text/plain" })]);
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input).toHaveAccessibleDescription(/huge\.pdf is too big\. Choose a file smaller than 2 kB\..*notes\.txt is not an allowed type of file\./);
      await waitFor(() => expect(announcer()).toHaveTextContent("huge.pdf is too big"));
    });

    it("dropping files adds them like choosing them", async () => {
      render(<Demo />);
      const zone = document.querySelector('[data-slot="file-upload-dropzone"]')!;
      fireEvent.drop(zone, { dataTransfer: { files: [pdf("dropped.pdf")] } });
      expect(await screen.findByText("dropped.pdf")).toBeInTheDocument();
    });

    it("uses the AksoLocaleProvider texts", async () => {
      const user = userEvent.setup();
      render(
        <AksoLocaleProvider locale="es">
          <FileUpload label="Documentos" multiple />
        </AksoLocaleProvider>,
      );
      expect(screen.getByText("o suelta los archivos aquí")).toBeInTheDocument();
      await user.upload(screen.getByLabelText("Documentos"), pdf("informe.pdf"));
      expect(screen.getByRole("button", { name: "Quitar informe.pdf" })).toHaveTextContent("Quitar");
    });
  });

  describe("keyboard", () => {
    it("removing a file moves focus to the next file, then back to the input; removals are announced", async () => {
      const user = userEvent.setup();
      render(<Demo />);
      const input = screen.getByLabelText("Documents");
      await user.upload(input, [pdf("a.pdf"), pdf("b.pdf")]);
      screen.getByRole("button", { name: "Remove a.pdf" }).focus();
      await user.keyboard("{Enter}");
      await waitFor(() => expectFocused(screen.getByRole("button", { name: "Remove b.pdf" })));
      await waitFor(() => expect(announcer()).toHaveTextContent("a.pdf removed"));
      await user.keyboard("{Enter}");
      await waitFor(() => expectFocused(input));
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });
  });

  describe("styles that e2e tests check further", () => {
    it("44px file button and Remove buttons with focus rings; nothing animated", async () => {
      const user = userEvent.setup();
      render(<Demo />);
      const input = screen.getByLabelText("Documents");
      expect(input.className).toContain("file:min-h-11");
      expect(input.className).toContain("focus-visible:outline-2");
      await user.upload(input, pdf());
      expect(screen.getByRole("button", { name: "Remove report.pdf" }).className).toContain("min-h-11");
      for (const el of document.querySelectorAll<HTMLElement>('[data-slot^="file-upload"]')) {
        for (const token of el.className.split(/\s+/)) {
          if (/^(transition|duration|ease|animate)/.test(token)) throw new Error(`"${token}" must be prefixed with motion-safe:`);
        }
      }
    });
  });
});
