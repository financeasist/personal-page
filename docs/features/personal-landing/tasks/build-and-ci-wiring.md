---
id: T10
title: "Build + CI wiring: drop Playwright/Chromium, gate the deploy path on check + invariant tests"
layer: wiring
deps: ["T4", "T9"]
blocks: []
acs: ["AC-05", "AC-06"]
files_hint: [".github/workflows/ci.yml", ".github/workflows/deploy.yml", "site/package.json", "site/astro.config.mjs"]
owner: "Roman"
estimate: "S"
context_budget: "S"
status: "todo"
---

<!-- Inline the slice the task needs, name where it came from, keep the link as fallback. -->

# T10 — Build + CI wiring

## Place in the sequence

- **Blocked by:** T4 — committed CV PDF + assertion (postbuild no longer generates), T9 — assembled page (there is something to build + test). · **Blocks:** —. · **Wave:** 5.
- **Lane:** shares `site/package.json` with T1 and T4 — serialized.

## Why (user story)

> **As** Roman
> **I want** the build to fail when the Profile content is missing an above-the-fold essential
> **So that** I never publish a page with a blank headline or a missing contact channel.
>
> — `spec.md §4, US-08, verbatim` · full text: [spec.md](../spec.md)

This task makes the deploy path (push to `main`) enforce the same content gate the PR path does,
and removes the now-dead Chromium install.

## Inlined context

> `astro check` (type-checking) and `astro` lint run as separate CI steps on pull requests only
> (`ci.yml`), not on the deploy path; **`tasks` should add `npm run check` + the invariant unit
> tests to `deploy.yml`** so a direct push to `main` is also type-gated.
>
> — `sad.md §7, verbatim` · full text: [sad.md](../sad.md)

> Lighthouse checks (and `astro check` on the deploy path) are manual / PR-only … `tasks` adds
> `npm run check` + invariant unit tests to `deploy.yml`.
>
> — `sad.md §11, risk row, verbatim` · full text: [sad.md](../sad.md)

> No Chromium/Playwright on the `site` CI + deploy path for v1 — the `npx playwright install
> --with-deps chromium` steps and the `postbuild` PDF generation come out, so both jobs get
> faster and smaller.
>
> — `adr/0008 §Consequences (Positive), verbatim` · full text: [adr/0008](../adr/0008-cv-delivery-is-a-committed-static-pdf-in-v1.md)

> Wiring Lighthouse CI and an `astro check` step onto the `deploy.yml` push path is a `tasks`
> follow-up (sad.md §7, §11). **Pre-launch, manual (not CI in v1):** the Lighthouse mobile audit
> … the page-vs-committed-CV parity check.
>
> — `spec.md §Test plan › CI placement, abridged` · full text: [spec.md](../spec.md)

Current `ci.yml` (site job): `npm ci` → `npx playwright install --with-deps chromium` →
`npm run check` → `npm run build`. Current `deploy.yml` (site job): `npm ci` → `npx playwright
install …` → `npm run build` → upload/deploy. `astro.config.mjs` has a `// site / base … once the
Pages URL is known` TODO.

**Fallback:** if the GitHub Pages URL / base path isn't known, leave `astro.config.mjs` as-is and
record it as a launch-checklist item — do not block the CI change on it. Read [sad.md](../sad.md)
§7 in full.

## Data delta

No DB changes.

## API contract

Internal — no API surface.

## Acceptance criteria

### AC-05 (US-08) — domain invariant (CI-enforcement half)

> **When** Roman or CI builds the site
> **Then** the build fails with a message naming the missing field, and the incomplete page is
> never published …
>
> — `spec.md §5, AC-05, abridged` · full text: [spec.md](../spec.md)

### AC-06 (US-07) — error (CI-enforcement half)

> **When** Roman builds or commits
> **Then** the build stops and reports which field is invalid and why, and nothing is published
> until it is corrected.
>
> — `spec.md §5, AC-06, abridged` · full text: [spec.md](../spec.md)

_This task's contribution: the deploy path (push to `main`), not only the PR path, runs
`npm run check` + the invariant tests before it publishes._

## Checklist

- [ ] `.github/workflows/ci.yml` (site job) — remove `npx playwright install --with-deps chromium`; add `npm test` (unit + integration invariant tests) between `check` and `build`.
- [ ] `.github/workflows/deploy.yml` (site job) — remove `npx playwright install …`; add `npm run check` and `npm test` before `npm run build`.
- [ ] `site/package.json` — confirm `postbuild` = the T4 assertion script (no Playwright); keep `playwright` as a devDependency (roadmap step 4 re-wires `generate-pdf.mjs`), or drop it — coordinate with Roman.
- [ ] `site/astro.config.mjs` — set `site` (and `base` if a project page) once the Pages URL is confirmed; else leave a `TODO` + launch-checklist note.

## Edge cases

| Case | Behaviour |
|---|---|
| a content invariant is violated on a direct push to `main` | `deploy.yml` fails at `check` / `test` — nothing deploys (AC-05/06) |
| Chromium not installed on the runner | fine — nothing uses it any more |
| `npm test` has no e2e browser on the deploy runner | deploy job runs unit + integration only; e2e/visual stay on the PR job (spec §Test plan CI placement) |

## Definition of Done

- [ ] `ci.yml` and `deploy.yml` site jobs have no `playwright install` step.
- [ ] `deploy.yml` runs `npm run check` + `npm test` before `build`.
- [ ] A dry-run (or `act` / branch push) shows a deliberately-broken `roman.json` fails the deploy job with the field named.
- [ ] `npm --prefix site run build` still green locally.
- [ ] Every Hard Rule inlined above still holds.
