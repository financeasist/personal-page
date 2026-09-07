import { defineConfig } from 'vitest/config';

// Unit + component + build-pipeline-integration tier.
//
// A plain Vitest config (not `astro/config`'s `getViteConfig`) — the Astro
// integration wrapper throws during Vitest's config load in this project (T1
// edge case: "if getViteConfig / astro:content mocking fights the setup, a plain
// Vitest config is acceptable"). Component tests render `.astro` files through
// Astro's Container API (`astro/container`), which needs no `astro:*` virtual
// modules resolved by Vite. Build-pipeline integration tests shell out to a real
// `astro build`. The browser tiers (e2e-through-UI + visual-regression) run
// under Playwright — see playwright.config.ts.
export default defineConfig({
  test: {
    include: ['test/**/*.test.ts', 'src/**/*.test.ts', 'src/**/__tests__/**/*.test.ts'],
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
    environment: 'node',
  },
});
