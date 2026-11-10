import type { Metadata } from "next";
import { CarouselDemo } from "@/components/carousel-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Carousel", description: "Accessible carousel following the WAI-ARIA pattern, with autoplay off by default." };

const usage = `import { Carousel, CarouselSlide } from "@/components/ui/carousel";

<Carousel label="Accessibility tips">
  <CarouselSlide>
    <h2>Use headings</h2>
    <p>Headings let people jump through a page.</p>
  </CarouselSlide>
  <CarouselSlide>…</CarouselSlide>
</Carousel>`;

export default function CarouselDocsPage() {
  return (
    <DocPage
      title="Carousel"
      intro={
        <p>
          Slides shown one at a time, with buttons to move between them. Many people miss content in carousels, so put the most important content outside one.
        </p>
      }
    >
      <DocSection id="example" title="Example">
        <Example>
          <CarouselDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand
          name="carousel"
          adds={
            <>
              This adds <code>components/ui/carousel.tsx</code> and the shared files in <code>lib/</code>.
            </>
          }
        />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li>
            Always give it a <code>label</code> that says what the slides are.
          </li>
          <li>
            Leave <code>autoplay</code> off if you can. When it is on, there is a Pause button, rotation stops while the pointer is over the carousel and when focus
            moves inside it, and it never starts for people who ask for reduced motion.
          </li>
          <li>Give each slide a heading or a short text, so it makes sense on its own.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Tab", "Moves through Pause / Play, Previous, Next, the links in the current slide, and the slide buttons."],
            ["Enter / Space", "Activates the focused button. The new slide is read by screen readers."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations, with and without autoplay", "Vitest + vitest-axe, Playwright"],
            ["A named carousel; slides are named groups (“2 of 3”); only the current slide is shown and reachable", "Vitest, Playwright"],
            ["Previous, Next and slide buttons; aria-current on the current slide button; texts translated", "Vitest, Playwright"],
            ["Polite live region while not rotating; silent while rotating", "Vitest, Playwright"],
            ["Autoplay: Pause button; stops on hover and on focus; never starts with reduced motion", "Vitest, Playwright"],
            ["Buttons 44×44px with focus rings of at least 3:1; slide dots at least 3:1", "Playwright"],
            ["No motion; no horizontal scroll at 320px", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
