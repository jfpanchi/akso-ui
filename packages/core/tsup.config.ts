import { defineConfig, type Options } from "tsup";

const shared: Options = {
  format: ["esm"],
  dts: { compilerOptions: { allowImportingTsExtensions: true, noEmit: false, emitDeclarationOnly: true } },
  sourcemap: true,
  external: ["react", "react-dom", "axe-core", "vitest-axe", "@testing-library/user-event"],
};

export default defineConfig([
  // React components use hooks and event handlers: mark the bundle as a client module for React Server Components.
  { ...shared, entry: { index: "src/index.ts" }, clean: true, banner: { js: '"use client";' } },
  // Framework-agnostic code, safe to import on the server.
  { ...shared, entry: { "tokens/index": "src/tokens/index.ts", "test/index": "src/test/index.ts" } },
]);
