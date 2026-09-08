---
id: T9
title: "Assemble index.astro from the components; source-exposure + zero-JS guarantees"
layer: ui
deps: ["T1", "T2", "T5", "T6", "T7", "T8"]
blocks: ["T10", "T11"]
acs: ["AC-01", "AC-02", "AC-07", "AC-08", "AC-10", "AC-13", "AC-14", "AC-15"]
files_hint: ["site/src/pages/index.astro"]
owner: "Roman"
estimate: "S"
context_budget: "M"
status: "todo"
---

<!-- Inline the slice the task needs, name where it came from, keep the link as fallback. -->

# T9 — Assemble index.astro

## Place in the sequence

- **Blocked by:** T5 — Layout/tokens, T6 — Header, T7 — Hero, T8 — About (+ T1 harness, T2 content). · **Blocks:** T10 — build + CI wiring, T11 — register components. · **Wave:** 4 (integration point).
- **Lane:** own file (`index.astro`).

## Why (user story)

> **As** Roman
> **I want** the page to render entirely from the Profile content entry
> **So that** a one-file edit and commit updates the live page — and the CV — with no code change.
>
> — `spec.md §4, US-07, verbatim` · full text: [spec.md](../spec.md)

This task wires the components into one page fed by the single `profile` entry, and enforces the
whole-page guarantees (one `<h1>`, semantic landmarks, nothing over-exposed in the delivered
source, 0 KB JS).

## Inlined context

> `index.astro` — the landing page — THIS feature. Layered … **content** (the typed entry +
> schema + invariants), **presentation** (page + hand-rolled components) … There is no
> domain/app/infra split — nothing runs at request time.
>
> — `sad.md §5, verbatim` · full text: [sad.md](../sad.md)

> Composition: fixed `Header` → `Hero` (photo + name + headline + optional tagline +
> `AvailabilityBlock` + optional Industries) → Top Stack line → `SCR-05` About me (grey) →
> `Footer` (flush to bottom). No routing; CSS-only in-page `#about` anchor.
>
> — `screens.md §Screens SCR-01, abridged` · full text: [screens.md](../screens.md)

> **Then** … no salary or rate expectation, no exact home address, no phone number, and none of
> the tracker's per-recruiter link labels appear anywhere in it, and Roman's email address and
> LinkedIn URL / handle are never rendered as visible text on the landing page … (Phone numbers
> are not on the landing page in any form in v1 — not as text, not in a link attribute …)
>
> — `spec.md §5, AC-07, verbatim` · full text: [spec.md](../spec.md)

> **Hard rule (NFR):** Client JavaScript shipped by this feature ≤ **1 KB** — one inline
> progressive-enhancement script (scroll-spy, **ADR-0009**), no JS bundle / framework island.
> _(Was "= 0 KB" before the 2026-09-07 polish pass.)_ Accessibility: Lighthouse ≥ 95; one
> `<h1>`; semantic landmarks; every interactive element keyboard-reachable.
>
> — `spec.md §6 NFR + sad.md §8 Accessibility row, abridged` · full text: [spec.md](../spec.md)

> **Hard rule:** the click-tracking beacon is roadmap step 8, **not this feature** — this feature
> only renders the actions and leaves stable `data-*` hooks. No `<script>`.
>
> — `spec.md §3 (non-goals), abridged` · full text: [spec.md](../spec.md)

Existing `site/src/pages/index.astro` is the scaffold stub (`getCollection('profile')` →
`profiles[0].data`) — replace its body wholesale. `contact.phones` must not be read anywhere on
this page.

**Fallback:** if a component contract turns out wrong at integration, fix it in that component's
file, not with page-level workarounds. Read [sad.md](../sad.md) §5–§6 in full.

## Data delta

No DB changes. `getCollection('profile')` → the one entry; passes slices to `Header` / `Hero` /
`AboutMe`. Reads no `contact.phones`.

## API contract

Internal — no API surface.

## Acceptance criteria

### AC-01 / AC-08 / AC-14 / AC-15 — as inlined in T6–T8

This task is the place they are verified **together on the real page** at both reference
viewports. Full Given-When-Then: [spec.md §5](../spec.md) AC-01, AC-08, AC-14, AC-15 (verbatim in
T7 / T8).

### AC-02 / AC-10 / AC-13 (US-02) — header hand-offs on the assembled page

Full Given-When-Then verbatim in T6; verified here end-to-end through the built page.

### AC-07 (US-01) — authorization (delivered-source half)

> **When** anyone views the page or its delivered source
> **Then** no salary or rate expectation, no exact home address, no phone number, and none of the
> tracker's per-recruiter link labels appear anywhere in it …
>
> — `spec.md §5, AC-07, verbatim` · full text: [spec.md](../spec.md)

## Checklist

- [ ] Rewrite `site/src/pages/index.astro` — use `Layout` (T5); body = `<Header {…}/>` + `<main>` (`<Hero {…}/>`, `<AboutMe {…}/>`) + `Footer` (via Layout). `<title>` = `${name} — ${headline}`.
- [ ] One `<h1>` on the page (the name, in `Hero`); `<header>` / `<main>` / `<footer>` landmarks; `lang="en"`.
- [ ] Pass only the needed profile slices to each component; never reference `contact.phones`.
- [ ] No client directives (`client:*`), no framework island. One inline `<script>` is allowed —
      the scroll-spy active-section indicator in `Header.astro` (ADR-0009); no other script.

## Edge cases

| Case | Behaviour |
|---|---|
| over-exposure token in `dist/` (salary / rate / home address / recruiter-link label) (E14) | assertion over the built output finds none |
| email / LinkedIn as visible text in `dist/` HTML | assertion finds none (only in `href`) |
| any phone digit string in `dist/` | assertion finds none (page never reads `contact.phones`) |
| JS disabled | full page renders and every action works (static) |
| 360 / 768 / 1280 / 1920 px (E17) | no horizontal scroll at any width |

## Definition of Done

- [ ] Integration (over `dist/`, `spec.md` §Test plan): `delivered HTML contains no salary, address, phone, or recruiter-link label`; `email and LinkedIn never appear as visible text in the rendered page`; `rendered page exposes no contact value as visible text`.
- [ ] Integration (build-output inspection): `assert the built dist/ ships no feature JS bundle` (0 KB).
- [ ] e2e-through-UI: keyboard-tab pass through Header + About; one `<h1>` + landmark assertions; `no horizontal scroll at 360 / 768 / 1280 / 1920 px` (parametrized).
- [ ] `npm --prefix site run build` green; manual pre-launch Lighthouse (LCP ≤ 2.5 s, ≤ 500 KB, a11y ≥ 95) noted in the release checklist (not CI — spec §6).
- [ ] Every Hard Rule inlined above still holds (0 KB JS; no `<script>`; single source of truth).
