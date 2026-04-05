# Delmarva Site Handbook

This is the **Delmarva Site Handbook**: how the app is structured, how we write code, how Contentful feeds the UI, and where to look when debugging or adding a feature.

Skim the index, bookmark what you need, and update the matching page when behavior changes so the next person (or tool) is not misled.

**For tools and LLMs:** [llms.md](llms.md) is a compact task → chapter map and a short copy-paste instruction blurb.

## How to read this handbook

Recommended onboarding order:

1. **Orientation** — [architecture.md](architecture.md): stack, folders, and how data gets from Contentful to the screen.
2. **Day-to-day coding** — [conventions.md](conventions.md): TypeScript, React, CSS, tests, accessibility.
3. **CMS work** — [contentful.md](contentful.md): types, getters, parsers, and new CMS-driven blocks.
4. **UI structure** — [components.md](components.md): folders, files, dynamic imports, docs.
5. **App patterns** — [patterns.md](patterns.md): App Router pages, metadata, React Query (mutations today), API routes, i18n, forms.
6. **Operations & tooling** — [platform.md](platform.md): CI, env, `next.config`, security headers, draft mode.
7. **Analytics & tags** — [integrations.md](integrations.md): GTM, data layer helpers.
8. **RSS, sitemaps, social preview** — [distribution.md](distribution.md): feed helpers, sitemap output, metadata images.
9. **Where things live** — [source-layout.md](source-layout.md): atoms, hooks, `src/utils`, `src/lib`.

## Index of docs

| File | What it covers |
|------|----------------|
| [architecture.md](architecture.md) | Tech stack, directory map, layout/providers, data flow. Start here. |
| [conventions.md](conventions.md) | TypeScript, Biome, CSS Modules, testing, accessibility. |
| [contentful.md](contentful.md) | Generated types, getters, parsers, sections, ContentRenderer, Rich Text. |
| [components.md](components.md) | Component folder layout, registry pattern, dynamic imports, READMEs. |
| [patterns.md](patterns.md) | RSC pages, `generateMetadata`, caching, React Query mutations, `api`, next-intl, forms. |
| [platform.md](platform.md) | GitHub CI, `pnpm` scripts, `next.config` (env, redirects, CSP), draft APIs. |
| [integrations.md](integrations.md) | Google Tag Manager, `trackEvent` / data layer. |
| [distribution.md](distribution.md) | RSS helpers, sitemap XML, `robots`, Open Graph / Twitter metadata files. |
| [source-layout.md](source-layout.md) | Jotai atoms, `src/utils` map, `src/lib`, constants. |
| [llms.md](llms.md) | Task-to-chapter routing for tools; copy-paste blurb for agents. |

## Development setup

Local setup (Node via asdf, pnpm, Vercel env pull, first `pnpm dev`) lives in the root **[README.md](../../README.md)**.

**Agents:** defaults and "keep docs in sync" expectations are in the repo root **[AGENTS.md](../../AGENTS.md)**. **Cursor** loads **[`.cursor/rules/delmarva-site-handbook.mdc`](../../.cursor/rules/delmarva-site-handbook.mdc)** as a project rule.
