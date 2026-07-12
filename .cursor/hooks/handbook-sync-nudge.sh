#!/usr/bin/env bash
set -euo pipefail

# postToolUse (Write|StrReplace): remind to update the matching handbook chapter.

source "$(dirname "$0")/_lib.sh"
hook_input

file="$(tool_file_path)"

chapter=""
case "$file" in
  *.spec.ts | *.spec.tsx | *.test.ts | *.test.tsx)
    chapter="conventions.md#testing (Jest, Testing Library, page objects)" ;;
  *.module.css | */src/styles/* | src/styles/*)
    chapter="conventions.md (CSS Modules: mobile-first base + nested @media)" ;;
  */src/app/api/* | src/app/api/*)
    chapter="patterns.md or integrations.md (API routes, Resend, spam protection)" ;;
  */src/app/* | src/app/*)
    chapter="patterns.md (App Router pages, metadata, layouts, next-intl)" ;;
  */src/components/* | src/components/* | */src/ui/* | src/ui/*)
    chapter="components.md (folder layout, dynamic imports, CMS wiring)" ;;
  */src/contentful/* | src/contentful/*)
    chapter="contentful.md (types, parsers, getters, ContentRenderer registry)" ;;
  */src/hooks/* | src/hooks/*)
    chapter="patterns.md (mutation hooks, React Query)" ;;
  */src/lib/* | src/lib/* | */src/utils/* | src/utils/* | */src/i18n/* | src/i18n/*)
    chapter="source-layout.md or patterns.md (utils, lib, i18n)" ;;
  */next.config.ts | next.config.ts)
    chapter="platform.md (env vars, redirects, CSP, images.remotePatterns)" ;;
  *)
    exit 0 ;;
esac

ctx="Handbook-sync check: you just edited $file. If this change shifts documented behavior or conventions, update docs/handbook/$chapter in the same change so the handbook stays accurate."

advise_context "$ctx"
exit 0
