# UI primitives (`src/ui/`)

Shared wrappers for headless controls used by feature components in `src/components/`. **Base UI** (`@base-ui/react`) is the default headless layer.

## Conventions

- Import Base UI from **`@base-ui/react/<module>`** subpaths (e.g. `@base-ui/react/dialog`) — **never** through barrel files. See [conventions.md](../../docs/handbook/conventions.md).
- Add a folder here **only** when a primitive needs shared CSS or behavior beyond what Base UI provides out of the box.
- Style with **CSS Modules** and **design tokens** from [`src/styles/variables.css`](../styles/variables.css). Target Base UI **`data-*`** state attributes (e.g. `[data-panel-open]`, `[data-disabled]`) rather than inventing parallel state classes.
- Mark wrappers **`"use client"`** — Base UI components are client-only.
- **Links** — do not use Base UI `Button` for navigation; use next-intl `Link` or styled `<a>` (see [Base UI Button guidelines](https://base-ui.com/react/components/button)).
- **Submit buttons** — pass `type="submit"` explicitly on Base UI `Button` (not the HTML default inside forms).

## Where things live

| Area | Import from |
|------|-------------|
| Base UI parts (`Field`, `Dialog`, `Select`, …) | `@base-ui/react/<module>` in the styled component that needs them |
| [Collapsible](./Collapsible/) | `src/ui/Collapsible/Collapsible.component` — panel height transition; used by **Accordion** |
| [FieldErrorMessage](./Field/FieldErrorMessage.component.tsx) | Shared `Field.Error` wiring for form components |
| Styled forms, Modal | `src/components/Input`, `TextArea`, `Select`, `Checkbox`, `FileInput`, `Modal` |

## Portal setup

Dialog and popover stacking: **`.appRoot`** with `isolation: isolate` on the layout wrapper in [`layout.tsx`](../app/[locale]/layout.tsx).
