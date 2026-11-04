# Accessibility statement

Akso UI aims to meet **WCAG 2.2 level AA**. This page says what we have tested, how, and what we have **not** tested yet.

No component library can make a product accessible on its own, and we do not claim that Akso UI is "100% accessible". Automated tools find only part of the problems that real people meet. Accessibility depends on how you use the components: your content, labels, color choices and page structure matter as much as our code.

If something does not work for you, please [report a barrier](https://github.com/jfpanchi/akso-ui/issues/new?template=accessibility-barrier.yml). You do not need to be a developer.

_Last updated: 2026-11-03_

## How we test

| Layer | Tool | What it can find | What it cannot find |
| --- | --- | --- | --- |
| Color tokens | Contrast tests in `packages/core/tests/tokens.test.ts` | Text and non-text contrast for every token pair we use, in light and dark mode | Contrast of colors you add yourself |
| Unit tests | Vitest + Testing Library + vitest-axe (jsdom) | Missing names, wrong roles, broken ARIA references, keyboard behavior, focus order | Layout, real colors, real screen reader output |
| End-to-end tests | Playwright + `@axe-core/playwright` (Chromium, light and dark) | Contrast as rendered, focus ring color and size, target sizes, reflow at 320px, `prefers-reduced-motion` | How screen readers announce things, voice control, real devices |
| Registry install | `scripts/verify-registry.sh` | The component still passes axe and keyboard checks after `npx shadcn add` into a fresh project | — |
| Manual testing | People using assistive technology | What it is like to actually use the component | — |

## Dialog

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations, open and closed | Several | Vitest + Playwright (light and dark) |
| Escape closes the dialog | 2.1.1 Keyboard | Vitest + Playwright |
| Focus stays inside while open (Tab and Shift+Tab) | 2.4.3 Focus Order | Vitest + Playwright |
| Focus returns to the trigger when closed (Escape, Cancel, ×, submit) | 2.4.3 Focus Order | Vitest + Playwright |
| Outside content is hidden from assistive technology while open | 1.3.1, 4.1.2 | Vitest |
| Accessible name from `DialogTitle`; optional description | 4.1.2 Name, Role, Value | Vitest; a development warning when the title is missing |
| The × button has a text name (translatable with `closeLabel`) | 1.1.1, 4.1.2 | Vitest |
| Visible `:focus-visible` ring, ≥ 2px, ≥ 3:1 contrast against what is behind it | 2.4.7, 1.4.11 | Playwright (computed colors) + token tests |
| The focus ring appears immediately (it is never animated) | 2.4.7 | Playwright |
| No transitions or animations with `prefers-reduced-motion: reduce` | 2.3.3 (AAA) | Playwright |
| No horizontal scroll at 320px wide; tall dialogs scroll instead of being cut off | 1.4.10 Reflow | Playwright |
| Buttons at least 24×24px (actual: 44×44px) | 2.5.8 Target Size (Minimum) | Playwright |
| Information is not conveyed by color alone (danger buttons: text label; hover: underline) | 1.4.1 Use of Color | Code review |

### Manual testing with assistive technology

| Assistive technology | Browser / platform | Status | Notes |
| --- | --- | --- | --- |
| NVDA | Chrome (Windows) | ⏳ Pending | |
| NVDA | Firefox (Windows) | ⏳ Pending | |
| JAWS | Chrome (Windows) | ⏳ Pending | |
| VoiceOver | Safari (macOS) | ⏳ Pending | |
| VoiceOver | Safari (iOS) | ⏳ Pending | |
| TalkBack | Chrome (Android) | ⏳ Pending | |
| Voice Control | macOS / iOS | ⏳ Pending | |

Other checks still pending: Windows High Contrast Mode / `forced-colors`, browser zoom to 400% in Firefox and Safari, screen magnifiers (ZoomText, macOS Zoom), switch access.

### Known limitations

- Base UI does not set `aria-modal="true"`. It hides content outside the dialog from assistive technology instead. We have not yet confirmed how every screen reader handles this. See the manual testing table.
- The default texts ("Close") are in English. Translate them with `closeLabel`.
- Automated tests only run in Chromium. Firefox and WebKit are not tested yet.

## By disability

| Group | What we do | Status |
| --- | --- | --- |
| Blind people (screen readers) | Semantic roles from Base UI, accessible names, focus management | Automated ✅ · Manual ⏳ |
| Low vision | AA contrast tokens, 320px reflow, no fixed sizes that block zoom | Automated ✅ · Manual ⏳ |
| Color blindness | Information never depends on color alone | Code review ✅ |
| Motor disabilities | Full keyboard support, 44px targets, visible focus | Automated ✅ · Switch access ⏳ |
| Deaf and hard of hearing | No audio-only content in components | Not applicable to Dialog |
| Cognitive disabilities | Short, plain default texts; predictable behavior | Code review ✅ · User testing ⏳ |
| Vestibular disorders | No motion with `prefers-reduced-motion`; small, short animations otherwise | Automated ✅ |
