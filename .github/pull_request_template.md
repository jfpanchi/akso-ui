## What does this change?

<!-- Short description. Link the issue if there is one. -->

## Accessibility checklist

- [ ] No Base UI `role`, `aria-*` or keyboard handler is overridden (or the reason is explained below)
- [ ] axe tests pass in Vitest and Playwright (light and dark), in every state
- [ ] Keyboard tests cover every key in the docs keyboard table
- [ ] `:focus-visible` ring is visible with at least 3:1 contrast
- [ ] Animations use `motion-safe:`; tested with `prefers-reduced-motion`
- [ ] Works at 320px wide without horizontal scroll
- [ ] Targets are at least 24×24px
- [ ] Color is not the only way information is shown
- [ ] `ACCESSIBILITY.md` and the docs page are updated
- [ ] Registry rebuilt (`pnpm registry:build`) and `pnpm verify:registry` passes
- [ ] Changeset added (if `packages/core` changed)

## Manual screen reader check

<!-- Screen reader + browser + OS + versions, and results of the checklist in CONTRIBUTING.md.
     If you could not do it, write "Not done" — that is fine, but say so. -->
