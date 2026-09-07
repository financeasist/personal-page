# data-model audit — personal-landing — 2026-09-07 (`--drift-only` re-sync)

Re-sync pass after the 2026-09-07 2nd-clarify scope cut (spec.md §1 "Scope narrowing" / §8
follow-up "Re-sync `sad.md` and `data-model.md`"). No full re-run — the feature still has
**no datastore, no migration, no SQL**.

## Staged migrations

**None.** No `migrations/` tree for `site/`, no migration tool in scope
(`architecture-map.md` `migration_tool` = Flyway, tracker only). The schema change is a
Zod / TypeScript edit + a JSON reshape, applied by `implement` under the ADR-0005 /
ADR-0007 tasks (`data-model.md` §"Schema change"). Nothing to promote.

## What changed vs `data-model-2026-09-06.md`

| # | Change | Driver |
|---|---|---|
| 1 | **ADD `about` embedded object** — `narrative` (required, non-empty) + `highlights` (required, ≥ 1 non-empty). New **INV-09**. | US-10 / AC-14 added to the spec 2026-09-07. |
| 2 | **`contact.phones` — reshape DROPPED.** Kept as the live `z.array(z.string())`. The `{ label, e164 }` shape was for the AC-03 no-digit chooser, now withdrawn. Phone renders **only on the CV route**. | Spec §1 — phone removed from the landing page (not deferred). |
| 3 | **DROP `selectedProjects` + `selectedProject` + INV-05** from the v1 schema (documented as v2-additive). | US-09 deferred to v2. |
| 4 | **DROP `experienceEntry.startYear` / `endYear` + INV-06**; `experienceEntry` reverts to the live shape (free-text `dateRange` kept). | US-04 deferred to v2; timeline needed the machine-readable years, CV route does not. |
| 5 | **DROP `earlierBackground`** from the v1 schema. | US-04 deferred to v2. |
| 6 | **`topStack` min 1 → 4** (INV-07 now `4..8`). | Spec §6 / `CONTEXT.md` — "min 4, max 8, build-enforced". |
| 7 | **`availability` gains optional `noticePeriod`.** | `CONTEXT.md` Availability-block definition (reconciled 2026-09-07) + spec §1 both list notice period. |
| 8 | `feature_size` frontmatter M → S (mirrors `.size`). | `.size` updated 2026-09-07. |

## Convention deviation flagged

**`availability.noticePeriod` reverses a prior data-model decision.** The 2026-09-06 doc
explicitly dropped `noticePeriod` "per Roman, 2026-09-06". The 2026-09-07 `CONTEXT.md`
reconciliation and spec §1 both put notice period back in the Availability block. This
re-sync follows the newer, authoritative artifacts and adds it as **optional** (absent is
valid — no content burden). **Roman to confirm or veto** — a one-word answer either way.

## Drift findings

Full table in `data-model.md` §"Drift check". Summary:

- **field-without-column:** `tagline`, `positioning`, `topStack`, `availability{}`,
  `about{}` — all NEW, added by the schema task. (`roman.json` already carries `tagline` +
  `positioning` keys, currently silently stripped — not yet in `config.ts`.)
- **shape-mismatch:** `contact.links` `.default([])` → `.min(1)`; `contact.availability`
  string → top-level `availability{}` object.
- **column-without-field:** `contact.availability` string — intentionally replaced, no
  orphan after the task.
- **reverted (was flagged 2026-09-06):** `contact.phones` shape now matches live;
  `experienceEntry.dateRange` kept.
- **content drift (out of scope — for `implement`'s content task):** CV-route fields
  (`competencies`, `summary`, `skills`, `experience`) are STUB; `languages[2]` reads
  `"Poland"` (likely "Polish"); `contact.phones[0]` = `"+38 063 199 08484"` has a
  digit-count problem.

No `_drift/*.sql` — no database.

## Breaking-change decompositions

None — no table, no running system, build-time only.

## Self-check (4 mandatory + additive)

| Check | Result |
|---|---|
| Naming matches repo convention | PASS — camelCase + Zod vocabulary, matches `config.ts`. |
| Down / reversibility | N/A — no migration; `git revert` of the `config.ts` + `roman.json` commit. |
| FK indexes | N/A — no relational store, no FK, no query. |
| Convention adherence | PASS — follows ADR-0001 / 0005 / 0007 / 0008; the SQL-migration default is N/A (no datastore), flagged in the scope note. |
| Deferred fields stay additive | PASS — `selectedProjects`, `startYear`/`endYear`, `earlierBackground` documented but not added; v2 features re-sync this doc without a reshape. |
| erDiagram | Structural lint only (no `mmdc` on this machine) — valid cardinality glyphs, `type name` attribute lines. PASS. |

## Second edit — 2026-09-07 (ratified screens divergences folded in)

After the divergences were settled with Roman (D-1/D-3/D-7/D-10 all ratified):

- **D-7 folded in:** added optional `industries` list (`z.array({ domain, note? }).max(6).optional()`) —
  hero right column, US-11 / AC-15. Optional → no build failure when absent.
- **D-10 folded in:** removed `positioning` from the target schema; `tagline` now allows a
  sentence or two with a ~300-char cap (was an implied one-liner). `roman.json`'s
  `positioning` key is dropped.
- Fixtures: `oversizePositioningProfile` → `oversizeTaglineProfile`; added
  `industriesOmittedProfile` / `oversizeIndustriesProfile`.
- D-1/D-3 (contact in a sticky Header, mobile hamburger menu) are a component/layout
  decision — no schema impact; ratified in spec + `sad.md` §5.

## Open items

- Exact employment date ranges + per-project impact statements — moved to **v2** by the
  2nd clarify (no longer v1 blockers).
- Roman to fill real values for `about.narrative` / `about.highlights` / `industries` /
  `availability.noticePeriod` in `roman.json` (before or during `implement`).

## Next stage

Per `.route` = `standard`: `sad.md` §5 + crosscutting re-sync **done** (this pass) → then
`/sdd:plan-tests personal-landing`. `api` stays N/A (no contract change — commit `7f90bb3`).
