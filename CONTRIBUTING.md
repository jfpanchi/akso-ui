# Contributing to Akso UI

Thank you for helping. Akso UI exists so that people with disabilities can use the products built with it. That goal comes before visual polish, new features and speed.

By taking part you agree to follow the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Ways to help

- **Report a barrier.** If something does not work with your assistive technology, [open a barrier report](https://github.com/jfpanchi/akso-ui/issues/new?template=accessibility-barrier.yml). You do not need to write code.
- **Do a manual test.** Pick a row marked "Pending" in [ACCESSIBILITY.md](./ACCESSIBILITY.md), follow the checklist below and open a PR or an issue with your results.
- **Write code.** Fix a bug or add a component (please open an issue first to discuss new components).

## Setup

```bash
pnpm install
```

```bash
pnpm test
```

```bash
pnpm --filter www exec playwright install chromium
```

```bash
pnpm test:e2e
```

## Rules for component code

These rules are also in [CLAUDE.md](./CLAUDE.md):

1. Never override `role`, `aria-*` attributes or keyboard handlers provided by Base UI. If you must, explain why in the PR.
2. Every interactive element has a visible `:focus-visible` style with at least 3:1 contrast.
3. Every animation respects `prefers-reduced-motion` (use Tailwind's `motion-safe:`).
4. Color is never the only way to convey information. Add an icon or text.
5. Touch targets are at least 24×24px (we aim for 44×44px).
6. Every form field has a visible label. Errors are linked with `aria-describedby` and announced.
7. Default texts are short and in plain language.
8. Use colors from the Akso tokens. If you add a token pair, add it to `contrastPairs` so it is tested.
9. Use `@base-ui/react`. Never the old name `@base-ui-components/react`.

## Starting a new component

Open an issue first. Then generate the files:

```bash
pnpm new:component <kebab-name> --base <base-ui-part>
```

Read the Base UI docs for the part (`apps/www/node_modules/@base-ui/react/docs/react/components/<part>.md`) before you write code. The generated tests marked `it.todo` and `test.fixme` are the minimum: replace every one with a real test.

Use the shared e2e checks in `apps/www/e2e/helpers/a11y.ts` (`expectNoAxeViolations`, `expectVisibleFocusRing`, `expectMinTargetSize`, `expectNoMotion`, `expectNoHorizontalScroll`…), so every component meets the same bar.

## Every component PR must include

A component PR is not ready to merge until all of this is done:

- [ ] **No `it.todo` or `test.fixme` left** for the component.
- [ ] **axe tests**: no violations, in every state (closed, open, with error, disabled…), in Vitest **and** Playwright (light and dark mode).
- [ ] **Keyboard tests**: every key in the component's keyboard table, focus order, focus trap or focus return where it applies.
- [ ] **Rendered checks in Playwright**: focus ring contrast, 320px reflow, target size, `prefers-reduced-motion`.
- [ ] **Documentation page** in `apps/www/app/docs/<component>` with a keyboard table and the test status.
- [ ] **ACCESSIBILITY.md** updated with a new section for the component, manual tests marked "Pending".
- [ ] **Registry** rebuilt (`pnpm registry:build`) and `pnpm verify:registry` passing.
- [ ] **Manual screen reader checklist** (below) done with at least one screen reader, or the PR clearly says it was not done.

### Manual screen reader checklist

Write down the screen reader, browser, operating system and their versions. For each item, write ✅, ❌ (with what happened) or "not tested".

- [ ] The trigger is announced with its role and name (for example, "Edit profile, button").
- [ ] When it opens, the screen reader announces the role ("dialog"), the name (title) and the description, if there is one.
- [ ] Focus lands on a sensible element and the screen reader says which one.
- [ ] With Tab / Shift+Tab, focus does not leave the component.
- [ ] In browse/virtual mode (NVDA/JAWS arrows, VoiceOver VO+arrows), content outside the dialog cannot be reached.
- [ ] Escape closes it, and the screen reader announces the element that receives focus again.
- [ ] Status messages (for example, "Profile saved.") are announced once, without moving focus.
- [ ] With voice control ("click Save", "show numbers"), every button can be activated by its visible name.

## Commits and versions

- If you change `packages/core`, run `pnpm changeset` and describe the change for users.
- Nothing is published to npm without the maintainer's decision.

### Publishing `akso-ui` (maintainer only)

The components are not on npm: they are installed from the shadcn registry in this repository. Only `packages/core` is published, as `akso-ui`.

1. Run `pnpm changeset version`. It turns the pending changesets into a new version and a `CHANGELOG.md` entry. Open a PR with the result and merge it when CI is green.
2. On `main`, run `pnpm install` and `pnpm test`.
3. Log in to npm with an account that has two-factor authentication:

   ```bash
   npm login
   ```

4. Publish. `prepublishOnly` builds the package first:

   ```bash
   pnpm --filter akso-ui publish
   ```

5. Create a git tag for the version (for example `akso-ui@0.1.0`) and push it.

The package is published with public access (`publishConfig` in `packages/core/package.json`).

## Code review

Reviewers check the rules above. A PR that weakens an accessibility test, for example by disabling an axe rule or skipping a test, needs a written reason, and the maintainer must accept it.
