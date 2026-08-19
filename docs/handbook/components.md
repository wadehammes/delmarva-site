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

For **nested modules** (entries inside another CMS block), use the same parser → switch → dynamic-import pattern in dedicated registries:

| Registry | Switch file | Registry file | Typical modules |
|----------|-------------|---------------|-----------------|
| **ContentModules** | [ContentModules.component.tsx](../../src/components/ContentModules/ContentModules.component.tsx) | [ContentModulesRegistry.tsx](../../src/components/ContentModules/ContentModulesRegistry.tsx) | Featured services, project/service/market lists, areas-served map/list |
| **FormRenderer** | [FormRenderer.component.tsx](../../src/components/FormRenderer/FormRenderer.component.tsx) | [FormRendererRegistry.tsx](../../src/components/FormRenderer/FormRendererRegistry.tsx) | General Inquiry, Request a Proposal |

**ContentModules** is **`server-only`** and may import server components directly from its registry. **FormRenderer** maps **`formType`** from [parseForm.ts](../../src/contentful/parseForm.ts) to the matching form component.

## Dynamic imports

- Use **`next/dynamic`** in the **registry** for large or rarely used blocks.
- Use **`{ ssr: false }`** only when the component or a dependency requires browser-only APIs on first paint.

## Links and navigation

- Prefer **next-intl** navigation helpers from [src/i18n/routing.ts](../../src/i18n/routing.ts) (`Link`, `useRouter`, `usePathname`) so locale prefix behavior stays correct (`localePrefix: "as-needed"`).
- External links: normal **`<a>`** with **`rel="noopener noreferrer"`** when **`target="_blank"`**.

## UI primitives

**`src/ui/`** holds shared controls (Button, TextField, TextArea) consumed by feature components. Keep feature-specific copy and layout in **`src/components/`**.

## Loading states

- **[Skeleton.component.tsx](../../src/components/Skeleton/Skeleton.component.tsx)** — shimmer placeholders using **`--color-skeleton-*`** tokens. Variants: **`block`**, **`line`**, **`media`** (16:9). Decorative only (**`aria-hidden`**, **`role="presentation"`**).
- Feature-specific overlays compose **`Skeleton`** with a status region. Example: **[AreasServicedMapLoadingOverlay.component.tsx](../../src/components/AreasServicedMap/AreasServicedMapLoadingOverlay.component.tsx)** (**`role="status"`**, **`aria-live="polite"`**, **`aria-busy`**, spinner respects **`prefers-reduced-motion`**). Reuse styles from the parent feature module when co-located (map loading uses **`AreasServicedMap.module.css`**).

## Map components

Service-area maps live under **`src/components/AreasServicedMap/`**:

| File | Role |
|------|------|
| **`AreasServicedMap.component.tsx`** | Client map: fetches county boundaries, renders Mapbox GL layers and legend |
| **`AreasServicedMapFromServices.component.tsx`** | Same client logic for CMS **`ContentAreasServicedMap`** parser shape |
| **`AreasServicedMapLoadingOverlay.component.tsx`** | Shared loading UI (skeleton + status panel) |
| **`AreasServicedMapClient.component.tsx`** | **`next/dynamic`** wrapper with **`ssr: false`** for pages that import the map |
| **`AreasServicedMapServer.component.tsx`** / **`AreasServicedMapTurnkeyServer.component.tsx`** | Server entry points that pass services into the client wrapper |

**Loading behavior:** County GeoJSON is fetched client-side via **`countiesToBoundaryLines`** ([countyUtils.ts](../../src/utils/countyUtils.ts)). The loading overlay stays visible until **both** boundary data is ready **and** Mapbox fires **`load`** (**`isMapReady`** in the client components)—avoiding a blank map flash between data and render.

See [integrations.md](integrations.md) (Mapbox env, boundaries API) and the co-located [README.md](../../src/components/AreasServicedMap/README.md).

## CMS service-area map block

The **`contentAreasServicedMap`** Contentful type renders through **`src/components/ContentAreasServicedMap/`**:

| File | Role |
|------|------|
| **`ContentAreasServicedMap.component.tsx`** | Client wrapper; **`dynamic`** import of **`AreasServicedMapFromServices`** with **`ssr: false`** |
| **`AreasServicedMapFromServices.component.tsx`** | Map logic for parsed CMS services (shares styles/loading overlay with **`AreasServicedMap`**) |
| **`ContentAreasServicedMapClient.component.tsx`** | Thin **`dynamic`** entry used from **ContentRenderer** |
| **`MapErrorBoundary.component.tsx`** | Catches Mapbox/runtime errors so one broken map does not crash the page |

**Wiring:** [parseContentAreasServicedMap.ts](../../src/contentful/parseContentAreasServicedMap.ts) → **`ContentRenderer`** **`case`** (wrapped in **`MapErrorBoundary`**) → **`ContentAreasServicedMapClient`**. Standalone pages use **`AreasServicedMapServer`** / **`AreasServicedMapTurnkeyServer`** from **ContentModules** instead.

## Stat (CSS ticker animation)

**[Stat.component.tsx](../../src/components/Stat/Stat.component.tsx)** displays CMS stat blocks with a **CSS translateY ticker**—not GSAP. Digits roll via **`TickerNumber`** and module CSS when **`useOptimizedInView`** (or an explicit **`trigger`** prop from accordions) fires the animation.

- Use **`Stat`** for standalone stat blocks and accordion grids (**≤3** stats).
- Use **GSAP** only for accordion **panel reveal** motion ([GSAP expand animations](#gsap-expand-animations)), not for counting digits.

## GSAP expand animations

**[ServiceAccordion](../../src/components/ServiceAccordion/ServiceAccordion.component.tsx)** and **[MarketAccordion](../../src/components/MarketAccordion/MarketAccordion.component.tsx)** animate panel content on expand with **GSAP** timelines built in **`setupAnimation`** and played from **`handleAccordionToggle`**. When **`defaultOpen`** is true (e.g. the first item in **All Services List**), pass **`animateOpenOnMount`** on **[Accordion](../../src/components/Accordion/Accordion.component.tsx)** so the panel height and inner content timelines run on load—not only after a user click.

When adding similar accordion motion:

- Use **`useDOMCleanup`** ([useIsBrowser.ts](../../src/hooks/useIsBrowser.ts)) and kill timelines on unmount.
- **Guard targets** before **`gsap.to`** / **`gsap.set`**: stats render as a grid (**≤3** stats) or a list (**>3**), so only one of **`statsRef`** / **`statsGridRef`** is mounted—never animate empty arrays or null refs (GSAP logs "target not found").
- Filter null refs out of batch **`gsap.set`** with **`.filter((el): el is HTMLElement => el != null)`**.
- Chain stagger steps only when **`querySelectorAll`** returns nodes (**`length > 0`**).
