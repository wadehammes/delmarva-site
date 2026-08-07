# Conventions

House style for TypeScript, React, CSS, and tests. When in doubt, mirror a nearby file that already matches the pattern and run **`pnpm lint`** before you push.

## TypeScript

- **Never use `any`.** Use proper types for props, state, and function signatures.
- **Always use arrow functions** for components and functions: `const MyComponent = (props: Props) => { ... }`, `const myHelper = (value: string) => { ... }`. Do not use `function` declarations or `React.FC`.
- **Braces on control flow** — always use `{}` for `if` / `else` / loops; no single-line unbraced bodies.
- **No non-null assertion (`!`).** Prefer optional chaining, nullish coalescing (`??`), or explicit checks.
- **No nullish coalescing assignment (`??=`).** Assign lazily with an `if` check instead (e.g. `if (!client) { client = createClient(); }`).
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
- `pnpm lint:fix` — fix and format writes
- `pnpm lint:ci` — CI mode with GitHub reporter

**Stylelint** ([stylelint.config.mjs](../../stylelint.config.mjs)) checks CSS Modules and global styles:

- `pnpm lint:css` — check (same as CI)
- `pnpm lint:css:fix` — auto-fix where supported
- `pnpm lint:all` — changed-file Biome check plus CSS fix

Run **`pnpm tsc:ci`** for strict TypeScript checks (same as CI).

## CSS

- **CSS Modules** next to components (`*.module.css`).
- **Mobile-first**: base styles for small screens; use `min-width` media queries for larger breakpoints.
- **Nest** selectors and media queries inside their parent rule (`&:hover`, `@media (min-width: …)`) rather than repeating the selector at the top level. Keep nesting depth reasonable.
- **Alphabetize** properties within a rule where practical.
- Prefer **flex/grid `gap`** over `margin-top` for spacing between siblings when layout allows.
- Use **design tokens** from global CSS variables where the codebase already does (see existing modules and [src/styles/](../../src/styles/)).
- All custom properties (`--*`) live in **[`src/styles/variables.css`](../../src/styles/variables.css)** — the single source of truth for design tokens, spacing, grid, and font stacks. The site is **dark-only** (`data-theme="dark"` on `<html>` in the root layout). Do not redeclare custom properties in `globals.css`; `@import "./variables.css"` pulls them in at the top.
- **Semantic color tokens** (prefer these in component CSS over raw palette values):
  - `--color-text` / `--color-bg` — default page text and background
  - `--color-surface-bg` / `--color-surface-text` — light surfaces (modals, cards, form fields)
  - `--card-bg`, `--divider`, `--divider-on-surface` — elevated surfaces and borders
  - `--overlay-*`, `--shadow-*`, `--color-input-*`, `--color-skeleton-*`, `--color-success-*` — overlays, shadows, form states, skeletons, and toasts
  - Palette tokens (`--colors-red`, `--colors-gray`, etc.) — brand accents and CMS section backgrounds only

## Testing

- **Jest** with **Testing Library**; import **`describe`**, **`it`**, **`expect`**, and lifecycle hooks from **`@jest/globals`** in every spec—do not rely on other undeclared globals. Use the shared **`jest`** object for **`jest.mock`**, **`jest.fn()`**, and **`jest.mocked()`** (hoisted mock factories must use the same instance). Matchers: **`@testing-library/jest-dom/jest-globals`** in [`.jest/setupTests.ts`](../../.jest/setupTests.ts) (extends **`expect`** from **`@jest/globals`**). Shared render helpers in [src/tests/testUtils.tsx](../../src/tests/testUtils.tsx) (includes **Jotai** provider where needed).
- **Write tests for expected behavior first.** Assert what users or callers should see (accessible labels, API payloads, error handling, security boundaries)—not implementation details. When a new or updated test fails, **fix the production code** if the expectation matches product intent; only change the test when the requirement was wrong or the assertion was brittle.
- **[basePageObject.po.ts](../../src/tests/basePageObject.po.ts)** — lightweight base class shared with energy-texas; extend per feature for page-object style tests.
- **Per-component page object** (when useful): `<Name>.po.tsx` extends **`BasePageObject`**, holds **test data and setup/render helpers only**—not wrappers around every `screen.getBy*`. POs do not assert; specs drive interactions and assertions with **`screen`** and **`userEvent`**.
- Tests use **`.test.tsx`** for components and **`.spec.ts`** for utilities (e.g. [recaptcha.spec.ts](../../src/utils/recaptcha.spec.ts), [localeUtils.spec.ts](../../src/i18n/localeUtils.spec.ts)); follow the naming pattern already used next to the code under test.
- Prefer **queries** that reflect accessible roles/labels; add stable selectors only when necessary.
- **`jest.mock` factories** — keep them free of `require()`; use ESM imports in dedicated mock modules under [`src/tests/mocks/`](../../src/tests/mocks/) or automock + `jest.mocked()` in the spec when a factory needs `jest.fn()`. **`next/dynamic`** is stubbed in Jest ([`nextDynamic.mock.ts`](../../src/tests/mocks/nextDynamic.mock.ts)) so lazy chunks do not resolve asynchronously during unrelated tests; import the underlying component directly when you need to assert on it.
- **`mapbox-gl` mocks** — When testing map components, mock **`NavigationControl`** and **`addControl`** on the **`Map`** instance (in addition to **`on('load', …)`**) so the **`load`** handler completes and loading overlays dismiss. Assert loading UI with **`getByRole('status')`**. See [AreasServicedMap.test.tsx](../../src/components/AreasServicedMap/AreasServicedMap.test.tsx).

### Jest configuration

- **[jest.config.ts](../../jest.config.ts)** — **`next/jest`**, jsdom, **`testTimeout: 20000`**, CSS mapped to **`identity-obj-proxy`**.
- **[`.jest/setEnvVars.ts`](../../.jest/setEnvVars.ts)** — sets **`ENVIRONMENT=staging`** before tests run.
- **[`.jest/setupTests.ts`](../../.jest/setupTests.ts)** — global mocks and lifecycle:
  - **`jest`** and hooks from **`@jest/globals`**; **`@testing-library/jest-dom/jest-globals`** for DOM matchers
  - **`global.fetch`** stubbed
  - **IntersectionObserver** and **matchMedia** via [src/tests/mocks/](../../src/tests/mocks/)
  - **`cleanup()`** after each test
- **`tsconfig.json`** — **`"types": ["jest", "node"]`** so specs and setup resolve **`jest`** globals; **`.next/types/validator.ts`** is excluded (stale route refs after deletes). SVGR imports: **`declare module "*.svg"`** in [src/@types/svg.d.ts](../../src/@types/svg.d.ts) (ambient file with no exports—same pattern as energy-texas / rhythm-marketing).

**`moduleNameMapper`** (prefer extending this over per-spec mocks):

| Module | Mock |
|--------|------|
| **`@faker-js/faker`** | [faker.ts](../../src/tests/mocks/faker.ts) |
| **`next-intl/navigation`** | [nextIntlNavigation.mock.ts](../../src/tests/mocks/nextIntlNavigation.mock.ts) |
| **`next/dynamic`** | [nextDynamic.mock.ts](../../src/tests/mocks/nextDynamic.mock.ts) |
| **`react-google-recaptcha`** | [reactGoogleRecaptcha.mock.ts](../../src/tests/mocks/reactGoogleRecaptcha.mock.ts) |

There is no **`pnpm test`** script; run **`pnpm test:ci`** locally (or **`pnpm exec jest --testPathPatterns=<pattern>`** for a subset).

### Test data and factories

- Factories use **@faker-js/faker** and extend [`BaseFactory`](../../src/tests/factories/BaseFactory.ts). Each factory exposes **`.build(attributes?)`** / **`.buildList(n, attributes?)`**—pass partial **`attributes`** to pin specific fields while the rest get fresh fake values.
- **Adding a factory**: create **`src/tests/factories/<Name>.factory.ts`**, build the instance with **`satisfies <TargetType>`**, and gate it with a **`KeysMatch<TargetType, typeof instance>`** line ([KeysMatch.ts](../../src/types/KeysMatch.ts)) so TypeScript fails when the target type grows a field the factory does not cover. Example: [`Form.factory.ts`](../../src/tests/factories/Form.factory.ts).

**Page object examples** (PO holds data + render/mocks; spec asserts):

- [GeneralInquiryForm.po.tsx](../../src/components/GeneralInquiryForm/GeneralInquiryForm.po.tsx) + [GeneralInquiryForm.test.tsx](../../src/components/GeneralInquiryForm/GeneralInquiryForm.test.tsx)
- [RequestAProposalForm.po.tsx](../../src/components/RequestAProposalForm/RequestAProposalForm.po.tsx) + [RequestAProposalForm.test.tsx](../../src/components/RequestAProposalForm/RequestAProposalForm.test.tsx)

## Accessibility

- Semantic HTML: correct heading order, `<button>` for actions, links for navigation.
- Form controls need labels or an accessible name (`aria-label` / `aria-labelledby` when design hides the label).
- Keyboard: focusable controls, focus management for modals/overlays.
- Honor **`prefers-reduced-motion`** for large or looping motion when straightforward.
- Async loading overlays that replace content should use **`role="status"`** (or **`role="alert"`** for errors) with visible status text; mark decorative spinners and skeletons **`aria-hidden`**. See [AreasServicedMapLoadingOverlay.component.tsx](../../src/components/AreasServicedMap/AreasServicedMapLoadingOverlay.component.tsx).

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
