# Accessibility statement

Akso UI aims to meet **WCAG 2.2 level AA**. This page says what we have tested, how, and what we have **not** tested yet.

No component library can make a product accessible on its own, and we do not claim that Akso UI is "100% accessible". Automated tools find only part of the problems that real people meet. Accessibility depends on how you use the components: your content, labels, color choices and page structure matter as much as our code.

If something does not work for you, please [report a barrier](https://github.com/jfpanchi/akso-ui/issues/new?template=accessibility-barrier.yml). You do not need to be a developer.

_Last updated: 2026-11-04_

## How we test

| Layer | Tool | What it can find | What it cannot find |
| --- | --- | --- | --- |
| Color tokens | Contrast tests in `packages/core/tests/tokens.test.ts` | Text and non-text contrast for every token pair we use, in light and dark mode | Contrast of colors you add yourself |
| Unit tests | Vitest + Testing Library + vitest-axe (jsdom) | Missing names, wrong roles, broken ARIA references, keyboard behavior, focus order | Layout, real colors, real screen reader output |
| End-to-end tests | Playwright + `@axe-core/playwright` (Chromium, light and dark) | Contrast as rendered, focus ring color and size, target sizes, reflow at 320px, `prefers-reduced-motion` | How screen readers announce things, voice control, real devices |
| Registry install | `scripts/verify-registry.sh` | The component still passes axe and keyboard checks after `npx shadcn add` into a fresh project | — |
| Manual testing | People using assistive technology | What it is like to actually use the component | — |

## Button

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations in every variant, size and state (including loading) | Several | Vitest + Playwright (light and dark) |
| Native `<button>`, `type="button"` by default (does not submit forms by accident) | 4.1.2 | Vitest |
| Enter and Space press it; disabled buttons are skipped by Tab | 2.1.1 Keyboard | Vitest + Playwright |
| Loading keeps focus on the same button, renames it ("Saving") and ignores presses | 2.4.3, 4.1.2 | Vitest + Playwright |
| Icon-only buttons without a name log an error in development | 4.1.2 | Vitest |
| Visible `:focus-visible` ring, ≥ 2px, ≥ 3:1 contrast in every variant, appearing at once | 2.4.7, 1.4.11 | Playwright (computed colors) |
| Spinner does not move with `prefers-reduced-motion: reduce` | 2.3.3 (AAA) | Playwright |
| At least 24×24px in every size (`default` and `icon`: 44px, `sm`: 36px) | 2.5.8 Target Size (Minimum) | Playwright |
| Danger variant uses text (and an underline on hover), not only color | 1.4.1 Use of Color | Code review |

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

### Known limitations

- The loading state follows the Base UI pattern (`focusableWhenDisabled` + `aria-labelledby`). Whether every screen reader announces the name change while focus stays on the button is not confirmed yet. Announce the final result with a status message (`LiveRegion`).
- The default loading text ("Loading") is in English. Translate it with `loadingText`.
- Ghost buttons have no visible border at rest. Use them only where the context makes clear that they can be pressed.

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
| Buttons at least 24×24px (actual: 44×44px; they use the Akso Button styles) | 2.5.8 Target Size (Minimum) | Playwright |
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

## Field

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations, valid and invalid | Several | Vitest + Playwright (light and dark) |
| The control is named by its visible label | 1.3.1, 2.5.3 Label in Name, 3.3.2 | Vitest + Playwright |
| Required fields show "(required)" as text, and the control is `required` | 3.3.2 Labels or Instructions | Vitest + Playwright |
| Description and errors are the control's accessible description; `aria-invalid` when invalid (Base UI) | 1.3.1, 3.3.1 | Vitest + Playwright |
| Errors have an icon and text; the border also gets thicker, not only red | 1.4.1 Use of Color | Vitest + Playwright |
| Errors that appear on blur or while typing are announced politely, with the field name | 4.1.3 Status Messages | Vitest + Playwright |
| Errors are not announced a second time right after submit (focus already reads them) | — | Vitest |
| Clicking the label focuses the control | 2.5.5 (AAA), usability | Vitest + Playwright |
| No horizontal scroll at 320px wide; long errors wrap | 1.4.10 Reflow | Playwright |

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

### Known limitations

- "(required)" is hidden from the accessible name, because screen readers already say "required" from the control. Whether every screen reader and voice control tool handles this well is not confirmed yet.
- Error announcements use one shared polite live region. They wait 0.5 seconds so fast typing does not cause a flood of messages.
- With `validationMode="onBlur"`, Base UI only checks a field on blur after it was edited. Empty required fields are reported on submit.
- For server errors, use a `FieldError` without `match`, and only render it while that error exists. Otherwise it repeats your other messages.

## Input

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations: default, invalid and disabled | Several | Vitest + Playwright (light and dark) |
| Native `<input>`; `type` and `autoComplete` are passed through | 1.3.5 Identify Input Purpose | Vitest |
| 44px tall, 16px text (no automatic zoom on iOS) | 2.5.8 Target Size, 1.4.4 Resize Text | Playwright |
| Visible focus ring, ≥ 2px, ≥ 3:1 contrast, appearing at once | 2.4.7, 1.4.11 | Playwright |
| Invalid: thicker border plus an icon and text message | 1.4.1 Use of Color | Vitest + Playwright |
| Border and placeholder colors meet contrast (token tests) | 1.4.11, 1.4.3 | Token tests |
| Disabled inputs are skipped by Tab | 2.1.1 | Playwright |

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

### Known limitations

- Disabled inputs have reduced opacity. WCAG does not require contrast for disabled controls, but they can be hard to read. If people need the value, show it as text.

## Textarea

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations, valid and invalid | Several | Vitest + Playwright (light and dark) |
| Native `<textarea>`, named and described by its Field | 1.3.1, 4.1.2 | Vitest |
| Validated like Input; focus moves to it on submit with errors | 3.3.1 | Vitest |
| Enter adds a line instead of submitting | 2.1.1 | Vitest + Playwright |
| Visible focus ring with ≥ 3:1 contrast; resizes vertically only | 2.4.7, 1.4.10 | Playwright |

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

### Known limitations

- There is no live character counter yet. If you set `maxLength`, say the limit in a `FieldDescription`.

## Fieldset

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations, enabled and disabled | Several | Vitest + Playwright (light and dark) |
| A group (`<fieldset>`) named by its legend | 1.3.1 Info and Relationships | Vitest + Playwright |
| Disabled fieldset disables every field and is skipped by Tab | 2.1.1 | Vitest |
| No horizontal scroll at 320px wide | 1.4.10 Reflow | Playwright |

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

### Known limitations

- Some screen readers repeat the legend before every field in the group. Keep legends short.

## Form

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations, before and after a submit with errors | Several | Vitest + Playwright (light and dark) |
| Native error bubbles are off (`novalidate`); each field shows its own message | 3.3.1 Error Identification | Vitest |
| Does not submit while there are errors | 3.3.4 (AAA, partial) | Vitest |
| On submit with errors, focus moves to the first invalid field in page order (Base UI) | 2.4.3, 3.3.1 | Vitest + Playwright |
| The number of fields needing attention is announced politely | 4.1.3 Status Messages | Vitest + Playwright |
| Server errors (`errors` prop) appear on the right field and are linked to it | 3.3.1, 3.3.3 | Vitest + Playwright |
| While sending, focus stays on the loading button; the result is a status message | 2.4.3, 4.1.3 | Playwright |
| No horizontal scroll at 320px wide, also with every error shown | 1.4.10 Reflow | Playwright |

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

### Known limitations

- Focus moves to the first invalid field instead of to an error summary at the top of the form. This is Base UI's behavior and we keep it. For long forms, an error summary with links may work better for some people; we have not built one yet.
- The count message is in English by default. Translate it with `invalidMessage`.

## By disability

| Group | What we do | Status |
| --- | --- | --- |
| Blind people (screen readers) | Semantic roles from Base UI, accessible names, focus management | Automated ✅ · Manual ⏳ |
| Low vision | AA contrast tokens, 320px reflow, no fixed sizes that block zoom | Automated ✅ · Manual ⏳ |
| Color blindness | Information never depends on color alone | Code review ✅ |
| Motor disabilities | Full keyboard support, 44px targets, visible focus | Automated ✅ · Switch access ⏳ |
| Deaf and hard of hearing | No audio-only content in components | Not applicable to Dialog |
| Cognitive disabilities | Short, plain default texts; predictable behavior; visible labels, "(required)" as text, errors that say what to do; `autoComplete` on fields | Code review ✅ · User testing ⏳ |
| Vestibular disorders | No motion with `prefers-reduced-motion`; small, short animations otherwise | Automated ✅ |
