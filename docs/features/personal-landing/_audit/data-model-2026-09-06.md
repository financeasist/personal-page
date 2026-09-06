# Audit — data-model — personal-landing — 2026-09-06

## Outcome

**No relational datastore.** SAD §6 predicted an N/A skip; confirmed. This feature persists
nothing at runtime. Its "data model" is the `profile` **content-collection document**
(`site/src/content/config.ts` + `site/src/data/profile/roman.json`). `data-model.md` is the
finalised field-shape spec for the ADR-0005 (new fields) + ADR-0007 (build invariants)
work, as those ADRs delegated.

## Staged migrations

**None.** No SQL, no migration tool in scope (`architecture-map.md` `migration_tool` =
Flyway, tracker service only). The schema change is a Zod + JSON edit applied by
`implement` under the ADR-0005 / ADR-0007 tasks — see `data-model.md` §"Schema change".
Nothing was written into any live `migrations/` tree (there is none for `site/`).

## Promote-time hint

Nothing to promote.

## Field-shape decisions confirmed with Roman (2026-09-06)

| Decision | Choice |
|---|---|
| Phone lines | `contact.phones: { label, e164 }[]` (min 1) — breaking shape change from `string[]`, needed for the AC-03 no-digit chooser |
| Experience dates | add `startYear` / `endYear` (integer years; `endYear: null` = present); **remove** `dateRange` string; display derived via a shared `formatDateRange()` helper |
| Availability block | `availability: { status (required), workAuthorization? }`; location stays `contact.location`; **dropped** separate remote/relocation field and notice period (status carries the remote stance) |
| topStack | dedicated hand-curated `topStack: string[]` (1–8), **not** derived from `skills` |

## Convention deviations

- The skill's default output (staged `*.up.sql` / `*.down.sql`) does not apply — feature has
  no database. Documented in `data-model.md` §"Scope note". Not a silent divergence.

## Invariants (ADR-0007) — 8 defined

INV-01 headline present · INV-02 availability present · INV-03 four contact channels ·
INV-04 field shapes · INV-05 selected-projects count + non-placeholder impact · INV-06
experience dates sane + non-overlapping · INV-07 topStack size · INV-08 no over-exposure
fields (structural).

## Drift findings

- **Schema drift (resolved by the ADR-0005 task):** 6 new fields absent from live schema;
  `contact.phones`, `contact.availability`, `experienceEntry.dateRange` change shape.
- **Content drift (out of scope — flagged for `implement`):** `roman.json` is mostly STUB
  content (roadmap step 2 / spec §8 reconciliation). `languages[2]` `"Poland"` likely
  means `"Polish"`. The current first phone number has a suspicious digit count — Roman to
  confirm the E.164 value.
- No `_drift/*.sql` — no database to drift against.

## Breaking-change decompositions

None — no live database table, so no expand→backfill→contract. The `contact.phones` shape
change is a one-shot edit to a single hand-authored JSON file committed with the schema
change.

## Open `<!-- TBD -->` / deferred

- Exact "placeholder impact" rule (INV-05) — default documented (≥ 40 chars + 6 blocked
  words); owner Roman/design, due before `sdd:implement` (spec §8).
- Exact non-overlapping employment year ranges (INV-06) — owner Roman, due before
  `sdd:tasks` (spec §8). INV-06 enforces non-overlap once years are set.

## Self-check

4/4 pass (naming ✓ · reversibility N/A—no migration ✓ · FK indexes N/A—no relational store
✓ · convention adherence ✓). Mermaid `erDiagram` validated by structural lint (no `mmdc`
available): valid cardinality glyphs, every relationship labelled, all attribute lines are
`type name` form.

## Next stage

`api personal-landing` — but the feature exposes **no API** (static site, no backend, no
contract). Route is `standard`, so the handoff offers the fast-lane skip: `data-model`'s
N/A condition for `api` (no new/changed endpoint, event, or public signature) holds → next
real stage is `/sdd:screens personal-landing` (there is a `web-frontend` UI surface).
