# Conventions

House style for TypeScript, React, CSS, and tests. When in doubt, mirror a nearby file that already matches the pattern and run **`pnpm lint`** before you push.

## TypeScript

- **Never use `any`.** Use proper types for props, state, and function signatures.
- **Prefer arrow functions** for components and most functions: `const MyComponent = (props: Props) => { ... }`. Do not use `React.FC`.
- **Braces on control flow** — always use `{}` for `if` / `else` / loops; no single-line unbraced bodies.
- **No non-null assertion (`!`).** Prefer optional chaining, nullish coalescing (`??`), or explicit checks.
- **Absolute imports (`src/…`).** Import app code from `src/` (e.g. `src/utils/urlHelpers`, `src/utils/env.helpers`). Exceptions: co-located **CSS Modules** and assets (`./MyComponent.module.css`).
- **No barrel `index.ts` files** that only re-export other modules; import from the defining file. **Exception:** **`src/contentful/types/`** is generated (includes **`index.ts`**); do not hand-edit or “fix” its export style.
- **Contentful**: Use generated types under `src/contentful/types/` and **parsed** shapes from `src/contentful/parse*.ts` in components. Regenerate with `pnpm types:contentful`; do not hand-edit generated files.

## React / JSX

- **Typed props** on plain function components; return type usually inferred.
- **Conditional UI**: Prefer an explicit ternary (`condition ? <A /> : null`) over `condition && <A />` so falsy values never render accidentally.
- **Class names**: Use **`clsx`** with object notation for conditionals, e.g. `clsx(styles.root, { [styles.active]: isActive })`.
- **Images**: Use **`next/image`** for content images with a meaningful **`alt`** (or `alt=""` when decorative). New remote hostnames belong in **`images.remotePatterns`** in [next.config.ts](../../next.config.ts).

## Formatting and linting

**Biome** is the single linter/formatter ([biome.json](../../biome.json)).

- `pnpm lint` — check
- `pnpm lint:fix` / `pnpm lint:write` — fix and format writes
- `pnpm lint:ci` — CI mode with GitHub reporter

Run **`pnpm tsc:ci`** for strict TypeScript checks (same as CI).

## CSS

- **CSS Modules** next to components (`*.module.css`).
- **Mobile-first**: base styles for small screens; use `min-width` media queries for larger breakpoints.
- **Nest** selectors and media queries inside their parent rule (`&:hover`, `@media (min-width: …)`) rather than repeating the selector at the top level. Keep nesting depth reasonable.
- **Alphabetize** properties within a rule where practical.
- Prefer **flex/grid `gap`** over `margin-top` for spacing between siblings when layout allows.
- Use **design tokens** from global CSS variables where the codebase already does (see existing modules and [src/styles/](../../src/styles/)).
- All custom properties (`--*`) live in **[`src/styles/variables.css`](../../src/styles/variables.css)** — the single source of truth for design tokens, spacing, grid, and font stacks. Theme overrides (`[data-theme]`) also live there. Do not redeclare custom properties in `globals.css`; `@import "./variables.css"` pulls them in at the top.
- **Adobe Fonts (Typekit)** load from **`<link rel="stylesheet">`** and **`<link rel="preconnect">`** on **`use.typekit.net`** in **[`src/app/[locale]/layout.tsx`](../../src/app/[locale]/layout.tsx)** (inside `<head>`), not via an `@import` in CSS—so **`@font-face`** is unaffected by webpack or layered `@import`s.
- **Cascade layers**: Swiper and Mapbox use **`layer(vendor)`** in **[`src/styles/vendor-layered.css`](../../src/styles/vendor-layered.css)**, pulled in from **`globals.css`**. App CSS and CSS Modules stay **unlayered** so they normally win over those vendor rules without extra specificity or per-component stylesheet imports.

## Testing

- **Jest** with **Testing Library**; shared render helpers in [src/tests/testUtils.tsx](../../src/tests/testUtils.tsx) (includes **Jotai** provider where needed).
- **[basePageObject.po.ts](../../src/tests/basePageObject.po.ts)** — lightweight base class; extend per feature if you introduce a page-object style test.
- Tests use **`.test.tsx`** for components and **`.spec.ts`** for some utilities (e.g. [recaptcha.spec.ts](../../src/utils/recaptcha.spec.ts)); follow the naming pattern already used next to the code under test.
- Prefer **queries** that reflect accessible roles/labels; add stable selectors only when necessary.

## Accessibility

- Semantic HTML: correct heading order, `<button>` for actions, links for navigation.
- Form controls need labels or an accessible name (`aria-label` / `aria-labelledby` when design hides the label).
- Keyboard: focusable controls, focus management for modals/overlays.
- Honor **`prefers-reduced-motion`** for large or looping motion when straightforward.

## Comments

Add comments only for non-obvious behavior, workarounds, or domain rules. Prefer clear names and small functions.

**Never** add comments that restate what the code already shows. Specifically:
- No JSDoc/block comments on functions or components whose name and types make the purpose obvious.
- No inline comments explaining standard language features, CSS properties, or library APIs.
- No section-header banners or decorative dividers.
- No prose restating what a property value or expression already says (e.g. `/* hides overflow */` above `overflow: hidden`).

## React Query

- Keep **`useMutation`** in dedicated files under **`src/hooks/mutations/`** rather than inlined in large components. **Mutation hooks** should stay thin: wire **`useMutation`** to **`api`** methods from [src/api/urls.ts](../../src/api/urls.ts). Handle side effects (toasts, navigation) at the call site when possible.
- There are no **`useQuery`** hooks in the repo yet; add a **`src/hooks/queries/`** (or similar) convention if you introduce client-side queries.
