import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3100);

// Optional: use a Chromium that is already installed instead of the one bundled with Playwright.
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const chromiumLaunch = executablePath ? { executablePath } : {};

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  // Chromium runs in light and dark mode. Firefox and WebKit (the Safari engine, used by
  // VoiceOver on macOS and iOS) run in light mode. Pick with --project; CI runs one browser per job.
  projects: [
    { name: "chromium-light", use: { ...devices["Desktop Chrome"], colorScheme: "light", launchOptions: chromiumLaunch } },
    { name: "chromium-dark", use: { ...devices["Desktop Chrome"], colorScheme: "dark", launchOptions: chromiumLaunch } },
    { name: "firefox", use: { ...devices["Desktop Firefox"], colorScheme: "light" } },
    { name: "webkit", use: { ...devices["Desktop Safari"], colorScheme: "light" } },
  ],
  webServer: {
    // `pnpm build` must run first (CI does it). Locally: pnpm --filter www build && pnpm test:e2e
    command: `pnpm exec next start -p ${PORT}`,
    url: `http://localhost:${PORT}/test/dialog`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
