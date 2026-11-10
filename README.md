# Akso UI

_[Leer en español](./README.es.md)_

Accessible React components built on [Base UI](https://base-ui.com) (`@base-ui/react`).

Each component is **tested with automated tools**: axe, keyboard tests, and checks in real browsers of contrast, focus rings, target size, 320px reflow and reduced motion. Each one also **documents what has and has not been checked** with assistive technology. We test with blind and low-vision users in mind, as well as people with color blindness and with motor, hearing, cognitive and vestibular disabilities. We do not compare screenshots, so a visual change that breaks none of these checks can go unnoticed. See the [accessibility statement](./ACCESSIBILITY.md) for the details. We never claim "100% accessible".

> Status: early work. Available components: **Button**, **Dialog**, **Field**, **Input**, **Textarea**, **Fieldset**, **Form**, **Checkbox**, **Checkbox group**, **Radio group**, **Switch**, **Select**, **Alert dialog**, **Toast**, **Alert**, **Progress**, **Meter**, **Tabs**, **Accordion**, **Collapsible**, **Popover**, **Tooltip**, **Menu**, **Combobox**, **Autocomplete**, **Slider**, **Drawer**, **Navigation menu**, **Toggle**, **Toggle group**, **Number field**, **Toolbar**, **Breadcrumb**, **Pagination**, **Context menu**, **Menubar**, **Table**, **Date picker**, **OTP field**, **Avatar**, **Separator** and **Scroll area**.

## What's in this repository

| Path | What it is |
| --- | --- |
| `packages/core` (`akso-ui`) | Color tokens with verified WCAG AA contrast, `VisuallyHidden`, `LiveRegion`, `SkipLink`, and test helpers (`expectNoA11yViolations`, keyboard utilities). Not published to npm yet. |
| `apps/www` | Next.js app that serves the [shadcn registry](https://ui.shadcn.com/docs/registry) and the documentation. |
| `apps/www/registry/akso/ui` | Source code of the components. |
| `apps/www/public/r` | Built registry files (`*.json`), committed so you can install from GitHub. |

## Install a component

In a project that already uses [shadcn](https://ui.shadcn.com) and Tailwind CSS v4:

```bash
npx shadcn@latest add https://raw.githubusercontent.com/jfpanchi/akso-ui/main/apps/www/public/r/dialog.json
```

This adds `components/ui/dialog.tsx` and the Akso `components/ui/button.tsx` it depends on, installs `@base-ui/react` and adds the Akso color tokens (`--akso-*`) to your CSS. The tokens have their own prefix, so they do not change your existing theme. Dark mode follows the `.dark` class.

Akso components never import each other: shared code is installed in `lib/` (`akso-styles.ts`, `akso-form.ts`, `akso-status.tsx`, `akso-locale.tsx`). If your project already has a file with the same name (for example shadcn's `components/ui/button.tsx` or `input.tsx`), shadcn asks before replacing it, and the other Akso components keep working if you say no.

```tsx
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger>Edit profile</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>Change your name and press Save.</DialogDescription>
    </DialogHeader>
    {/* form fields */}
    <DialogFooter>
      <DialogClose>Cancel</DialogClose>
      <DialogClose variant="primary">Save</DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Install a fixed version

The URL above installs the latest code from `main`. To get a version that does not change, put the version in the URL instead of `main`:

```bash
npx shadcn@latest add https://raw.githubusercontent.com/jfpanchi/akso-ui/v0.1.0/apps/www/public/r/dialog.json
```

The components it depends on (Button, tokens, shared `lib/` files) come from the same version. The available versions are on the [releases page](https://github.com/jfpanchi/akso-ui/releases).

## Language

Default texts (like "Close" or "Loading") are in English. To get them in Spanish, wrap your app in the provider that is installed with the components:

```tsx
import { AksoLocaleProvider } from "@/lib/akso-locale";

<AksoLocaleProvider locale="es">{children}</AksoLocaleProvider>
```

Also set `<html lang="es">`. A prop on a component always wins over the provider.

## Development

Requirements: Node.js 22+ and pnpm 12 (`corepack enable` or `npm i -g pnpm`).

```bash
pnpm install
```

```bash
pnpm lint
```

```bash
pnpm typecheck
```

```bash
pnpm test
```

```bash
pnpm test:e2e
```

The e2e command builds the app and runs Playwright in Chromium (light and dark). CI also runs the tests in Firefox and WebKit; locally, install those browsers and use `pnpm test:e2e:all`. The first time, install the browser with `pnpm --filter www exec playwright install chromium`.

Other useful commands:

```bash
pnpm --filter www dev
```

```bash
pnpm registry:build
```

```bash
pnpm verify:registry
```

`verify:registry` creates a new Next.js + shadcn project (or Vite / React Router with `scripts/verify-registry.sh --framework vite|react-router`; CI runs all three), installs every component and the tokens from your local registry files, builds the project and runs axe and keyboard checks on it. Run `pnpm registry:build` first.

To start a new component:

```bash
pnpm new:component radio-group --base radio-group
```

This creates the component, its unit and e2e tests (with the required checks marked as to-do), its docs and test pages, its registry entry and its section in `ACCESSIBILITY.md`.

## Contributing

Read [CONTRIBUTING.md](./CONTRIBUTING.md). Every component PR needs axe and keyboard tests and the manual screen reader checklist.

If you use a screen reader or other assistive technology, you can help by following the [manual testing script](./MANUAL_TESTING.md). No coding needed.

If you find an accessibility barrier, [tell us about it](https://github.com/jfpanchi/akso-ui/issues/new?template=accessibility-barrier.yml). No technical knowledge needed.

## License

[MIT](./LICENSE)
