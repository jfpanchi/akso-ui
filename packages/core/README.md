# akso-ui

Accessible building blocks for React from [Akso UI](https://github.com/jfpanchi/akso-ui): color tokens with checked WCAG AA contrast, small accessibility components, and test helpers.

> The Akso components themselves (Dialog, Form, Select…) are not in this package. You install them with shadcn from the [Akso registry](https://github.com/jfpanchi/akso-ui#install-a-component).

We test with automated tools and say what has and has not been checked with assistive technology. We never claim "100% accessible". See the [accessibility statement](https://github.com/jfpanchi/akso-ui/blob/main/ACCESSIBILITY.md).

## Install

```bash
npm install akso-ui
```

Requires React 19.

## Color tokens

CSS variables for light and dark mode. Dark mode follows the system setting; add the `dark` or `light` class to `<html>` to choose one. Every text and control color pair meets WCAG AA contrast, and a test checks it.

```css
@import "akso-ui/tokens.css";

body {
  background: var(--akso-background);
  color: var(--akso-foreground);
}
```

The same values are available in JavaScript, together with contrast helpers:

```ts
import { colors, contrastRatio, meetsAA, WCAG_AA } from "akso-ui/tokens";

contrastRatio("#1d4ed8", "#ffffff"); // 6.7
meetsAA("#71717a", "#ffffff", "nonText"); // true (3:1 for borders and icons)
```

`akso-ui/tokens` has no React code, so you can use it on the server or in build scripts.

## Components

```tsx
import { LiveRegion, SkipLink, VisuallyHidden } from "akso-ui";
```

Import `akso-ui/tokens.css` once: it also has the styles that hide `SkipLink` until it is focused.

- **`SkipLink`**: a "Skip to main content" link that shows when it gets keyboard focus. Put it first in the page and give your main content `id="main-content"` (or set `targetId`).
- **`LiveRegion`**: tells screen readers about a change, like "Saved" or "3 results". Change `message` to announce it. Use `politeness="assertive"` only for urgent errors.
- **`VisuallyHidden`**: text for screen readers only, such as the name of an icon button.

```tsx
<SkipLink />
<main id="main-content">
  <button type="button">
    <TrashIcon aria-hidden="true" />
    <VisuallyHidden>Delete</VisuallyHidden>
  </button>
  <LiveRegion message={status} />
</main>
```

## Test helpers

For Vitest with Testing Library. Install the tools they use:

```bash
npm install -D vitest-axe axe-core @testing-library/user-event
```

```ts
import { expectFocusTrapped, expectNoA11yViolations, pressEscape, tab } from "akso-ui/test";

await expectNoA11yViolations(container); // WCAG 2.0–2.2 A/AA; lists every problem it finds
await expectFocusTrapped(user, dialog); // Tab and Shift+Tab stay inside
```

Automated tests catch only part of the problems. They do not replace testing with screen readers and with people with disabilities.

## License

[MIT](./LICENSE)
