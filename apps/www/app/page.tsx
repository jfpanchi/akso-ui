import Link from "next/link";
import { components } from "@/lib/components";
import { REGISTRY_BASE_URL } from "@/lib/registry";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Akso UI</h1>
      <p className="text-lg">
        Accessible React components built on <a href="https://base-ui.com">Base UI</a>. Each component is tested with axe and
        with the keyboard, and documents what has been checked with screen readers and what has not.
      </p>
      <h2 className="text-2xl font-semibold">Components</h2>
      <ul className="list-disc pl-6">
        {components.map((c) => (
          <li key={c.slug}>
            <Link href={`/docs/${c.slug}`}>{c.name}</Link>
          </li>
        ))}
      </ul>
      <h2 className="text-2xl font-semibold">Install a component</h2>
      <p>Akso UI is distributed as a shadcn registry. In a project that already uses shadcn:</p>
      <pre className="rounded-md border border-akso-border p-4 text-sm whitespace-pre-wrap break-all">
        <code>{`npx shadcn@latest add ${REGISTRY_BASE_URL}/dialog.json`}</code>
      </pre>
    </div>
  );
}
