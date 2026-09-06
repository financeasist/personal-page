---
status: Accepted
owner: "Roman (roman.grupskyi@gmail.com)"
reviewers: []
updated_at: "2026-09-06"
feature_size: "greenfield-foundation"
ticket: "docs/idea-brief.md"
---

# 0003 — Keep the site and the tracker in one monorepo with independent build/deploy

- **Status:** Accepted
- **Date:** 2026-09-06
- **Deciders:** Roman + survey (greenfield foundation session)

## Context

The project has two deployable pieces — a static Astro site and a Java tracking service — plus a
deferred third (a browser admin panel). They share domain concepts (recruiter links, the profile)
but no runtime code, and deploy to different platforms.

## Decision drivers

- One place to reason about the whole project; one PR can touch page + tracker together.
- The two stacks must build, test, and deploy **independently** (different toolchains, different hosts).
- Room to add the deferred admin panel without a repo split (idea-brief §5).
- Personal project — minimal ceremony, no polyglot build tool.

## Considered options

1. **Monorepo, folder-per-app** (`site/`, `tracker/`, `docs/`), each with its own build; CI matrixes
   over the two; no monorepo tool.
2. **Two separate repos** — clean isolation, but cross-cutting changes need two PRs and the docs/spec
   pipeline would straddle repos.
3. **Monorepo with a polyglot orchestrator** (Nx / Bazel / Turborepo) — overkill for two apps.

## Decision outcome

**Chosen:** Option 1. A plain folder-per-app monorepo gives single-PR changes and one home for the
SDD `docs/` pipeline, while each app keeps its native build (`npm` for `site/`, `./mvnw` for
`tracker/`). No orchestrator to learn. Option 2 fragments the pipeline; Option 3 adds tooling weight a
two-app repo does not need.

## Consequences

**Positive**
- The `docs/` SDD artifacts cover both apps from one place.
- CI runs each app's toolchain in its own job; a site-only change never triggers a Maven build.
- The deferred admin panel drops in as a fourth top-level folder.

**Negative**
- No enforced dependency boundaries between folders (convention only).
- Contributors clone both toolchains even to touch one app.

**Neutral**
- Splitting into separate repos later is a `git filter-repo` per folder — possible, not free.

## Links

- Idea brief: [[../idea-brief.md]]
- Architecture map: [[../architecture-map.md]] §Module inventory
- Related ADR: [[0001-astro-static-site-with-typed-content-collection]], [[0002-java-spring-boot-tracker-with-append-only-postgres]]
