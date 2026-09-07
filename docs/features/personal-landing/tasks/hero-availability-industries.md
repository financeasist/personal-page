---
id: T7
title: "Hero (headshot + name + headline + tagline) with AvailabilityBlock and optional Industries"
layer: ui
deps: ["T1", "T2", "T5"]
blocks: ["T9"]
acs: ["AC-01", "AC-08", "AC-15"]
files_hint: ["site/src/components/Hero.astro", "site/src/components/AvailabilityBlock.astro", "site/src/components/Industries.astro", "site/src/assets/"]
owner: "Roman"
estimate: "M"
context_budget: "M"
status: "todo"
---

<!-- Inline the slice the task needs, name where it came from, keep the link as fallback. -->

# T7 — Hero + AvailabilityBlock + Industries

## Place in the sequence

- **Blocked by:** T1 — test harness, T2 — profile schema + content (the new fields), T5 — tokens + shell. · **Blocks:** T9 — assemble index.astro. · **Wave:** 3.
- **Lane:** own files (`Hero` / `AvailabilityBlock` / `Industries` + `src/assets/`). Parallel with T6 (Header) and T8 (About).

## Why (user story)

> **As a** Recruiter
> **I want** the essentials — headshot, name, headline, top stack, location, availability —
> visible without scrolling
> **So that** I can decide in about twenty seconds whether to pursue him.
>
> — `spec.md §4, US-01, verbatim` · full text: [spec.md](../spec.md)

> **As a** Recruiter
> **I want** a short list of the industries Roman has delivered in, in the hero
> **So that** I can judge domain fit at a glance alongside his stack.
>
> — `spec.md §4, US-11, verbatim` · full text: [spec.md](../spec.md)

This task builds the above-the-fold column (photo, name, headline, optional tagline, availability,
top stack) and the optional industries column.

## Inlined context

> above-the-fold: headshot, name, headline, optional tagline, `AvailabilityBlock`, optional
> Industries. `AvailabilityBlock` — status / location / optional notice / optional work auth.
> `Industries` — optional hero list — domain + optional note (renders only when present).
>
> — `sad.md §5, component list, verbatim` · full text: [sad.md](../sad.md)

**SCR-01 states to build** (`screens.md`): **default — laptop** (`Sh75H` › Hero `xEwZk`,
Industries `QfCVa`): white band; headshot (`me.png`) + name + headline + optional tagline +
`AvailabilityBlock` (status + location) on the **left**; the **INDUSTRIES** list on the **right**;
then the **Top Stack** line — **≤ 8 technologies**; no scrolling. **default — phone** (`XKUfO`):
same essentials single-column; the INDUSTRIES list sits **below** the `AvailabilityBlock`; body
text ≥ 16 px; no horizontal scroll. **default — tagline omitted** (`AKdd9`): headline renders with
`AvailabilityBlock` directly beneath — AC-01 still holds.

> **Images** — Headshot processed by `astro:assets` — responsive sizes, modern format, explicit
> dimensions, **eager + high fetch-priority for the LCP element**.
>
> — `sad.md §8, Images row, verbatim` · full text: [sad.md](../sad.md)

> **Hard rule (risk):** Headshot asset is ~2 MB — blows the 500 KB page-weight budget if shipped
> raw → `astro:assets` optimisation, responsive sizes, target < 100 KB at display size.
>
> — `sad.md §11, verbatim` · full text: [sad.md](../sad.md)

> §6 drop order when the mobile hero overflows the fold: **1. Industries list → 2. Tagline →
> 3. top-stack wraps and truncates toward its 8-item cap.** The essentials themselves never drop.
>
> — `spec.md §6 NFR, verbatim` · full text: [spec.md](../spec.md)

Headshot source: [`docs/reference/me.png`](../../../reference/me.png) (~1.9 MB) → import into
`site/src/assets/roman.jpg` (or keep `.png`) and render through `astro:assets` `<Image>`. Alt text
comes from the profile (headshot path + alt are existing schema fields — AC-05 requires both).
`AvailabilityBlock` has no notice-period line in the `.pen` frame — add it only if
`availability.noticePeriod` is set (`screens.md` AvailabilityBlock row). Tagline is Roman's
~40-word sentence (`screens.md` §Source, D-10).

**Fallback:** the AC-01 essentials list is canonical and **shared with AC-05** — if the layout
can't fit everything at 1280×800 / 390×844, cut optional elements in the §6 drop order, never an
essential. Read [screens.md](../screens.md) SCR-01 in full.

## Data delta

No DB changes. Reads `name`, `headline`, `tagline?`, `topStack` (4–8), `availability.{status,
noticePeriod?, workAuthorization?}`, `contact.location`, `industries?` ({domain, note?}), and the
existing headshot path + alt fields.

— `data-model.md §Entities, abridged` · full text: [data-model.md](../data-model.md)

## API contract

Internal — no API surface.

## Acceptance criteria

### AC-01 (US-01) — happy path

> **Given** a Recruiter opens the landing page at either reference viewport (1280×800 laptop or
> 390×844 phone, see §6)
> **When** the page finishes loading
> **Then** without scrolling, the Recruiter sees every **above-the-fold essential**: Roman's
> headshot, his name, his headline, his current availability status (carrying the remote-work /
> relocation stance), his location, his top stack (four to eight technologies), and the three
> contact actions (email, LinkedIn, Download CV) — the contact actions rendered in the persistent
> header … _(The About section is below the fold … The optional Industries list and Tagline are
> hero content but not essentials — absent is valid.)_
>
> — `spec.md §5, AC-01, verbatim` · full text: [spec.md](../spec.md)

_This task owns every essential except the three contact actions (T6). The `<h1>` is the name,
here._

### AC-08 (US-06) — happy path (hero half)

> **Then** every above-the-fold essential (AC-01 list) is visible without scrolling, all text is
> legible, and there is no horizontal scrolling. … At the narrower 360 px width only the
> no-horizontal-scroll guarantee is binding — essentials may reflow below the fold there …
>
> — `spec.md §5, AC-08, abridged` · full text: [spec.md](../spec.md)

### AC-15 (US-11) — content-driven, optional

> **Given** the Profile content carries an `industries` list (one to six entries, each a `domain`
> and an optional `note`) **or** omits it entirely
> **When** the hero renders
> **Then** if the list is present the hero shows it as a short column straight from the Profile
> content (no hard-coded copy), reflowing below the availability block on the phone viewport; if
> the list is absent the hero renders without that column and the build still succeeds. An
> `industries` entry with an empty `domain`, or more than six entries, fails the build with a
> message naming the field (AC-06).
>
> — `spec.md §5, AC-15, verbatim` · full text: [spec.md](../spec.md)

## Checklist

- [ ] `site/src/assets/` — add the optimised headshot; render via `astro:assets` `<Image>` with explicit `width`/`height`, `loading="eager"`, `fetchpriority="high"`; target < 100 KB at display size.
- [ ] `site/src/components/Hero.astro` — white band (T5 `Band`); left column: `<h1>`(name) + headline + `{tagline && <p>…}` + `<AvailabilityBlock />`; right column: `{industries?.length && <Industries />}`; then the Top Stack line (`topStack.join` / chips, ≤ 8). Responsive: two-column laptop → single-column phone (Industries below AvailabilityBlock).
- [ ] `site/src/components/AvailabilityBlock.astro` — `status`, `contact.location`, `{workAuthorization}`, `{noticePeriod}`; all from content.
- [ ] `site/src/components/Industries.astro` — renders `industries` as a short list (`domain` + optional `note`); nothing when the array is absent/empty.
- [ ] No hard-coded recruiter-facing copy — every visible string is a content field (chrome labels like "Top stack" / "Availability" headings are structural, allowed).

## Edge cases

| Case | Behaviour |
|---|---|
| `tagline` absent | headline sits directly above `AvailabilityBlock`; AC-01 still holds (`AKdd9`) |
| `industries` absent | no right column; laptop hero is single-column; build succeeds (AC-15) |
| `industries` present on phone | list reflows below `AvailabilityBlock` |
| `availability.workAuthorization` / `noticePeriod` absent | those lines simply don't render |
| 360 px width (E16) | no horizontal scroll; drop order Industries → Tagline → top-stack truncates |
| headshot alt missing | caught at build by AC-05 (T2 schema) — not this component's runtime concern |

## Definition of Done

- [ ] Component tests (`spec.md` §Test plan): `above-the-fold essentials render from profile content`; `hero renders the industries column from content when present, omits it when absent`.
- [ ] Integration: `build succeeds with industries omitted` (`industriesOmittedProfile()`).
- [ ] e2e-through-UI: `laptop and phone hero show every essential with no scroll` (1280×800, 390×844); visual-regression `hero baseline unchanged — laptop + phone` (baseline committed).
- [ ] Build weight check: headshot < 100 KB at display size; page ships 0 KB JS.
- [ ] Every Hard Rule inlined above still holds (LCP image eager/high-priority; essentials never dropped).
