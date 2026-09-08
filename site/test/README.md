# site test harness

Three tiers (spec.md §Test plan):

| Tier | Runner | Command | Location |
|---|---|---|---|
| unit / component | Vitest | `npm --prefix site test` | `test/**/*.test.ts`, `src/**/__tests__/*.test.ts` |
| build-pipeline integration | Vitest (shells out to `astro build`) | `npm --prefix site test` | `test/build/*.test.ts` |
| e2e-through-UI + visual-regression | Playwright | `npm --prefix site run test:e2e` | `e2e/*.spec.ts` |

- **Component tests** render `.astro` files with Astro's Container API
  (`experimental_AstroContainer` from `astro/container`) and assert over the HTML
  string (parsed with `linkedom`). No `astro:*` virtual modules needed — that is
  why `vitest.config.ts` is a plain config, not `getViteConfig`.
- **e2e** runs against a real `astro build` served by `astro preview` — the
  Playwright `webServer` block builds it. Two projects: `laptop` (1280×800) and
  `phone` (390×844), the spec.md §6 reference viewports.
- **Visual baselines** are committed as `e2e/<spec>.spec.ts-snapshots/` next to
  each spec. Regenerate deliberately with `npx playwright test --update-snapshots`.
- **Browsers:** `npx playwright install chromium` in a fresh checkout (CI runs it
  on the PR job only — spec.md §Test plan › CI placement).
- **Fixtures:** `test/fixtures/profile.ts` — the `data-model.md` §Test fixtures
  factories. Invalid/edge fixtures use `example.test`, never real contact details.
