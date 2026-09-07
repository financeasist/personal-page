---
id: T5
title: "Design tokens (section bands) + base page shell (Layout) + Footer"
layer: ui
deps: ["T1"]
blocks: ["T6", "T7", "T8", "T9"]
acs: ["AC-08"]
files_hint: ["site/src/styles/global.css", "site/src/layouts/Layout.astro", "site/src/components/Footer.astro"]
owner: "Roman"
estimate: "S"
context_budget: "M"
status: "todo"
---

<!-- Inline the slice the task needs, name where it came from, keep the link as fallback. -->

# T5 — Design tokens + base page shell + Footer

## Place in the sequence

- **Blocked by:** T1 — Set up the site test harness. · **Blocks:** T6 — Header, T7 — About section, T8 — Hero/Availability/Industries, T9 — assemble index.astro (all compose into this Layout / use these tokens). · **Wave:** 2.
- **Lane:** own lane — the shared token + shell files, established once so the parallel component tasks don't collide on `global.css`.

## Why (user story)

> **As a** Recruiter
> **I want** the page legible and every action tappable on a phone-sized screen
> **So that** I can review a link from my inbox while away from my desk.
>
> — `spec.md §4, US-06, verbatim` · full text: [spec.md](../spec.md)

This task sets the page skeleton (`min-height:100vh` flow, `<head>`, semantic landmarks, `Footer`
flush to the bottom) and the alternating-band colour tokens every section renders against.

## Inlined context

> **Section backgrounds alternate** (Roman's request): `Header` navy → **Hero white** → **About
> me grey** (`color/canvas`) → `Footer` navy. Full-bleed colour bands; content stays in a
> centered max-width column.
> **`Footer` is flush to the bottom.** The page is `min-height: 100vh` with the `Footer` as the
> last flow child, so on a short viewport it still sits at the bottom edge — no gap below it.
>
> — `screens.md §Source, verbatim` · full text: [screens.md](../screens.md)

> `Footer` — Dark-navy bar, centered "Copyright © Hrupskyi R. Bio 2026". Flush to the viewport
> bottom (`min-height: 100vh` page).
>
> — `screens.md §Components, Footer row, verbatim` · full text: [screens.md](../screens.md)

> **Styling:** Tailwind v4 with `@theme` tokens in `site/src/styles/global.css`; hand-rolled
> `.astro` components in `site/src/components/`; zero client JS by default.
> **Locale-clean:** no hard-coded English in non-content-driven components.
>
> — `CLAUDE.md §site, verbatim` · full text: [CLAUDE.md](../../../CLAUDE.md)

> **Hard rule (NFR):** Client JavaScript shipped by this feature = **0 KB**. Body text ≥ 16 px;
> every interactive target ≥ 44×44 px (WCAG 2.5.8). No horizontal scroll at 360 / 768 / 1280 /
> 1920 px width.

_(NFR amended 2026-09-07 by ADR-0009: ≤ 1 KB — one inline scroll-spy PE script, no bundle. The page shell / tokens task itself still ships no script.)_
>
> — `spec.md §6 NFR, abridged` · full text: [spec.md](../spec.md)

Existing `site/src/styles/global.css` has `--color-navy #2b3a55`, `--color-navy-dark #1f2a3f`,
`--color-ink #1a1a1a`, `--color-muted #5b6472`, `--font-sans`, and a `@media print` block — keep
all of it. The "Copyright © Hrupskyi R. Bio 2026" string is chrome (not recruiter content), so a
literal in `Footer.astro` is acceptable per locale-clean (structural copy).

**Fallback:** the design canon (`docs/design-system.md` §Token source) says the **code file stays
the source of truth** for colours — add `canvas`/`surface` there, don't invent a parallel palette.

## Data delta

No DB changes.

## API contract

Internal — no API surface.

## Acceptance criteria

### AC-08 (US-06) — happy path (shell half)

> **Then** every above-the-fold essential (AC-01 list) is visible without scrolling, all text is
> legible, and there is no horizontal scrolling. … At the narrower 360 px width only the
> no-horizontal-scroll guarantee is binding …
>
> — `spec.md §5, AC-08, abridged` · full text: [spec.md](../spec.md)

_This task's contribution: the shell never introduces horizontal overflow (no fixed widths,
`overflow-x` contained), and the band/`Layout` structure the other AC-08 work builds on._

## Checklist

- [ ] `site/src/styles/global.css` — add `--color-canvas` (section grey) and `--color-surface` (`#ffffff`) to the `@theme` block; a base rule giving `html`/`body` a ≥ 16 px root font and no horizontal overflow.
- [ ] `site/src/layouts/Layout.astro` — `<!doctype html>`, `<html lang="en">`, `<head>` (charset, viewport `width=device-width, initial-scale=1`, `<title>` from a prop), imports `global.css`; `<body>` is a `min-height:100vh` flex column: `<slot />` then `<Footer />` as the last flow child.
- [ ] `site/src/components/Footer.astro` — full-bleed navy (`--color-navy` / `--color-navy-dark`) bar, centered "Copyright © Hrupskyi R. Bio 2026", `<footer>` landmark.
- [ ] A small reusable "band" helper (utility classes or a `Band.astro`) for full-bleed colour + centered max-width column — used by Hero (white) and About (grey).

## Edge cases

| Case | Behaviour |
|---|---|
| very short viewport (content < 100vh) | `Footer` still sits at the bottom edge, no gap below |
| 360 px width (E16/E17) | no horizontal scroll — shell uses no fixed widths, images/blocks `max-width:100%` |
| JS disabled | shell is pure HTML/CSS — identical |

## Definition of Done

- [ ] Component test: `Layout` renders one `<footer>`, `lang="en"`, a `<title>` from its prop, and the `Footer` as the last body child.
- [ ] e2e row (parametrized, shared with later tasks): `no horizontal scroll at 360 / 768 / 1280 / 1920 px` passes for a page that is just `Layout` + placeholder content.
- [ ] `npm --prefix site run build` + `check` clean; build output ships **0 KB** JS.
- [ ] Tokens added in `global.css` (not inline); every Hard Rule above holds.
