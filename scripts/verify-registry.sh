#!/usr/bin/env bash
# Verifies that Akso UI components install from the registry into a fresh
# Next.js + shadcn project, that the project builds, and that the installed
# components pass axe and keyboard checks.
#
# Items reference each other with their public GitHub URLs. This script serves a
# copy of apps/www/public/r with those URLs pointed at localhost, so it tests the
# files in your working tree, not what is on GitHub.
#
# Usage: scripts/verify-registry.sh [work-dir]
# Requires: pnpm registry:build. Uses the network to install npm packages.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORK="${1:-$(mktemp -d)}"
REGISTRY_PORT=3101
APP_PORT=3200
REGISTRY_URL="http://localhost:$REGISTRY_PORT/r"
PUBLIC_BASE=$(node -e "const s=require('fs').readFileSync('$ROOT/apps/www/lib/registry.ts','utf8');console.log(s.match(/\"(https:[^\"]+)\"/)[1])")
WWW_MODULES="$ROOT/apps/www/node_modules"
NEXT_VERSION=$(node -p "require('$WWW_MODULES/next/package.json').version")
SHADCN_VERSION=$(node -p "require('$WWW_MODULES/shadcn/package.json').version")
PW_VERSION=$(node -p "require('$WWW_MODULES/@playwright/test/package.json').version")
AXE_PW_VERSION=$(node -p "require('$WWW_MODULES/@axe-core/playwright/package.json').version")

# Servers run in their own process group (setsid) so cleanup also stops their children.
cleanup() {
  for pid in "${REGISTRY_PID:-}" "${APP_PID:-}"; do
    [ -n "$pid" ] && kill -- "-$pid" 2>/dev/null || true
  done
}
trap cleanup EXIT

echo "→ Serving apps/www/public/r on $REGISTRY_URL"
rm -rf "$WORK/registry" && mkdir -p "$WORK/registry/r"
for file in "$ROOT"/apps/www/public/r/*.json; do
  sed "s#$PUBLIC_BASE#$REGISTRY_URL#g" "$file" > "$WORK/registry/r/$(basename "$file")"
done
(exec setsid node "$ROOT/scripts/verify-registry/serve.mjs" "$WORK/registry" "$REGISTRY_PORT" >/dev/null 2>&1) &
REGISTRY_PID=$!
npx -y wait-on@8 -t 30000 "$REGISTRY_URL/dialog.json"

echo "→ Creating a test project in $WORK/consumer"
rm -rf "$WORK/consumer"
(cd "$WORK" && npx -y "create-next-app@$NEXT_VERSION" consumer --ts --tailwind --app --eslint --no-src-dir \
  --import-alias "@/*" --use-npm --turbopack --yes >/dev/null)
cd "$WORK/consumer"

fail() { echo "✗ $1"; exit 1; }

echo "→ shadcn init (installs shadcn's own components/ui/button.tsx, like most real projects)"
npx -y "shadcn@$SHADCN_VERSION" init -d --base base >/dev/null
SHADCN_BUTTON_SUM=$(sha1sum components/ui/button.tsx)

echo "→ add dialog: must bring lib/akso-styles.ts and the tokens, and leave the existing button alone"
npx -y "shadcn@$SHADCN_VERSION" add "$REGISTRY_URL/dialog.json" -y < /dev/null
test -f components/ui/dialog.tsx || fail "components/ui/dialog.tsx was not created"
test -f lib/akso-styles.ts || fail "lib/akso-styles.ts was not created"
grep -q '@/lib/akso-styles' components/ui/dialog.tsx || fail "dialog.tsx does not import @/lib/akso-styles"
[ "$(sha1sum components/ui/button.tsx)" = "$SHADCN_BUTTON_SUM" ] || fail "installing dialog changed the existing button.tsx"
grep -q '"@base-ui/react"' package.json || fail "@base-ui/react was not installed"
grep -q -- "--akso-focus-ring" app/globals.css || fail "Akso tokens were not added to globals.css"
echo "  ✓ dialog, lib/akso-styles.ts, @base-ui/react and tokens installed; existing button untouched"

echo "→ add button with --overwrite (replaces shadcn's button on purpose)"
npx -y "shadcn@$SHADCN_VERSION" add "$REGISTRY_URL/button.json" -y --overwrite < /dev/null
grep -q "Akso UI · Button" components/ui/button.tsx || fail "components/ui/button.tsx is not the Akso Button"
echo "  ✓ Akso button installed"

echo "→ add every other component in the registry"
OTHERS=$(node -e "
const r = require('$ROOT/apps/www/registry.json');
console.log(r.items.filter(i => i.type === 'registry:ui' && !['button', 'dialog'].includes(i.name)).map(i => '$REGISTRY_URL/' + i.name + '.json').join(' '));
")
# shellcheck disable=SC2086
npx -y "shadcn@$SHADCN_VERSION" add $OTHERS -y < /dev/null
for url in $OTHERS; do
  name=$(basename "$url" .json)
  test -f "components/ui/$name.tsx" || fail "components/ui/$name.tsx was not created"
done
if grep -rq '@/registry/' components lib; then fail "an installed file still imports @/registry/"; fi
echo "  ✓ $(echo "$OTHERS" | wc -w) more components installed; no file imports @/registry/"

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
