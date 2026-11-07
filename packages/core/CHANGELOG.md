# akso-ui

## 0.1.0

### Minor Changes

- a86ed29: First version: WCAG AA color tokens, `VisuallyHidden`, `LiveRegion`, `SkipLink` and test helpers (`expectNoA11yViolations`, keyboard utilities).
- f09c07f: Add `success` and `warning` color tokens, checked for WCAG AA contrast in light and dark mode.

### Patch Changes

- 508684a: Verify contrast for radio dots, check marks and switch thumbs.
- 685f903: Verify contrast for error text on the page background and for invalid field borders.
- `axe-core` and `vitest-axe` are now optional peer dependencies. Install them only if you use `akso-ui/test`; apps that use only the tokens or components no longer download test tools.
- 2c59cf7: `parseColor` and `contrastRatio` also accept `color(srgb r g b)`, the format WebKit uses for some computed colors.
