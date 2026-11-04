/**
 * Shared Playwright `test`: page.goto() also waits until React has hydrated the page
 * (<html data-hydrated>, set by components/hydration-marker.tsx). Without this, slower
 * browsers (WebKit in CI) could type or click before React was listening.
 */
import { test as base } from "@playwright/test";

export const test = base.extend({
  page: async ({ page }, use) => {
    const goto = page.goto.bind(page);
    page.goto = async (url, options) => {
      const response = await goto(url, options);
      await page.locator("html[data-hydrated]").waitFor({ state: "attached" });
      return response;
    };
    await use(page);
  },
});

export { expect, type Locator, type Page } from "@playwright/test";
