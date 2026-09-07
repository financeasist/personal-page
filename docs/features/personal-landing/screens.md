---
status: draft
feature_size: "S"
tool: "pencil"
updated_at: "2026-09-07"
---

# Screens — personal-landing

> The canonical **screen manifest** — every screen in every state — produced by `screens` (between
> `api` and `tasks`) and read by `tasks` (each `ui` task cites SCR ids + states), `implement`
> (builds the screen to the declared states) and `review` (the built screen must match this).
> Downstream stages reference **only this manifest** — never a raw design file.

<!-- Re-synced 2026-09-07 to the S-size scope (spec.md §1 "Scope narrowing" / §8 follow-up,
     ux-flows.md commit b75fc9f, sad.md §6 commit 9930320):
       - SCR-02 (experience timeline)   → v2 with US-04 / AC-09  — section cut, id retired
       - SCR-03 (selected projects)     → v2 with US-09 / AC-11  — section cut, id retired
       - SCR-04 (phone-line chooser)    → removed with US-03 / AC-03 (already deleted)
       + SCR-05 (About section)         → ratified — US-10 / AC-14 added to the spec
     Contact actions are now THREE (email · LinkedIn · Download CV), no phone.
     2nd pass 2026-09-07: divergences D-1/D-3/D-7/D-10 all RATIFIED (spec §1/§4/§5 + CONTEXT.md
     + sad.md + ux-flows.md re-synced). Contact actions in a persistent sticky Header; optional
     industries list (US-11/AC-15); tagline absorbs the old positioning block.
     Template redesign 2026-09-07: centered hero column (circular headshot · name + navy rule ·
     headline · tagline · Availability+Industries two-col · top stack as one middot line — no
     chips); natural top-to-bottom flow (the binding above-the-fold-fit constraint is withdrawn —
     spec §1 "Template redesign" note); Industries renders at every width; Header gains a Contact
     (mailto) item + CSS-only scroll-shrink. Live mockups: screens.pen frames s7Hhu (laptop hero),
     A3vORR (laptop About), XKUfO (phone). State-row wireframes below not yet re-synced. -->

## Source

- **Tool:** `pencil` — per the design canon (`docs/design-system.md`, `tool: pencil`). The screens
  are drawn in `docs/features/personal-landing/screens.pen`, composed against the token variables
  seeded from `site/src/styles/global.css` (`color/navy`, `color/ink`, `color/muted`, …). Each
  state row below carries its **node-id** in the Source-ref column; `tasks` / `implement` /
  `review` read **this manifest**, never the `.pen` file.
- **v1 screens:** `SCR-01` (landing hero, above the fold) and `SCR-05` (About section, below the
  fold) — sections of one static page, no routing. **Retired ids (kept, not reused):** `SCR-02`
  (experience timeline) and `SCR-03` (selected projects) are **v2**; `SCR-04` (phone-line chooser)
  was **removed** with US-03.
- **File:** `docs/features/personal-landing/screens.pen` — top-level frames still in use:
  `SCR-01 · laptop default` `Sh75H`, `SCR-01 · phone default` `XKUfO`,
  `SCR-01 · laptop · tagline omitted` `AKdd9`, `SCR-01 · keyboard focus (Header)` `heCTv`,
  `SCR-05 · about me` `GSu58`. Reusable component frames in the top row: `AvailabilityBlock`
  `k6V1ni`, `Header` `dvllD`, `Footer` `W7AZlV`. **Stale frames pending deletion from `.pen`:**
  `SCR-02 · experience timeline` `hzNGN`, `SCR-03 · selected projects` `xSFYJ`, `ProjectCard`
  `nZ4xd` / `J2r0z`, `ExperienceTimeline`, `SelectedProjects` — cut to v2 by this re-sync;
  `SCR-04` and the `PhoneChooser` / `ContactActions` / `ContactButton` frames were already
  deleted (D-2). The ASCII wireframes further below are an **informative** cross-check.
- **Section backgrounds alternate** (Roman's request): `Header` navy → **Hero white** →
  **About me grey** (`color/canvas`) → `Footer` navy. Full-bleed colour bands; content stays in a
  centered max-width column. _(The Experience / Selected-projects bands are v2.)_ A
  `— section background scheme —` note frame on the canvas (`wSrnk`) carries the sequence — needs
  updating in the `.pen` to drop the two v2 bands.
- **`Footer` is flush to the bottom.** The page is `min-height: 100vh` with the `Footer` as the
  last flow child, so on a short viewport it still sits at the bottom edge — no gap below it.
- **Hero right column = `Industries` list (D-7, ratified).** The hero's right column carries the
  **INDUSTRIES** list from `linkedin-about.md`: iGaming — Remote Game Servers (RGS) · FinTech &
  E-commerce — Value Intelligence AI platform · Healthcare — medical software for hospitals ·
  Retail — Automated Decision Intelligence systems. Backed by the optional `industries` Profile
  field (`data-model.md`); static text, no assets, no anchors. Absent → the column is omitted.
- **Tagline (Roman's wording, D-10 ratified):** "Java engineer and technical leader with 9+ years
  of experience designing, building, and scaling high-load distributed systems, leading
  engineering teams, and delivering business-critical platforms across multiple domains." A
  ~40-word sentence, ≤ ~300 chars — sits directly under the headline. This **is** the `tagline`;
  there is no separate `positioning` block (the field was removed — `data-model.md`).
- **Content is real.** All copy in the artboards is pulled from `docs/reference/`
  (`cv-template-reference.pdf`, `cv-classic-variant.pdf`, `linkedin-about.md`): name, headline
  **"Senior Java Engineer | Lead Backend Engineer"** (matches `cv-classic-variant.pdf` and
  `site/src/data/profile/roman.json`), the education line, the real headshot
  (`docs/reference/me.png`).
- **Top stack — trim to the cap (D-9, resolved against the manifest).** The spec keeps
  `topStack` at **min 4 / max 8, build-enforced** (spec §6, `CONTEXT.md`, `data-model.md`
  INV-07). Roman's ~11-item "…and more" wording drawn in the artboards **must be trimmed to ≤ 8**
  before `implement` — the `.pen` Top-Stack text needs updating.
- **Responsive.** Every v1 screen is drawn at both reference viewports (1280×800 laptop, 390×844
  phone) — `Sh75H` / `XKUfO` for SCR-01; SCR-05 reflows two-column → single column on phone.
  Responsive-both is the design-system posture.
- **Fixed `Header` (D-3, ratified).** The `Header` is position-sticky / fixed to the top of the
  viewport (CSS only, no JS) — it stays visible on scroll. The hero's top padding accounts for its
  height. `Header` / `Footer` are registered in `sad.md` §5; the in-page `#about` anchor is
  CSS-only and does not make the page a multi-route app.
- **No `api` stage:** the feature has no datastore and no API (`data-model` → N/A → `api`
  skipped), so there are no contract error responses. Non-default states derive from spec §5 ACs
  and `sad.md` §6 `alt` / `else` branches only.
- **Static, zero-JS delivery.** The page is fully rendered at build time (SSG, ADR-0001). There is
  **no runtime `loading` / `empty` / `error` state** on any screen: no client fetch, no
  hydration, and every completeness failure is a build-time gate (AC-05 / AC-06, ADR-0007) so an
  incomplete page never deploys. Each screen carries explicit `N/A: <reason>` rows for those
  classes. The real variation is **content-driven** (optional fields present / absent) and
  **viewport-driven** (laptop vs phone).

## ⚠ Divergence from spec — all resolved

This manifest was iterated with Roman in Pencil past what `screens` is meant to decide. **The
scope cut (SCR-02/03 → v2, SCR-04 removed, SCR-05 added, three contact actions) and the four
layout divergences (D-1/D-3/D-7/D-10) are now all ratified** — spec §1/§4/§5 + `CONTEXT.md` +
`sad.md` + `ux-flows.md` re-synced 2026-09-07. Table kept for traceability.

| # | Status | Decision |
|---|---|---|
| D-1 | **RESOLVED 2026-09-07** | The three contact actions live in a **persistent sticky header** (CSS-only), not a hero block — still above the fold, still one tap on a laptop. Mobile: email + LinkedIn as icon controls + a native-`<details>` menu holding Download CV + About (Download CV is two taps on mobile — accepted). Spec §4 US-02 / §5 AC-01/02/08/13 reworded. |
| D-2 | **RESOLVED** | US-03 / AC-03 withdrawn — no phone on the landing page in v1. `SCR-04` + `PhoneChooser` deleted. `contact.phones` is CV-route-only (`data-model.md`). |
| D-3 | **RESOLVED 2026-09-07** | The page has `Header` + `Footer` chrome and a CSS-only in-page `#about` anchor — this does not make it a multi-route app. `Header` / `Footer` registered in `sad.md` §5. Sticky header is CSS-only (zero-JS). |
| D-4 | **RESOLVED** | US-10 / AC-14 added — required `about.narrative` + `about.highlights`. `data-model.md` INV-09 enforces it at build. |
| D-5 | **RESOLVED** | §1 canonical "9+ years"; manifest uses "9+" everywhere. |
| D-7 | **RESOLVED 2026-09-07** | Hero right column = the optional **INDUSTRIES** list, backed by a new **optional `industries` Profile field** (`{ domain, note? }`, ≤ 6). US-11 / AC-15 added. Absent → no column, no build failure. |
| D-8 | **MOOT** | `SCR-03` cut to v2; the `ProjectCard` accordion + `description` / `techStack` / `dateRange` fields go to v2 with US-09. |
| D-9 | **RESOLVED (against the manifest)** | `topStack` stays min 4 / **max 8, build-enforced** (`data-model.md` INV-07). **Trim the Top-Stack list to ≤ 8** in the `.pen` and in `roman.json` before `implement`. |
| D-10 | **RESOLVED 2026-09-07** | The **tagline absorbs the old "positioning block"** — one optional hero field, a sentence or two, **~300-char cap**. The separate `positioning` field is **removed** from `data-model.md` (it was never in the live schema). |

## Screens

### SCR-01 — Landing hero (above the fold)

**Layout (D-1/D-3/D-7/D-10 all ratified 2026-09-07):** fixed `Header` (carries the three contact
controls) → `Hero` (photo + name + headline + optional tagline + `AvailabilityBlock` on the left;
optional **INDUSTRIES list on the right**) → Top Stack line (≤ 8 items, D-9) → `SCR-05` About me
(grey) → `Footer` (flush to bottom). No separate `positioning` block — the tagline carries it.

| State | Trigger / condition | Components (design-system inventory) | Source-ref (`screens.pen`) |
|---|---|---|---|
| default — laptop | Page load at 1280×800, all above-the-fold essentials present (build-guaranteed). Fixed white-on-navy `Header` (name + LinkedIn / email **icon controls** → LinkedIn URL / `mailto:`; `About me` / `Download CV` / `Contact` menu items — **three contact actions, no phone**). Hero (white band): headshot (`me.png`), name, headline, the optional **tagline**, `AvailabilityBlock` (status + location) on the left; the **INDUSTRIES** list on the right (D-7). Then the **Top Stack** line — **≤ 8 technologies** (D-9). No scrolling. `Footer` flush to the bottom. | `Header`, `Hero`, `AvailabilityBlock`, `Footer` | `Sh75H` (Header `dvllD`, Hero `xEwZk`, Industries `QfCVa`, Footer `W5vee`) · wireframe A |
| default — phone | Page load at 390×844. `Header` condenses to name + LinkedIn / email icons + a menu affordance. Same essentials single-column; the INDUSTRIES list sits below the `AvailabilityBlock`; body text ≥ 16 px; every contact control ≥ 44×44 px; no horizontal scroll at any width. Verified in the QG-3 manual pass at 390×844. | `Header`, `Hero`, `AvailabilityBlock`, `Footer` | `XKUfO` (Industries `WMCWv`) · wireframe B |
| default — tagline omitted | `profile.tagline` is empty (optional, spec §1). Headline renders with `AvailabilityBlock` directly beneath — the tightest hero. AC-01 still holds. | `Header`, `Hero`, `Footer` | `AKdd9` (`Tagline` frame `PXgxV` absent in this state) |
| default — keyboard focus | Recruiter tabs the page (QG-3). Every `Header` control takes a visible focus ring, in DOM order (Name link → LinkedIn → Gmail → About me → Download CV → Contact), operable by Enter / Space. Zero client JS. | `Header` | `heCTv` |
| N/A: loading | Static HTML, no client fetch and no hydration; the headshot is `astro:assets` eager + high fetch-priority with explicit dimensions, so first paint is the `default` layout with no CLS. | — | — |
| N/A: empty | The build fails and names the field if any AC-05 essential is missing — headline, availability status, location, headshot path / alt, fewer than four `topStack` entries, `email`, the LinkedIn link, or the committed CV PDF (ADR-0007 / ADR-0008). An empty hero can never deploy. | — | — |
| N/A: error | No runtime error path exists on static delivery (SAD §8 "Error handling: build-time only"). | — | — |

```text
wireframe A — SCR-01 default (laptop, 1280x800)
+==============================================================+
| Roman Hrupskyi  [in][@]         About me   Download CV   Contact |  <- Header — fixed/sticky, navy
+==============================================================+
|                                                              |  <- Hero: WHITE band
|  +----------+  Roman Hrupskyi              INDUSTRIES  (D-7)  |
|  |  me.png  |  Senior Java Engineer |      - iGaming - RGS    |
|  | (photo)  |  Lead Backend Engineer       - FinTech & E-com  |
|  +----------+  tagline (optional, <=300ch) - Healthcare       |
|                                            - Retail           |
|               +--------------------------+                    |
|               | AVAILABILITY             |                    |
|               | Open to Remote & Hybrid  |                    |
|               | Krakow, Poland           |                    |
|               +--------------------------+                    |
|                                                              |
|   TOP STACK:  Java - Spring Boot - Kafka - Postgres - Redis  |
|   - Kubernetes - ... (<= 8 items, D-9)                       |
+--------------------------------------------------------------+
  no scrolling needed to see everything above this line
  ( v  ABOUT ME - grey band  v )
+==============================================================+
|            Copyright (c) Hrupskyi R. Bio 2026               |  <- Footer — navy, flush to bottom
+==============================================================+

wireframe B — SCR-01 default (phone, 390x844)
+============================+
| Roman Hrupskyi  [in][@][=] |   <- Header condensed (no phone icon)
+============================+
|      +--------------+       |
|      |   me.png     |       |
|      +--------------+       |
|   Roman Hrupskyi           |
|   Senior Java Engineer |    |
|   Lead Backend Engineer    |
|   tagline (optional)       |
|                            |
|  +----------------------+  |
|  | AVAILABILITY         |  |
|  | Open to Remote &     |  |
|  | Hybrid - Krakow, PL  |  |
|  +----------------------+  |
|                            |
|  INDUSTRIES (D-7)          |
|  - iGaming  - FinTech      |
|  - Healthcare  - Retail    |
|                            |
|  Top stack: Java - Spring  |
|  Boot - Kafka - ... (<=8)  |
|                            |
|  ( contact actions: per    |
|    D-1 in the Header -     |
|    Email / LinkedIn icons, |
|    Download CV menu item.  |
|    NO phone. )             |
+============================+
| Copyright (c) Hrupskyi R.  |   <- Footer
| Bio 2026                   |
+============================+
   vertical scroll only, never horizontal
```

### SCR-05 — About me (below the fold)

> **Ratified 2026-09-07 (D-4).** US-10 / AC-14 in the spec; `data-model.md` INV-09 makes
> `about.narrative` + `about.highlights` build-required. Copy is from
> `docs/reference/linkedin-about.md`, reconciled to "9+" years (D-5). The `Header` "About me"
> menu item anchors here (`#about`, D-3 ratified — `Header` / `Footer` registered in `sad.md` §5).

| State | Trigger / condition | Components (design-system inventory) | Source-ref (`screens.pen`) |
|---|---|---|---|
| default — laptop | Recruiter scrolls past the hero (or clicks `Header` → "About me", `#about`). Grey band. Centered "ABOUT ME" heading + rule, then two columns: a **narrative** (`about.narrative` — systems-thinking working style, the sales / PM background, the AI-tooling paragraph — from `linkedin-about.md`) and a **HIGHLIGHTS** bullet list (`about.highlights` — Roman's own text: "Experience managing engineers." · variety of projects legacy→startups · architectures monolith→microservices · teams co-located→hundreds worldwide · Java + RDBMS + distributed-systems expertise · a "See my LinkedIn profile" link). Rendered straight from Profile content — no hard-coded copy (AC-14). | `Section` (`AboutMe` block) | `GSu58` (`Section` `HO9ni` / `AboutMe` `k0sIs` / `highlights` `MKVFu`) · wireframe F |
| default — phone | Same content, single column — the HIGHLIGHTS list sits under the narrative. Body text ≥ 16 px, no horizontal scroll (AC-14). | `Section` | `GSu58` (reflow) |
| default — AI-tooling line omitted | The AI-assistants paragraph inside `about.narrative` is optional wording (positioning, not a core claim) → the narrative ends at the stakeholder-communication line. The section still renders (narrative is non-empty). | `Section` | `GSu58` › narrative (last paragraph absent) |
| N/A: empty | `about.narrative` and a non-empty `about.highlights` are **build-required** (`data-model.md` INV-09, ADR-0007). A missing / empty narrative or an empty highlights list **fails the build, naming the field** (AC-05 / AC-06) — the section never renders blank. | — | — |
| N/A: loading / error | Static section, no runtime data path (SAD §8). | — | — |

```text
wireframe F — SCR-05 default (laptop)
+--------------------------------------------------------------+
|                       ABOUT ME                               |
|                        ------                                |
|  Seasoned Java professional with 9+ years ...    HIGHLIGHTS  |
|  building scalable, high-performance ...         - Experience managing engineers.
|                                                 - Variety of projects, legacy -> startups
|  Systems thinking - the big picture and the      - Architectures, monolith -> microservices
|  deep implementation detail at once.             - Teams, co-located -> hundreds worldwide
|                                                 - Java + RDBMS + distributed systems
|  Sales / project-management background -         -> See my LinkedIn profile for more details
|  delivering business value through tech.                     |
|                                                              |
|  Comfortable with AI coding assistants ...  (optional line)  |
+--------------------------------------------------------------+
  phone: HIGHLIGHTS list stacks under the narrative
```

### SCR-02 — Experience timeline — **DEFERRED TO v2**

Cut from v1 on 2026-09-07 (scope narrowing, spec §1 / §3) with **US-04 / AC-09**. The
below-the-fold experience timeline, the pre-2017 "earlier background" line, and the
`ExperienceTimeline` component are v2. In v1 a Recruiter checks Roman's history via the
committed CV. The `hzNGN` artboard and the `ExperienceTimeline` frame are **stale in
`screens.pen`** and should be deleted. Id retained, not reused — re-instate with US-04.
`data-model.md` keeps `experience[]` in the schema (CV route only), unchanged shape.

### SCR-03 — Selected projects — **DEFERRED TO v2**

Cut from v1 on 2026-09-07 (scope narrowing, spec §1 / §3) with **US-09 / AC-11 / AC-12**.
The selected-work section, the `ProjectCard` accordion (D-8), the `selectedProjects`
content field, and the placeholder-impact rule (INV-05) are all v2. The `xSFYJ` artboard
and the `SelectedProjects` / `ProjectCard` frames are **stale in `screens.pen`** and should
be deleted. Id retained, not reused — re-instate with US-09.

### SCR-04 — Phone-line chooser — **REMOVED** (not deferred)

Removed 2026-09-07 with **US-03 / AC-03** — the phone is not a landing-page channel in v1
(a fresh decision, not a v2 backlog item). The `SCR-04` artboard and the `PhoneChooser` /
`ContactActions` / `ContactButton` frames were deleted from `screens.pen`. `contact.phones`
stays a content field, rendered only on the CV route.

## Components

Registered in `docs/design-system.md` §Component inventory with real
`site/src/{layouts,components}/<Name>.astro` `file:line` anchors (done — T11).

| Component | `file:line` (shipped) | v1 status | Notes |
|---|---|---|---|
| `Layout` | `site/src/layouts/Layout.astro:1` | in v1 (new) | Page shell — `<html lang="en">`, `<title>` prop, `min-height:100vh` flex column, `Footer` last. |
| `Band` | `site/src/components/Band.astro:1` | in v1 (new primitive) | Full-bleed colour band + centered column; `Hero` / `Section` / `Footer` compose from it. |
| `Header` | `site/src/components/Header.astro:1` | in v1 (D-1 / D-3) | Fixed / sticky dark-navy bar (CSS only). Name + email/LinkedIn icon controls + About + Download CV; phone condenses to a native `<details>` menu (About + Download CV). Value only in `href`; `data-contact-channel` / `data-cv-download` step-8 hooks. **No phone, no "Contact" item.** |
| `ContactActions` | folded into `Header.astro` | in v1 (D-1) | Not a separate file — the three controls are `<a>` elements inside `Header`. |
| `Footer` | `site/src/components/Footer.astro:1` | in v1 (D-3) | Dark-navy bar (via `Band`), centered "Copyright © Hrupskyi R. Bio 2026". Flush to the viewport bottom. |
| `Hero` | `site/src/components/Hero.astro:1` | in v1 (D-7 / D-10) | `astro:assets` headshot (`me.png`, eager, < 100 KB) + `<h1>` name + headline + optional tagline + `AvailabilityBlock` (left) + optional `Industries` (right) + top-stack chips. Fills the fold. Responsive-both; `<360px` drops Industries first. |
| `AvailabilityBlock` | `site/src/components/AvailabilityBlock.astro:1` | in v1 | `status` + `location` + optional `noticePeriod` + optional `workAuthorization`, all content-driven. |
| `Industries` | `site/src/components/Industries.astro:1` | in v1, optional (D-7) | Hero right column / below availability on phone. Renders `industries` (`{domain, note?}`, ≤ 6); absent → omitted, build still passes (AC-15). |
| `Section` | `site/src/components/Section.astro:1` | in v1 | Centered heading + short navy rule + spacing rhythm; wraps `Band`. `scroll-margin-top` for `#anchor`. |
| `AboutMe` | `site/src/components/AboutMe.astro:1` | in v1 (D-4) | Grey band (`Section` canvas, `id="about"`), `narrative` (blank-line paragraphs) + `highlights` + a LinkedIn link; one column on phone. |
| `ExperienceTimeline` | **v2 — not built** (SCR-02) | v2 | Re-instate with US-04. |
| `SelectedProjects` | **v2 — not built** (SCR-03) | v2 | Re-instate with US-09. |
| `ProjectCard` | **v2 — not built** (SCR-03, D-8) | v2 | Native `<details>` accordion; re-instate with US-09. |

`PhoneChooser` and `ContactButton` are **deleted** — phone dropped (D-2). `ContactActions` is
**kept** — it renders the three controls *inside* `Header` (D-1 ratified), not a hero row; the
`.pen` frame should be redrawn against the header layout.

## Handoff — open before `tasks`

All spec divergences are ratified. Remaining mechanical clean-up (does not block `plan-tests`):

1. **`.pen` cleanup** — delete the `SCR-02` / `SCR-03` / `ExperienceTimeline` / `SelectedProjects`
   / `ProjectCard` frames and the two v2 background bands (`wSrnk` note frame); trim the
   Top-Stack text to ≤ 8 (D-9); update the `Header` mobile menu to show the ratified layout.
2. **`roman.json`** — trim `topStack` to ≤ 8; add the `industries` list; keep `tagline` ≤ 300;
   remove the `positioning` key (all folded into `data-model.md` §"roman.json reshape").
