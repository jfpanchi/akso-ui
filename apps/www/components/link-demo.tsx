import { Link } from "@/registry/akso/ui/link";

/** Demo used by the docs page and by the e2e tests. */
export function LinkDemo() {
  return (
    <div className="flex max-w-prose flex-col gap-3">
      <p>
        Read the <Link href="#accessibility">accessibility notes</Link> before you start.
      </p>
      <p>
        Akso UI is built on{" "}
        <Link href="https://base-ui.com" newTab>
          Base UI
        </Link>
        .
      </p>
    </div>
  );
}
