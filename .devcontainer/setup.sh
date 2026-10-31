#!/usr/bin/env bash
# Runs once when the codespace is built. Install what this course needs, and nothing else.
set -euo pipefail
cp -n .setup/.env.example .env 2>/dev/null || true

curl -LsSf https://astral.sh/uv/install.sh | sh
export PATH="$HOME/.local/bin:$PATH"
uv tool install specify-cli

if [ -f package.json ]; then npm ci; fi
