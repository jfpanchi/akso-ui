#!/usr/bin/env bash
# Creates a versioned registry release: a git tag (for example v0.1.0) whose
# registry files point to that same tag, so `npx shadcn add .../v0.1.0/.../dialog.json`
# also installs the Button and the tokens from v0.1.0, never from main.
#
# The tag points to a commit that is NOT on main: main keeps its URLs to main.
#
# Usage: scripts/release-registry.sh v0.1.0 [--push]
#   Without --push it only creates the tag locally, so you can inspect it.
set -euo pipefail

VERSION="${1:-}"
PUSH="${2:-}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

fail() { echo "✗ $*" >&2; exit 1; }

[[ "$VERSION" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]] || fail "Give a version like v0.1.0 (got '$VERSION')."
[ -z "$PUSH" ] || [ "$PUSH" = "--push" ] || fail "Unknown option: $PUSH"
[ -z "$(git status --porcelain)" ] || fail "The working tree has changes. Commit or stash them first."
if git rev-parse -q --verify "refs/tags/$VERSION" >/dev/null; then fail "Tag $VERSION already exists."; fi
if [ "$PUSH" = "--push" ] && git ls-remote --exit-code --tags origin "refs/tags/$VERSION" >/dev/null 2>&1; then
  fail "Tag $VERSION already exists on origin."
fi

MAIN_BASE="https://raw.githubusercontent.com/jfpanchi/akso-ui/main/apps/www/public/r"
TAG_BASE="https://raw.githubusercontent.com/jfpanchi/akso-ui/$VERSION/apps/www/public/r"
grep -q "\"$MAIN_BASE\"" apps/www/lib/registry.ts || fail "apps/www/lib/registry.ts does not point to main. Run this from main."

START="$(git rev-parse HEAD)"
START_REF="$(git symbolic-ref -q --short HEAD || git rev-parse HEAD)"
restore() { git checkout -q "$START_REF" 2>/dev/null || true; }
trap restore EXIT

echo "→ Building the registry for $VERSION from $(git rev-parse --short "$START")"
git checkout -q --detach "$START"
# Only the registry base URL changes: in lib/registry.ts and in registry.json.
sed -i "s#$MAIN_BASE#$TAG_BASE#g" apps/www/lib/registry.ts apps/www/registry.json
pnpm --silent build:core >/dev/null
pnpm --silent registry:build >/dev/null

echo "→ Checking that every link points to $VERSION"
if grep -rl "$MAIN_BASE" apps/www/public/r apps/www/registry.json apps/www/lib/registry.ts; then
  fail "The files above still point to main."
fi
grep -q "$TAG_BASE" apps/www/public/r/dialog.json || fail "dialog.json does not reference $VERSION."
pnpm --silent --filter www exec vitest run tests/registry.test.ts >/dev/null || fail "Registry tests failed."

git add apps/www/lib/registry.ts apps/www/registry.json apps/www/public/r
git -c user.name="${GIT_AUTHOR_NAME:-$(git config user.name || echo akso-release)}" \
    -c user.email="${GIT_AUTHOR_EMAIL:-$(git config user.email || echo akso-release@users.noreply.github.com)}" \
    commit -q -m "Registry $VERSION: links point to $VERSION"
git tag -a "$VERSION" -m "Akso UI registry $VERSION"
echo "  ✓ Tag $VERSION created on $(git rev-parse --short HEAD) (not on main)"

if [ "$PUSH" = "--push" ]; then
  git push -q origin "refs/tags/$VERSION"
  echo "  ✓ Pushed $VERSION"
else
  echo "Inspect it with: git show $VERSION --stat"
  echo "Push it with:    git push origin $VERSION"
fi
echo "Install from it: npx shadcn@latest add $TAG_BASE/dialog.json"
