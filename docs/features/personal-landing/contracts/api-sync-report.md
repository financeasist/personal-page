---
status: N/A — skipped
skill: sdd:api
slug: personal-landing
generated_at: "2026-09-07"
---

# API sync report — personal-landing

## Outcome: SKIPPED — no external interface

**One-line note:** `personal-landing` has **no external interface** — no HTTP/REST surface,
no RPC, no CLI, no published library/SDK, no async events. `api` produces no contract for
it. Proceed to `tasks`.

## Why

| Signal | Reading |
|---|---|
| `sad.md` frontmatter `target_surfaces` | `[web-frontend]` — a single static Astro page. A UI surface **consumes** a backend contract; it does not author one. |
| Backend surface | None. `sad.md` §3: *"There is no runtime backend and no external service call from the delivered page."* §4: *"No backend, no API, no other surface."* |
| `sad.md` §6 runtime view | Two theatres — a Recruiter reading static files + handing off to their own device apps (`tel:` / `mailto:` / `https:` / file download), and the build/deploy pipeline. No request-time service, no datastore, no request/response exchange to specify. |
| `data-model.md` | *"no database, no migration, no runtime persistence."* The only persisted artefact is the `profile` content-collection document (build-time input), whose field-shape spec already lives in `data-model.md` — not an API payload. |
| `spec.md` §5 error ACs (AC-05, AC-06) | Every error is a **build-time gate** (Zod schema + `.refine()` invariants failing `astro build`), not an HTTP error response. |
| Contact "actions" (AC-02, AC-13) | Browser-native URI-scheme hand-offs to the recruiter's own apps — not calls to any service this feature owns. |
| The tracker service | A **separate** deployable (`tracker/`, Spring Boot + Postgres). Its click-ingest / redirect API is roadmap steps 5–8 and out of scope here (`sad.md` §2, spec §3). When that feature is specified, `api` runs for *it*. |

## Drift check

Not applicable — there is no generated contract to check against the model or the sequences.
The upstream drift discipline for this feature's one structured document was already run by
`data-model` (see `data-model.md` §"Drift check" — schema-vs-fixture, resolved by the
ADR-0005 schema task).

## Coverage cross-check (spec §5 ACs → surface)

Every §5 AC resolves to either a **build-time invariant** (owned by `data-model.md` INV-01…INV-08
+ ADR-0007) or a **client-side / static-delivery property** (owned by `screens.md` +
`plan-tests`). None maps to an API operation. No sequence-gap OQ raised — `sad.md` §6 already
enumerates the build-gate branches (Flow 4) and the accepted unresolved hand-off (Flow 2).

## Definition of Done

- [x] Interface kind determined from `sad.md` `target_surfaces` (`[web-frontend]`) — not re-derived.
- [x] N/A condition met (no external interface) → skip recorded here, no `openapi.yaml` written.
- [x] `events.md` not created (no async flows).
- [x] Handoff points to the next stage per `.route` (`standard`).
