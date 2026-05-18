#!/usr/bin/env bash
# Run on Linux/AWS from repo root for a clean, lockfile-faithful production build.
# Usage: bash scripts/aws-ci-build.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
rm -rf node_modules .next
npm ci
npm run build
