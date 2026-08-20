# Agent instructions

**Always** read the handbook before starting any work in this repo. Start with **`docs/handbook/README.md`**, use **`docs/handbook/llms.md`** to find the chapter that matches the task, and follow documented patterns there—including **`docs/handbook/conventions.md`** for TypeScript and React style. Do not write or change code until you have checked the relevant handbook chapter(s).

**Cursor** applies **`.cursor/rules/delmarva-site-handbook.mdc`** automatically as a project rule (when present).

**Keep the handbook accurate:** Whenever a change would make the handbook wrong or incomplete—new flows (CI, env, tags), moved files, component or convention changes, Contentful/parser patterns, or anything a future reader would be misled by—update the relevant **`docs/handbook/*.md`** in the **same PR** when practical, or in a small follow-up right away. Do not leave docs stale on purpose.

You can skip a full handbook pass only for **narrow** edits (typos, single obvious lines, mechanical fixes) that do not change behavior or documented expectations.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
