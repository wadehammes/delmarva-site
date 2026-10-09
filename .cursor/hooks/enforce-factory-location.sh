#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/_lib.sh"
hook_input

file="$(tool_file_path)"

case "$file" in
  *.factory.ts) ;;
  *) exit 0 ;;
esac

case "$file" in
  */src/tests/factories/* | src/tests/factories/*) exit 0 ;;
esac

base="$(basename "$file")"
reason="Blocked: factories live in src/tests/factories/, not next to the component. Create this as src/tests/factories/${base} (subclass BaseFactory, export a singleton). See docs/handbook/conventions.md (Test data and factories)."

deny_tool "$reason"
exit 0
