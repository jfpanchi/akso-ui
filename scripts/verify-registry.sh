#!/usr/bin/env bash
# Verifies that the Dialog can be installed from the local registry into a fresh
# Next.js + shadcn project, that the project builds, and that the installed
# component passes axe and keyboard checks.
#
# Usage: scripts/verify-registry.sh [work-dir]
# Requires: apps/www built (pnpm --filter www build). Uses the network to install npm packages.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORK="${1:-$(mktemp -d)}"
REGISTRY_PORT=3100
APP_PORT=3200
NEXT_VERSION=$(node -p "require('$ROOT/apps/www/node_modules/next/package.json').version")
SHADCN_VERSION=$(node -p "require('$ROOT/apps/www/node_modules/shadcn/package.json').version")
PW_VERSION=$(node -p "require('$ROOT/apps/www/node_modules/@playwright/test/package.json').version")
AXE_PW_VERSION=$(node -p "require('$ROOT/apps/www/node_modules/@axe-core/playwright/package.json').version")

# Servers run in their own process group (setsid) so cleanup also stops next-server children.
cleanup() {
  for pid in "${REGISTRY_PID:-}" "${APP_PID:-}"; do
    [ -n "$pid" ] && kill -- "-$pid" 2>/dev/null || true
  done
}
trap cleanup EXIT

echo "→ Serving the registry on :$REGISTRY_PORT"
(cd "$ROOT/apps/www" && exec setsid pnpm exec next start -p "$REGISTRY_PORT" >/dev/null 2>&1) &
REGISTRY_PID=$!
npx -y wait-on@8 -t 60000 "http://localhost:$REGISTRY_PORT/r/dialog.json"

echo "→ Creating a test project in $WORK/consumer"
rm -rf "$WORK/consumer"
(cd "$WORK" && npx -y "create-next-app@$NEXT_VERSION" consumer --ts --tailwind --app --eslint --no-src-dir \
  --import-alias "@/*" --use-npm --turbopack --yes >/dev/null)
cd "$WORK/consumer"

echo "→ shadcn init + add dialog from http://localhost:$REGISTRY_PORT/r/dialog.json"
npx -y "shadcn@$SHADCN_VERSION" init -d --base base >/dev/null
npx -y "shadcn@$SHADCN_VERSION" add "http://localhost:$REGISTRY_PORT/r/dialog.json" -y

test -f components/ui/dialog.tsx || { echo "components/ui/dialog.tsx was not created"; exit 1; }
grep -q '"@base-ui/react"' package.json || { echo "@base-ui/react was not installed"; exit 1; }
grep -q -- "--akso-focus-ring" app/globals.css || { echo "Akso tokens were not added to globals.css"; exit 1; }

echo "→ Building the test project"
cp "$ROOT/scripts/verify-registry/page.tsx" app/page.tsx
npm run build >/dev/null

echo "→ Running axe and keyboard checks"
npm install --no-save "@playwright/test@$PW_VERSION" "@axe-core/playwright@$AXE_PW_VERSION" >/dev/null
(exec setsid npx next start -p "$APP_PORT" >/dev/null 2>&1) &
APP_PID=$!
npx -y wait-on@8 -t 60000 "http://localhost:$APP_PORT"
cp "$ROOT/scripts/verify-registry/check.mjs" ./check.mjs
node check.mjs "http://localhost:$APP_PORT"
