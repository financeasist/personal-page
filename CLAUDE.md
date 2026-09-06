# CLAUDE.md — conventions for personal-landing

Monorepo, two independent apps. Full rationale + C4 in `docs/architecture-map.md`; ADRs in
`docs/adr/`. This file is the short rule set every contribution must match.

## Layout

```
site/      Astro 5 static site  → GitHub Pages
tracker/   Java 21 / Spring Boot → Fly.io (waw)
docs/      architecture map, ADRs, roadmap, reference PDFs
.github/   CI (on PR) + Deploy (on push to main)
```

The two build, test and deploy independently. No direct code sharing — the browser (served by
`site`) calls `tracker` over HTTPS JSON.

## site

- **Content is the single source of truth.** Profile data lives in one typed Astro content
  collection (`site/src/data/profile/*.json`, schema in `site/src/content/config.ts`). The landing
  page (`index.astro`) and the CV print route (`cv.astro`) both render from it.
- **CV PDF is generated, never committed.** `npm --prefix site run build` runs a `postbuild`
  step (`site/scripts/generate-pdf.mjs`, Playwright/Chromium) that renders `/cv` to a
  meaningfully-named A4 PDF in `dist/` (e.g. `Roman-Hrupskyi-Lead-Java-Engineer-CV.pdf`, not
  `cv.pdf`). A CV content change is a content-collection edit only.
- **`cv.astro` layout is locked** to `docs/reference/cv-template-reference.pdf` — reproduce it,
  don't reshape it. Only section data changes.
- **Styling:** Tailwind v4 with `@theme` tokens in `site/src/styles/global.css`; hand-rolled
  `.astro` components in `site/src/components/`; zero client JS by default (one small inline script
  posts contact-click / cv-download events).
- **Locale-clean:** keep the schema single-shaped and no hard-coded English in non-content-driven
  components — multi-language is a deferred but foundation-compatible direction.
- Node 20+. Commands: `npm --prefix site run build` / `test` / `lint` (`lint` = `astro check`).

## tracker

- **Package layout** under `com.grupskyi.tracker`: `web` (controllers) / `app` (services) /
  `infra` (JDBC repos, Telegram client) / `domain` (records).
- **Constructor injection only** — no field `@Autowired`. Components discovered by scan.
- **Persistence:** Spring Data JDBC `CrudRepository` in `infra`; no JPA, no lazy loading.
  `visit_event` is **append-only** — never write an `UPDATE`/`DELETE` code path.
- **IDs:** `visit_event.id` = `bigint generated always as identity`; order by
  `created_at timestamptz default now()`. `recruiter_link.label` is a human-chosen slug PK.
- **Error handling:** one `@RestControllerAdvice` → `{ "error": <code>, "message": <text> }`.
  Event-ingest endpoints are **fire-and-forget**: log a DB/logging failure server-side and still
  return `202` — never a 5xx to the browser.
- **Migrations:** Flyway, `V<n>__<snake_case>.sql` in
  `tracker/src/main/resources/db/migration/`; forward-only, keep each small and
  reversible-by-hand.
- **Redirect latency:** `/t/{label}` is on a recruiter's click path — no heavy work before the
  302, Fly machine stays warm (`min_machines_running = 1`).
- **Tests:** JUnit 5. Unit = plain classes. Integration = `@SpringBootTest` + Testcontainers
  Postgres (extend `AbstractIntegrationTest`). Needs a running Docker daemon.
- Java 21. Commands: `./mvnw -f tracker/pom.xml package` / `test` / `spotless:check`.

## Deploy

- `.github/workflows/ci.yml` on PR: site (`npm run check` + `build`) + tracker (`./mvnw verify`).
- `.github/workflows/deploy.yml` on push to `main`: site → GitHub Pages, tracker → Fly.io.
- Secrets (`FLY_API_TOKEN`, Fly secrets for `DATABASE_*` / `TELEGRAM_*`) are never committed.
