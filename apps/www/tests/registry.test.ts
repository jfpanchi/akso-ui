import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { buildCssVars } from "../scripts/sync-registry-tokens";

const root = resolve(import.meta.dirname, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

describe("registry", () => {
  const registry = JSON.parse(read("registry.json"));

  it("uses the tokens verified in packages/core (run `pnpm --filter www registry:sync`)", () => {
    for (const item of registry.items) {
      if (item.cssVars) expect(item.cssVars, item.name).toEqual(buildCssVars());
    }
  });

  it("public/r is up to date (run `pnpm --filter www registry:build`)", () => {
    for (const item of registry.items) {
      const built = JSON.parse(read(`public/r/${item.name}.json`));
      for (const file of item.files ?? []) {
        const builtFile = built.files.find((f: { path: string }) => f.path === file.path);
        expect(builtFile?.content, file.path).toBe(read(file.path));
      }
      expect(built.cssVars ?? {}, item.name).toEqual(item.cssVars ?? {});
    }
  });

  it("never uses the old @base-ui-components package name", () => {
    expect(read("registry/akso/dialog/dialog.tsx")).not.toContain("@base-ui-components");
    expect(JSON.stringify(registry)).not.toContain("@base-ui-components");
  });
});
