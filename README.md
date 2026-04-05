# Delmarva Site Development

Marketing site powered by Next.js, TypeScript, and CSS Modules, using Contentful as the CMS.

## Prerequisites / recommendations

- [Install Zsh](https://github.com/ohmyzsh/ohmyzsh/wiki/Installing-ZSH#how-to-install-zsh-on-many-platforms)
- [Oh My Zsh](https://ohmyz.sh/) (themes and plugins)

## Development setup

- Install [asdf](https://asdf-vm.com/guide/getting-started.html) (see [`.tool-versions`](./.tool-versions) for plugins and versions).

Run asdf:

```bash
asdf install
```

Install dependencies:

```bash
pnpm install
```

### Download env vars

Install the [Vercel CLI](https://vercel.com/cli):

```bash
pnpm add -g vercel
```

Then:

```bash
vercel link
```

Complete the prompts (authenticate, then link this repository to the **Delmarva Site** Vercel project). If you need access to the team project, ask whoever administers Vercel for your org.

Pull environment variables:

```bash
vercel env pull
```

Run the dev server:

```bash
pnpm dev
```

The app serves at **http://localhost:5656** (see [`package.json`](./package.json)). Draft / preview content uses Next.js **draft mode** and Contentful preview keys—see [docs/handbook/platform.md](./docs/handbook/platform.md).

## Development and deployment

Deployments are handled on **Vercel**. Pull requests typically get preview deployments; production follows your team’s release process.

### Default branch is `staging`

Develop on feature / chore / bug branches from **`staging`**. Merge PRs into **`staging`** for integration; use tags for production releases as below.

To cut a production release, create a **semver** tag after the latest (tags look like **`vX.Y.Z`**—check [Releases](https://github.com/wadehammes/delmarva-site/releases) or run `git tag`). That should trigger automation in [Actions](https://github.com/wadehammes/delmarva-site/actions) according to your workflow.

Steps:

1. Check out **`staging`** and pull the latest changes.
2. From **`staging`**, run:

```bash
make release tag=vX.Y.Z
```

(`tag` must start with **`v`**; the [Makefile](./Makefile) enforces this.)

### New UI components

There is **no** `pnpm scaffold` script. Copy an existing component folder under `src/components` and adjust—see [docs/handbook/components.md](./docs/handbook/components.md).

### Adding new environment keys

**Vercel first:** Add variables in the Vercel project’s environment settings for each target (Preview, Production, Development) that needs them. Preview and production builds use Vercel’s env; they do not read committed `.env` files.

Then update the repo and local setup:

1. **[`next.config.ts`](./next.config.ts)** — add the key to the `env` block when it should be exposed to the client or match existing patterns.
2. **`.env.local`** — local values (not committed). After dashboard changes, run **`vercel env pull`** to refresh.

If the team maintains a sample env file elsewhere, keep it in sync; this repo does not ship a committed `.env.sample` today.

### Managing package updates

1. Branch: `git checkout -b package-updates-$(date +%Y-%m-%d)` (or similar).
2. Run `pnpm up --L --i`.
3. Select packages to upgrade (space to toggle, arrows to move).
4. Commit, push, open a PR, and run CI / preview as usual.

### Testing

Tests use Jest with shared helpers in [`src/tests/testUtils.tsx`](./src/tests/testUtils.tsx). Prefer the same patterns as nearby specs when adding coverage.

## Linting and formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting.

- Check the codebase:

  ```sh
  pnpm lint
  ```

- Apply safe fixes and format:

  ```sh
  pnpm lint:write
  ```

## Delmarva Site handbook

The handbook under [`docs/handbook/`](./docs/handbook/) is the canonical place for structure, conventions, Contentful usage, and platform details. Update it when behavior or layout changes so the next reader (human or tool) is not misled.

**Entry point:** [`docs/handbook/README.md`](./docs/handbook/README.md)

**Agents:** [AGENTS.md](./AGENTS.md). In Cursor, project rules live under [`.cursor/rules/`](./.cursor/rules/). For other tools, use the task map in [`docs/handbook/llms.md`](./docs/handbook/llms.md).

### Suggested reading order

- **New to the project:** [architecture.md](./docs/handbook/architecture.md), then [conventions.md](./docs/handbook/conventions.md), then skim [patterns.md](./docs/handbook/patterns.md).
- **Adding or changing UI:** [components.md](./docs/handbook/components.md) and [conventions.md](./docs/handbook/conventions.md).
- **CMS (Contentful):** [contentful.md](./docs/handbook/contentful.md).
- **Pages, data fetching, or SEO:** [patterns.md](./docs/handbook/patterns.md) and the data-flow notes in [architecture.md](./docs/handbook/architecture.md).
- **CI, env, draft mode:** [platform.md](./docs/handbook/platform.md).
- **GTM and analytics helpers:** [integrations.md](./docs/handbook/integrations.md).
- **RSS, sitemaps, social metadata:** [distribution.md](./docs/handbook/distribution.md).
- **Jotai, hooks, `src/utils`, `src/lib`:** [source-layout.md](./docs/handbook/source-layout.md).

### What each document covers

| Document | Purpose |
|----------|---------|
| [**architecture.md**](./docs/handbook/architecture.md) | Stack, **directory map**, App Router layout, data flow (Contentful → parsers → Page / SectionRenderer / ContentRenderer). |
| [**conventions.md**](./docs/handbook/conventions.md) | **TypeScript**, **React**, **Biome**, **CSS Modules**, **testing**, **accessibility**. |
| [**contentful.md**](./docs/handbook/contentful.md) | **Generated types** (`pnpm types:contentful`), getters vs parsers, sections vs modules, **ContentRenderer**, Rich Text. |
| [**components.md**](./docs/handbook/components.md) | Component folders, registry / dynamic imports, READMEs, no scaffold script. |
| [**patterns.md**](./docs/handbook/patterns.md) | **App Router** pages, **`generateMetadata`**, caching, React Query mutations, **API** routes, **next-intl**, forms. |
| [**platform.md**](./docs/handbook/platform.md) | **GitHub CI** (`tsc`, Biome, Jest), **`pnpm` scripts**, **`next.config`** env and redirects, **CSP**, draft APIs. |
| [**integrations.md**](./docs/handbook/integrations.md) | **GTM**, **data layer** / `trackEvent`, Mapbox and reCAPTCHA env notes. |
| [**distribution.md**](./docs/handbook/distribution.md) | **RSS** and **sitemap** helpers, **robots**, Open Graph / Twitter metadata patterns. |
| [**source-layout.md**](./docs/handbook/source-layout.md) | **Jotai** atoms, **`src/utils`** module map, **`src/lib`**. |
| [**llms.md**](./docs/handbook/llms.md) | Task → chapter map and copy-paste blurb for agents. |

### Relationship to this README

This README focuses on **machine setup**, **release tagging**, env keys, package upgrades, and **Biome commands**. Deeper rules belong in the handbook; add a short pointer here and the full explanation under `docs/handbook/` when you document a new recurring workflow.

## Other resources

- [Next.js documentation](https://nextjs.org/docs)
- [Contentful documentation](https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/)
- [pnpm](https://pnpm.io/)
- [Scripts directory](./scripts/README.md)

## Component Documentation

- [Scripts Directory](scripts/README.md)
- [Accordion Component](src/components/Accordion/README.md)
- [AreasServicedMap Component](src/components/AreasServicedMap/README.md)
- [Button Component](src/components/Button/README.md)
- [CTA Component](src/components/CTA/README.md)
- [Carousel Component](src/components/Carousel/README.md)
- [ContentCarousel Component](src/components/ContentCarousel/README.md)
- [CopyBlock Component](src/components/ContentCopyBlock/README.md)
- [ContentHero Component](src/components/ContentHero/README.md)
- [ContentRenderer Component](src/components/ContentRenderer/README.md)
- [ContentfulAssetRenderer Component](src/components/ContentfulAssetRenderer/README.md)
- [DeployButton Component](src/components/DeployButton/README.md)
- [DeployPage Component](src/components/DeployPage/README.md)
- [ExitDraftModeLink Component](src/components/ExitDraftModeLink/README.md)
- [Input Component](src/components/Input/README.md)
- [Link Component](src/components/Link/README.md)
- [LocaleSwitcherSelect Component](src/components/LocaleSwitcherSelect/README.md)
- [Modal Components](src/components/Modal/README.md)
- [Navigation Component](src/components/Navigation/README.md)
- [NotFoundPage Component](src/components/NotFoundPage/README.md)
- [Page Component](src/components/Page/README.md)
- [PageLayout Component](src/components/PageLayout/README.md)
- [ProjectCard Component](src/components/ProjectCard/README.md)
- [ProjectCoverflowCarousel Component](src/components/ProjectCoverflowCarousel/README.md)
- [ProjectModal Component](src/components/ProjectModal/README.md)
- [RichText Component](src/components/RichText/README.md)
- [Section Component](src/components/Section/README.md)
- [SectionRenderer Component](src/components/SectionRenderer/README.md)
- [ServiceAccordion Component](src/components/ServiceAccordion/README.md)
- [Stat Component](src/components/Stat/README.md)
- [VideoPlayer Component](src/components/VideoPlayer/README.md)
- [Hooks](src/hooks/README.md)
- [Resend Email Templates](src/lib/README.md)
- [UI Button Component](src/ui/Button/README.md)
- [UI TextArea Component](src/ui/TextArea/README.md)
- [UI TextField Component](src/ui/TextField/README.md)
