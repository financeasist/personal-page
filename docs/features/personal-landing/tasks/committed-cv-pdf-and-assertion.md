---
id: T4
title: "Commit the static CV PDF and assert it exists at build time"
layer: wiring
deps: ["T3"]
blocks: ["T10"]
acs: ["AC-04", "AC-05"]
files_hint: ["site/public/", "site/scripts/assert-cv-pdf.mjs", "site/scripts/generate-pdf.mjs", "site/package.json"]
owner: "Roman"
estimate: "S"
context_budget: "S"
status: "todo"
---

<!-- Inline the slice the task needs, name where it came from, keep the link as fallback. -->

# T4 — Committed CV PDF + build-time "file exists" assertion

## Place in the sequence

- **Blocked by:** T3 — Shared CV-filename helper. · **Blocks:** T10 — build + CI wiring (which strips the Playwright install now that generation is gone). · **Wave:** 3.
- **Lane:** shares `site/package.json` with T1 and T10 — serialized.

## Why (user story)

> **As a** Recruiter
> **I want** the CV download to produce a file named for Roman and his role
> **So that** it is recognisable in my downloads folder and in our applicant tracking system.
>
> — `spec.md §4, US-05, verbatim` · full text: [spec.md](../spec.md)

This task puts the actual named PDF behind the Download-CV control and makes a missing file fail
the build instead of shipping a dead link.

## Inlined context

> **Chosen:** Commit a hand-maintained CV PDF under `site/public/` for v1; defer ADR-0004's
> build-time `/cv` generation to roadmap step 4. The Download-CV control links to the committed
> file.
> … `site/src/pages/cv.astro` and `site/scripts/generate-pdf.mjs` stay in the tree, unwired —
> roadmap step 4 re-enables them.
>
> — `adr/0008 §Decision outcome + §Consequences, abridged` · full text: [adr/0008](../adr/0008-cv-delivery-is-a-committed-static-pdf-in-v1.md)

> **CV delivery in v1 is a committed static PDF, not a generated one** … The Download-CV control
> points at a hand-committed PDF under `site/public/` (the reconciled "Classic" variant), named
> through the shared filename helper. … A missing committed PDF fails the build (postbuild
> assertion → "file exists").
>
> — `spec.md §1, abridged` · full text: [spec.md](../spec.md)

> INV-03 … the CV channel (`name` + `headline` present **and** the committed PDF exists at the
> expected path — postbuild "file exists" assertion, ADR-0008).
>
> — `data-model.md §Invariants, INV-03, abridged` · full text: [data-model.md](../data-model.md)

Source file to commit: [`docs/reference/cv-classic-variant.pdf`](../../../reference/cv-classic-variant.pdf)
(the reconciled "Classic" variant — already shows Roman's contact details as visible text, which
is correct for the CV, spec §1). Place it at `site/public/<cvFilename({name,headline})>` so Astro
serves it from the site root. Current derived name: `Roman-Hrupskyi-Senior-Java-Engineer-CV.pdf`.

> **Hard rule:** CV PDF is committed (v1). v1 ships a hand-maintained static PDF under
> `site/public/`; the Download-CV control links to it. Build-time generation … is deferred to
> roadmap step 4.
>
> — `CLAUDE.md §site, verbatim` · full text: [CLAUDE.md](../../../CLAUDE.md)

**Fallback:** if the "Classic" PDF isn't the right artifact to commit, the requirement is
*a real, correctly-named PDF at `site/public/` and a build that fails without it* — coordinate the
file content with Roman; don't block the assertion on it.

## Data delta

No DB changes. The CV "channel" is satisfied by a file on disk, not a content field
(`data-model.md` INV-03 note).

## API contract

Internal — no API surface.

## Acceptance criteria

### AC-04 (US-05) — cross-context

> **Then** the CV download is served under a filename derived from that same name and headline
> through the shared filename helper — not a generic "cv" name …
>
> — `spec.md §5, AC-04, abridged` · full text: [spec.md](../spec.md)

### AC-05 (US-08) — domain invariant (CV-channel half)

> _The "CV channel" … is satisfied when the committed PDF exists at the expected path (postbuild
> "file exists" assertion) and the name + headline needed to derive its filename are present._
>
> — `spec.md §5, AC-05 note, verbatim` · full text: [spec.md](../spec.md)

## Checklist

- [ ] Commit `docs/reference/cv-classic-variant.pdf` content to `site/public/Roman-Hrupskyi-Senior-Java-Engineer-CV.pdf` (name from `cvFilename()`, not hand-typed in code paths).
- [ ] `site/scripts/assert-cv-pdf.mjs` (new) — import `cvFilename`, read `site/src/data/profile/roman.json`, assert `site/public/<derived>` exists and is non-empty; `process.exit(1)` with a message naming the expected path on failure.
- [ ] `site/package.json` — `postbuild` → `node scripts/assert-cv-pdf.mjs` (replaces `node scripts/generate-pdf.mjs`).
- [ ] Leave `site/scripts/generate-pdf.mjs` in the tree, unreferenced (roadmap step 4 re-wires it) — add a one-line header comment that it is deferred per ADR-0008.

## Edge cases

| Case | Behaviour |
|---|---|
| committed PDF missing at the derived path (E3) | `postbuild` assertion fails the build, message names the expected `site/public/…` path |
| `roman.json` `name`/`headline` changed so the derived name moves | assertion looks for the new name → fails until the file is renamed too (surfaces drift — spec §7) |
| PDF present but 0 bytes | treated as missing — assertion fails |

## Definition of Done

- [ ] Integration test: `build asserts the committed CV PDF exists at the derived path` — a scoped `astro build` + `postbuild` passes with the file present and fails (naming the path) with it removed (`missingCvPdfProfile()` fixture, `spec.md` §Test plan AC-04 / E3).
- [ ] `npm --prefix site run build` green; `dist/Roman-Hrupskyi-Senior-Java-Engineer-CV.pdf` is served.
- [ ] `postbuild` no longer invokes Playwright/Chromium.
- [ ] Every Hard Rule inlined above still holds.
