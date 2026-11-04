import type { Metadata } from "next";
import { SliderDemo } from "@/components/slider-demo";
import { AutomatedTestsTable, CodeBlock, DocPage, DocSection, Example, InstallCommand, KeyboardTable, ManualTestsTable } from "@/components/docs/doc-page";

export const metadata: Metadata = { title: "Slider", description: "Accessible slider built on Base UI." };

const usage = `<Slider label="Volume" defaultValue={40} step={5} />
<Slider label="Room temperature" min={16} max={28} defaultValue={21} getValueText={(v) => \`\${v} degrees\`} />`;

export default function SliderDocsPage() {
  return (
    <DocPage title="Slider" intro={<p>Lets people choose a number within a range, like the volume. Dragging is never required: the track, the keyboard and the − and + buttons work too.</p>}>
      <DocSection id="example" title="Example">
        <Example>
          <SliderDemo />
        </Example>
      </DocSection>

      <DocSection id="install" title="Install">
        <InstallCommand name="slider" adds={<>This adds <code>components/ui/slider.tsx</code> and <code>lib/akso-styles.ts</code>, and installs <code>@base-ui/react</code>.</>} />
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock>{usage}</CodeBlock>
        <ul className="list-disc pl-6">
          <li><code>label</code> is required. The current value is always shown as text.</li>
          <li>The − and + buttons let people change the value with single taps, for those who cannot drag (WCAG 2.5.7). They are not Tab stops: keyboard users use the arrow keys on the slider. Voice control users can say “click Increase”.</li>
          <li>Use <code>getValueText</code> to give the value its unit for screen readers (“21 degrees”).</li>
          <li>If the exact number matters, consider a number field instead: sliders are imprecise on small screens.</li>
        </ul>
      </DocSection>

      <DocSection id="keyboard" title="Keyboard">
        <KeyboardTable
          rows={[
            ["Arrow Right / Arrow Up", "Increases by one step."],
            ["Arrow Left / Arrow Down", "Decreases by one step."],
            ["Page Up / Page Down", "Changes by a larger step."],
            ["Home / End", "Goes to the minimum or maximum."],
          ]}
        />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <h3 className="text-xl font-semibold">Automated tests</h3>
        <AutomatedTestsTable
          rows={[
            ["No axe violations", "Vitest + vitest-axe, Playwright"],
            ["Native range input named by the label, with value and value text", "Vitest, Playwright"],
            ["Arrows, Home and End change the value; one Tab stop", "Vitest, Playwright"],
            ["− and + buttons change the value with one tap", "Vitest, Playwright"],
            ["Thumb 24px; visible focus ring with at least 3:1 contrast", "Playwright"],
            ["No horizontal scroll at 320px wide", "Playwright"],
          ]}
        />
        <h3 className="text-xl font-semibold">Manual tests with assistive technology</h3>
        <ManualTestsTable />
      </DocSection>
    </DocPage>
  );
}
