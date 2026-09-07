---
id: T8
title: "About section — Section wrapper + AboutMe (narrative + highlights), below the fold"
layer: ui
deps: ["T1", "T2", "T5"]
blocks: ["T9"]
acs: ["AC-14"]
files_hint: ["site/src/components/Section.astro", "site/src/components/AboutMe.astro"]
owner: "Roman"
estimate: "S"
context_budget: "S"
status: "todo"
---

<!-- Inline the slice the task needs, name where it came from, keep the link as fallback. -->

# T8 — About section

## Place in the sequence

- **Blocked by:** T1 — test harness, T2 — profile schema + content (`about.*`), T5 — tokens + shell. · **Blocks:** T9 — assemble index.astro. · **Wave:** 3.
- **Lane:** own files (`Section` / `AboutMe`). Parallel with T6 (Header) and T7 (Hero).

## Why (user story)

> **As a** Recruiter
> **I want** a short About section one scroll below the fold — a few sentences of narrative plus
> a handful of highlights
> **So that** I get a fuller sense of his focus and strengths in his own words before I decide to
> reach out.
>
> — `spec.md §4, US-10, verbatim` · full text: [spec.md](../spec.md)

This task builds the one below-the-fold section in v1 and the reusable `Section` wrapper.

## Inlined context

> `Section` — below-the-fold section wrapper. `AboutMe` — below-the-fold About section — narrative
> + highlights (US-10).
>
> — `sad.md §5, component list, verbatim` · full text: [sad.md](../sad.md)

**SCR-05 states to build** (`screens.md`, `GSu58`): **default — laptop**: grey band, centered
"ABOUT ME" heading + short navy rule, then two columns — a **narrative** (`about.narrative`) and a
**HIGHLIGHTS** bullet list (`about.highlights`) ending with a "See my LinkedIn profile" link.
Rendered straight from Profile content — **no hard-coded copy**. **default — phone**: single
column, HIGHLIGHTS under the narrative, body text ≥ 16 px, no horizontal scroll. **AI-tooling line
omitted**: the last narrative paragraph is optional wording — the section still renders (narrative
non-empty). The `Header` "About me" menu item anchors here (`id="about"`).

> **Precondition:** the build enforced a non-empty `about.narrative` and a non-empty
> `about.highlights` list (AC-05, AC-06) — the section never renders blank.
>
> — `sad.md §6, Flow 3 Note, verbatim` · full text: [sad.md](../sad.md)

> **Section rhythm:** full-bleed background bands **alternate** … About me **grey**. Section
> headings are centered with a short navy rule beneath.
> **Microcopy tone:** plain, recruiter-facing. Locale-clean — visible strings come from the
> content collection.
>
> — `docs/design-system.md §Interaction & writing conventions, abridged` · full text: [design-system.md](../../../design-system.md)

Narrative source (reconciled to "9+ years"):
[`docs/reference/linkedin-about.md`](../../../reference/linkedin-about.md). The narrative text and
the highlight lines are **content** (set in T2's `roman.json`) — this component only renders them.

**Fallback:** the binding rule is *no hard-coded copy + phone reflow to one column ≥ 16 px* (AC-14).
Layout beyond that is free. Read [screens.md](../screens.md) SCR-05 in full.

## Data delta

No DB changes. Reads `about.narrative` (string, may hold multiple paragraphs) and
`about.highlights` (string[], ≥ 1). Optionally reads the LinkedIn link for the "See my LinkedIn
profile" anchor.

— `data-model.md §Entities, about table, verbatim` · full text: [data-model.md](../data-model.md)

## API contract

Internal — no API surface.

## Acceptance criteria

### AC-14 (US-10) — happy path

> **Given** the Profile content carries `about.narrative` (a non-empty paragraph) and
> `about.highlights` (a non-empty list of short lines)
> **When** a Recruiter scrolls one screen below the fold at either reference viewport (1280×800 /
> 390×844)
> **Then** the About section renders the narrative and the highlights straight from the Profile
> content — no hard-coded copy — and on the phone viewport it reflows to a single column with
> body text ≥ 16 px and no horizontal scroll.
>
> _The About section is below the fold by design — it is not part of the AC-01 / AC-08
> above-the-fold guarantee._
>
> — `spec.md §5, AC-14, verbatim` · full text: [spec.md](../spec.md)

## Checklist

- [ ] `site/src/components/Section.astro` — layout-only wrapper: full-bleed band colour (prop), centered max-width column, centered heading + short navy rule, spacing rhythm. Reusable (About now; Experience/Selected-projects in v2).
- [ ] `site/src/components/AboutMe.astro` — `<Section>` grey, `id="about"`, "ABOUT ME" heading; renders `about.narrative` (split paragraphs on blank lines) + a `<ul>` of `about.highlights` + a LinkedIn link. Two columns laptop → one column phone; body text ≥ 16 px.
- [ ] No literal narrative/highlight strings in the component — all from props/content.

## Edge cases

| Case | Behaviour |
|---|---|
| `about.narrative` / `about.highlights` missing or empty | caught at build (AC-05/AC-06, T2) — the component is never asked to render blank |
| narrative last paragraph (AI-tooling line) absent | section renders normally; narrative just ends earlier |
| phone viewport | HIGHLIGHTS list stacks under the narrative; no horizontal scroll |
| very long highlight line | wraps; no horizontal overflow |

## Definition of Done

- [ ] Component test (`spec.md` §Test plan): `About renders narrative + highlights straight from profile content` (asserts no hard-coded copy — text equals the fixture's).
- [ ] e2e-through-UI: `About visible one scroll below the fold; single column ≥ 16px on phone` (1280×800, 390×844); visual-regression `About section baseline — laptop + phone`.
- [ ] `#about` anchor resolves (matches the Header menu link from T6).
- [ ] Build ships 0 KB JS; `check` + `lint` clean.
- [ ] Every Hard Rule inlined above still holds.
