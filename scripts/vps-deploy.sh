#!/usr/bin/env bash
# Run on the VPS after `git pull` to rebuild and restart the app.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  echo "Missing .env in $ROOT — copy .env.example and configure secrets first." >&2
  exit 1
fi

echo "==> Installing dependencies"
npm ci

echo "==> Building Next.js (production)"
export NODE_ENV=production
npm run build

echo "==> Reloading PM2"
if pm2 describe academy-fullpotential >/dev/null 2>&1; then
  pm2 reload ecosystem.config.js --update-env
else
  pm2 start ecosystem.config.js
fi

pm2 save
echo "==> Deploy complete"
