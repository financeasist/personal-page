---
status: Accepted
owner: "Roman (Architect)"
reviewers: ["Roman"]
updated_at: "2026-09-06"
feature_size: "M"
ticket: "roadmap step 3 — personal-landing"
---

# 0005 — Extend the single profile entry with landing-specific structured fields

- **Status:** Accepted
- **Date:** 2026-09-06
- **Deciders:** Roman

## Context

The scaffold's `profile` content collection (`site/src/content/config.ts`) mirrors the locked CV template's sections. The landing page needs data the CV template does not carry: an optional `tagline`, an optional short `positioning` block, a curated `topStack` (≤ 8 technologies for the hero), `selectedProjects` (3–5 entries, each with an impact statement), a structured availability block (`status` plus optional `workAuthorization`; location stays on `contact`), labelled phone lines (for the no-digit chooser), and a one-line `earlierBackground`. (Final field shapes — including the fields dropped from this candidate list, e.g. a discrete relocation field — are settled by `data-model`.) The spec's invariant is "one Profile content entry, two renderers (landing page + CV)".

## Decision drivers

- Spec §2 goal: "one reconciled professional history that never contradicts the generated CV".
- `CONTEXT.md` invariant: the landing page and the CV PDF always render from the same Profile content entry.
- Spec §6: content completeness enforced at build; locale-clean schema (multi-language additive later).
- Effort budget ~1 week, solo — avoid a second content surface to keep in sync.

## Considered options

1. **Add landing-specific fields to the same `profile` entry** — one JSON file, one Zod schema; some fields are consumed only by the landing renderer, some only by the CV renderer, most by both.
2. **A separate `landing` content collection** — a second file/schema dedicated to the page.
3. **Derive landing fields from existing CV fields** — e.g. `topStack` = first N of `skills`, parse the availability string into the block.

## Decision outcome

**Chosen:** Option 1. It keeps a single authored file and a single schema, so the page and the CV can never disagree on a shared fact and there is nothing to synchronise. Option 2 reintroduces the drift the single-source invariant exists to prevent. Option 3 is implicit and fragile — a curated hero stack and a structured availability block are real editorial decisions, not something to infer from a skills list or a free-text string.

## Consequences

**Positive**
- The single-source invariant holds structurally; no sync step, no drift.
- Each renderer picks the fields it needs; adding a field is one schema edit.
- A per-locale entry later stays a copy of one shape (locale-clean).

**Negative**
- The `profile` schema carries fields only one renderer uses — mild conceptual bloat.
- The schema grows noticeably in this feature (structured availability, projects, labelled phones).

**Neutral**
- Splitting into two collections later is possible but would require re-establishing the sync contract this decision avoids.
- The exact field shapes are finalised by the `data-model` stage.

## Links

- Spec: [[../spec.md]] §1, §4 (US-07)
- SAD: [[../sad.md]] §4, §5
- Related ADR: [[0007-enforce-content-invariants-in-the-schema-at-build-time]]
- Inherits: `docs/adr/0001` (typed content collection as single source of truth)
