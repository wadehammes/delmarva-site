# Handbook routing (for tools and LLMs)

Use this page to choose **which markdown file to read first**. It mirrors the handbook index in **[README.md](README.md)**.

**Convention:** paths are relative to `docs/handbook/` (e.g. `contentful.md`).

## Task → chapter

| Task or question | Read first |
|------------------|------------|
| Stack, folders, layout, providers, Contentful → page render flow | [architecture.md](architecture.md) |
| TypeScript / React style, Biome, CSS Modules, tests, a11y, `next/image` | [conventions.md](conventions.md) |
| Contentful types/codegen, getters, parsers, sections, ContentRenderer / registry, new CMS block | [contentful.md](contentful.md) |
| Component folder layout, dynamic imports, co-located READMEs | [components.md](components.md) |
| App Router pages, metadata, revalidation, React Query mutations, `src/api`, next-intl, forms | [patterns.md](patterns.md) |
| CI, `pnpm` scripts, `next.config` (env, redirects, CSP), draft/disable-draft routes | [platform.md](platform.md) |
| GTM, data layer / `trackEvent` | [integrations.md](integrations.md) |
| RSS helpers, sitemap output, `robots`, OG/Twitter metadata | [distribution.md](distribution.md) |
| Jotai atoms, `src/utils` map, `src/lib`, constants | [source-layout.md](source-layout.md) |

## Outside this folder

| Task | Location |
|------|----------|
| Install tools, first run, env / Vercel | Repo root **[README.md](../../README.md)** |
| Agent defaults, handbook sync | **[AGENTS.md](../../AGENTS.md)**; Cursor **[`.cursor/rules/delmarva-site-handbook.mdc`](../../.cursor/rules/delmarva-site-handbook.mdc)** |
| Per-hook notes | **[src/hooks/README.md](../../src/hooks/README.md)** |
| Resend email templates | **[src/lib/README.md](../../src/lib/README.md)** |

## Suggested instruction blurb (copy-paste)

```text
Before substantive edits, read docs/handbook/README.md and the chapter that matches the task (see docs/handbook/llms.md for a task→chapter map). When your change affects behavior, setup, or how features should be built, update the relevant docs/handbook/*.md in the same PR or an immediate follow-up so the handbook stays accurate.
```
