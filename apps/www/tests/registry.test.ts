import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { buildCssVars, REGISTRY_BASE_URL } from "../scripts/sync-registry-tokens";

const root = resolve(import.meta.dirname, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

interface RegistryItem {
  name: string;
  type: string;
  files?: { path: string; type: string }[];
  cssVars?: unknown;
  registryDependencies?: string[];
}

describe("registry", () => {
  const registry: { items: RegistryItem[] } = JSON.parse(read("registry.json"));
  const names = new Set(registry.items.map((item) => item.name));

  it("uses the tokens verified in packages/core (run `pnpm --filter www registry:sync`)", () => {
    const withVars = registry.items.filter((item) => item.cssVars);
    expect(withVars.map((item) => item.name)).toEqual(["akso-tokens"]);
    expect(withVars[0]?.cssVars).toEqual(buildCssVars());
  });

  it("public/r is up to date (run `pnpm --filter www registry:build`)", () => {
    for (const item of registry.items) {
      const built = JSON.parse(read(`public/r/${item.name}.json`));
      for (const file of item.files ?? []) {
        const builtFile = built.files.find((f: { path: string }) => f.path === file.path);
        expect(builtFile?.content, file.path).toBe(read(file.path));
      }
      expect(built.cssVars ?? {}, item.name).toEqual(item.cssVars ?? {});
      expect(built.registryDependencies ?? [], item.name).toEqual(item.registryDependencies ?? []);
    }
  });

  it("references Akso items by full URL, never by bare name (bare names resolve to shadcn's own registry)", () => {
    for (const item of registry.items) {
      for (const dep of item.registryDependencies ?? []) {
        if (dep === "utils") continue; // shadcn's cn() helper, intentionally from the official registry
        expect(dep, `${item.name} → ${dep}`).toMatch(new RegExp(`^${REGISTRY_BASE_URL}/[a-z-]+\\.json$`));
        const target = dep.slice(REGISTRY_BASE_URL.length + 1, -".json".length);
        expect(names.has(target), `${item.name} depends on unknown item "${target}"`).toBe(true);
      }
    }
  });

  it("every ui item lives in registry/akso/ui so shadcn rewrites its imports to @/components/ui", () => {
    for (const item of registry.items.filter((i) => i.type === "registry:ui")) {
      for (const file of item.files ?? []) expect(file.path).toMatch(/^registry\/akso\/ui\/[a-z-]+\.tsx$/);
    }
  });

  it("every lib item lives in registry/akso/lib so shadcn installs it in lib/", () => {
    for (const item of registry.items.filter((i) => i.type === "registry:lib")) {
      for (const file of item.files ?? []) expect(file.path).toMatch(/^registry\/akso\/lib\/[a-z-]+\.ts$/);
    }
  });

  it("each registry import is declared as a dependency of the item", () => {
    for (const item of registry.items) {
      for (const file of item.files ?? []) {
        const imports = [...read(file.path).matchAll(/from "@\/registry\/akso\/(ui|lib)\/([a-z-]+)"/g)];
        for (const [, kind, name] of imports) {
          expect(kind === "ui" || kind === "lib", file.path).toBe(true);
          const dep = `${REGISTRY_BASE_URL}/${name}.json`;
          expect(item.registryDependencies ?? [], `${file.path} imports ${name}`).toContain(dep);
        }
      }
    }
  });

  it("components never import another component's file: shared code goes in registry/akso/lib", () => {
    // Projects often already have shadcn's components/ui/button.tsx; shadcn does not overwrite it by default.
    for (const item of registry.items.filter((i) => i.type === "registry:ui")) {
      for (const file of item.files ?? []) {
        expect(read(file.path), file.path).not.toMatch(/from "@\/registry\/akso\/ui\//);
      }
    }
  });

  it("never uses the old @base-ui-components package name", () => {
    for (const dir of ["registry/akso/ui", "registry/akso/lib"]) {
      for (const file of readdirSync(resolve(root, dir))) expect(read(`${dir}/${file}`), file).not.toContain("@base-ui-components");
    }
    expect(JSON.stringify(registry)).not.toContain("@base-ui-components");
  });
});
