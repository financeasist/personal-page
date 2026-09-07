---
id: T2
title: "Extend the profile content schema + build-time invariants, reshape roman.json"
layer: domain
deps: ["T1"]
blocks: ["T7", "T8", "T9"]
acs: ["AC-05", "AC-06", "AC-07", "AC-14", "AC-15"]
files_hint: ["site/src/content/config.ts", "site/src/lib/content-checks.ts", "site/src/data/profile/roman.json", "site/test/fixtures/"]
owner: "Roman"
estimate: "M"
context_budget: "M"
status: "todo"
---

<!-- Inline the slice the task needs, name where it came from, keep the link as fallback. -->

# T2 — Profile content schema + invariants + roman.json reshape

## Place in the sequence

- **Blocked by:** T1 — Set up the site test harness. · **Blocks:** T7 — About section, T8 — Hero/Availability/Industries, T9 — assemble index.astro. · **Wave:** 2.
- **Lane:** own lane. The schema change and its single content instance (`roman.json`) ship in **one task / one commit** — tightening `config.ts` alone would red the build until `roman.json` matches (compile-coupled), so they are not split.

## Why (user story)

> **As** Roman
> **I want** the page to render entirely from the Profile content entry
> **So that** a one-file edit and commit updates the live page — and the CV — with no code change.
>
> — `spec.md §4, US-07, verbatim` · full text: [spec.md](../spec.md)

This task defines the typed shape + build-time invariants the whole page renders from, and
migrates the one `profile` entry to it with real landing content.

## Inlined context

> **Chosen:** Add landing-specific fields to the same `profile` entry … one JSON file, one Zod
> schema; some fields are consumed only by the landing renderer, some only by the CV renderer,
> most by both.
>
> — `adr/0005 §Decision outcome, abridged` · full text: [adr/0005](../adr/0005-extend-the-single-profile-entry-with-landing-specific-fields.md)

> **Chosen:** Zod schema + `.refine()` in `site/src/content/config.ts` … cross-field rules go in
> `.refine()` / `.superRefine()`. Helper predicates … live in `site/src/lib/content-checks.ts`
> and are unit-tested. Failures name the field.
>
> — `adr/0007 §Decision outcome, abridged` · full text: [adr/0007](../adr/0007-enforce-content-invariants-in-the-schema-at-build-time.md)

**Schema change — apply exactly this** (`data-model.md` §"Schema change (for implement)"):

> 1. `site/src/content/config.ts` — extend the `profile` Zod schema:
>    - add `tagline?` (`z.string().min(1).max(300).optional()`), `topStack` (`z.array(z.string().min(1)).min(4).max(8)`);
>    - add `industries?` (`z.array(z.object({ domain: z.string().min(1), note: z.string().min(1).optional() })).max(6).optional()`);
>    - add `availability: z.object({ status: z.string().min(1), noticePeriod: z.string().min(1).optional(), workAuthorization: z.string().min(1).optional() })` (required);
>    - add `about: z.object({ narrative: z.string().min(1), highlights: z.array(z.string().min(1)).min(1) })` (required);
>    - require `contact.links.min(1)` (was `.default([])`);
>    - remove the free-text `contact.availability` string;
>    - **do not add** a `positioning` field (D-10 — merged into `tagline`);
>    - leave `contact.phones`, `experience[]`, `skills[]`, `summary`, `competencies`, `education` **unchanged**;
>    - append the `.superRefine` block implementing INV-03 (email present + a `linkedin.com` link).
> 2. `site/src/lib/content-checks.ts` (new) — `hasLinkedInLink(links)` predicate; unit-tested.
> 4. `site/src/data/profile/roman.json` — reshape to the new schema; landing-page fields
>    (`about`, `availability`, `topStack`, `tagline`, `industries`) get real values; CV-route
>    fields stay STUB.
>
> — `data-model.md §Schema change, abridged` · full text: [data-model.md](../data-model.md)

**Invariants to enforce (each failure must name the field — AC-05/AC-06):**

> INV-01 headline non-empty · INV-02 `availability.status` non-empty · INV-03 all **three** contact
> channels: `contact.email` valid **and** ≥ 1 `contact.links` entry whose `url` host is
> `linkedin.com` **and** the CV channel (`name` + `headline` present; the committed-PDF check is
> T4's postbuild assertion) · INV-04 field shapes: email has `@`; every `url` parses; no empty
> required string; `topStack` ≤ 8; `tagline` ≤ 300; `industries` ≤ 6 · INV-07 `topStack.length` in
> 4..8 · INV-08 schema carries **no** `salary`/`rate`/`homeAddress`/recruiter-link-label key
> (structural — the shape has no such key) · INV-09 `about.narrative` non-empty **and**
> `about.highlights` ≥ 1 entry, every entry non-empty.
>
> — `data-model.md §Invariants, abridged` · full text: [data-model.md](../data-model.md)

**`roman.json` reshape deltas** (`data-model.md` §"roman.json reshape"):

> - `contact.availability: "Open to Remote & Hybrid Opportunities"` → `availability: { "status": "Open to Remote & Hybrid Opportunities", "noticePeriod": …, "workAuthorization": … }`
> - add `about: { "narrative": <reconciled from linkedin-about.md>, "highlights": [ … ] }`
> - add `topStack` — 4–8 items (trim Roman's ~11-item wording to the cap)
> - keep `tagline` (≤ 300 chars); **remove** the `positioning` key
> - add optional `industries` — e.g. `[{ "domain": "iGaming", "note": "Remote Game Servers (RGS)" }, …]`, ≤ 6, from `linkedin-about.md`
> - `contact.phones` **unchanged**; `contact.links` — keep the single LinkedIn entry
> - content nit flagged for this task: `languages[2]` reads `{ "name": "Poland", "level": "basic" }` — likely meant "Polish"
>
> — `data-model.md §roman.json reshape, abridged` · full text: [data-model.md](../data-model.md)

Narrative + industries source text: [`docs/reference/linkedin-about.md`](../../../reference/linkedin-about.md)
(reconcile "over 8 years" → the canonical **"9+ years"**, spec §1). Highlights are Roman's own
bullets (`screens.md` SCR-05: managing engineers · legacy→startups · monolith→microservices ·
co-located→hundreds worldwide · Java + RDBMS + distributed systems · a "See my LinkedIn profile"
link).

**Fallback:** if a `.superRefine` message can't name the field cleanly, prefer a per-field
`.refine` on the sub-schema so Astro's own error carries the path. Read [data-model.md](../data-model.md)
§Invariants + §Entities in full.

## Data delta

Content-collection document `profile` (embedded sub-objects, no DB). Fields touched:

| Field | Type | Constraints | Change |
|---|---|---|---|
| `tagline` | `z.string().min(1).max(300).optional()` | absent OK; present-but-empty invalid; ≤ 300 | added |
| `topStack` | `z.array(z.string().min(1)).min(4).max(8)` | 4–8 items (INV-07) | added |
| `industries` | `z.array({domain:min(1), note?:min(1)}).max(6).optional()` | absent OK; ≤ 6; empty `domain` invalid | added |
| `availability` | `z.object({status:min(1), noticePeriod?:min(1), workAuthorization?:min(1)})` | required; `status` non-empty (INV-02) | added |
| `about` | `z.object({narrative:min(1), highlights: z.array(min(1)).min(1)})` | required (INV-09) | added |
| `contact.links` | `z.array(link).min(1)` | ≥ 1, one LinkedIn (INV-03) | altered (was `.default([])`) |
| `contact.availability` | free-text string | — | removed (replaced by `availability{}`) |
| `contact.phones`, `experience`, `skills`, `summary`, `competencies`, `education` | — | — | read-only (unchanged) |

— `data-model.md §Entities + §Invariants, abridged` · full text: [data-model.md](../data-model.md)

## API contract

Internal — no API surface.

## Acceptance criteria

### AC-05 (US-08) — domain invariant

> **Given** the Profile content is missing a **required landing field** — Roman's name, the
> headshot (image path *and* its alt text), the headline, the availability status, the location,
> fewer than four entries in the top stack, any of the three contact channels (email, LinkedIn,
> CV — all required), or the About section (`about.narrative` *and* a non-empty `about.highlights`
> list)
> **When** Roman or CI builds the site
> **Then** the build fails with a message naming the missing field, and the incomplete page is
> never published (the invariant "the landing page is always complete" holds).
>
> _The "CV channel" has no Profile-content field of its own: it is satisfied when the committed
> PDF exists at the expected path (postbuild "file exists" assertion) and the name + headline
> needed to derive its filename are present._
>
> — `spec.md §5, AC-05, verbatim` · full text: [spec.md](../spec.md)

_(The headshot path+alt fields sit on the existing schema shape; the committed-PDF half of the CV
channel is T4's postbuild assertion — this task owns name/headline presence + email + LinkedIn.)_

### AC-06 (US-07) — error

> **Given** Roman edits the Profile content and enters a value that does not match the required
> shape — an email address with no "@", an empty headline, a malformed link, a top stack with
> more than eight entries
> **When** Roman builds or commits
> **Then** the build stops and reports which field is invalid and why, and nothing is published
> until it is corrected.
>
> _The optional Tagline and the optional Industries list are exempt: absent is valid;
> present-but-empty is not (an empty `tagline` string, or an `industries` entry with an empty
> `domain`, fails as a malformed value). The Tagline, when present, is capped at ~300 characters;
> `industries` at 6 entries._
>
> — `spec.md §5, AC-06, verbatim` · full text: [spec.md](../spec.md)

### AC-07 (US-01) — authorization (structural half)

> **Then** no salary or rate expectation, no exact home address, no phone number, and none of the
> tracker's per-recruiter link labels appear anywhere in it …
>
> — `spec.md §5, AC-07, abridged` · full text: [spec.md](../spec.md)

_This task's contribution: INV-08 — the schema carries no `salary`/`rate`/`homeAddress`/link-label
key, so such a value cannot enter the content or the page source. The rendered-page half is T6/T9._

### AC-14 (US-10) — happy path (schema half)

> **Given** the Profile content carries `about.narrative` (a non-empty paragraph) and
> `about.highlights` (a non-empty list of short lines) …
> Both `about.narrative` and a non-empty `about.highlights` are build-required (AC-05); an empty
> narrative string or an empty highlights list fails the build (AC-06).
>
> — `spec.md §5, AC-14, abridged` · full text: [spec.md](../spec.md)

### AC-15 (US-11) — content-driven, optional (schema half)

> **Given** the Profile content carries an `industries` list (one to six entries, each a `domain`
> and an optional `note`) **or** omits it entirely … An `industries` entry with an empty
> `domain`, or more than six entries, fails the build with a message naming the field (AC-06).
>
> — `spec.md §5, AC-15, abridged` · full text: [spec.md](../spec.md)

## Checklist

- [ ] `site/src/content/config.ts` — apply the schema deltas above; add the `.superRefine` for INV-03.
- [ ] `site/src/lib/content-checks.ts` (new) — `hasLinkedInLink(links)` (host of a parsed `url` === or ends with `linkedin.com`).
- [ ] `site/src/data/profile/roman.json` — reshape per the deltas; real `about` / `availability` / `topStack` (≤ 8) / `industries` (≤ 6); drop `positioning`; fix `languages[2]` → "Polish".
- [ ] `site/test/fixtures/` — fill `validProfile()` + `missingChannelProfile` / `missingAboutProfile` / `emptyAboutProfile` / `malformedProfile` / `undersizeTopStackProfile` / `oversizeTopStackProfile` / `oversizeTaglineProfile` / `industriesOmittedProfile` / `oversizeIndustriesProfile` (bodies).

## Edge cases

| Case | Behaviour |
|---|---|
| `contact.email` absent (E1) | build fails naming `contact.email` |
| no `linkedin.com` entry in `contact.links` (E2) | build fails naming the missing LinkedIn link |
| `about` object omitted entirely (E4) | build fails naming `about` |
| `about.highlights` is an empty list (E5) | build fails naming `about.highlights` |
| `topStack` < 4 (E6) / > 8 (E10) | build fails naming `topStack` |
| `contact.email` has no `@` (E7) | build fails naming `contact.email` and why |
| `headline` empty string (E8) | build fails naming `headline` |
| a link `url` does not parse (E9) | build fails naming that link |
| `tagline` present but empty (E11) | build fails naming `tagline` |
| `industries` entry empty `domain` (E12) / > 6 entries (E13) | build fails naming the `industries` field |
| `industries` key omitted | build passes; no failure |

## Definition of Done

- [ ] Unit tests (per `spec.md` §Test plan): `schema rejects a profile missing a required landing field`, `schema rejects a malformed field value with a named reason`, `cv-filename`-independent — the schema + `hasLinkedInLink` predicate covered with the `data-model.md` §Test fixtures factories.
- [ ] Integration (real pipeline): `astro build fails and names the missing field` / `… the malformed field`, over an ephemeral fixture content location.
- [ ] `npm --prefix site run build` is green with the reshaped `roman.json`.
- [ ] `npm --prefix site run check` clean; INV-08 holds (no forbidden key in the schema).
- [ ] Every Hard Rule inlined above still holds (single source of truth; locale-clean; `.refine()` in `config.ts`).
