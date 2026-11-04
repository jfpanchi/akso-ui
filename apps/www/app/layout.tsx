import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { SkipLink } from "akso-ui";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Akso UI", template: "%s · Akso UI" },
  description: "Accessible React components built on Base UI, tested for people with disabilities.",
};

// Never block zoom: people with low vision need it (WCAG 1.4.4).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SkipLink />
        <header className="border-b border-akso-border">
          <nav aria-label="Main" className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
            <Link href="/" className="inline-flex min-h-11 items-center font-semibold text-akso-foreground no-underline">
              Akso UI
            </Link>
            <Link href="/docs/dialog" className="inline-flex min-h-11 items-center">
              Dialog
            </Link>
            <a href="https://github.com/jfpanchi/akso-ui" className="inline-flex min-h-11 items-center">
              GitHub
            </a>
          </nav>
        </header>
        <main id="main-content" className="mx-auto max-w-3xl px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
