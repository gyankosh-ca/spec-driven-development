#!/usr/bin/env bash
# Proves this checkpoint works. CI runs it on main and on every edN/step-* branch,
# so a broken checkpoint is caught before a student opens it.
set -euo pipefail
export PATH="$HOME/.local/bin:$PATH"

node --version
specify --help > /dev/null && echo "specify: ok"

# From step 5 on, the app exists and its tests must pass.
if [ -f package.json ]; then
  npm ci
  npm test
fi
