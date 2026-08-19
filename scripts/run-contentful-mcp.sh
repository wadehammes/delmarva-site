#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT/.env.local"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing .env.local — run: vercel env pull" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN="${CONTENTFUL_CMA_TOKEN:?CONTENTFUL_CMA_TOKEN not set in .env.local}"
export SPACE_ID="${CONTENTFUL_SPACE_ID:?CONTENTFUL_SPACE_ID not set in .env.local}"
export ENVIRONMENT_ID="${CONTENTFUL_ENVIRONMENT_ID:-master}"
export CONTENTFUL_HOST="${CONTENTFUL_HOST:-api.contentful.com}"

exec npx -y @contentful/mcp-server
