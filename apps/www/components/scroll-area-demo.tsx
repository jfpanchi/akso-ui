import { ScrollArea } from "@/registry/akso/ui/scroll-area";

const releases = Array.from({ length: 12 }, (_, i) => ({ version: `1.${12 - i}.0`, note: i % 3 === 0 ? "New components and fixes." : "Fixes and smaller changes." }));
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Demo used by the docs page and by the e2e tests. */
export function ScrollAreaDemo() {
  return (
    <div className="flex max-w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 id="release-notes" className="text-lg font-semibold">
          Release notes
        </h2>
        <ScrollArea aria-labelledby="release-notes" className="h-48 w-full max-w-sm">
          <ul className="flex flex-col gap-3">
            {releases.map((r) => (
              <li key={r.version}>
                <p className="font-semibold">Version {r.version}</p>
                <p className="text-sm text-akso-muted-foreground">{r.note}</p>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
      <ScrollArea aria-label="Monthly visits" orientation="horizontal" className="w-full max-w-sm">
        <table className="text-sm">
          <caption className="sr-only">Monthly visits</caption>
          <thead>
            <tr>
              {months.map((m) => (
                <th key={m} scope="col" className="px-3 py-1 text-left">
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {months.map((m, i) => (
                <td key={m} className="px-3 py-1 tabular-nums">
                  {(1200 + i * 137).toLocaleString("en-US")}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </ScrollArea>
      <ScrollArea aria-label="Short note" className="w-full max-w-sm">
        <p>Short text: nothing to scroll, so Tab skips this box.</p>
      </ScrollArea>
    </div>
  );
}
