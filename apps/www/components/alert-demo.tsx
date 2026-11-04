import { Alert } from "@/registry/akso/ui/alert";

/** Demo used by the docs page and by the e2e tests. */
export function AlertDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Alert status="info" title="New version available">
        Reload the page to get the latest features.
      </Alert>
      <Alert status="success" title="Payment received">
        We sent the receipt to your email.
      </Alert>
      <Alert status="warning" title="Your session ends in 5 minutes">
        Save your work to avoid losing it.
      </Alert>
      <Alert status="error" title="We could not save your changes">
        Check your connection and try again.
      </Alert>
    </div>
  );
}
