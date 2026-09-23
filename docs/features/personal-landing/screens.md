---
status: draft
feature_size: "S"
tool: "pencil"
updated_at: "2026-09-22"
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
     XpCTC / A3vORR (About), XKUfO (phone).
     Re-sync 2026-09-22/23 (spec clarify sweep): fold gate + drop order withdrawn; topStack cap
     8 → 12 (D-9 amended, no trim); header Contact item documented; section tones corrected to
     the shipped Band tones; wireframes A and B redrawn against the shipped Hero.astro /
     Header.astro (centered template), superseding the pre-redesign drawings. -->

## Source

- **Tool:** `pencil` — per the design canon (`docs/design-system.md`, `tool: pencil`). The screens
  are drawn in `docs/features/personal-landing/screens.pen`, composed against the token variables
  seeded from `site/src/styles/global.css` (`color/navy`, `color/ink`, `color/muted`, …). Each
  state row below carries its **node-id** in the Source-ref column; `tasks` / `implement` /
  `review` read **this manifest**, never the `.pen` file.
- **v1 screens:** `SCR-01` (landing hero, top of page) and `SCR-05` (About section, below the
  hero) — sections of one static page, no routing. **Retired ids (kept, not reused):** `SCR-02`
  (experience timeline) and `SCR-03` (selected projects) are **v2**; `SCR-04` (phone-line chooser)
  was **removed** with US-03.
- **File:** `docs/features/personal-landing/screens.pen` — **verified read-only 2026-09-23**
  (Pencil MCP, no edits). Live frames this manifest cites:
  `s7Hhu` (group) › `AKdd9` — **SCR-01 laptop default** (the frame is still *named*
  "SCR-01 · tagline omitted", but it carries the tagline — the name is a leftover);
  `XKUfO` — SCR-01 phone default; `heCTv` — SCR-01 keyboard focus (Header);
  `XpCTC` › `vk6U0` — **SCR-05 About me, laptop**; `A3vORR` › `ucM5t` — SCR-05 About me, wide
  single-band variant; `mknmh` — a `Footer` instance at page width. Reusable components:
  `AvailabilityBlock` `k6V1ni`, `Header` `dvllD` (About me · Download CV · Contact), `Footer`
  `W7AZlV`. **Still on the canvas but stale:** `SCR-02 · experience timeline` `hzNGN`,
  `SCR-03 · selected projects` `xSFYJ`, the `ProjectCard` component `J2r0z`, and the text of two
  note frames — `— section background scheme —` `wSrnk` (still lists "Hero white · About grey ·
  Experience · Selected projects") and `— manifest legend —` `f4NTK` (still lists ContactButton ·
  ContactActions · PhoneChooser and SCR-01..04). No frame draws a "tagline omitted" state or an
  opened phone menu. The ASCII wireframes further below are an **informative** cross-check.
- **Section backgrounds alternate** (Roman's request): `Header` navy → **Hero `color/canvas`**
  (light grey-blue `#eef1f5`) → **About me `color/canvas-sunken`** (a touch darker, `#e3e7ed`) →
  `Footer` navy — as shipped via `Band` tones. Full-bleed colour bands; content stays in a
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
- **Top stack — cap is 12 (D-9, reconciled 2026-09-22).** `topStack` is **min 4 / max 12,
  build-enforced** (spec §6, `CONTEXT.md`, `data-model.md` INV-07 — raised 8 → 12 to match the
  live schema). Roman's ~11-item wording drawn in the artboards fits the cap; no trim needed.
- **Responsive.** Every v1 screen is drawn at both reference viewports (1280×800 laptop, 390×844
  phone) — `AKdd9` / `XKUfO` for SCR-01; SCR-05 reflows two-column → single column on phone.
  Responsive-both is the design-system posture.
- **Fixed `Header` (D-3, ratified).** The `Header` is position-sticky / fixed to the top of the
  viewport (CSS only, no JS) — it stays visible on scroll. The hero's top padding accounts for its
  height. `Header` / `Footer` are registered in `sad.md` §5; the in-page `#about` anchor is
  CSS-only and does not make the page a multi-route app.
- **No `api` stage:** the feature has no datastore and no API (`data-model` → N/A → `api`
  skipped), so there are no contract error responses. Non-default states derive from spec §5 ACs
  and `sad.md` §6 `alt` / `else` branches only.
- **Static delivery, one tiny PE script.** The page is fully rendered at build time (SSG,
  ADR-0001); the only client JavaScript is the ~320 B inline scroll-spy active-section indicator
  (ADR-0009) — no bundle, no hydration. There is **no runtime `loading` / `empty` / `error`
  state** on any screen: no client fetch, and every completeness failure is a build-time gate
  (AC-05 / AC-06, ADR-0007) so an incomplete page never deploys. Each screen carries explicit `N/A: <reason>` rows for those
  classes. The real variation is **content-driven** (optional fields present / absent) and
  **viewport-driven** (laptop vs phone).

## ⚠ Divergence from spec — all resolved

This manifest was iterated with Roman in Pencil past what `screens` is meant to decide. **The
scope cut (SCR-02/03 → v2, SCR-04 removed, SCR-05 added, three contact actions) and the four
layout divergences (D-1/D-3/D-7/D-10) are now all ratified** — spec §1/§4/§5 + `CONTEXT.md` +
`sad.md` + `ux-flows.md` re-synced 2026-09-07. Table kept for traceability.

| # | Status | Decision |
|---|---|---|
| D-1 | **RESOLVED 2026-09-07** | The three contact actions live in a **persistent sticky header** (CSS-only), not a hero block — still one tap on a laptop, in reach at any scroll position. Mobile: email + LinkedIn as icon controls + a native-`<details>` menu holding Download CV, `Contact` (email) + About (Download CV is two taps on mobile — accepted). Spec §4 US-02 / §5 AC-01/02/08/13 reworded. |
| D-2 | **RESOLVED** | US-03 / AC-03 withdrawn — no phone on the landing page in v1. `SCR-04` + `PhoneChooser` deleted. `contact.phones` is CV-route-only (`data-model.md`). |
| D-3 | **RESOLVED 2026-09-07** | The page has `Header` + `Footer` chrome and a CSS-only in-page `#about` anchor — this does not make it a multi-route app. `Header` / `Footer` registered in `sad.md` §5. Sticky header is CSS-only (zero-JS). |
| D-4 | **RESOLVED** | US-10 / AC-14 added — required `about.narrative` + `about.highlights`. `data-model.md` INV-09 enforces it at build. |
| D-5 | **RESOLVED** | §1 canonical "9+ years"; manifest uses "9+" everywhere. |
| D-7 | **RESOLVED 2026-09-07** | Hero right column = the optional **INDUSTRIES** list, backed by a new **optional `industries` Profile field** (`{ domain, note? }`, ≤ 6). US-11 / AC-15 added. Absent → no column, no build failure. |
| D-8 | **MOOT** | `SCR-03` cut to v2; the `ProjectCard` accordion + `description` / `techStack` / `dateRange` fields go to v2 with US-09. |
| D-9 | **RESOLVED — amended 2026-09-22** | `topStack` is min 4 / **max 12, build-enforced** (`data-model.md` INV-07). _Originally resolved as max 8 with a trim; the spec clarify sweep reconciled the cap to the live schema (12), so the ~11-item list stands and no trim is needed._ |
| D-10 | **RESOLVED 2026-09-07** | The **tagline absorbs the old "positioning block"** — one optional hero field, a sentence or two, **~300-char cap**. The separate `positioning` field is **removed** from `data-model.md` (it was never in the live schema). |

## Screens

### SCR-01 — Landing hero (top of page)

**Layout (D-1/D-3/D-7/D-10 ratified 2026-09-07; centered template redesign 2026-09-07):** sticky
`Header` (carries the three contact actions) → `Hero`: a **centered intro column** (rounded
headshot — circle in code, see Handoff 3 → name + short navy rule → headline → optional tagline) → a **two-column block**
(`AvailabilityBlock` left, optional **INDUSTRIES** right; one column on phone) → the **Top Stack**
as one middot-separated line, no chips (≤ 12 items, D-9) → `SCR-05` About me → `Footer` (flush to
bottom). No separate `positioning` block — the tagline carries it.

| State | Trigger / condition | Components (design-system inventory) | Source-ref (`screens.pen`) |
|---|---|---|---|
| default — laptop | Page load at 1280×800, every AC-01 essential rendered in reading order (build-guaranteed; no single-viewport-height requirement, spec §6). Sticky white-on-navy `Header` (name + LinkedIn / Email **icon controls** → LinkedIn URL / `mailto:` — icons only in the `.pen`; the shipped `Header.astro` also shows their text labels at ≥ 960 px, see Handoff; inline `About me` / `Download CV` / `Contact` — `Contact` is the same email Contact action as the icon; **three contact actions, no phone**). Hero (`color/canvas` band): centered rounded headshot (`me.png`), name + rule, headline, the optional **tagline**; below, `AvailabilityBlock` (status + location) left and the **INDUSTRIES** list right (D-7). Then the **Top Stack** line — **≤ 12 technologies** (D-9). About follows the hero. `Footer` flush to the bottom. | `Header`, `Hero`, `AvailabilityBlock`, `Footer` | `s7Hhu` › `AKdd9` (Header `dvllD`, Footer `W7AZlV`) · wireframe A |
| default — phone | Page load at 390×844. `Header` condenses to name + LinkedIn / email icons + a menu affordance (native `<details>`: About me · Download CV · `Contact`). Same essentials single-column, in reading order; the INDUSTRIES list sits below the `AvailabilityBlock` and renders at every width — nothing is dropped (360 px included); body text ≥ 16 px; every contact control ≥ 44×44 px; no horizontal scroll at any width. Verified in the QG-3 manual pass at 390×844. | `Header`, `Hero`, `AvailabilityBlock`, `Footer` | `XKUfO` (Industries `WMCWv`) · wireframe B |
| default — tagline omitted | `profile.tagline` is absent (optional, spec §1). The headline is followed directly by the Availability / Industries block — the tightest hero. AC-01 still holds. | `Header`, `Hero`, `Footer` | **not drawn** — no `.pen` frame shows this state (`AKdd9` carries the tagline); derived from AC-01 + the optional `tagline` field |
| default — keyboard focus | Recruiter tabs the page (QG-3). Every `Header` control takes a visible focus ring, in DOM order (Name link → LinkedIn → Email → About me → Download CV → Contact), operable by Enter / Space. The only script is the scroll-spy indicator (ADR-0009) — decorative, no effect on focus or activation. | `Header` | `heCTv` |
| about-in-view — active nav | While `#about` is in the reading band the header "About me" link + menu item carry a filled-block active state (`.is-active`), toggled by the inline `IntersectionObserver` (ADR-0009). Scroll away ⇒ state clears. JS off ⇒ state never applied; the link is otherwise unchanged. | `Header` | — (post-`screens.pen`, 2026-09-07) |
| N/A: loading | Static HTML, no client fetch and no hydration; the headshot is `astro:assets` eager + high fetch-priority with explicit dimensions, so first paint is the `default` layout with no CLS. | — | — |
| N/A: empty | The build fails and names the field if any AC-05 essential is missing — headline, availability status, location, headshot path / alt, fewer than four `topStack` entries, `email`, the LinkedIn link, or the committed CV PDF (ADR-0007 / ADR-0008). An empty hero can never deploy. | — | — |
| N/A: error | No runtime error path exists on static delivery (SAD §8 "Error handling: build-time only"). | — | — |

```text
wireframe A — SCR-01 default (laptop, 1280x800; header is the wide layout at >= 960 px)
+==================================================================================+
| Roman Hrupskyi  [in] [@]                          About me   Download CV   [Contact] |  <- Header: sticky, navy
+==================================================================================+
|                                                                                  |  <- Hero band: color/canvas
|                                 .----------.                                     |
|                                (   me.png   )   rounded headshot (LCP, eager)     |
|                                 '----------'                                     |
|                                Roman Hrupskyi                        <h1>        |
|                                   ------                             navy rule   |
|                  Senior Java Engineer | Lead Backend Engineer        headline    |
|          Java engineer and technical leader with 9+ years of ...    tagline (opt)|
|                                                                                  |
|        +------------------------------+   +--------------------------------+     |
|        | AVAILABILITY                 |   | INDUSTRIES (optional, D-7)     |     |
|        | Open to Remote & Hybrid      |   | iGaming — RGS                  |     |
|        |   Opportunities              |   | FinTech & E-commerce — ...     |     |
|        | Krakow, Poland               |   | Healthcare — ...               |     |
|        +------------------------------+   | Retail — ...                   |     |
|                                           +--------------------------------+     |
|                                                                                  |
|                                    TOP STACK                                     |
|     Java · Spring ecosystem (...) · Event-driven architecture · Microservices ·  |
|     Kafka · Postgres · Hazelcast · Kubernetes · GitLab · CI/CD · and more        |
|                     (one middot line, no chips; <= 12 items, D-9)                |
+----------------------------------------------------------------------------------+
|                          ABOUT ME  (SCR-05, color/canvas-sunken)                 |
|                                   ...                                            |
+==================================================================================+
|                     Copyright (c) Hrupskyi R. Bio 2026                           |  <- Footer: navy, flush to bottom
+==================================================================================+
  natural top-to-bottom flow — essentials in reading order, no fold gate (spec §6)

wireframe B — SCR-01 default (phone, 390x844; compact header below 960 px)
+=================================+
| Roman Hrupskyi     [in] [@] [=] |   <- Header: icons (labels visually hidden) + <details> menu
+=================================+
|                    +----------+ |   [=] open:  About me
|                    | menu     | |              Download CV
|                    +----------+ |              Contact  (mailto — same email action)
|          .--------.             |
|         (  me.png  )            |   circular headshot
|          '--------'             |
|        Roman Hrupskyi           |
|            ------               |
|   Senior Java Engineer |        |
|   Lead Backend Engineer         |
|   Java engineer and technical   |
|   leader with 9+ years of ...   |   tagline (optional) — never dropped
|                                 |
|  +---------------------------+  |
|  | AVAILABILITY              |  |
|  | Open to Remote & Hybrid   |  |
|  | Opportunities             |  |
|  | Krakow, Poland            |  |
|  +---------------------------+  |
|  +---------------------------+  |
|  | INDUSTRIES                |  |   stacks under Availability — never dropped
|  | iGaming — RGS             |  |
|  | FinTech & E-commerce — ...|  |
|  | Healthcare — ...          |  |
|  | Retail — ...              |  |
|  +---------------------------+  |
|            TOP STACK            |
|  Java · Spring ecosystem (...)  |
|  · Event-driven architecture ·  |
|  ... · CI/CD · and more (<= 12) |
+---------------------------------+
|  ABOUT ME (one column)  ...     |
+=================================+
| Copyright (c) Hrupskyi R.       |   <- Footer
| Bio 2026                        |
+=================================+
   vertical scroll only, never horizontal (360 px included)
```

### SCR-05 — About me (below the hero)

> **Ratified 2026-09-07 (D-4).** US-10 / AC-14 in the spec; `data-model.md` INV-09 makes
> `about.narrative` + `about.highlights` build-required. Copy is from
> `docs/reference/linkedin-about.md`, reconciled to "9+" years (D-5). The `Header` "About me"
> menu item anchors here (`#about`, D-3 ratified — `Header` / `Footer` registered in `sad.md` §5).

| State | Trigger / condition | Components (design-system inventory) | Source-ref (`screens.pen`) |
|---|---|---|---|
| default — laptop | Recruiter scrolls past the hero (or clicks `Header` → "About me", `#about`). `color/canvas-sunken` band. Centered "ABOUT ME" heading + rule, then two columns: a **narrative** (`about.narrative` — systems-thinking working style, the sales / PM background, the AI-tooling paragraph — from `linkedin-about.md`) and a **HIGHLIGHTS** bullet list (`about.highlights` — Roman's own text: "Experience managing engineers." · variety of projects legacy→startups · architectures monolith→microservices · teams co-located→hundreds worldwide · Java + RDBMS + distributed-systems expertise · a "See my LinkedIn profile" link). Rendered straight from Profile content — no hard-coded copy (AC-14). | `Section` (`AboutMe` block) | `XpCTC` › `vk6U0` (wide variant `A3vORR` › `ucM5t`) · wireframe F |
| default — phone | Same content, single column — the HIGHLIGHTS list sits under the narrative. Body text ≥ 16 px, no horizontal scroll (AC-14). | `Section` | not drawn separately — reflow of `vk6U0` |
| default — AI-tooling line omitted | The AI-assistants paragraph inside `about.narrative` is optional wording (positioning, not a core claim) → the narrative ends at the stakeholder-communication line. The section still renders (narrative is non-empty). | `Section` | not drawn — `vk6U0` › narrative minus its last paragraph |
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
| `Header` | `site/src/components/Header.astro:1` | in v1 (D-1 / D-3) | Sticky dark-navy bar (CSS only, CSS scroll-driven shrink). ≥ 960 px: name + LinkedIn / Email icon controls with labels + inline About me · Download CV · **Contact**; < 960 px: name + icon controls (labels visually hidden) + a native `<details>` menu (About me · Download CV · Contact). `Contact` is a `mailto:` carrying the same `data-contact-channel="email"` as the email icon — **one** Contact action, not a fourth. Value only in `href`; `data-contact-channel` / `data-cv-download` step-8 hooks; `data-nav-link="about"` for the scroll-spy. **No phone.** |
| `ContactActions` | folded into `Header.astro` | in v1 (D-1) | Not a separate file — the three controls are `<a>` elements inside `Header`. |
| `Footer` | `site/src/components/Footer.astro:1` | in v1 (D-3) | Dark-navy bar (via `Band`), centered "Copyright © Hrupskyi R. Bio 2026". Flush to the viewport bottom. |
| `Hero` | `site/src/components/Hero.astro:1` | in v1 (D-7 / D-10) | `astro:assets` headshot (`me.png`, eager, < 100 KB) + `<h1>` name + headline + optional tagline + `AvailabilityBlock` (left) + optional `Industries` (right) + top stack as one middot line (no chips). Responsive-both; Industries reflows under the availability block on phone and is never dropped (drop order withdrawn 2026-09-22). |
| `AvailabilityBlock` | `site/src/components/AvailabilityBlock.astro:1` | in v1 | `status` + `location` + optional `noticePeriod` + optional `workAuthorization`, all content-driven. |
| `Industries` | `site/src/components/Industries.astro:1` | in v1, optional (D-7) | Hero right column / below availability on phone. Renders `industries` (`{domain, note?}`, ≤ 6); absent → omitted, build still passes (AC-15). |
| `Section` | `site/src/components/Section.astro:1` | in v1 | Centered heading + short navy rule + spacing rhythm; wraps `Band`. `scroll-margin-top` for `#anchor`. |
| `AboutMe` | `site/src/components/AboutMe.astro:1` | in v1 (D-4) | `color/canvas-sunken` band (`Section`, `id="about"`), `narrative` (blank-line paragraphs) + `highlights` + a LinkedIn link; one column on phone. |
| `ExperienceTimeline` | **v2 — not built** (SCR-02) | v2 | Re-instate with US-04. |
| `SelectedProjects` | **v2 — not built** (SCR-03) | v2 | Re-instate with US-09. |
| `ProjectCard` | **v2 — not built** (SCR-03, D-8) | v2 | Native `<details>` accordion; re-instate with US-09. |

`PhoneChooser` and `ContactButton` are **deleted** — phone dropped (D-2). `ContactActions` is
**not a separate component** — its three controls live *inside* `Header.astro` (D-1 ratified), not
as a hero row; its `.pen` frame was deleted with the others.

## Handoff — open before `tasks`

All spec divergences are ratified. Remaining mechanical clean-up (does not block `plan-tests`):

1. **`.pen` cleanup — optional, Roman's call (checked 2026-09-23, nothing changed).** The live
   screens are as Roman wants them. What is still stale on the canvas: the v2 frames `hzNGN` /
   `xSFYJ` and the `ProjectCard` component `J2r0z`; the note-frame text in `wSrnk` and `f4NTK`;
   the name of `AKdd9` ("tagline omitted", though it has the tagline). None of it affects the
   build or the site — `tasks` / `implement` / `review` read this manifest, not the `.pen`.
   ~~trim the Top-Stack text to ≤ 8~~ (withdrawn — cap is 12, D-9).
2. ~~**`roman.json`** — add the `industries` list; keep `tagline` ≤ 300; remove the
   `positioning` key~~ — **done** (shipped `roman.json` has `industries`, a ≤ 300 tagline and no
   `positioning`; its 11-item `topStack` is within the cap of 12).
3. **Code ↔ `.pen` differences found 2026-09-23 (for Roman to decide; nothing changed):**
   - **Header icon labels on laptop** — the `.pen` shows LinkedIn / Email as icons only; the
     shipped `Header.astro` un-hides the text labels ("LinkedIn", "Email") at ≥ 960 px.
   - **Headshot shape on laptop** — the `.pen` laptop hero draws a rounded-square photo (the
     phone frame is circular); `Hero.astro` renders a circle (`border-radius: 50%`) at every width.
   - **Top-stack copy** — the `.pen` text (… Kafka · Postgres · Redis · Hazelcast · Kubernetes ·
     GitLab · and more) differs from `roman.json` (adds Event-driven architecture, Microservices,
     CI/CD; no Redis). The page renders `roman.json`; the `.pen` copy is illustrative.
