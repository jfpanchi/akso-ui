# CLAUDE.md

Guidance for Claude (and other AI assistants) working in this repository.

## Project

Akso UI: accessible React components on top of Base UI (`@base-ui/react`), distributed as a shadcn registry.

- `packages/core` → npm package `akso-ui` (not published): tokens, `VisuallyHidden`, `LiveRegion`, `SkipLink`, test helpers (`akso-ui/test`), contrast utilities (`akso-ui/tokens`).
- `apps/www` → Next.js app: registry (`registry.json` → `shadcn build` → `public/r/*.json`), docs pages, Playwright e2e tests.
- Component source: `apps/www/registry/akso/ui/<name>.tsx`, unit tests next to it (`<name>.test.tsx`). Shared code: `apps/www/registry/akso/lib/<name>.ts`. These paths are required: shadcn rewrites `@/registry/akso/ui/x` to `@/components/ui/x` and `@/registry/akso/lib/x` to `@/lib/x` on install.
- E2E specs: `apps/www/e2e/<name>.spec.ts`, using the shared checks in `apps/www/e2e/helpers/a11y.ts`.
- Docs pages: `apps/www/app/docs/<name>/page.tsx`, built from `apps/www/components/docs/doc-page.tsx`. Test pages: `apps/www/app/test/<name>/page.tsx`.

Commands: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`, `pnpm registry:build`, `pnpm verify:registry`, `pnpm new:component <name> [--base <base-ui-part>]`.

Start every new component with `pnpm new:component`. It creates all the files with the required tests as `it.todo` / `test.fixme`; the component is not done until none are left.

Base UI documentation ships inside the package: `node_modules/@base-ui/react/docs/react/components/<name>.md`. Read it before you use a part or a prop. Do not guess APIs.

## Rules

- Never override `role`, `aria-*` or keyboard handlers provided by Base UI. If you need to change them, explain why in the PR.
- Every interactive element has a visible `:focus-visible` style with at least 3:1 contrast.
- Every animation respects `prefers-reduced-motion`.
- Color is never the only way to convey information (add an icon or text).
- Minimum touch target size: 24×24px.
- Every form field has a visible label; errors are linked with `aria-describedby` and announced.
- Default texts use short, plain language.
- No component is done until its axe and keyboard tests pass.
- Use `@base-ui/react`, never the old name `@base-ui-components/react`.
- Do not publish anything to npm unless the maintainer asks for it.

## Practical notes

- Use `motion-safe:` for every `transition-*`, `duration-*`, `ease-*` and `animate-*` class. Unit tests enforce this.
- Reuse `buttonClassName()` and `focusRingClassName` from `registry/akso/lib/akso-styles.ts` instead of copying button or focus styles.
- A component must never import another component's file (`@/registry/akso/ui/*`). Many projects already have shadcn's `components/ui/button.tsx`, and shadcn does not overwrite it by default, so the import would break. Put shared code in `registry/akso/lib/` (installed in `lib/`). A registry test enforces this.
- Do not transition `outline-color` (avoid `transition-colors`/`transition-all` on focusable elements). The focus ring must appear immediately.
- Colors come from `--akso-*` tokens (`bg-akso-surface`, `text-akso-foreground`…). New token pairs go into `contrastPairs` in `packages/core/src/tokens/colors.ts`. Then run `pnpm --filter akso-ui generate:css` and `pnpm --filter www registry:sync`.
- After you edit a registry component, run `pnpm registry:build` and commit `apps/www/public/r`.
- In `registry.json`, reference other Akso items by their full URL (`REGISTRY_BASE_URL` in `apps/www/lib/registry.ts` + `/<name>.json`). A bare name like `"button"` installs **shadcn's** button, not ours. Only `"utils"` is used by bare name on purpose.
- In e2e tests, wait only for finite animations (`waitForAnimations` does this): spinners are infinite.
- Never say a component is "100% accessible". Update `ACCESSIBILITY.md` with what was actually tested.
