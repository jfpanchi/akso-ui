import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3100);

// Optional: use a Chromium that is already installed instead of the one bundled with Playwright.
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    launchOptions: executablePath ? { executablePath } : {},
  },
  projects: [
    { name: "chromium-light", use: { ...devices["Desktop Chrome"], colorScheme: "light" } },
    { name: "chromium-dark", use: { ...devices["Desktop Chrome"], colorScheme: "dark" } },
  ],
  webServer: {
    // `pnpm build` must run first (CI does it). Locally: pnpm --filter www build && pnpm test:e2e
    command: `pnpm exec next start -p ${PORT}`,
    url: `http://localhost:${PORT}/test/dialog`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
