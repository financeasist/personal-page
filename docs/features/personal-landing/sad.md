---
status: Draft
owner: "Roman (Architect / Tech Lead)"
reviewers: ["Roman"]
updated_at: "2026-09-07"
feature_size: "S"
target_surfaces: [web-frontend]  # single static web front-end; read (never re-derived) by api/sequences/tasks/plan-tests/review → _shared/surfaces.md
---

# Software Architecture Document — personal-landing

<!-- 12 Arc42 sections. C4 Context (L1) inline in §3, C4 Container (L2) inline in §5.
     Numbers in §10 come VERBATIM from spec.md §6 NFR. -->

## 1. Introduction and goals

**Intent.** Build one static landing page (`site/src/pages/index.astro`) that lets a **Recruiter** judge Roman's fit in a twenty-second above-the-fold scan and reach him through email, LinkedIn, or a CV download from a persistent header, and lets **Roman** publish every change by committing a single content file. The page renders entirely from the one typed **Profile content** entry that also feeds the CV route. This feature is roadmap step 3; the stack (Astro 5 static site, Tailwind v4, typed content collection, zero client JS) is fixed upstream by `docs/architecture-map.md` and ADR-0001–0004 (ADR-0004 amended for v1 by ADR-0008 — v1 ships a committed static CV PDF).

<!-- Re-synced 2026-09-07 to the S-size scope (spec.md §1 "Scope narrowing" / §8, screens.md commit
     0fbb877, ux-flows.md commit b75fc9f). §6 was re-synced separately (commit 9930320). Changes:
       - phone removed from the landing page (US-03 / AC-03 withdrawn) — PhoneChooser dropped
       - experience timeline (US-04) + selected work (US-09) deferred to v2 — ExperienceTimeline,
         SelectedProjects, ProjectCard dropped; selectedProjects / earlierBackground / machine-
         readable experience years are v2-additive on the same entry
       - About section added (US-10 / AC-14) — AboutMe component + required about.narrative/highlights
       - contact actions (now THREE: email, LinkedIn, Download CV) move into a persistent, sticky,
         CSS-only Header; mobile condenses to name + email/LinkedIn icons + a native <details> menu
         (ratified divergence D-1 / D-3)
       - optional Industries list in the hero's right column (ratified divergence D-7) — new optional
         industries content field
       - tagline absorbs the positioning block (ratified divergence D-10) — positioning field removed
       - CV PDF generator container removed per ADR-0008 (committed static file, not generated) -->


**Top-3 quality goals (1-liners; full scenarios in §10):**

1. **Above-the-fold render speed** — the scan is usable within 2.5 s on a mid-tier phone over 4G.
2. **Never ship a broken or incomplete page** — missing or malformed Profile content fails the build; nothing incomplete deploys.
3. **Zero-JavaScript, accessible delivery** — the page and every contact action work with no client script, at ≥ 95 Lighthouse accessibility.

**Stakeholders.**

| Role | Interest | Sign-off owner? |
|---|---|---|
| Recruiter | Opens the link, scans fit, makes contact | No |
| Roman | Authors the Profile content, owns the page, reads analytics later | Yes |
| Tech Lead (Roman) | SAD approval | Yes |

<!-- Decision overrides (¶4) — populated by the critic resolution loop, empty otherwise. -->

## 2. Constraints

**Technical.**
- Node 20+; Astro 5 (static output); TypeScript; Tailwind v4 with `@theme` tokens in `site/src/styles/global.css`.
- Content in a typed Astro content collection — `site/src/data/profile/*.json`, Zod schema in `site/src/content/config.ts`. One `profile` entry is the single source of truth for the landing page **and** the CV route.
- Zero client JavaScript by default (ADR-0001); the click-tracking beacon is roadmap step 8, not this feature.
- The CV print route (`site/src/pages/cv.astro`) layout is locked to `docs/reference/cv-template-reference.pdf` (ADR-0004) — this feature does not touch it, but shares the content entry and the CV-filename helper with it.
- Build/test/lint: `npm --prefix site run build` / `check` (`astro check`) / `lint`.

**Organisational.**
- Solo developer (Roman). Effort budget: about one week.
- Deadline: "live within the week" — soft; ship-fast beats ship-complete.
- Roadmap step 4 (CV PDF route) is sequenced to land together with this feature.

**Conventions.**
- `CLAUDE.md` (repo root) + `docs/architecture-map.md` §Conventions.
- Hand-rolled `.astro` components in `site/src/components/`; no component kit.
- Locale-clean: no hard-coded English in non-content-driven markup — copy comes from Profile content or is structural.

**Regulatory / external.**
- EU data protection: the only personal data is Roman's own, self-published. No visitor data is collected by this feature (tracking is roadmap steps 6–8). Security review N/A (spec §6.1).

## 3. Context and scope

The landing site is a public, statically-hosted page. A **Recruiter** reaches it through a link Roman puts in his CV, LinkedIn, or outreach email (or, later, a labelled `/t/{label}` redirect — roadmap step 5, not part of this feature) and interacts with it entirely client-side: reading, scrolling, and activating contact actions that hand off to the recruiter's own mail client or browser. **Roman** changes what the page shows only by editing the Profile content entry and committing; GitHub Actions builds and deploys. There is no runtime backend and no external service call from the delivered page. The trust boundary is the git repository: the only input that shapes the page is content Roman commits, validated at build time.

<!-- brownfield: the Astro site skeleton, the `profile` content collection + Zod schema, `index.astro`/`cv.astro` stubs, and the GitHub Pages deploy workflow already exist (scaffold, commit b1583df). This feature fills them in. `docs/architecture-map.md` reflects_commit a647c5d (pre-scaffold) but describes the same target baseline. -->

**External systems (in / out):**

| Actor or system | Type | Interaction |
|---|---|---|
| Recruiter | Person | Opens the page over HTTPS; reads; activates contact actions (all client-side) |
| Roman | Person | Edits the Profile content entry, commits to the repo |
| GitHub Actions | System (external) | Builds the site on push to `main`, renders the CV PDF, deploys |
| GitHub Pages | System (external) | Serves the static page over HTTPS |
| Recruiter's device apps | System (external) | Mail client, browser — receive the contact-action hand-offs (`mailto:` / new tab / file download) |

**C4 Context (L1):**

```mermaid
C4Context
    title personal-landing — System Context

    Person(recruiter, "Recruiter", "Scans Roman's fit in ~20s, wants one-tap contact")
    Person(roman, "Roman", "Edits the Profile content entry and commits")

    System(site, "Landing site", "Static Astro page on GitHub Pages, rendered from one Profile content entry")

    System_Ext(actions, "GitHub Actions", "Builds, validates content, renders the CV PDF, deploys on push to main")
    System_Ext(pages, "GitHub Pages", "Serves the static page over HTTPS")
    System_Ext(devices, "Recruiter device apps", "Mail client / browser that receive contact hand-offs")

    Rel(roman, site, "Edits content, commits", "git")
    Rel(site, actions, "Built and deployed by", "CI on push")
    Rel(actions, pages, "Publishes static output to", "deploy")
    Rel(recruiter, pages, "Reads the page", "HTTPS")
    Rel(recruiter, devices, "Contact action opens a channel", "mailto / https / download")
```

## 4. Solution strategy

**Target surface:** `web-frontend` — one statically-generated web page. No backend, no API, no other surface. (The CV PDF route is a sibling feature; the tracker is a separate service.) **UI architecture:** static site generation (SSG) — the page is fully rendered at build time; there is no SPA, no hydration, no client router. This is inherited from ADR-0001, restated here as this feature's UI-architecture decision; it does not cross the blast-radius gate (already locked upstream) so it is recorded inline, not as a new ADR.

**Top strategic choices (the seeds for ADRs):**

1. **One Profile content entry, extended with landing-specific structured fields** — the landing page needs data the CV template does not carry (a `tagline`, a curated `topStack`, a structured `availability` block, an `about` section, an optional `industries` list). These are added as fields on the same `profile` entry rather than a separate collection or derived implicitly from CV fields, so the "one source, two renderers" invariant holds and nothing drifts. The v2 sections — `selectedProjects` with impact, machine-readable experience years, an `earlierBackground` line — extend the same entry additively when they land. → **ADR-0005**.
2. **Contact details are actionable-only, in link attributes, zero client JavaScript** — email / LinkedIn never render as visible text on the landing page; each is a plain link (`mailto:` / `https:` new tab). The phone is not a landing-page channel in v1. The three contact controls live in a persistent, sticky, CSS-only `Header`; on the phone viewport the header condenses to Roman's name, the email + LinkedIn icon controls, and a native `<details>` disclosure menu holding Download CV and an About link. No script assembles or obfuscates the values in v1. → **ADR-0006** (resolves spec §8 Q3).
3. **Content invariants enforced at build time in the content-collection schema** — required fields (including a non-empty `about.narrative` and a non-empty `about.highlights`), all three contact channels present (email, LinkedIn, and the committed CV PDF): expressed as Zod schema rules (`.refine`) so `astro check` / the build fails and names the offending field. No incomplete page can deploy. → **ADR-0007**.

Tactical decisions (hand-rolled components, the shared CV-filename helper, image optimisation via `astro:assets`) trace to these seeds and to the repo conventions; they are recorded in §5 / §8, not as ADRs.

## 5. Building block view

Layered by responsibility within a single static-site build: **content** (the typed entry + schema + invariants), **presentation** (page + hand-rolled components), **shared helpers** (CV filename, content-invariant checks), **assets** (the optimised headshot). There is no domain/app/infra split — nothing runs at request time.

**Internal decomposition:**

```
site/
├── src/
│   ├── data/profile/roman.json         one Profile content entry (single source of truth)
│   ├── content/config.ts               Zod schema + .refine() content invariants  (ADR-0007)
│   ├── pages/
│   │   ├── index.astro                 the landing page — THIS feature
│   │   └── cv.astro                    CV print route — roadmap step 4 (shares content + helper)
│   ├── components/
│   │   ├── Header.astro                persistent sticky top bar (CSS only) — name + ContactActions;
│   │   │                               mobile: name + email/LinkedIn icons + a native <details> menu (Download CV, About)
│   │   ├── Footer.astro                copyright line, flush to the viewport bottom (min-height:100vh page)
│   │   ├── Section.astro               below-the-fold section wrapper
│   │   ├── Hero.astro                  above-the-fold: headshot, name, headline, optional tagline, AvailabilityBlock, optional Industries
│   │   ├── AvailabilityBlock.astro     status / location / optional notice / optional work auth
│   │   ├── ContactActions.astro        the three labelled controls, rendered inside Header (ADR-0006); each carries a stable data-* hook for step 8
│   │   ├── Industries.astro            optional hero list — domain + optional note (renders only when present)
│   │   └── AboutMe.astro               below-the-fold About section — narrative + highlights (US-10)
│   ├── lib/
│   │   ├── cv-filename.ts              name + headline → "Roman-Hrupskyi-…-CV.pdf"  (shared with cv.astro; generate-pdf.mjs is v2)
│   │   └── content-checks.ts           the LinkedIn-link predicate used by config.ts refinements
│   ├── assets/roman.jpg                optimised headshot (via astro:assets)
│   └── styles/global.css               Tailwind v4 @theme tokens
└── public/<Roman-Hrupskyi-…-CV.pdf>    v1 — hand-committed CV PDF (ADR-0008); build asserts it exists
```

*(v2 additions on the same entry: `ExperienceTimeline` + `SelectedProjects` + `ProjectCard`
components, and `scripts/generate-pdf.mjs` when build-time CV generation returns.)*

**C4 Container (L2):**

```mermaid
C4Container
    title personal-landing — Containers

    Person(recruiter, "Recruiter")
    Person(roman, "Roman")

    Container_Boundary(build, "Site build (GitHub Actions)") {
        Container(content, "Profile content + schema", "JSON + Zod (astro:content)", "One typed entry; build-time invariant checks")
        Container(astro, "Astro static build", "Astro 5 / Tailwind v4", "Renders index.astro (+ cv.astro) to static HTML/CSS/img")
        Container(cvpdf, "Committed CV PDF", "static file in site/public/", "v1 — hand-maintained (ADR-0008); postbuild asserts the named file exists")
    }

    Container(pages, "Static page", "HTML + CSS + images on GitHub Pages", "The delivered landing page — zero JavaScript")

    System_Ext(devices, "Recruiter device apps", "Mail client / browser")

    Rel(roman, content, "Edits + commits", "git")
    Rel(roman, cvpdf, "Hand-maintains + commits", "git")
    Rel(content, astro, "Validated content feeds the render")
    Rel(astro, cvpdf, "asserts the name-derived file exists (postbuild)")
    Rel(astro, pages, "Publishes static output + the committed CV PDF", "deploy")
    Rel(recruiter, pages, "Reads the page", "HTTPS")
    Rel(recruiter, devices, "Contact action opens a channel", "mailto / https / download")
```

## 6. Runtime view

The runtime view has two theatres: the **client side** (a Recruiter reading a static page and handing off to their own apps — Flows 1–3) and the **build/deploy pipeline** (Roman publishes a content change — Flow 4). There is no request-time service and no datastore; every error the spec demands is a build-time gate (Flow 4) or an accepted unresolved hand-off (Flow 2). Participants are concrete, matching the §3 / §5 C4 models.

<!-- Re-synced 2026-09-07 to the phone-out / About-in scope (spec.md, ux-flows.md commit b75fc9f):
     the phone-line chooser flow (was Flow 3, US-03) and the depth-sections flow (was Flow 4,
     US-04/US-09) are removed — phone withdrawn from v1, experience timeline + selected projects
     deferred to v2; a new Flow 3 covers the About section (US-10 / AC-14). -->

### Flow 1 — Recruiter scans the landing page

*Realises US-01, US-06. Covers AC-01 (laptop scan) and AC-08 (phone viewport).*

```mermaid
sequenceDiagram
    actor Recruiter
    participant Pages as GitHub Pages
    participant Page as Landing page (static)
    Note over Page: Precondition: a completed build published the page (Flow 4) — every above-the-fold essential is present
    Recruiter->>Pages: open the shared link
    Pages-->>Recruiter: static HTML + CSS + optimised headshot (0 KB JavaScript)
    Recruiter->>Page: scan above the fold (SCR-01)
    alt reference laptop viewport 1280x800
        Page-->>Recruiter: headshot, name, headline, availability (location + remote stance), top stack, three contact actions — no scrolling
    else phone viewport 390x844
        Page-->>Recruiter: same essentials, single column, tap targets at least 44x44 px, no horizontal scroll
    end
    Note over Recruiter,Page: Postcondition: Recruiter can state seniority, stack, location, availability — continues to Flow 2, scrolls to Flow 3, or leaves
```

### Flow 2 — Recruiter makes contact

*Realises US-02, US-05. Covers AC-02 (email), AC-13 (LinkedIn tab, CV download), AC-04 (download side), AC-10 (no visible contact text), AC-07 (runtime half — no visible contact text, phone absent).*

```mermaid
sequenceDiagram
    actor Recruiter
    participant Page as Landing page (static)
    participant Device as Recruiter device app
    Note over Page: Precondition: the three contact controls rendered (email, LinkedIn, Download CV) — email and LinkedIn values live only in link attributes, never as visible text (ADR-0006, AC-10). No phone control on the page in v1 (AC-07)
    Recruiter->>Page: activate a contact action
    alt email
        Page->>Device: hand off mailto addressed to Roman
        Device-->>Recruiter: mail client opens a pre-addressed message, no further steps
    else LinkedIn
        Page->>Device: hand off https link opening in a new tab
        Device-->>Recruiter: LinkedIn profile opens in a new tab and the landing page stays open
    else Download CV
        Page->>Device: hand off the committed named PDF as a file download
        Device-->>Recruiter: named PDF saved to the device, not opened inline
    end
    alt the channel has no handler app on the device
        Device-->>Recruiter: action does not resolve — accepted, with no copyable-text fallback (ADR-0006) — LinkedIn and CV still work
    end
    Note over Recruiter,Device: Postcondition: Recruiter continues in their own tool
```

### Flow 3 — Recruiter reads the About section

*Realises US-10. Covers AC-14 (About renders from Profile content, phone reflow).*

```mermaid
sequenceDiagram
    actor Recruiter
    participant Page as Landing page (static)
    Note over Page: Precondition: the build enforced a non-empty about.narrative and a non-empty about.highlights list (AC-05, AC-06) — the section never renders blank
    Recruiter->>Page: scroll one screen below the fold (SCR-05)
    Page-->>Recruiter: About section — narrative paragraph + highlights list, rendered straight from Profile content, no hard-coded copy
    alt phone viewport 390x844
        Page-->>Recruiter: single column, body text at least 16 px, no horizontal scroll
    end
    Note over Recruiter,Page: Postcondition: Recruiter scrolls back up to a contact action (Flow 2) or leaves
```

### Flow 4 — Roman publishes a content change

*Realises US-07, US-08. Covers AC-05 (missing required field, incl. `about.*`), AC-06 (malformed field), AC-04 (named-PDF present at build).*

```mermaid
sequenceDiagram
    actor Roman
    participant Repo as Profile content (git)
    participant CI as GitHub Actions
    participant Pages as GitHub Pages
    Note over Roman,Repo: Precondition: the edit is confined to the one profile entry (roman.json) — no code change
    Roman->>Repo: commit an edit to the Profile content
    Repo->>CI: push to main triggers the build
    CI->>CI: validate content — Zod schema + refine() invariants (ADR-0007)
    alt a required field is missing (name, headshot path or alt, headline, availability, location, fewer than four top-stack entries, any of the three contact channels, about.narrative, or a non-empty about.highlights)
        CI-->>Roman: build fails, naming the missing field — nothing deploys (AC-05)
    else a field is malformed (email without an @, empty headline, malformed link, more than eight top-stack entries, fewer than four, present-but-empty tagline)
        CI-->>Roman: build fails, naming the field and why — nothing deploys (AC-06)
    else content valid
        CI->>CI: render index.astro and cv.astro
        Note over CI: verifies the committed name-derived CV PDF exists at the expected path — filename derived via the shared cv-filename helper (AC-04, ADR-0008). A missing PDF fails the build
        CI->>Pages: deploy static output (HTML + CSS + images + the committed CV PDF)
        Pages-->>Roman: page live
    end
```

### Flagged for `data-model` / follow-up

- **No datastore, no schema.** No flow has a persist step against a datastore. The only build-time artefact is the committed CV PDF (Flow 4, ADR-0008) — verified to exist, not generated in v1. `data-model` has no entity, column, or index to design for this feature — expect an N/A skip to `api`.
- **Pipeline trigger, drawn as sync.** Flow 4's `push to main triggers the build` is event-driven, but it is an internal CI trigger, not a third-party callback — no idempotency key, retry note, or dead-letter branch is warranted. GitHub Actions' own re-run semantics are outside this view.
- **AC-07 is only partly runtime.** The "no visible contact text" / "no phone control" half is the `Note` in Flow 2. The "no salary / no home address / no per-recruiter link labels anywhere in the delivered source" half is a build-output / source-inspection property with no runtime flow — verified by `plan-tests`, not shown here.
- **Withdrawn / deferred (no flow, by design):** AC-03 (phone control — removed from v1 with US-03), AC-09 (experience timeline — deferred to v2 with US-04), AC-11 / AC-12 (selected projects + placeholder-impact rule — deferred to v2 with US-09).
- **US-11 (Industries list, AC-15) has no dedicated flow.** It is static, optional hero content with no interaction and no error branch — part of the Flow 1 scan. Present → rendered from the `industries` field; absent or collapsed on the phone viewport (§6 drop order) → the hero renders without it. Covered by `ux-flows.md` (Flow US-11) and `screens.md` SCR-01; a sequence diagram would add nothing.

## 7. Deployment view

Reuses the scaffold's deployment unit unchanged: GitHub Actions builds `site/` on push to `main` (`npm --prefix site run build` = `astro build` + the `postbuild` Playwright/Chromium PDF step) and deploys the static output to GitHub Pages. `astro build` validates the `profile` content collection against the Zod schema **and its `.refine()` invariants** and fails on any violation — this is what gates the deploy (ADR-0007). `astro check` (type-checking) and `astro` lint run as separate CI steps on pull requests only (`ci.yml`), not on the deploy path; `tasks` should add `npm run check` + the invariant unit tests to `deploy.yml` so a direct push to `main` is also type-gated. No server, no container, no datastore for this feature. The build job already installs Chromium for the PDF (scaffold).

**Monitoring:**
- No runtime monitoring — the page is static files on a CDN.
- Build health: the GitHub Actions run is the signal; a red build blocks the deploy.
- Lighthouse (LCP, weight, accessibility) is run manually pre-launch and after significant content changes; wiring it into CI is a later improvement (§11).

**Scaling thresholds:**
- Static hosting on GitHub Pages — effectively unbounded read traffic; no scaling action for this feature at any realistic recruiter volume.
- Page weight budget ≤ 500 KB transferred (§10) — the headshot is the only large asset and is optimised at build (§8).

## 8. Crosscutting concepts

| Concept | Convention | Where defined |
|---|---|---|
| Single source of truth | The landing page and the CV route both render from one `profile` entry; no page-specific copy in components | `CONTEXT.md` invariant · ADR-0005 |
| Content validation | Zod schema + `.refine()` invariants (required fields incl. `about.narrative` + `about.highlights`, all three contact channels: email, LinkedIn, committed CV) fail the build and name the field | ADR-0007 · `site/src/content/config.ts` |
| Client JavaScript | None. Progressive enhancement only; the mobile header menu is a native `<details>` disclosure; contact actions are plain links | ADR-0001 · ADR-0006 |
| Contact-detail exposure | Email / LinkedIn never rendered as visible text on the landing page; values live only in the header controls' link attributes; not obfuscated in v1 (revisit — §11). Phone is not a landing-page channel in v1 | ADR-0006 · `CONTEXT.md` invariant |
| Images | Headshot processed by `astro:assets` — responsive sizes, modern format, explicit dimensions, eager + high fetch-priority for the LCP element | §5 `src/assets/` · here |
| Accessibility | Semantic HTML, one `<h1>`, keyboard-operable controls, body text ≥ 16 px, interactive targets ≥ 44×44 px (WCAG 2.5.8), Lighthouse a11y ≥ 95 | spec §6 · here |
| Tracking hooks (for step 8) | Every header contact control carries a stable `data-contact-channel` (`email` / `linkedin`) or `data-cv-download` attribute; roadmap step 8's inline beacon script binds to these — no markup change needed then | spec §3 · `architecture-map.md` §Frontend · here |
| Error handling | Build-time only — a validation failure stops the build with a named field. No runtime error path exists (static delivery) | ADR-0007 |
| Localisation | Single language (English) in v1; schema and components stay locale-clean so a per-locale entry is additive later | `architecture-map.md` §Constraints |
| Observability / logging | N/A at runtime (static files); build logs are the GitHub Actions run | — |
| CV filename | Derived from `name` + `headline` by `site/src/lib/cv-filename.ts`, shared by `index.astro` and `cv.astro` (`generate-pdf.mjs` is v2) — never hand-copied. In v1 the postbuild step asserts the committed `site/public/` PDF exists at the derived name | §5 `lib/cv-filename.ts` · `docs/adr/0004` (amended by ADR-0008) |

## 9. Architecture decisions

| # | Title | Status | Section |
|---|---|---|---|
| 0005 | Extend the single profile entry with landing-specific structured fields | Accepted | §4 |
| 0006 | Contact details as actionable-only link attributes, zero client JavaScript | Accepted | §4 |
| 0007 | Enforce content invariants in the content-collection schema at build time | Accepted | §4 |
| 0008 | CV delivery is a committed static PDF in v1 | Accepted | §4, §11 |

Inherited foundational ADRs (not re-decided here): `docs/adr/0001` (Astro static site + typed content collection), `0004` (CV PDF generated from a print route at build time — **amended for v1 by ADR-0008**: v1 ships a committed static PDF; build-time generation resumes at roadmap step 4).

ADR files live under `docs/features/personal-landing/adr/NNNN-<title>.md`.

## 10. Quality requirements

**QG-1. Above-the-fold render speed**
- **When:** a Recruiter opens the page on a mid-tier mobile device over throttled 4G (Lighthouse "mobile" preset).
- **Then:** Largest Contentful Paint ≤ 2.5 s; initial page weight ≤ 500 KB transferred; 0 KB of client JavaScript shipped by this feature.
- **How verify:** Lighthouse mobile audit run manually pre-launch; build-output inspection for the JS figure; build size report for weight.

**QG-2. Never ship a broken or incomplete page**
- **When:** the Profile content is missing or has a malformed required field — no headline, no availability status, no location, a missing/empty `about.narrative` or an empty `about.highlights`, fewer than four `topStack` entries, any of the three contact channels absent (email, LinkedIn, or the committed CV PDF), or a malformed value (email without an `@`, unparseable link, more than eight `topStack` entries, present-but-empty `tagline`).
- **Then:** 100% of missing / malformed required fields fail the build, which names the offending field; nothing is published.
- **How verify:** `astro build` enforces the content-collection schema and its `.refine()` invariants and gates the deploy (ADR-0007); unit tests over the invariant predicates with fixture profiles; `astro check` on pull requests (and, once `tasks` adds it, on the deploy path).

**QG-3. Zero-JavaScript, accessible, correctly-scaled delivery**
- **When:** a Recruiter uses the page with JavaScript disabled, or with a keyboard / screen reader, on any viewport from 360 to 1920 px wide.
- **Then:** every contact action works; Lighthouse Accessibility ≥ 95; every interactive element is keyboard-reachable and operable; body text ≥ 16 px; interactive targets ≥ 44×44 px; no horizontal scroll at 360 / 768 / 1280 / 1920 px width; and every above-the-fold essential is visible with no scrolling at 1280×800 (reference laptop) and 390×844 (reference phone).
- **How verify:** Lighthouse mobile audit + manual keyboard pass + manual responsive check at the four widths + manual above-the-fold check at 1280×800 and 390×844, all pre-launch.

## 11. Risks and technical debt

| Risk / debt | Severity | Mitigation | Owner |
|---|---|---|---|
| Committed CV PDF drifts from the page (surname / headline / dates) — the "two divergent CVs" problem the feature exists to fix | Medium | ADR-0008: v1 ships a hand-committed PDF under `site/public/`; a missing file fails the build (postbuild "file exists" assertion). Manual page-vs-CV parity check each release + each content edit; revisit trigger = build-time generation returns (roadmap step 4 / v2) | Roman |
| Headshot asset is ~2 MB — blows the 500 KB page-weight budget if shipped raw | Medium | `astro:assets` optimisation, responsive sizes, target < 100 KB at display size; checked in the QG-1 Lighthouse pass | Roman |
| Optional `tagline` + `industries` list together push the header contact actions off the fold at 390×844 (AC-08) | Low | Schema caps `tagline` at ~300 chars (`data-model`); both fields optional so the tight layout is opt-in; §6 drop order (Industries → Tagline → top-stack truncates) + manual above-the-fold check at 390×844 in the QG-3 pass | Roman |
| Lighthouse checks (and `astro check` on the deploy path) are manual / PR-only, not on push to `main` — quality can regress silently on a later direct content edit | Low | `tasks` adds `npm run check` + invariant unit tests to `deploy.yml`; document the pre-launch Lighthouse checklist; wire Lighthouse CI as a later improvement | Roman |
| Ratified screens divergences (D-1 header contact / D-3 header+footer chrome / D-7 industries list / D-10 tagline absorbs positioning) landed after the SAD's first pass | Low | Resolved 2026-09-07 in spec §1/§4/§5 + `CONTEXT.md` + this re-sync; `screens.md` § Divergence tracks them as RESOLVED | Roman |

**Accepted debt (acceptable in v1, plan to fix later):**
- Contact values obfuscation: **resolved for v1 by ADR-0006** — link-attributes-only, no script. Casual scraping is still possible (the values are in the `href`s); the same data is in Roman's public CV. Revisit trigger: observed scraping abuse → switch to script-assembled-on-click (spec §8 Q3).
- No automated visual-regression or Lighthouse gate in CI — manual pre-launch checks only.

## 12. Glossary

Domain terms are canonical in `CONTEXT.md` (Recruiter, Roman, Profile content, Availability block, Contact action, About section, Industries list, Above-the-fold scan, Headline, Tagline, Top stack, Experience timeline *(v2)*, Selected project *(v2)*, Impact statement *(v2)*, Labelled link). SAD-specific terms:

| Term | Meaning |
|---|---|
| SSG (static site generation) | The whole page is rendered to HTML/CSS/images at build time; no server rendering, no client hydration, no router |
| Content invariant | A rule the Profile content must satisfy to build — e.g. "all three contact channels present", "the About section is complete (non-empty narrative + at least one highlight)"; expressed as a Zod `.refine()` |
| Actionable-only | A contact detail exposed only as an activatable control (a link), never as readable text on the landing page |
| Reference viewport | 1280×800 (laptop) and 390×844 (phone) — the sizes "fits above the fold" and "no horizontal scroll" are checked against |
| LCP | Largest Contentful Paint — the render-speed metric in QG-1, target ≤ 2.5 s on the Lighthouse mobile preset |
