# CLAUDE.md

Guidance for Claude (and other AI assistants) working in this repository.

## Project

Akso UI: accessible React components on top of Base UI (`@base-ui/react`), distributed as a shadcn registry.

- `packages/core` → npm package `akso-ui` (not published): tokens, `VisuallyHidden`, `LiveRegion`, `SkipLink`, test helpers (`akso-ui/test`), contrast utilities (`akso-ui/tokens`).
- `apps/www` → Next.js app: registry (`registry.json` → `shadcn build` → `public/r/*.json`), docs pages, Playwright e2e tests.
- Component source: `apps/www/registry/akso/<name>/<name>.tsx`, unit tests next to it.

Commands: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`, `pnpm registry:build`, `pnpm verify:registry`.

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

- Use `motion-safe:` for every `transition-*`, `duration-*`, `ease-*` and `animate-*` class. A unit test enforces this for Dialog.
- Do not transition `outline-color` (avoid `transition-colors`/`transition-all` on focusable elements). The focus ring must appear immediately.
- Colors come from `--akso-*` tokens (`bg-akso-surface`, `text-akso-foreground`…). New token pairs go into `contrastPairs` in `packages/core/src/tokens/colors.ts`. Then run `pnpm --filter akso-ui generate:css` and `pnpm --filter www registry:sync`.
- After you edit a registry component, run `pnpm registry:build` and commit `apps/www/public/r`.
- Never say a component is "100% accessible". Update `ACCESSIBILITY.md` with what was actually tested.
