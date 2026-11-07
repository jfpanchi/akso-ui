# Accessibility statement

Akso UI aims to meet **WCAG 2.2 level AA**. This page says what we have tested, how, and what we have **not** tested yet.

No component library can make a product accessible on its own, and we do not claim that Akso UI is "100% accessible". Automated tools find only part of the problems that real people meet. Accessibility depends on how you use the components: your content, labels, color choices and page structure matter as much as our code.

If something does not work for you, please [report a barrier](https://github.com/jfpanchi/akso-ui/issues/new?template=accessibility-barrier.yml). You do not need to be a developer.

Want to help test? Follow the [manual testing script](./MANUAL_TESTING.md) ([en español](./MANUAL_TESTING.es.md)): step-by-step checks for each component, for people who use a screen reader or other assistive technology. Every "⏳ Pending" row below is waiting for one.

_Last updated: 2026-11-07_

## How we test

| Layer | Tool | What it can find | What it cannot find |
| --- | --- | --- | --- |
| Color tokens | Contrast tests in `packages/core/tests/tokens.test.ts` | Text and non-text contrast for every token pair we use, in light and dark mode | Contrast of colors you add yourself |
| Unit tests | Vitest + Testing Library + vitest-axe (jsdom) | Missing names, wrong roles, broken ARIA references, keyboard behavior, focus order | Layout, real colors, real screen reader output |
| End-to-end tests | Playwright + `@axe-core/playwright` in Chromium (light and dark), Firefox and WebKit (Safari's engine) | Contrast as rendered, focus ring color and size, target sizes, reflow at 320px, `prefers-reduced-motion` | How screen readers announce things, voice control, real devices |
| Exceptions | Base UI "focus guards" (invisible `aria-hidden` elements around open popups that move focus on the same frame they receive it) are excluded from the e2e axe runs by selector. In Vitest only, the best-practice rule `region` is skipped where a popup is rendered in a portal. Every exception is written next to the test that uses it. | — |
| Windows high contrast | `apps/www/e2e/forced-colors.spec.ts` (Chromium emulating `forced-colors: active`) | Button outlines, focus ring, checkbox/radio/switch states, progress/meter/slider bars, selected tab, field borders and dialog edges stay visible with system colors | Every possible user theme; real Windows High Contrast with a screen reader |
| Registry install | `scripts/verify-registry.sh` (Next.js, Vite and React Router) | Every component installs and builds in a fresh project of each framework, and still passes axe and keyboard checks there | — |
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

Other checks still pending: real Windows High Contrast Mode with a screen reader (forced colors is emulated in e2e tests), browser zoom to 400% in Firefox and Safari, screen magnifiers (ZoomText, macOS Zoom), switch access.

### Known limitations

- Base UI does not set `aria-modal="true"`. It hides content outside the dialog from assistive technology instead. We have not yet confirmed how every screen reader handles this. See the manual testing table.
- The default texts ("Close") are in English. Use `AksoLocaleProvider locale="es"` for Spanish, or `closeLabel`.
- Automated tests run in Chromium, Firefox and WebKit. WebKit on Linux is close to Safari but not the same: Safari on macOS and iOS is checked only in the manual tests above.

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
| With `maxLength`: visible "characters left" counter, announced politely at 20, 10 and 0 left; Base UI's description link is untouched | 4.1.3, 3.3.2 | Vitest |
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

- The character counter is announced only at 20, 10 and 0 characters left, so it does not interrupt on every key. Whether that is often enough is not confirmed with users yet.

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
| `errorSummary`: a named summary with one link per field, focused after a submit with errors; each link moves focus to its field | 3.3.1, 2.4.3 | Vitest + Playwright |

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

- By default, focus moves to the first invalid field (Base UI's behavior). For long forms, `errorSummary` shows a summary with one link per field at the top of the form and moves focus to it instead (tested); which one works better for people is not confirmed with users yet.
- The count message is in English by default. Translate it with `invalidMessage`.

## Checkbox

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations: unchecked, checked, partly checked, disabled, invalid | Several | Vitest + Playwright (light and dark) |
| `role=checkbox` named by its visible text; `aria-checked` true / false / mixed (Base UI) | 4.1.2 | Vitest + Playwright |
| The box and its text are one target, at least 44px tall; clicking the text toggles | 2.5.8 Target Size | Vitest + Playwright |
| Checked shows a check mark, mixed shows a dash: shape, not only color | 1.4.1 Use of Color | Vitest + Playwright |
| Space toggles; disabled is skipped by Tab | 2.1.1 Keyboard | Vitest + Playwright |
| Required inside a Field: `aria-invalid` and the error as description | 3.3.1 | Vitest |
| Visible focus ring with ≥ 3:1 contrast, appearing at once | 2.4.7, 1.4.11 | Playwright |

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

- Inside a Field, each option is wrapped in Base UI `Field.Item` so options never share a label id. Without it, every option in one Field got the name of the first one (found by our tests).

## Checkbox group

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations, enabled and disabled | Several | Vitest + Playwright (light and dark) |
| A group named by its legend (Base UI forms guide pattern) | 1.3.1 | Vitest + Playwright |
| Each checkbox is its own Tab stop; Space toggles | 2.1.1 | Vitest + Playwright |
| No horizontal scroll at 320px wide | 1.4.10 | Playwright |

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

## Radio group

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations: no choice, a choice, invalid | Several | Vitest + Playwright (light and dark) |
| `role=radiogroup` named by its legend; radios named by their text | 1.3.1, 4.1.2 | Vitest + Playwright |
| One Tab stop; arrow keys move and choose; disabled options skipped (Base UI) | 2.1.1 | Vitest + Playwright |
| The chosen option shows a dot, not only a color | 1.4.1 | Playwright |
| Required (from the Field): submit marks the group invalid, moves focus into it and announces the count | 3.3.1, 4.1.3 | Vitest + Playwright |
| Rows at least 44px; visible focus ring with ≥ 3:1 contrast | 2.5.8, 2.4.7, 1.4.11 | Playwright |

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

- Some screen readers read the legend before every option. Keep legends short.

## Switch

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations: off, on and disabled | Several | Vitest + Playwright (light and dark) |
| `role=switch` named by its text, with `aria-checked` (Base UI) | 4.1.2 | Vitest + Playwright |
| Space and Enter toggle it; clicking the text toggles it | 2.1.1 | Vitest + Playwright |
| On is shown by thumb position, fill and a check mark | 1.4.1 Use of Color | Vitest + Playwright |
| Track 44×24px; row 44px tall | 2.5.8 | Playwright |
| The thumb does not slide with `prefers-reduced-motion: reduce` | 2.3.3 (AAA) | Playwright |

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

- Screen readers announce switches differently ("switch, on" or "toggle button, pressed"). This is not confirmed manually yet.

## Select

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations: closed, open, invalid | Several | Vitest + Playwright (light and dark) |
| Trigger named by the visible label; `aria-expanded` (Base UI) | 1.3.1, 4.1.2 | Vitest + Playwright |
| Options named; the chosen one is `aria-selected` and shows a check mark and bold text | 1.4.1, 4.1.2 | Vitest + Playwright |
| Arrows, Home/End, Enter, Escape and typeahead; focus returns to the trigger (Base UI) | 2.1.1, 2.4.3 | Vitest + Playwright |
| The highlighted option has a 2px ring with ≥ 3:1 contrast, not only a background | 1.4.11, 2.4.7 | Playwright |
| Required (from the Field): error linked and focus moves to the trigger on submit | 3.3.1 | Vitest + Playwright |
| Trigger and options at least 44px tall | 2.5.8 | Playwright |
| No motion with `prefers-reduced-motion`; open list fits at 320px wide | 2.3.3 (AAA), 1.4.10 | Playwright |

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

- Select is not searchable beyond typeahead. For long lists, a combobox is better (not built yet).
- The open list is rendered in a portal at the end of the page. Screen readers handle this through `aria-controls`/focus, which is not confirmed manually yet.

## Alert dialog

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations, open and closed | Several | Vitest + Playwright (light and dark) |
| `role=alertdialog` named by its title and described by its description (Base UI) | 4.1.2 | Vitest |
| Focus starts on the safe choice (Cancel first in the DOM); trapped; returns to the trigger | 2.4.3, 3.3.4 | Vitest + Playwright |
| Escape cancels; clicking outside does not close it | 2.1.1, 3.3.4 | Vitest + Playwright |
| Buttons say what they do; danger style has a text label | 1.4.1, 2.4.6 | Code review + Vitest |
| Visible focus ring ≥ 3:1; buttons 44px; no motion with reduced motion; fits at 320px | 2.4.7, 2.5.8, 2.3.3, 1.4.10 | Playwright |

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

- On narrow screens the buttons are stacked with the action above Cancel, while focus starts on Cancel. Visual and focus order differ slightly there; not confirmed with users yet.

## Toast

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations with toasts shown | Several | Vitest + Playwright (light and dark) |
| Toasts live in a labeled "Notifications" region; errors are announced with `role=alert` (Base UI) | 4.1.3 Status Messages | Vitest + Playwright |
| Showing a toast does not move focus | 2.4.3, 3.2.1 | Playwright |
| Errors and toasts with an action stay until dismissed; others stay 6 s and pause on hover/focus (Base UI) | 2.2.1 Timing Adjustable | Vitest + Playwright |
| F6 moves focus to the toasts; action and close buttons work with the keyboard (Base UI) | 2.1.1 | Vitest + Playwright |
| Each type has an icon shape and a hidden status word | 1.4.1 Use of Color | Vitest + Playwright |
| Toasts are listed one under another, fully visible (not piled up) | 1.4.13, 1.4.10 | Playwright |
| No motion with reduced motion; fits at 320px | 2.3.3, 1.4.10 | Playwright |

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

- Base UI hides each toast's close button from assistive technology until the notifications region has focus or the pointer (F6 or hover). We keep this Base UI behavior; it is not confirmed manually with screen readers yet.
- Toasts that close on their own (6 s) can still be missed. Do not put information people need only in a toast.
- The hidden status words ("Error:") are in English by default. Translate them with `statusLabels` on ToastProvider.

## Alert

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations in every status, including color contrast | Several | Vitest + Playwright (light and dark) |
| Each status has a different icon shape and a hidden status word before the title | 1.4.1 Use of Color, 1.3.1 | Vitest + Playwright |
| Not a live region by default; `live` sets `role=status` or `role=alert` | 4.1.3 | Vitest + Playwright |
| Success and warning colors meet 4.5:1 (new tokens) | 1.4.3 | Token tests |
| No horizontal scroll at 320px | 1.4.10 | Playwright |

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

- Alert is plain HTML (no Base UI primitive): Base UI has no static alert component.

## Progress

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations: value, complete, unknown | Several | Vitest + Playwright (light and dark) |
| `role=progressbar` named by its visible label, with `aria-valuenow/min/max` (Base UI) | 4.1.2 | Vitest + Playwright |
| The value is also shown as text; friendly `aria-valuetext` supported | 1.1.1, 1.3.1 | Vitest + Playwright |
| The bar has ≥ 3:1 contrast against its track | 1.4.11 | Playwright + token tests |
| The unknown-amount pulse does not run with reduced motion | 2.3.3 (AAA) | Playwright |

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

- Screen readers do not always announce value changes of a progress bar. Announce the end of the task with a status message.

## Meter

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations | Several | Vitest + Playwright (light and dark) |
| `role=meter` named by its visible label, with value and friendly text (Base UI) | 4.1.2 | Vitest + Playwright |
| The value is also shown as text | 1.1.1 | Vitest + Playwright |
| No horizontal scroll at 320px | 1.4.10 | Playwright |

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

- Support for `role=meter` varies between screen readers; some read it as a progress bar. Not confirmed manually yet.

## Tabs

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations | Several | Vitest + Playwright (light and dark) |
| Named `tablist`; tabs with `aria-selected` and `aria-controls` linked to panels (Base UI) | 1.3.1, 4.1.2 | Vitest + Playwright |
| One Tab stop; arrows move; Enter/Space activate (manual activation); panel focusable | 2.1.1, 2.4.3 | Vitest + Playwright |
| Selected tab: 4px underline with ≥ 3:1 contrast and bold text, not only color | 1.4.1, 1.4.11 | Playwright |
| Tabs 44px tall; visible focus ring ≥ 3:1; tabs wrap at 320px | 2.5.8, 2.4.7, 1.4.10 | Playwright |

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

- Disabled tabs can be reached with the arrow keys (Base UI, following the ARIA Authoring Practices), but not opened.

## Accordion

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations, closed and open | Several | Vitest + Playwright (light and dark) |
| Each trigger is a button inside a real heading (level configurable), with `aria-expanded` (Base UI) | 1.3.1, 2.4.6, 4.1.2 | Vitest + Playwright |
| Closed panels use `hidden="until-found"`, so find-in-page reveals them | 2.4, cognitive | Vitest + Playwright |
| Enter/Space toggle; Tab moves between triggers | 2.1.1 | Vitest + Playwright |
| The arrow changes direction with the state | 1.4.1 | Playwright |
| No height animation with reduced motion; no horizontal scroll at 320px | 2.3.3, 1.4.10 | Playwright |

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

- Base UI removed arrow-key navigation between triggers, following the updated ARIA Authoring Practices; Tab moves between them.
- `aria-controls` is only set while a panel is open (Base UI).

## Collapsible

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations, closed and open | Several | Vitest + Playwright (light and dark) |
| Button with `aria-expanded` and `aria-controls` (Base UI) | 4.1.2 | Vitest + Playwright |
| Closed panel uses `hidden="until-found"` | cognitive | Vitest |
| Enter/Space toggle; 44px trigger; visible focus ring ≥ 3:1 | 2.1.1, 2.5.8, 2.4.7 | Vitest + Playwright |
| No animation with reduced motion | 2.3.3 | Playwright |

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

## Popover

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations, closed and open | Several | Vitest + Playwright (light and dark) |
| Trigger with `aria-expanded`; popup named by its title and described (Base UI) | 4.1.2 | Vitest + Playwright |
| Focus moves inside on open; Escape and Close return focus to the trigger (Base UI) | 2.1.1, 2.4.3 | Vitest + Playwright |
| Also opens on hover for info icons, while staying reachable by keyboard and touch | 1.4.13, 2.5 | Playwright |
| Trigger 44px with a visible focus ring; open popover fits at 320px | 2.5.8, 2.4.7, 1.4.10 | Playwright |

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

## Tooltip

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations, closed and open (including contrast) | Several | Vitest + Playwright (light and dark) |
| Icon-only triggers without a name get the tooltip text as `aria-label`; visible text is kept as the name | 4.1.2, 2.5.3 Label in Name | Vitest + Playwright |
| Appears on keyboard focus; Escape hides it without moving focus (Base UI) | 1.4.13, 2.1.1 | Vitest + Playwright |
| Stays open while the pointer is over it (hoverable, Base UI) | 1.4.13 | Playwright |
| No motion with reduced motion | 2.3.3 | Playwright |

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

- Tooltips do not appear on touch screens (Base UI). Never put information people need only in a tooltip; use Popover or text on the page.

## Menu

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations, closed and open | Several | Vitest + Playwright (light and dark) |
| `menu`, `menuitem`, `menuitemcheckbox`, `menuitemradio` with their states (Base UI) | 4.1.2 | Vitest + Playwright |
| Arrows, Home/End, typeahead, Enter, Escape; focus returns to the trigger (Base UI) | 2.1.1, 2.4.3 | Vitest + Playwright |
| Highlighted item: 2px ring with ≥ 3:1 contrast, not only a background | 1.4.11, 2.4.7 | Playwright |
| Checked items show a check mark or a dot | 1.4.1 | Vitest |
| Submenus: trigger with `aria-haspopup`/`aria-expanded`; Arrow Right opens, Arrow Left closes, focus returns (Base UI) | 2.1.1, 4.1.2 | Vitest + Playwright |
| Items 44px tall; open menu fits at 320px; no motion with reduced motion | 2.5.8, 1.4.10, 2.3.3 | Playwright |

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

- Disabled items can be reached with the arrow keys (Base UI, ARIA Authoring Practices) but do nothing.
- Filterable menus from Base UI are not wrapped yet.

## Combobox

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations closed; open with one Base UI exception (see limitations) | Several | Vitest + Playwright (light and dark) |
| Input with `role=combobox` named by the visible label; `aria-expanded`, `aria-activedescendant` (Base UI) | 1.3.1, 4.1.2 | Vitest + Playwright |
| Number of matching options announced politely (Base UI `Combobox.Status`); “No results.” shown and announced | 4.1.3 Status Messages | Vitest + Playwright |
| Arrows, Enter, Escape; focus stays in the input | 2.1.1 | Vitest + Playwright |
| Required (from the Field): error linked; focus moves to the input on submit | 3.3.1 | Vitest + Playwright |
| Highlighted option: ring ≥ 3:1; chosen option: check mark and bold; options 44px | 1.4.11, 1.4.1, 2.5.8 | Playwright |
| Visible focus ring around the input group ≥ 3:1; open list fits at 320px | 2.4.7, 1.4.10 | Playwright |

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

- While the list is open, Base UI hides the rest of the page with `aria-hidden` (so the screen reader's virtual cursor stays in the combobox) but does not make it inert, so axe reports `aria-hidden-focus` in that state. We keep Base UI's behavior; Tab closes the list and exposes the page again (tested). Not confirmed with screen readers yet.
- Only options from the list can be chosen. Free text with suggestions (autocomplete) is not built yet.

## Slider

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations | Several | Vitest + Playwright (light and dark) |
| Native range input (`role=slider`) named by the visible label, with value and value text (Base UI) | 1.3.1, 4.1.2 | Vitest + Playwright |
| Arrows, Page Up/Down, Home/End; one Tab stop | 2.1.1 | Vitest + Playwright |
| Dragging is not required: − / + buttons (single tap) and clicking the track | 2.5.7 Dragging Movements | Vitest + Playwright |
| The value is always shown as text | 1.3.1 | Vitest + Playwright |
| Thumb 24px with a visible focus ring; step buttons 44px | 2.5.8, 2.4.7 | Playwright |

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

- The − / + buttons are not Tab stops (keyboard users use the arrow keys); they can be used by pointer, touch and voice control ("click Increase").

## Drawer

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations, closed and open | Several | Vitest + Playwright (light and dark) |
| `role=dialog` named by its title and described (Base UI) | 4.1.2 | Vitest + Playwright |
| Focus trapped; Escape and the close button return focus to the trigger (Base UI) | 2.1.1, 2.4.3 | Vitest + Playwright |
| Swiping is never required: a 44px close button on every side | 2.5.7 Dragging Movements | Vitest + Playwright |
| Snap points: a "Show more / Show less" button (with `aria-expanded`) changes the height without dragging | 2.5.7 Dragging Movements | Vitest + Playwright |
| No slide with reduced motion; fits at 320px | 2.3.3, 1.4.10 | Playwright |

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

- Nested drawers from Base UI are not wrapped yet.

## Navigation menu

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations, closed and open (Base UI focus guards excluded by selector, see limitations) | Several | Vitest + Playwright (light and dark) |
| Named `navigation` landmark; section buttons with `aria-expanded`; real links (no `role=menu`) | 1.3.1, 2.4.1, 4.1.2 | Vitest + Playwright |
| Current page: `aria-current=page`, underline and bold text | 1.4.1, 2.4.8 | Vitest + Playwright |
| Enter opens a section; Tab reaches its links; Escape closes and returns focus | 2.1.1, 2.4.3 | Vitest + Playwright |
| Items 44px; visible focus ring ≥ 3:1; open panel fits at 320px | 2.5.8, 2.4.7, 1.4.10 | Playwright |

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

- Base UI adds invisible "focus guard" elements (`aria-hidden`, `tabindex=0`) around the open panel; they move focus on the same frame they receive it. axe flags them, so they are excluded from the e2e axe checks by selector (see "How we test").

## Autocomplete

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations, closed and with suggestions open | Several | Vitest + Playwright (light and dark) |
| The input is a `combobox` named by its visible label (Base UI) | 1.3.1, 4.1.2 | Vitest + Playwright |
| Typing shows matching suggestions and announces how many there are (polite) | 4.1.3 | Vitest + Playwright |
| "No suggestions." is shown when nothing matches | 3.3.1 | Vitest + Playwright |
| Free text is kept: a value that is not a suggestion stays | 3.3.2 | Vitest + Playwright |
| Arrow keys highlight a suggestion and Enter puts it in the field; focus stays in the field; Escape closes | 2.1.1 | Vitest + Playwright |
| Suggestions 44px tall; the highlighted one has a ring, not only a color | 2.5.8, 1.4.1 | Vitest + Playwright |
| No motion with `prefers-reduced-motion: reduce`; no horizontal scroll at 320px | 2.3.3 (AAA), 1.4.10 | Playwright |

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

- The contrast of the highlight ring is not measured by a test yet; it uses the same focus ring token as other components.
- How each screen reader reads the number of suggestions is not confirmed manually yet.

## Toggle

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations: off, pressed, icon-only and disabled | Several | Vitest + Playwright (light and dark) |
| Native `<button>` with `aria-pressed` (Base UI); the name does not change with the state | 4.1.2 | Vitest + Playwright |
| Space and Enter press it; disabled toggles are skipped by Tab | 2.1.1 | Vitest + Playwright |
| Pressed is shown with a fill and a bar along the bottom, not color alone; the fill has at least 3:1 contrast with the page | 1.4.1, 1.4.11 | Vitest + Playwright |
| Off and pressed stay visible in Windows high contrast (Highlight fill, visible bar and outline) | 1.4.11 | Playwright (forced colors, Chromium) |
| Targets 44×44px; visible focus ring with at least 3:1 contrast | 2.5.8, 2.4.7 | Playwright |
| Error in development when it has no accessible name | 4.1.2 | Vitest |
| No motion with `prefers-reduced-motion: reduce`; no horizontal scroll at 320px | 2.3.3 (AAA), 1.4.10 | Playwright |

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

- Screen readers say the state differently ("pressed", "selected", "on"). Not confirmed manually yet.
- A toggle is easy to confuse with a normal button. For settings in a form, a Switch or a Checkbox is usually clearer.

## Toggle group

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations: single and multiple groups | Several | Vitest + Playwright (light and dark) |
| `role=group` named by its label; each item is a button with `aria-pressed` (Base UI) | 1.3.1, 4.1.2 | Vitest + Playwright |
| Tab enters the group on one button, arrow keys move between buttons, Space presses, Tab leaves | 2.1.1, 2.4.3 | Vitest + Playwright |
| Without `multiple`, one at a time; with `multiple`, several | 4.1.2 | Vitest + Playwright |
| Same pressed style as Toggle (fill and bar, not color alone) | 1.4.1 | Vitest |
| Targets 44×44px; visible focus ring with at least 3:1 contrast; wraps on narrow screens | 2.5.8, 2.4.7, 1.4.10 | Playwright |
| Error in development when the group has no name | 4.1.2 | Vitest |
| No motion with `prefers-reduced-motion: reduce` | 2.3.3 (AAA) | Playwright |

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

- Single-choice groups use pressed buttons, not radio buttons, so screen readers do not say "1 of 3". In a form, a Radio group is clearer.
- Some screen reader users do not expect arrow keys inside a group of buttons. Not confirmed manually yet.

## Number field

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations: normal, disabled and with an error shown | Several | Vitest + Playwright (light and dark) |
| Named by the FieldLabel; the error is linked with `aria-describedby` and `aria-invalid` (Base UI Field) | 1.3.1, 3.3.1, 4.1.2 | Vitest + Playwright |
| Arrow keys step, Shift + arrows take big steps, Home/End go to min/max (Base UI) | 2.1.1 | Vitest + Playwright |
| Tab reaches the field only; the − and + buttons are named and reachable by touch screen readers | 2.4.3, 4.1.2 | Vitest + Playwright |
| Button names and role description translated with `AksoLocaleProvider` | 3.1.2 | Vitest |
| Field and buttons 44×44px; focus ring on the whole field with at least 3:1 contrast | 2.5.8, 2.4.7, 1.4.11 | Playwright |
| Invalid style: thicker border; the error text has an icon | 1.4.1 | Code review + Field tests |
| No motion with `prefers-reduced-motion: reduce`; no horizontal scroll at 320px | 2.3.3 (AAA), 1.4.10 | Playwright |

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

- The − and + buttons are named "Decrease" and "Increase", without the field's name. With several number fields, a touch screen reader user may need to read the field first. Not confirmed manually yet.
- Screen readers read the role description differently, and some ignore it. Not confirmed manually yet.

## Toolbar

### Automated checks (passing)

| Requirement | WCAG | How it is checked |
| --- | --- | --- |
| No axe violations, before and after pressing toggles | Several | Vitest + Playwright (light and dark) |
| `role=toolbar` with `aria-orientation`, named with `aria-label`; groups and separators exposed (Base UI) | 1.3.1, 4.1.2 | Vitest |
| One Tab stop; arrow keys reach every control across groups and wrap; visible focus ring with at least 3:1 contrast on each | 2.1.1, 2.4.3, 2.4.7 | Vitest + Playwright |
| Disabled buttons stay focusable with `aria-disabled` (Base UI default) | 4.1.2 | Vitest + Playwright |
| Toggles keep `aria-pressed` and the Akso pressed style (fill and bar, not color alone) | 1.4.1, 4.1.2 | Vitest + Playwright |
| Every control at least 44×44px; the toolbar wraps at 320px wide | 2.5.8, 1.4.10 | Playwright |
| Error in development when the toolbar or a toggle group has no name | 4.1.2 | Vitest |
| No motion with `prefers-reduced-motion: reduce` | 2.3.3 (AAA) | Playwright |

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

- Home and End do not move to the first and last control (Base UI's Toolbar does not handle them; they are optional in the WAI-ARIA toolbar pattern). Inside a toggle group they move within the group.
- Some screen reader users do not expect arrow keys inside a toolbar. Not confirmed manually yet.

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
