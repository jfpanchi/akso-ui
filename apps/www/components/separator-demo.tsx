import { Separator } from "@/registry/akso/ui/separator";

/** Demo used by the docs page and by the e2e tests. */
export function SeparatorDemo() {
  return (
    <div className="flex max-w-md flex-col gap-4 rounded-md border border-akso-border bg-akso-surface p-4">
      <section aria-labelledby="account-heading" className="flex flex-col gap-1">
        <h2 id="account-heading" className="text-lg font-semibold">
          Account
        </h2>
        <p>Name, email and password.</p>
      </section>
      <Separator />
      <section aria-labelledby="billing-heading" className="flex flex-col gap-1">
        <h2 id="billing-heading" className="text-lg font-semibold">
          Billing
        </h2>
        <p>Plan, payment method and invoices.</p>
      </section>
      <Separator decorative />
      <nav aria-label="Footer" className="flex h-6 items-center gap-3 text-sm">
        <a href="#help" className="underline">
          Help
        </a>
        <Separator orientation="vertical" decorative />
        <a href="#privacy" className="underline">
          Privacy
        </a>
      </nav>
    </div>
  );
}
