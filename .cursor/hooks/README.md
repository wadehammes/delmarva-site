# Cursor hooks

Project hooks that keep agent work aligned with `docs/handbook/`. Adapted from [filtermydiscogs `.cursor/`](https://github.com/rhythmengineering/filtermydiscogs/tree/main/.cursor) for Cursor's hook format.

Config: [`.cursor/hooks.json`](../hooks.json). Scripts: [`.cursor/hooks/`](./).

Shared team files under `.cursor/` are tracked in git (`hooks.json`, `hooks/`, `rules/`). Local/runtime Cursor state (`mcp.json`, `*.log`, `settings.local.json`, checkpoints, etc.) stays gitignored — see root [`.gitignore`](../../.gitignore).

## Cursor hook events

| Event | Role in this repo |
|-------|-------------------|
| `sessionStart` | One-line handbook pointer (`session-handbook-routing.sh`) |
| `preToolUse` | Blocking guardrails (CSS, factories, query-hook mocks, …) |
| `postToolUse` | Advisory checks (e.g. CSS nesting depth) |
| `beforeShellExecution` | Git safety (destructive git, raw `git commit`) |
| `stop` | Drift checks, handbook test rules Jest, `pnpm lint:all` follow-ups |

## Hooks

| Script | Event | What it does |
|--------|-------|--------------|
| `session-handbook-routing.sh` | `sessionStart` | One-line pointer to `docs/handbook/` and `llms.md` (does not inject the full routing table). |
| `block-co-authored-by-commit.sh` | `beforeShellExecution` (`git commit`) | Denies raw `git commit` (agents must use `scripts/git-commit.sh` or `git -c core.hooksPath=.githooks commit`) and blocks `Co-authored-by` in the command string. |
| `block-destructive-git.sh` | `beforeShellExecution` (`git push`, `git reset`, `git clean`) | Denies force push to **`main`** / **`staging`**, **`git reset --hard`**, and **`git clean -f…`**. |
| `block-added-comments.sh` | `preToolUse` | Denies edits that add code comments. |
| `block-toplevel-media.sh` | `preToolUse` | Denies top-level `@media` in CSS — nest inside selectors. |
| `block-custom-media.sh` | `preToolUse` | Denies `@custom-media` / `@media (--var)` — use range syntax. |
| `block-margin-top.sh` | `preToolUse` | Denies `margin-top` in CSS (use flex `gap`); ignores `margin-top: 0` and `scroll-margin-top`. |
| `block-placeholder-names.sh` | `preToolUse` | Denies generic placeholder names (`raw`, `tmp`, `val`, `foo`, etc.) in TS/TSX bindings and params. |
| `enforce-component-template.sh` | `preToolUse` (`Write`) | Steers new components through copying an existing sibling folder. |
| `block-barrel-files.sh` | `preToolUse` (`Write`) | Denies new `index.ts`/`index.tsx` barrels under `src/` (except generated Contentful types). |
| `enforce-factory-location.sh` | `preToolUse` (`Write`) | Denies `*.factory.ts` outside `src/tests/factories/`. |
| `block-query-hook-mocks.sh` | `preToolUse` | Denies specs under `src/hooks/queries/` or `src/hooks/mutations/`, and feature-test edits that mock those hooks instead of `src/api/urls` (including `.po.tsx`). |
| `handbook-sync-nudge.sh` | *(off)* | Per-edit docs reminder — **not wired** in `hooks.json` (too noisy during coding). Script kept for optional re-enable. |
| `check-css-nesting.sh` | `postToolUse` | Advisory when CSS nests selectors 4+ levels deep. |
| `handbook-drift-check.sh` | `stop` | One follow-up if **`src/`** or test infra changed without a handbook update, and/or setup surfaces changed without **README.md**. |
| `handbook-test-drift-check.sh` | `stop` | Runs handbook testing rule Jest tests (`handbookTestRules.spec.ts`) when feature test files changed. |
| `lint-all-check.sh` | `stop` | Runs **`pnpm lint:all`** when the session changed meaningful source and follow up once on failure. |

## Git commits (agents)

Use **`scripts/git-commit.sh`** or **`git -c core.hooksPath=.githooks commit`** so [`.githooks/commit-msg`](../../.githooks/commit-msg) rejects `Co-authored-by` trailers.

## Requirements

- `bash`, `jq`, `git` on `PATH`
- Hook scripts must be executable (`chmod +x .cursor/hooks/*.sh`)

## Adding or changing a hook

1. Add or edit a script under `.cursor/hooks/` (read JSON from **stdin**; use `_lib.sh` helpers).
2. Wire it in `.cursor/hooks.json` with the right event and matcher.
3. `chmod +x` the script and document it in the table above.
4. Blocking hooks return `{ "permission": "deny", ... }` on `preToolUse`; advisory hooks return `{ "additional_context": "..." }` on `postToolUse`; `stop` uses `{ "followup_message": "..." }`.

Debug via Cursor **Settings → Hooks** or the **Hooks** output channel. Reload happens on `hooks.json` save; restart Cursor if hooks do not pick up.
