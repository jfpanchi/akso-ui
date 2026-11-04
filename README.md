# Akso UI

_[Leer en español](./README.es.md)_

Accessible React components built on [Base UI](https://base-ui.com) (`@base-ui/react`).

Each component is **tested with automated tools** (axe, keyboard and visual tests) and **documents what has and has not been checked** with assistive technology. We test with blind and low-vision users in mind, as well as people with color blindness and with motor, hearing, cognitive and vestibular disabilities. See the [accessibility statement](./ACCESSIBILITY.md) for the details. We never claim "100% accessible".

> Status: early work. Available components: **Button** and **Dialog**.

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

The e2e command builds the app and runs Playwright. The first time, install the browser with `pnpm --filter www exec playwright install chromium`.

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

`verify:registry` creates a new Next.js + shadcn project, installs the Dialog (and, through it, the Button and the tokens) from your local registry files, builds the project and runs axe and keyboard checks on it. Run `pnpm registry:build` first.

To start a new component:

```bash
pnpm new:component radio-group --base radio-group
```

This creates the component, its unit and e2e tests (with the required checks marked as to-do), its docs and test pages, its registry entry and its section in `ACCESSIBILITY.md`.

## Contributing

Read [CONTRIBUTING.md](./CONTRIBUTING.md). Every component PR needs axe and keyboard tests and the manual screen reader checklist.

If you find an accessibility barrier, [tell us about it](https://github.com/jfpanchi/akso-ui/issues/new?template=accessibility-barrier.yml). No technical knowledge needed.

## License

[MIT](./LICENSE)
