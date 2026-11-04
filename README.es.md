# Akso UI

_[Read in English](./README.md)_

Componentes React accesibles construidos sobre [Base UI](https://base-ui.com) (`@base-ui/react`).

Cada componente está **probado con herramientas automáticas** (axe, teclado y pruebas visuales) y **documenta qué se ha comprobado y qué no** con tecnologías de asistencia. Probamos pensando en personas ciegas, con baja visión, con daltonismo y con discapacidad motora, auditiva, cognitiva y vestibular. Los detalles están en la [declaración de accesibilidad](./ACCESSIBILITY.md) (en inglés). Nunca afirmamos que algo sea "100% accesible".

> Estado: trabajo inicial. Componentes disponibles: **Button**, **Dialog**, **Field**, **Input**, **Textarea**, **Fieldset**, **Form**, **Checkbox**, **Checkbox group**, **Radio group**, **Switch**, **Select**, **Alert dialog**, **Toast**, **Alert**, **Progress**, **Meter**, **Tabs**, **Accordion**, **Collapsible**, **Popover**, **Tooltip**, **Menu**, **Combobox**, **Slider**, **Drawer** y **Navigation menu**.

## Qué hay en este repositorio

| Ruta | Qué es |
| --- | --- |
| `packages/core` (`akso-ui`) | Tokens de color con contraste WCAG AA verificado, `VisuallyHidden`, `LiveRegion`, `SkipLink` y helpers de test (`expectNoA11yViolations`, utilidades de teclado). Todavía no está publicado en npm. |
| `apps/www` | App Next.js que sirve el [registry de shadcn](https://ui.shadcn.com/docs/registry) y la documentación. |
| `apps/www/registry/akso/ui` | Código fuente de los componentes. |
| `apps/www/public/r` | Archivos del registry ya generados (`*.json`). Se guardan en el repo para poder instalar desde GitHub. |

## Instalar un componente

En un proyecto que ya usa [shadcn](https://ui.shadcn.com) y Tailwind CSS v4:

```bash
npx shadcn@latest add https://raw.githubusercontent.com/jfpanchi/akso-ui/main/apps/www/public/r/dialog.json
```

Esto añade `components/ui/dialog.tsx` y el `components/ui/button.tsx` de Akso del que depende, instala `@base-ui/react` y agrega los tokens de color de Akso (`--akso-*`) a tu CSS. Los tokens tienen su propio prefijo, así que no cambian tu tema actual. El modo oscuro sigue la clase `.dark`.

Los componentes de Akso nunca se importan entre sí: el código compartido se instala en `lib/` (`akso-styles.ts`, `akso-form.ts`). Si tu proyecto ya tiene un archivo con el mismo nombre (por ejemplo, el `components/ui/button.tsx` o `input.tsx` de shadcn), shadcn pregunta antes de reemplazarlo, y los demás componentes de Akso siguen funcionando si respondes que no.

```tsx
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger>Editar perfil</DialogTrigger>
  <DialogContent closeLabel="Cerrar">
    <DialogHeader>
      <DialogTitle>Editar perfil</DialogTitle>
      <DialogDescription>Cambia tu nombre y pulsa Guardar.</DialogDescription>
    </DialogHeader>
    {/* campos del formulario */}
    <DialogFooter>
      <DialogClose>Cancelar</DialogClose>
      <DialogClose variant="primary">Guardar</DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

Los textos por defecto están en inglés. Usa `closeLabel` para traducir el nombre del botón ×.

## Desarrollo

Requisitos: Node.js 22+ y pnpm 12 (`corepack enable` o `npm i -g pnpm`).

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

El comando e2e compila la app y ejecuta Playwright. La primera vez, instala el navegador con `pnpm --filter www exec playwright install chromium`.

Otros comandos útiles:

```bash
pnpm --filter www dev
```

```bash
pnpm registry:build
```

```bash
pnpm verify:registry
```

`verify:registry` crea un proyecto nuevo de Next.js + shadcn, instala el Dialog (y con él el Button y los tokens) desde tus archivos locales del registry, compila el proyecto y le pasa pruebas de axe y teclado. Antes ejecuta `pnpm registry:build`.

Para empezar un componente nuevo:

```bash
pnpm new:component radio-group --base radio-group
```

Esto crea el componente, sus tests unitarios y e2e (con las comprobaciones obligatorias marcadas como pendientes), sus páginas de documentación y de prueba, su entrada en el registry y su sección en `ACCESSIBILITY.md`.

## Contribuir

Lee [CONTRIBUTING.md](./CONTRIBUTING.md). Todo PR de componente necesita tests de axe y de teclado y la checklist manual de lector de pantalla.

Si encuentras una barrera de accesibilidad, [cuéntanos](https://github.com/jfpanchi/akso-ui/issues/new?template=accessibility-barrier.yml). No hace falta saber de programación.

## Licencia

[MIT](./LICENSE)
