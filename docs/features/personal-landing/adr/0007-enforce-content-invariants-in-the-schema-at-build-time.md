---
status: Accepted
owner: "Roman (Architect)"
reviewers: ["Roman"]
updated_at: "2026-09-06"
feature_size: "M"
ticket: "roadmap step 3 — personal-landing"
---

# 0007 — Enforce content invariants in the content-collection schema at build time

- **Status:** Accepted
- **Date:** 2026-09-06
- **Deciders:** Roman

## Context

The landing page must never publish incomplete or malformed content: a missing headline or availability block, any of the four contact channels absent, a selected project with an empty or placeholder impact statement, or overlapping experience date ranges. Roman authors the Profile content by hand and commits it; there is no editor UI to catch mistakes. The spec makes several of these build-failure acceptance criteria (AC-05, AC-06, AC-12).

## Decision drivers

- Spec §6 NFR: "100% of missing / malformed required fields fail the build".
- Spec §5: AC-05, AC-06, AC-12 all require a *build failure* that *names the field*.
- Spec §1 quality goal 2: "never ship a broken or incomplete page".
- Solo author, no editor UI — the commit + CI run is the only checkpoint.

## Considered options

1. **Zod schema + `.refine()` in `site/src/content/config.ts`** — Astro already validates the collection against this schema on `astro check` and on build; cross-field rules (all four channels, non-placeholder impact, non-overlapping dates) go in `.refine()` / `.superRefine()`.
2. **A separate lint script run in CI** — a standalone Node script that loads the JSON and asserts the invariants, wired as its own CI step.
3. **Runtime guard in the page component** — the component checks and throws while rendering.

## Decision outcome

**Chosen:** Option 1. Astro runs the content-collection schema on every `astro check` and build with no extra wiring, the errors already name the field and file, and keeping the rules next to the schema means one place defines "valid Profile content". Option 2 duplicates the load-and-parse and adds a CI step that can drift from the schema. Option 3 fails too late (a render error, not a validation error) and only if that code path runs. Helper predicates (placeholder detection, date-overlap) live in `site/src/lib/content-checks.ts` and are unit-tested.

## Consequences

**Positive**
- One definition of valid content; `astro check` and the build both enforce it; failures name the field.
- Cross-field invariants (channel completeness, date overlap, placeholder impact) are testable in isolation.

**Negative**
- Complex `.superRefine()` logic can get dense; needs its own unit tests to stay trustworthy.
- The exact "placeholder impact" rule (min length, blocked words) is still open (spec §8, §11).

**Neutral**
- If the schema later needs to be shared with another tool, the refinements travel with it.
- `data-model` finalises the field shapes these refinements run against.

## Links

- Spec: [[../spec.md]] §5 (AC-05, AC-06, AC-12), §6, §8
- SAD: [[../sad.md]] §4, §8, §10 (QG-2)
- Related ADR: [[0005-extend-the-single-profile-entry-with-landing-specific-fields]]
