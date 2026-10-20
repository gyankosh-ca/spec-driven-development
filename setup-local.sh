#!/usr/bin/env bash
# Sets up this repo on your own Mac or Linux laptop, without Docker or Codespaces.
# Run from the repo folder:  bash setup-local.sh
# Safe to run again: anything already installed is left alone.
set -euo pipefail

export PATH="$HOME/.local/bin:$PATH"

node_major() { node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0; }

if [ "$(node_major)" -lt 24 ]; then
  echo "→ Installing Node.js 24 (through fnm, in your home folder)"
  curl -fsSL https://fnm.vercel.app/install | bash -s -- --skip-shell
  export PATH="$HOME/.local/share/fnm:$HOME/.fnm:$PATH"
  eval "$(fnm env)"
  fnm install 24 && fnm default 24 && fnm use 24
fi

if ! command -v uv > /dev/null; then
  echo "→ Installing uv"
  curl -LsSf https://astral.sh/uv/install.sh | sh
fi

echo "→ Installing Spec Kit (specify)"
uv tool install --upgrade --quiet specify-cli

if [ -f package.json ]; then
  echo "→ Installing the app's packages"
  npm install --no-fund --no-audit
fi

echo
echo "Ready. Node $(node --version), $(specify --version 2>/dev/null || echo 'specify installed')."
echo "Open a NEW terminal so the new commands are found, then follow STEPS.md."
