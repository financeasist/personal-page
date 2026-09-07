---
id: T11
title: "Register the new components in the design canon + architecture map"
layer: docs
deps: ["T9"]
blocks: []
acs: []
files_hint: ["docs/design-system.md", "docs/features/personal-landing/screens.md", "docs/architecture-map.md"]
owner: "Roman"
estimate: "S"
context_budget: "S"
status: "todo"
---

<!-- Inline the slice the task needs, name where it came from, keep the link as fallback. -->

# T11 — Register components in the design canon

## Place in the sequence

- **Blocked by:** T9 — assemble index.astro (every component now exists at a real path). · **Blocks:** —. · **Wave:** 5.
- **Lane:** own lane — docs only, no code.

## Why (user story)

> **As** Roman
> **I want** the page to render entirely from the Profile content entry
> **So that** a one-file edit and commit updates the live page — and the CV — with no code change.
>
> — `spec.md §4, US-07, verbatim` · full text: [spec.md](../spec.md)

Not a behaviour change — it keeps the design canon and the architecture map honest so the next UI
feature reuses these primitives instead of re-creating them.

## Inlined context

> `site/src/components/` is empty today. The rows below are the first shared primitives, all
> created by **personal-landing** … `implement` replaces `pending` with the real `file:line`
> anchor as it registers each one.
>
> — `docs/design-system.md §Component inventory, verbatim` · full text: [design-system.md](../../../design-system.md)

> Registered in `docs/design-system.md` §Component inventory. `implement` replaces each `pending`
> there with the real `site/src/components/<Name>.astro` `file:line` anchor.
>
> — `screens.md §Components, verbatim` · full text: [screens.md](../screens.md)

Components delivered by this feature: `Layout` (T5), `Footer` (T5), `Header` (T6), `Hero` /
`AvailabilityBlock` / `Industries` (T7), `Section` / `AboutMe` (T8). Still **v2, not built**:
`ExperienceTimeline`, `SelectedProjects`, `ProjectCard` — mark them so, don't delete the rows.

> **Hard rule:** Hand-rolled `.astro` components in `site/src/components/`; no component kit.
>
> — `CLAUDE.md §site, verbatim` · full text: [CLAUDE.md](../../../CLAUDE.md)

**Fallback:** if `architecture-map.md` has no component-inventory section to update, skip that
file and note it in the PR — the canonical inventory is `docs/design-system.md`. Read
[design-system.md](../../../design-system.md) §Component inventory in full.

## Data delta

No DB changes.

## API contract

Internal — no API surface.

## Acceptance criteria

None — this task carries no spec §5 acceptance criterion (documentation upkeep for US-07
traceability). Correctness = the Definition of Done below.

## Checklist

- [ ] `docs/design-system.md` §Component inventory — replace `pending` with the real `site/src/components/<Name>.astro:<line>` anchor for `Header`, `Footer`, `Section`, `AboutMe`, `Industries`, `Hero`, `AvailabilityBlock`; add a `Layout` row.
- [ ] Mark `ExperienceTimeline` / `SelectedProjects` / `ProjectCard` rows **v2 — not built (SCR-02 / SCR-03)**.
- [ ] `docs/features/personal-landing/screens.md` §Components — same `pending` → real-anchor swap.
- [ ] `docs/architecture-map.md` — if it carries a frontend component list, add the new primitives; otherwise note "no inventory section — canonical list is design-system.md" in the PR.
- [ ] `docs/design-system.md` frontmatter `updated_at` bumped.

## Edge cases

| Case | Behaviour |
|---|---|
| a component's final name differs from the manifest (e.g. `ContactActions` folded into `Header`) | register the name that shipped; add a one-line note explaining the fold |
| `architecture-map.md` `reflects_commit` is stale | leave it — refreshing the map is a `survey` job, out of scope here |

## Definition of Done

- [ ] Every component this feature shipped has a real `file:line` anchor in `docs/design-system.md`.
- [ ] No `pending` row remains for a component that now exists.
- [ ] v2 components are labelled, not removed.
- [ ] Docs-only change — no code, no test impact.
