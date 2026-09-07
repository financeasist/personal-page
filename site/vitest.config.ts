import { defineConfig } from 'vitest/config';

// Unit + component + build-pipeline-integration tier.
//
// A plain Vitest config. Astro's `getViteConfig` throws during Vitest's config
// phase in this project, so `.astro` files are NOT transformed inside Vitest.
// Instead:
//   - unit tests  → plain TS (helpers, predicates, the exported Zod schema)
//   - component + integration tests → a REAL `astro build` against a fixture
//     profile in a temp root, asserting over the emitted `dist/` HTML
//     (test/helpers/build-fixture.ts). This is the integration strategy
//     spec.md §Test plan prescribes ("write the fixture profile into a
//     throwaway content location, run a scoped astro build, assert").
// The browser tiers (e2e-through-UI + visual-regression) run under Playwright —
// see playwright.config.ts.
export default defineConfig({
  test: {
    include: ['test/**/*.test.ts', 'src/**/*.test.ts', 'src/**/__tests__/**/*.test.ts'],
    exclude: ['e2e/**', 'node_modules/**', 'dist/**', 'test/helpers/**'],
    environment: 'node',
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
});
