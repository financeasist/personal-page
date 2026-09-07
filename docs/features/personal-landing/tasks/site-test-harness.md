---
id: T1
title: "Set up the site test harness (unit/component + build-output tiers)"
layer: tests
deps: []
blocks: ["T2", "T3", "T5", "T6", "T7", "T8", "T9"]
acs: []
files_hint: ["site/package.json", "site/vitest.config.ts", "site/test/", "site/src/lib/__tests__/"]
owner: "Roman"
estimate: "S"
context_budget: "S"
status: "todo"
---

<!-- Inline the slice the task needs, name where it came from, keep the link as fallback. -->

# T1 — Set up the site test harness

## Place in the sequence

- **Blocked by:** — · **Blocks:** every code task (T2 schema, T3 helper, T5 shell, T6 Header, T7 Hero, T8 About, T9 assembly) — TDD (`tdd: true`) needs a runner before RED. · **Wave:** 1.
- **Lane:** shares `site/package.json` with T3 and T10 — serialized. Own test tree otherwise.

## Why (user story)

> **As** Roman
> **I want** the build to fail when the Profile content is missing an above-the-fold essential
> **So that** I never publish a page with a blank headline or a missing contact channel.
>
> — `spec.md §4, US-08, verbatim` · full text: [spec.md](../spec.md)

This task delivers none of US-08's behaviour directly — it stands up the test tiers every
later task's RED step and Definition of Done depend on.

## Inlined context

> `target_surfaces: [web-frontend]` (sad.md) → the frontend tiers apply: **component** (a UI
> component exercised in isolation), **visual-regression** (rendered UI diffed against a
> baseline), **e2e-through-UI** (the flow driven through the built page). There is no datastore
> and no API … "integration" here means a test against the **real Astro build pipeline**
> (`astro:content` + the Zod schema + its `.refine()` invariants + the `postbuild` step), not a
> mock. Test *tools* are not named — `implement` detects what the repo already uses and picks the
> unit/component runner, the browser-driver and the visual-diff tool.
>
> — `spec.md §Test plan (preamble), abridged` · full text: [spec.md](../spec.md)

> **Every PR (fast):** unit (schema + `cv-filename` helper), component, and the build-output
> inspection integration tests (`astro build` against fixtures + the zero-JS + `dist/` exposure
> assertions). **Every PR (heavier, still gating):** e2e-through-UI and visual-regression against
> the `validProfile()` build.
>
> — `spec.md §Test plan › CI placement, abridged` · full text: [spec.md](../spec.md)

> **Hard rule:** Node 20+. Commands: `npm --prefix site run build` / `test` / `lint`
> (`lint` = `astro check`). Hand-rolled `.astro` components; no component kit.
>
> — `CLAUDE.md §site, verbatim` · full text: [CLAUDE.md](../../../CLAUDE.md)

Nothing under `site/` runs tests today — `package.json` has `dev/build/postbuild/preview/check/lint`
only. Astro is a Vite project, so **Vitest** is the natural unit/component runner (`getViteConfig`
from `astro/config` wires `astro:content` mocking); the browser tier (e2e-through-UI +
visual-regression) uses **Playwright** — already a `devDependency` (`playwright ^1.55`) — driving a
`astro preview` / static `dist/` server. Pick the concrete tools here; every later task's tests
follow this choice.

**Fallback:** if `getViteConfig` / `astro:content` mocking fights the setup, a plain Vitest config
plus a thin fixture loader is acceptable — the requirement is *a runner the later tasks can target*,
not a specific integration depth. Read [spec.md](../spec.md) §Test plan in full.

## Data delta

No DB changes.

## API contract

Internal — no API surface.

## Acceptance criteria

None — this task carries no spec §5 acceptance criterion. Its correctness is the Definition of
Done below (a runnable, green harness the dependent tasks build on).

## Checklist

- [ ] Add the unit/component runner + config — `site/vitest.config.ts` (via `getViteConfig`), `test` + `test:watch` scripts in `site/package.json`.
- [ ] Add the browser tier config — `site/playwright.config.ts` driving `dist/` (built by `astro build`) at the two reference viewports 1280×800 / 390×844; a `test:e2e` script.
- [ ] Decide + wire the visual-diff tool (Playwright's built-in `toHaveScreenshot` is the low-friction default); a `test:visual` script; document where baselines are committed.
- [ ] Add a `site/test/fixtures/` module stub for the `data-model.md` §Test fixtures factories (`validProfile()` + the invalid/edge variants) — signatures only; later tasks fill the bodies they need. PII guard: `example.test`, never Roman's real details, in invalid fixtures.
- [ ] One smoke test per tier that asserts something real (e.g. `validProfile()` parses against the current schema) so `npm --prefix site test` exits green.

## Edge cases

| Case | Behaviour |
|---|---|
| `astro:content` virtual module not resolvable under Vitest | use `getViteConfig` from `astro/config`; if still failing, mock the collection loader in `site/test/setup.ts` |
| Playwright browsers not installed in a fresh checkout | `test:e2e` script (or a `pretest:e2e`) runs `playwright install chromium`; documented in the task's PR notes |

## Definition of Done

- [ ] `npm --prefix site test` runs and is green (unit/component tier).
- [ ] `npm --prefix site run test:e2e` runs against a real `astro build` output and is green.
- [ ] The fixture module exports the `data-model.md` §Test fixtures factory names (stubs OK).
- [ ] `npm --prefix site run check` and `lint` still pass.
- [ ] Zero production-code change — only test infra + `package.json` scripts + dev deps.
