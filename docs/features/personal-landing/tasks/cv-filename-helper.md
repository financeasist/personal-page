---
id: T3
title: "Shared CV-filename helper (name + headline → Roman-Hrupskyi-…-CV.pdf)"
layer: app
deps: ["T1"]
blocks: ["T4", "T6"]
acs: ["AC-04"]
files_hint: ["site/src/lib/cv-filename.ts", "site/src/lib/__tests__/cv-filename.test.ts"]
owner: "Roman"
estimate: "S"
context_budget: "S"
status: "todo"
---

<!-- Inline the slice the task needs, name where it came from, keep the link as fallback. -->

# T3 — Shared CV-filename helper

## Place in the sequence

- **Blocked by:** T1 — Set up the site test harness. · **Blocks:** T4 — committed CV PDF + assertion (needs the derived name), T6 — Header (Download-CV `href`). · **Wave:** 2.
- **Lane:** own lane — one new file + its test.

## Why (user story)

> **As a** Recruiter
> **I want** the CV download to produce a file named for Roman and his role
> **So that** it is recognisable in my downloads folder and in our applicant tracking system.
>
> — `spec.md §4, US-05, verbatim` · full text: [spec.md](../spec.md)

This task delivers the single filename-derivation function both the Header link and the build-time
"file exists" assertion use, so the name is computed once, never hand-copied.

## Inlined context

> CV filename — Derived from `name` + `headline` by `site/src/lib/cv-filename.ts`, shared by
> `index.astro` and `cv.astro` (`generate-pdf.mjs` is v2) — never hand-copied. In v1 the postbuild
> step asserts the committed `site/public/` PDF exists at the derived name.
>
> — `sad.md §8, "CV filename" row, verbatim` · full text: [sad.md](../sad.md)

> The filename is still resolved through a shared helper (from the Profile content name +
> headline), never a hand-copied string, so step 4 can later swap the generated file in with no
> control change.
>
> — `spec.md §1, verbatim` · full text: [spec.md](../spec.md)

The existing unwired `site/scripts/generate-pdf.mjs` already contains the derivation to port
(`slug()` → NFKD, strip non-word, spaces→`-`; `headlineLead = headline.split('|')[0].trim()`;
`filename = ${slug(name)}-${slug(headlineLead)}-CV.pdf`). Current data →
`Roman-Hrupskyi-Senior-Java-Engineer-CV.pdf` (headline `"Senior Java Engineer | Lead Backend
Engineer"`).

> **Hard rule:** Content is the single source of truth … The landing page (`index.astro`) and the
> CV print route (`cv.astro`) both render from it.
>
> — `CLAUDE.md §site, verbatim` · full text: [CLAUDE.md](../../../CLAUDE.md)

**Scope note:** create the TS helper + test only. Do **not** rewrite `generate-pdf.mjs` (it is
unwired and T4 handles the `postbuild` script); `cv.astro` is roadmap step 4 and out of scope.

**Fallback:** if the port and the `.mjs` slug diverge on an edge (diacritics, the `|` split), the
**spec's example output** `Roman-Hrupskyi-…-CV.pdf` and "not a generic 'cv' name" (AC-04) win.

## Data delta

No DB changes. Reads `profile.name` + `profile.headline` (shapes unchanged by this task).

## API contract

Internal — no API surface. Exports `cvFilename({ name, headline }): string`.

## Acceptance criteria

### AC-04 (US-05) — cross-context

> **Given** the Profile content specifies Roman's name and headline
> **When** the site is built
> **Then** the CV download is served under a filename derived from that same name and headline
> through the shared filename helper — not a generic "cv" name — and the reconciled name and
> headline in the committed CV match what the landing page shows (enforced in v1 by the release
> parity check, §7; structurally once the CV is generated, next version).
>
> — `spec.md §5, AC-04, verbatim` · full text: [spec.md](../spec.md)

_This task owns the "filename derived through the shared helper" clause. The committed-file-exists
clause is T4; the page-vs-CV parity is a manual release check (spec §7)._

## Checklist

- [ ] `site/src/lib/cv-filename.ts` — `export function cvFilename({ name, headline }: { name: string; headline: string }): string`; internal `slug()` (NFKD, strip non-`[\w\s-]`, trim, spaces→`-`); take the headline segment before the first `|`; return `<slug(name)>-<slug(headlineLead)>-CV.pdf`.
- [ ] `site/src/lib/__tests__/cv-filename.test.ts` — `cv-filename helper derives the name-and-headline filename` (asserts the exact `Roman-Hrupskyi-Senior-Java-Engineer-CV.pdf` for the current profile) + the edge rows below.

## Edge cases

| Case | Behaviour |
|---|---|
| `headline` with no `\|` | whole headline is slugged (no crash) |
| diacritics / non-ASCII in `name` | NFKD-folded, non-word stripped — ASCII-safe filename |
| leading/trailing spaces around the `\|` segment | trimmed before slugging |
| double spaces / punctuation runs | collapse to single `-`, no leading/trailing `-` |

## Definition of Done

- [ ] `cv-filename helper derives the name-and-headline filename` unit test passes (level: unit, per `spec.md` §Test plan AC-04 row).
- [ ] Helper is pure, dependency-free, importable from both `.astro` and a Node script.
- [ ] `npm --prefix site run check` + `lint` clean.
- [ ] `generate-pdf.mjs` untouched; no `cv.astro` change.
