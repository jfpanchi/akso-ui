import type { Metadata } from "next";
import { CodeBlock, DocPage, DocSection } from "@/components/docs/doc-page";
import { REGISTRY_BASE_URL } from "@/lib/registry";

export const metadata: Metadata = { title: "Language", description: "Default texts of Akso UI in English and Spanish." };

const usage = `import { AksoLocaleProvider } from "@/lib/akso-locale";

// In your root layout. Also set the page language: <html lang="es">.
<AksoLocaleProvider locale="es">
  {children}
</AksoLocaleProvider>

// Change some texts, or add a language
<AksoLocaleProvider locale="es" messages={{ loading: "Un momento" }}>
  {children}
</AksoLocaleProvider>`;

const rows: [string, string, string][] = [
  ["Close (×) buttons", "Close", "Cerrar"],
  ["Toast close button", "Dismiss", "Cerrar aviso"],
  ["Loading button", "Loading", "Cargando"],
  ["Required field", "(required)", "(obligatorio)"],
  ["Form with errors", "2 fields need attention.", "Revisa 2 campos."],
  ["Status words", "Information, Success, Warning, Error", "Información, Hecho, Atención, Error"],
  ["Combobox", "No results. / 3 results / Show options / Clear", "Sin resultados. / 3 resultados / Mostrar opciones / Borrar"],
  ["Slider buttons", "Decrease / Increase", "Disminuir / Aumentar"],
];

const cell = "border border-akso-border px-2 py-2 text-left align-top break-words [overflow-wrap:anywhere]";

export default function LanguagePage() {
  return (
    <DocPage
      title="Language"
      intro={
        <p>
          Components have a few texts of their own, like the name of a close button or the message after a form with errors. They are in
          English by default. Wrap your app in <code>AksoLocaleProvider</code> to get them in Spanish or to change them.
        </p>
      }
    >
      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>
            A prop on a component (for example <code>closeLabel</code> or <code>loadingText</code>) always wins over the provider.
          </li>
          <li>
            <strong>Set the page language too</strong> (<code>&lt;html lang=&quot;es&quot;&gt;</code>). Screen readers use it to choose the voice
            and pronunciation (WCAG 3.1.1).
          </li>
          <li>
            The provider is installed with any component that has its own texts (<code>lib/akso-locale.tsx</code>), from{" "}
            <code className="break-all">{REGISTRY_BASE_URL}</code>.
          </li>
        </ul>
      </DocSection>
      <DocSection id="texts" title="Texts">
        <table className="w-full table-fixed border-collapse">
          <caption className="sr-only">Default texts in English and Spanish</caption>
          <thead>
            <tr>
              <th scope="col" className={cell}>
                Where
              </th>
              <th scope="col" className={cell}>
                English
              </th>
              <th scope="col" className={cell} lang="es">
                Español
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([where, en, es]) => (
              <tr key={where}>
                <td className={cell}>{where}</td>
                <td className={cell}>{en}</td>
                <td className={cell} lang="es">
                  {es}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DocSection>
    </DocPage>
  );
}
