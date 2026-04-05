# Contentful integration

Marketing pages are driven by Contentful. This guide covers **generated types**, **getters**, **parsers**, and how **sections** and **content entries** reach **ContentRenderer**.

## Content types (generated)

TypeScript definitions for Contentful models live under **`src/contentful/types/`**. They are **generated** and must not be edited by hand.

Each type module exports an **`isType…(entry)`** guard (e.g. **`isTypeContentHero`**, **`isTypeCopyBlock`**) that checks **`entry.sys.contentType.sys.id`**. Prefer these over string comparisons or ad hoc helpers so runtime checks stay aligned with codegen.

- **Regenerate**: `pnpm types:contentful` (requires `CONTENTFUL_SPACE_ID` and `CONTENTFUL_CMA_TOKEN` per [package.json](../../package.json) script / env).
- After CMS schema changes, regenerate and fix parsers or components that break.

## Getters

**Getters** are async functions that use the Contentful client (and caching helpers where applicable).

- **Examples**: [getPages.ts](../../src/contentful/getPages.ts) (`fetchPage`, etc.), [getNavigation.ts](../../src/contentful/getNavigation.ts), [getFooter.ts](../../src/contentful/getFooter.ts), [getServices.ts](../../src/contentful/getServices.ts), [getProjects.ts](../../src/contentful/getProjects.ts), [getMarkets.ts](../../src/contentful/getMarkets.ts).
- **Preview**: Pass `preview: true` when **draft mode** is enabled so unpublished content loads.

## Parsers

Parsers in **`src/contentful/parse*.ts`** turn raw entries into shapes the UI can render.

- **Input**: Raw entry types from generated `Type*` modules (often `*WithoutUnresolvableLinksResponse` or similar).
- **Output**: Plain objects with stable field names and nested parsed data where needed.
- **Type checks**: [src/contentful/helpers.ts](../../src/contentful/helpers.ts) exports **`ExtractSymbolType`**, **`ContentfulTypeCheck`**, and related helpers—use them to keep parsed types aligned with Contentful fields.
- **Assets**: [parseContentfulAsset.ts](../../src/contentful/parseContentfulAsset.ts) normalizes media.

## Sections and content entries

- **Sections** are defined and parsed in [parseSections.ts](../../src/contentful/parseSections.ts) (and related types). Each section has layout, styling, and a **`content`** array of entries.
- **SectionRenderer** ([SectionRenderer.component.tsx](../../src/components/SectionRenderer/SectionRenderer.component.tsx)) wraps each section in **Section** and maps **`content`** to **ContentRenderer**.
- **ContentRenderer** ([ContentRenderer.component.tsx](../../src/components/ContentRenderer/ContentRenderer.component.tsx)) switches on **`content.sys.contentType.sys.id`**, runs the right parser, and renders the matching component.

Heavy UI pieces are imported from **[ContentRendererRegistry.tsx](../../src/components/ContentRenderer/ContentRendererRegistry.tsx)** via **`next/dynamic`** so bundles stay split.

## Adding a new Contentful-driven block

1. Add or update the content type in Contentful, then run **`pnpm types:contentful`**.
2. Implement **`parse<Name>.ts`**: normalized type, parse function, and **`ContentfulTypeCheck`** / **`ExtractSymbolType`** where symbols drive unions.
3. Register the component in **ContentRendererRegistry** (dynamic import) if it should lazy-load.
4. Add a **`case`** in **ContentRenderer** that parses the entry and returns the component with the parsed props.
5. If the block appears inside a section’s **`content`** array, ensure the Contentful model allows it there; no extra wiring is needed beyond the content type id in the switch.

## Rich Text

Rich Text uses **`@contentful/rich-text-react-renderer`** and types from **`@contentful/rich-text-types`**. Reuse existing options/builders from the codebase (e.g. **RichText** component and related utilities) so typography and links stay consistent.

## Client

**[client.ts](../../src/contentful/client.ts)** exports **`contentfulClient`** for delivery/preview. Use that client through the **getters** (and **`cached`**) rather than constructing one-off clients, so tokens, preview behavior, and caching stay consistent.
