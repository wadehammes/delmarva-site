# Agent instructions

Before **substantive** work in this repo—features, refactors, Contentful/CMS changes, patterns that touch pages/API/i18n, CI or env, analytics or tags—read **`docs/handbook/README.md`** and the handbook **chapter** that matches the task. Use **`docs/handbook/llms.md`** for a compact task→chapter map (helpful for routing or for pasting into other tools). **Cursor** applies **`.cursor/rules/delmarva-site-handbook.mdc`** automatically as a project rule.

Follow documented patterns.

**Keep the handbook accurate:** Whenever a change would make the handbook wrong or incomplete—new flows (CI, env, tags), moved files, component or convention changes, Contentful/parser patterns, or anything a future reader would be misled by—update the relevant **`docs/handbook/*.md`** in the **same PR** when practical, or in a small follow-up right away. Do not leave docs stale on purpose.

You can skip a full handbook pass for **narrow** edits (typos, single obvious lines, mechanical fixes) that do not change behavior or documented expectations.
