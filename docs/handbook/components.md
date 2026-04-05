# Components

New UI typically lives under **`src/components/<Name>/`** or **`src/ui/<Name>/`** for primitives. This page describes common file patterns and how CMS modules connect to the registry.

## Folder layout

Use **PascalCase** folders that match the component name. Most files use **`<Name>.component.tsx`**; some entry points use **`<Name>.tsx`** (e.g. [Navigation.tsx](../../src/components/Navigation/Navigation.tsx)).

### Typical files

| File | Purpose |
|------|--------|
| **`<Name>.component.tsx`** | Main React component; compose UI and keep logic focused. |
| **`<Name>.module.css`** | Scoped styles (CSS Modules). |
| **`<Name>.test.tsx`** | Jest / Testing Library tests when the feature needs them. |
| **`<Name>.interfaces.ts`** or inline types | Public props when not fully implied by a parser type. |
| **`README.md`** | Optional usage and props documentation (many Delmarva components include this). |

There is **no** `pnpm scaffold` script in this repo; copy an existing sibling folder as a template.

## CMS-backed components

Components rendered from Contentful usually:

1. Accept props shaped by a **parser** in `src/contentful/parse*.ts`.
2. Are imported from **[ContentRendererRegistry.tsx](../../src/components/ContentRenderer/ContentRendererRegistry.tsx)** with **`next/dynamic`** (`ssr: true` unless you need client-only behavior).
3. Are wired in **[ContentRenderer.component.tsx](../../src/components/ContentRenderer/ContentRenderer.component.tsx)** with a **`case`** on the Contentful content type id.

For **nested modules** (e.g. grids or carousels that contain other entries), see **ContentModules** and **FormRenderer** registries for the same dynamic-import pattern.

## Dynamic imports

- Use **`next/dynamic`** in the **registry** for large or rarely used blocks.
- Use **`{ ssr: false }`** only when the component or a dependency requires browser-only APIs on first paint.

## Links and navigation

- Prefer **next-intl** navigation helpers from [src/i18n/routing.ts](../../src/i18n/routing.ts) (`Link`, `useRouter`, `usePathname`) so locale prefix behavior stays correct (`localePrefix: "as-needed"`).
- External links: normal **`<a>`** with **`rel="noopener noreferrer"`** when **`target="_blank"`**.

## UI primitives

**`src/ui/`** holds shared controls (Button, TextField, TextArea) consumed by feature components. Keep feature-specific copy and layout in **`src/components/`**.
