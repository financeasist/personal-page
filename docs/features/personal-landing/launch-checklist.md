# Launch checklist — personal-landing

Run before each release. The automated gates (content completeness, client-JS
budget — ≤ 1 KB / one inline PE script / no bundle / no island per ADR-0009, CV
PDF exists) are enforced by CI (`npm run check` + `npm test` + `npm run build`
on both the PR and the deploy path). The rows below are **manual** and a miss
**blocks the launch** until fixed or waived in writing here (spec.md §6).

## One-time / config

- [ ] **`site/astro.config.mjs`** — set `site` (and `base` for a project page)
      to the confirmed GitHub Pages URL. Until then internal absolute links
      resolve at `/`. Header hrefs use `import.meta.env.BASE_URL`, so only the
      config changes.
- [ ] **Visual-regression baselines for CI** — `e2e/visual.spec.ts-snapshots/`
      holds macOS baselines. Generate Linux baselines once in a Playwright
      container (`mcr.microsoft.com/playwright`) and commit them, or keep
      visual-regression a local-only pre-merge step (spec.md §Test plan).

## Every release

- [ ] **Lighthouse mobile audit** (run manually): LCP ≤ 2.5 s · initial page
      weight ≤ 500 KB · Accessibility ≥ 95. A miss blocks launch (spec.md §6).
- [ ] **Manual keyboard pass** — every interactive element reachable and
      operable; visible focus ring; one `<h1>`.
- [ ] **Responsive check** at 360 / 768 / 1280 / 1920 px — no horizontal scroll;
      at 360 px the essentials may reflow below the fold, drop order
      Industries → Tagline → top-stack truncates.
- [ ] **Above-the-fold fit** at 1280×800 and 390×844 — every AC-01 essential
      visible without scrolling.
- [ ] **Page ↔ committed CV parity** (accepted v1 debt, spec.md §7/§8): the live
      page and `site/public/Roman-Hrupskyi-Senior-Java-Engineer-CV.pdf` agree on
      surname, headline and dates. Retire this row when the CV is generated from
      the profile content (roadmap step 4).

## Waivers

_None._
