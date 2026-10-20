#!/usr/bin/env bash
# Runs once when the codespace is built. Install what this course needs, and nothing else.
set -euo pipefail
cp -n .env.example .env 2>/dev/null || true
