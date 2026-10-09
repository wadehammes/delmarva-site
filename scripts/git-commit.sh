#!/usr/bin/env bash
set -euo pipefail

exec git -c core.hooksPath=.githooks commit "$@"
