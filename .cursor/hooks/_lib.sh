#!/usr/bin/env bash

hook_input() {
  INPUT="$(cat)"
}

project_dir() {
  local from_input
  from_input="$(printf '%s' "$INPUT" | jq -r '.cwd // empty')"
  if [ -n "$from_input" ]; then
    printf '%s' "$from_input"
  else
    pwd
  fi
}

tool_file_path() {
  printf '%s' "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // ""'
}

tool_added_text() {
  printf '%s' "$INPUT" | jq -r '
    [
      .tool_input.new_string?,
      .tool_input.content?,
      .tool_input.string?,
      (.tool_input.edits[]?.new_string)
    ]
    | map(select(. != null))
    | join("\n")
  '
}

abs_path() {
  local file="$1"
  local root
  root="$(project_dir)"
  case "$file" in
    /*) printf '%s' "$file" ;;
    *) printf '%s' "$root/$file" ;;
  esac
}

deny_tool() {
  local reason="$1"
  jq -n --arg r "$reason" '{
    permission: "deny",
    user_message: $r,
    agent_message: $r
  }'
}

advise_context() {
  local ctx="$1"
  jq -n --arg c "$ctx" '{ additional_context: $c }'
}

run_pnpm() {
  if [ -x "${HOME}/.local/bin/mise" ]; then
    "${HOME}/.local/bin/mise" exec -- pnpm "$@"
  elif command -v mise >/dev/null 2>&1; then
    mise exec -- pnpm "$@"
  elif command -v pnpm >/dev/null 2>&1; then
    command pnpm "$@"
  else
    return 127
  fi
}

handbook_chapters_for_path() {
  local file="$1"
  local chapters=()

  case "$file" in
    docs/handbook/*)
      return 0
      ;;
    .jest/*)
      chapters+=("conventions.md" "platform.md")
      ;;
    jest.config.ts | jest.config.js | jest.config.mjs)
      chapters+=("platform.md" "conventions.md")
      ;;
    next.config.ts | next.config.js | next.config.mjs)
      chapters+=("platform.md")
      ;;
    src/tests/factories/*)
      chapters+=("conventions.md")
      ;;
    *.spec.ts | *.spec.tsx | *.test.ts | *.test.tsx)
      chapters+=("conventions.md")
      ;;
    *.module.css)
      chapters+=("conventions.md")
      ;;
    src/contentful/*)
      chapters+=("contentful.md")
      ;;
    src/app/api/*)
      chapters+=("platform.md" "integrations.md")
      ;;
    src/app/*)
      chapters+=("patterns.md")
      ;;
    src/components/*)
      chapters+=("components.md")
      ;;
    src/hooks/* | src/atoms/*)
      chapters+=("patterns.md" "source-layout.md")
      ;;
    src/i18n/*)
      chapters+=("patterns.md")
      ;;
    src/lib/*)
      chapters+=("integrations.md" "distribution.md" "platform.md")
      ;;
  esac

  if [ "${#chapters[@]}" -eq 0 ]; then
    chapters+=("conventions.md")
  fi

  printf '%s\n' "${chapters[@]}" | awk '!seen[$0]++' | tr '\n' ' '
}
