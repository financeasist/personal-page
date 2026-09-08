# Launch checklist — personal-landing

Run before each release. The automated gates (content completeness, client-JS
budget — ≤ 1 KB / one inline PE script / no bundle / no island per ADR-0009, CV
PDF exists) are enforced by CI (`npm run check` + `npm test` + `npm run build`
on both the PR and the deploy path). The rows below are **manual** and a miss
**blocks the launch** until fixed or waived in writing here (spec.md §6).

**Tracked on GitHub:** DNS + Pages custom domain → [#16](https://github.com/financeasist/personal-page/issues/16); the recurring manual gates (Lighthouse, Linux visual baselines) → [#17](https://github.com/financeasist/personal-page/issues/17).

## One-time / config

- [x] **`site/astro.config.mjs`** — `site: 'https://romanhrupskyi.com'`, no
      `base` (custom apex domain, served from root). `site/public/CNAME` pins the
      domain for GitHub Pages.
- [ ] **DNS + Pages custom domain** — at the registrar for `romanhrupskyi.com`:
      apex `A` records → `185.199.108.153` / `.109.153` / `.110.153` / `.111.153`
      (and `AAAA` → `2606:50c0:8000::153` … `8003::153`), plus `CNAME` on `www`
      → `financeasist.github.io`. Then repo Settings → Pages → Custom domain =
      `romanhrupskyi.com`, wait for the DNS check, tick **Enforce HTTPS**.
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
