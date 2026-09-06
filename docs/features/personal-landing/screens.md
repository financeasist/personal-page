---
status: draft
feature_size: "M"
tool: "pencil"
updated_at: "2026-09-06"
---

# Screens — personal-landing

> The canonical **screen manifest** — every screen in every state — produced by `screens` (between
> `api` and `tasks`) and read by `tasks` (each `ui` task cites SCR ids + states), `implement`
> (builds the screen to the declared states) and `review` (the built screen must match this).
> Downstream stages reference **only this manifest** — never a raw design file.

## Source

- **Tool:** `pencil` — per the design canon (`docs/design-system.md`, `tool: pencil`). The screens
  are drawn in `docs/features/personal-landing/screens.pen`, composed against the token variables
  seeded from `site/src/styles/global.css` (`color/navy`, `color/ink`, `color/muted`, …). Each
  state row below carries its **node-id** in the Source-ref column; `tasks` / `implement` /
  `review` read **this manifest**, never the `.pen` file.
- **File:** `docs/features/personal-landing/screens.pen` — one top-level frame per screen + state
  variant (`SCR-01 · laptop default` `Sh75H`, `SCR-01 · phone default` `XKUfO`,
  `SCR-01 · laptop · tagline + positioning omitted` `AKdd9`, `SCR-01 · keyboard focus (Header)`
  `heCTv`, `SCR-02 · experience timeline` `hzNGN`, `SCR-03 · selected projects` `xSFYJ`,
  `SCR-05 · about me` `GSu58`). Reusable component frames sit in the top row (`ProjectCard`
  `nZ4xd`, `AvailabilityBlock` `k6V1ni`, `Header` `dvllD`, `Footer` `W7AZlV`). `SCR-04` and the
  `PhoneChooser` / `ContactActions` / `ContactButton` frames are **deleted** (D-2). The ASCII
  wireframes further below are kept as an **informative** cross-check — the `.pen` nodes are the
  drawing of record.
- **Section backgrounds alternate** (Roman's request, per the reference example): `Header` navy →
  **Hero white** → **About me grey** (`color/canvas`) → **Experience white** → **Selected projects
  grey** → `Footer` navy. Full-bleed colour bands; content stays in a centered max-width column.
  Drawn as the fill of each section artboard; a `— section background scheme —` note frame on the
  canvas (`wSrnk`) carries the sequence.
- **`Footer` is flush to the bottom.** The page is `min-height: 100vh` with the `Footer` as the
  last flow child, so on a short viewport it still sits at the bottom edge — no gap below it (the
  `SCR-01` artboard height ends exactly at the `Footer`'s bottom).
- **Hero right column = `Industries` list.** The hero's right column (previously empty — "too
  empty"; briefly a company `LogoWall`, now removed) carries the **INDUSTRIES** list from
  `linkedin-about.md`: iGaming — Remote Game Servers (RGS) · FinTech & E-commerce — Value
  Intelligence AI platform · Healthcare — medical software for hospitals · Retail — Automated
  Decision Intelligence systems. Static text, no assets, no anchors.
- **Tagline (Roman's wording):** "Java engineer and technical leader with 9+ years of experience
  designing, building, and scaling high-load distributed systems, leading engineering teams, and
  delivering business-critical platforms across multiple domains." A ~40-word sentence — sits
  directly under the headline. **The `positioning` block is removed from the hero** (Roman:
  "empty this section") — the tagline now carries that job. `positioning` as a content field is
  either dropped or repurposed for the CV route (D-10).
- **Content is real.** All copy in the artboards is pulled from `docs/reference/`
  (`cv-template-reference.pdf`, **`cv-classic-variant.pdf`**, `linkedin-about.md`): name, headline
  **"Senior Java Engineer | Lead Backend Engineer"** (matches `cv-classic-variant.pdf` and
  `site/src/data/profile/roman.json`), the EveryMatrix / Exoft / SoftServe / DevCom timeline, the
  education line, the real headshot (`docs/reference/me.png`).
- **Project impact + detail copy is REAL — from `cv-classic-variant.pdf`** (the classic variant
  has quantified achievements the template PDF lacks): e.g. RGS Platform → "scaled reactive Java
  microservices to tens of millions of business transactions/day … optimised MySQL tables of
  billions of records … led 7 backend engineers". **This resolves spec §8's impact-statement
  open question** — `tasks` / `data-model` can drop that OQ. Employment ranges: the classic
  variant reads **2023–2026 / 2021–2023 / 2018–2021** for the top three — no overlap; supersedes
  the template PDF's ambiguous ranges (spec §8's first OQ is also effectively resolved — confirm
  in `tasks`).
- **Responsive.** Every screen is drawn at both reference viewports (1280×800 laptop, 390×844
  phone) — `Sh75H` / `XKUfO`, and the sections reflow (SCR-02/03/05 two-column → single column on
  phone; `Header` right-side menu → a menu affordance). Responsive-both is the design-system
  posture; the manifest carries a laptop + phone artboard for SCR-01 and notes the reflow for the
  section screens.
- **Fixed `Header`.** The `Header` is position-sticky / fixed to the top of the viewport
  (CSS only, no JS) — it stays visible on scroll so the contact + nav controls are always one
  reach away. The hero's top padding accounts for its height.
- **⚠ This revision diverges materially from the spec — see [§ Divergence from spec](#-divergence-from-spec) below.**
  At Roman's direction the four hero `ContactActions` were **removed from the page body** and now
  live only in the `Header` (LinkedIn + email as icon controls pointing at the LinkedIn URL /
  `mailto:`; `Download CV` + `Contact` as menu items). **Phone is not offered** anywhere in
  `SCR-01` (Roman: "phone hide"). A new **`SCR-05 · about me`** section was added, copy from
  `linkedin-about.md`. `Header` / `Footer` / the About section / the sticky behaviour / the
  dropped phone action are **not** in spec §1 / §4 / `sad.md` §5 / `ux-flows.md`. These are design
  decisions the spec must ratify before `tasks` — `screens` has drawn them but cannot make them.
- **Component inventory:** `docs/design-system.md` §Component inventory lists the eight original
  primitives plus `Header` / `Footer` (added by this revision). Component names in the state
  tables reference that inventory by name; `implement` replaces each `pending` there with the real
  `site/src/components/<Name>.astro` `file:line` anchor as it builds them.
- **No `api` stage:** the feature has no datastore and no API (`data-model` → N/A → `api` skipped),
  so there are no contract error responses. Non-default states derive from spec §5 ACs and
  `sad.md` §6 `alt`/`else` branches only.
- **Static, zero-JS delivery.** The page is fully rendered at build time (SSG, ADR-0001). There is
  **no runtime `loading` / `empty` / `error` state** on any screen: no client fetch, no
  hydration, and every completeness failure is a build-time gate (AC-05 / AC-06 / AC-12,
  ADR-0007) so an incomplete page never deploys. Each screen therefore carries explicit
  `N/A: <reason>` rows for those classes. The real variation is **content-driven** (optional
  fields present/absent, a figure present/absent) and **viewport-driven** (laptop vs phone).

## ⚠ Divergence from spec

This manifest was iterated with Roman past what `screens` is meant to decide. The drawing reflects
his direction; the spec does not yet. **Resolve before `tasks`** — via a spec edit or
`/sdd:clarify personal-landing`.

| # | Spec says | This manifest draws | Needs |
|---|---|---|---|
| D-1 | §4 US-02 / AC-02 / AC-13 — phone, email, LinkedIn, CV download are "four **Contact actions** … immediate actions **at the top of the page**". | The hero button row is **gone**. `Header` carries: LinkedIn + email as **icon controls** (→ LinkedIn URL / `mailto:`), `Download CV` + `Contact` as **menu items**. | Spec §4/§5 reworded: contact lives in the `Header`, not a hero block. AC-02/AC-13 still hold (mail client, new tab, file download); AC-01's "four contact actions" essential no longer applies to the hero. |
| D-2 | §4 US-03 / AC-03 — "choose which number to call", the no-JS phone-line chooser (`SCR-04`). | **RESOLVED — phone dropped.** Roman: "SCR-04 phone line is not valid anymore." No phone control anywhere on the landing page; `SCR-04` + the `PhoneChooser` frame are deleted. | `tasks` / spec edit: **remove US-03, AC-03, `ux-flows.md` Flow US-03, `sad.md` §6 Flow 3.** `contact.phones` stays a content field but is rendered only on the CV route. |
| D-3 | §1 — one static landing page; `sad.md` §5 component list has no chrome; `ux-flows.md` — "single page, no routing". | Fixed (sticky) **`Header`** + **`Footer`**; `Header` menu items `About me` (`#about`) / `Contact` (`#contact`) are in-page nav. | Register `Header` / `Footer` in `sad.md` §5; add the `#about` / `#contact` anchors to `ux-flows.md`; note the sticky header is CSS-only (still zero-JS). |
| D-4 | §3 — "No blog, articles, or personal-life content … deferred to v2"; no About section in §4. | New **`SCR-05 · about me`** — a `narrative` (from `linkedin-about.md`) + a `highlights` bullet list (Roman's own text). | Add an About user-story + AC to spec §4/§5. |
| D-5 | `linkedin-about.md` says "over 8 years"; CV says "over 9". | Uses **"9+"** everywhere (CV / spec §1 canonical). | Already a spec §1 decision — no action, noted for traceability. |
| D-6 | `sad.md` §8 — `Download CV` carries one `data-cv-download` hook. | `Download CV` now appears in the `Header` (and the CV route). | The tracking hook (roadmap step 8) goes on the `Header` control. |
| D-7 | Hero has no second column in spec §4 / `sad.md` §5. | Hero right column = the **INDUSTRIES** list (iGaming / FinTech & E-commerce / Healthcare / Retail — from `linkedin-about.md`). *(An earlier company `LogoWall` was tried and dropped — no logo tiles, no `#exp-` anchors.)* | Add the `industries` content field (or derive from experience) to spec §1 / `data-model`; register the two-column hero in `sad.md` §5. |
| D-8 | `SCR-03` cards are a static list of name + role + impact (spec §4 US-09, AC-11). | `ProjectCard` is a **native-`<details>` accordion** — collapsed summary, expands to a `Detail` block (full CV description, tech stack, date range). | Add the interaction to spec §4/§5 (still zero-JS); `data-model` adds `description` / full `techStack` / `dateRange` to the project entry. `sad.md` §6 gains a Flow (or reuses the removed phone-chooser one). |
| D-9 | §1 — top stack is "a curated list of **at most eight** technologies". | Roman's wording is ~11 items + "and more": "Java · Spring ecosystem (Boot, Cloud, WebFlux, Data, Security) · Kafka · Postgres · Redis · Hazelcast · Kubernetes · GitLab · and more". | Relax the §1 cap, or trim the list. `data-model` `topStack` `.max(8)` refinement (ADR-0007) must change to match whatever is decided. |
| D-10 | §1 — `tagline` is "an optional **one-line** sentence"; `positioning` is a separate 2–3 sentence block, both in the hero. | **RESOLVED** — the ~40-word sentence is the `tagline`; the `positioning` block is **removed from the hero** entirely (Roman: "empty this section"). | Spec §1: `tagline` wording is no longer "one-line" (allow ~40 words); **drop `positioning` from the hero** — keep the field only if the CV route uses it, else remove from the schema (ADR-0005 / `data-model`). |

## Screens

### SCR-01 — Landing hero (above the fold)

**Post-divergence layout:** fixed `Header` → `Hero` (photo + name + headline + optional tagline +
`AvailabilityBlock` on the left; **INDUSTRIES list on the right**) → Top Stack line → `SCR-05`
About me (grey) → `SCR-02` Experience (white) → `SCR-03` Selected projects (grey) → `Footer`
(flush to bottom). **No `positioning` block** (D-10) and **no contact-action row** (D-1) in the
hero — contact lives in the `Header`.

| State | Trigger / condition | Components (design-system inventory) | Source-ref (`screens.pen`) |
|---|---|---|---|
| default — laptop | Page load at 1280×800, all above-the-fold essentials present (build-guaranteed). Fixed white-on-navy `Header` (name + LinkedIn/email **icon controls** → LinkedIn URL / `mailto:`; `About me` / `Download CV` / `Contact` menu items) frames the top. Hero (white band): headshot (`me.png`), name, headline, the optional **tagline** (Roman's ~40-word sentence — no separate positioning block, D-10), `AvailabilityBlock` (status + location, **no notice**) on the left; the **INDUSTRIES** list (iGaming / FinTech & E-commerce / Healthcare / Retail — from `linkedin-about.md`) on the right. Then the **Top Stack** line — "Java · Spring ecosystem (Boot, Cloud, WebFlux, Data, Security) · Kafka · Postgres · Redis · Hazelcast · Kubernetes · GitLab · and more" (**D-9** — Roman's wording exceeds the spec §1 "at most eight technologies" cap; wraps to 2 lines). No scrolling. `Footer` flush to the bottom. | `Header`, `Hero`, `AvailabilityBlock`, `Footer` | `Sh75H` (Header `dvllD`, Hero `xEwZk`, Industries `QfCVa`, Footer `W5vee`) · wireframe A |
| default — phone | Page load at 390×844. `Header` condenses to name + LinkedIn/email icons + a menu affordance. Same essentials single-column; the INDUSTRIES list sits below the `AvailabilityBlock`; body text ≥16 px; no horizontal scroll at any width. Verified in the QG-3 manual pass at 390×844. | `Header`, `Hero`, `AvailabilityBlock`, `Footer` | `XKUfO` (Industries `WMCWv`) · wireframe B |
| default — tagline omitted | `profile.tagline` is empty (optional, spec §1). Headline renders with `AvailabilityBlock` directly beneath — the tightest hero. AC-01 still holds. | `Header`, `Hero`, `Footer` | `AKdd9` (`Tagline` frame `PXgxV` absent in this state) |
| default — keyboard focus | Recruiter tabs the page (QG-3). Every `Header` control takes a visible focus ring, in DOM order (Name link → LinkedIn → Gmail → About me → Download CV → Contact), operable by Enter/Space. Zero client JS. The `Header` is the contact + nav surface. | `Header` | `heCTv` |
| N/A: loading | Static HTML, no client fetch and no hydration; the headshot is `astro:assets` eager + high fetch-priority with explicit dimensions, so first paint is the `default` layout with no CLS. | — | — |
| N/A: empty | The build fails and names the field if the headline or the availability status is missing (AC-05, ADR-0007) — an empty hero can never deploy. (The "four contact channels" invariant moves to whatever D-1/D-2 resolve.) | — | — |
| N/A: error | No runtime error path exists on static delivery (SAD §8 "Error handling: build-time only"). | — | — |

```text
wireframe A — SCR-01 default (laptop, 1280x800)
+==============================================================+
| Roman Hrupskyi  [in][@]         About me   Download CV   Contact |  <- Header — fixed/sticky, navy
+==============================================================+
|                                                              |  ← Hero: WHITE band
|  +----------+  Roman Hrupskyi              INDUSTRIES         |
|  |  me.png  |  Senior Java Engineer |      · iGaming — RGS    |
|  | (photo)  |  Lead Backend Engineer       · FinTech & E-com  |
|  +----------+  tagline (Roman's ~40-word    · Healthcare — hospitals
|                sentence — no positioning    · Retail — Decision Intel
|                block)                                         |
|               +--------------------------+                    |
|               | AVAILABILITY             |                    |
|               | Open to Remote & Hybrid  |                    |
|               | Krakow, Poland           |                    |
|               +--------------------------+                    |
|                                                              |
|   TOP STACK:  Java · Spring ecosystem (Boot, Cloud, WebFlux, |
|   Data, Security) · Kafka · Postgres · Redis · Hazelcast ·   |
|   Kubernetes · GitLab · and more                             |
+--------------------------------------------------------------+
  no scrolling needed to see everything above this line
  ( ↓ ABOUT ME — grey band · EXPERIENCE — white · PROJECTS — grey ↓ )
+==============================================================+
|            Copyright © Hrupskyi R. Bio 2026                  |  <- Footer — navy, flush to bottom
+==============================================================+

wireframe B — SCR-01 default (phone, 390x844)
+============================+
| Roman Hrupskyi  [in][@][=] |   <- Header condensed
+============================+
|      +--------------+       |
|      |   me.png     |       |
|      +--------------+       |
|   Roman Hrupskyi           |
|   Senior Java Engineer |    |
|   Lead Backend Engineer    |
|   tagline (Roman's        |
|   ~40-word sentence)      |
|                            |
|  +----------------------+  |
|  | AVAILABILITY         |  |
|  | Open to Remote &     |  |
|  | Hybrid · Krakow, PL  |  |
|  +----------------------+  |
|                            |
|  Top stack:                |
|  Java · Spring ecosystem · |
|  Kafka · ... (<= 8)        |
|                            |
|  +----------------------+  |
|  |       Call           |  | <- each >= 44x44 px
|  +----------------------+  |
|  |       Email          |  |
|  +----------------------+  |
|  |     LinkedIn  ^      |  |
|  +----------------------+  |
|  |    Download CV       |  |
|  +----------------------+  |
+============================+
| Copyright © Hrupskyi R.    |   <- Footer
| Bio 2026                   |
+============================+
   vertical scroll only, never horizontal
```

### SCR-05 — About me (below the fold)

> **NEW — not in `ux-flows.md` SCR inventory or spec §4 (D-4).** Added at Roman's request. Copy is
> from `docs/reference/linkedin-about.md`, reconciled to "9+" years (D-5). The `Header` "About me"
> menu item anchors here (`#about`).

| State | Trigger / condition | Components (design-system inventory) | Source-ref (`screens.pen`) |
|---|---|---|---|
| default — laptop | Recruiter scrolls past the hero (or clicks `Header` → "About me", `#about`). Grey band. Centered "ABOUT ME" heading + rule, then two columns: a **narrative** (systems-thinking working style, the sales/PM background, the AI-tooling paragraph — from `linkedin-about.md`) and a **HIGHLIGHTS** bullet list (Roman's own text: "Experience managing engineers." · variety of projects legacy→startups · architectures monolith→microservices · teams co-located→hundreds worldwide · Java + RDBMS + distributed-systems expertise · "→ See my LinkedIn profile for more details" link). | `Section` (`NEW: AboutMe` block) | `GSu58` (`Section` `HO9ni` / `AboutMe` `k0sIs` / `highlights` `MKVFu`) · wireframe F |
| default — phone | Same content, single column — the HIGHLIGHTS list sits under the narrative. | `Section` | `GSu58` (reflow) |
| default — AI-tooling line omitted | The AI-assistants paragraph is optional (positioning, not a core claim) → the narrative ends at the stakeholder-communication line. | `Section` | `GSu58` › narrative (last paragraph absent) |
| N/A: empty | If the About copy is a required content field it is schema-enforced (ADR-0007) and the build fails when missing; if optional, the whole section does not render. **D-4 decides which.** | — | — |
| N/A: loading / error | Static section, no runtime data path (SAD §8). | — | — |

```text
wireframe F — SCR-05 default (laptop)
+--------------------------------------------------------------+
|                       ABOUT ME                               |
|                        ------                                |
|  Seasoned Java professional with 9+ years ...    HIGHLIGHTS  |
|  building scalable, high-performance ...         · Experience managing engineers.
|                                                 · Variety of projects, legacy → startups
|  Systems thinking — the big picture and the      · Architectures, monolith → microservices
|  deep implementation detail at once.             · Teams, co-located → hundreds worldwide
|                                                 · Java + RDBMS + distributed systems
|  Sales / project-management background —         → See my LinkedIn profile for more details
|  delivering business value through tech.                     |
|                                                              |
|  Comfortable with AI coding assistants ...  (optional line)  |
+--------------------------------------------------------------+
  phone: HIGHLIGHTS list stacks under the narrative
```

### SCR-02 — Experience timeline (below the fold)

| State | Trigger / condition | Components (design-system inventory) | Source-ref (`screens.pen`) |
|---|---|---|---|
| default | Recruiter scrolls below the fold. White band. Centered "EXPERIENCE" heading + rule. Roles most-recent-first with company, date range and a contribution line — from `cv-classic-variant.pdf`: **EveryMatrix** (Java Team Lead / Solution Architect, 2023–2026), **Exoft** (Senior Software Engineer, 2021–2023), **SoftServe** (Software Engineer, 2018–2021), **DevCom** (Full-Stack Software Engineer, 2017–2019) — then the single pre-2017 "earlier background" line (AC-09, `sad.md` §6 Flow 4 `alt`). The classic variant's ranges are non-overlapping (spec §8's date OQ effectively resolved). | `Section`, `ExperienceTimeline` | `hzNGN` (`ExperienceTimeline` frame `jgvYw`) · wireframe C |
| default — current role | The latest entry (EveryMatrix) — a current role reads "&lt;start&gt; – present" when there is no end year (AC-09). | `ExperienceTimeline` | `hzNGN` › `Role (current)` row `eUu9X` |
| default — earlier-background omitted | `profile.earlierBackground` is empty (optional field, spec §1) → the "earlier background" line is absent; the section ends at the last timeline row. | `ExperienceTimeline` | `hzNGN` › earlier-background line `LcIat` (the line that is absent in this state) |
| N/A: empty | The content schema requires ≥1 experience entry (ADR-0007 invariants); a zero-role timeline can never build. | — | — |
| N/A: loading / error | Static section, no runtime data path (SAD §8). | — | — |

```text
wireframe C — SCR-02 default
+--------------------------------------------------------------+
|                       EXPERIENCE                              |
|                         ------                                |
|  Java Team Lead / Solution Architect · EveryMatrix  2023–2026 |
|  Led backend for a business-critical RGS platform, team of 7; |
|  scaled microservices to tens of millions of txns/day.        |
|                                                              |
|  Senior Software Engineer · Exoft                   2021–2023 |
|  Backend microservices + Salesforce CRM integrations for      |
|  Spotlight.ai (AI Value Intelligence).                        |
|                                                              |
|  Software Engineer · SoftServe                      2018–2021 |
|  Enterprise components for CompuGroup Medical's hospital      |
|  platform.                                                    |
|                                                              |
|  Full-Stack Software Engineer · DevCom              2017–2019 |
|  REST APIs for a marketplace / e-commerce platform.           |
|  ------------------------------------------------------------ |
|  Earlier background: sales & project management, 2004-2017.   |  <- single line, optional
+--------------------------------------------------------------+
```

### SCR-03 — Selected projects (below the fold)

**`ProjectCard` is an accordion** (Roman's request). Native `<details>` disclosure — **no JS**,
same pattern the removed `PhoneChooser` used. Collapsed: name + role + one-line impact + a
chevron. Expanded: adds a `Detail` block — description, tech stack, date range. **D-8**: the
accordion + the per-project `description` / full `techStack` / `dateRange` fields aren't in spec
§4 / `sad.md` §5 — `data-model` needs them on the project entry. **All copy is real, from
`cv-classic-variant.pdf`.**

| State | Trigger / condition | Components (design-system inventory) | Source-ref (`screens.pen`) |
|---|---|---|---|
| default — all collapsed | Grey band. Centered "SELECTED PROJECTS" heading + rule. A **vertical stack** of 3–5 `ProjectCard` accordions, each collapsed: project name, Roman's role, one-line impact, chevron-down (AC-11, `sad.md` §6 Flow 4 `else`). Projects from `cv-classic-variant.pdf`: **RGS Platform** (EveryMatrix), **Spotlight.ai Value Intelligence** (Exoft), **CompuGroup Medical platform** (SoftServe). | `Section`, `SelectedProjects`, `ProjectCard` | `xSFYJ` (`SelectedProjects` frame `b9PNeG`) · wireframe D |
| card expanded | Recruiter activates a card's `<summary>` → the native disclosure opens (no JS), revealing the `Detail` block: description, tech stack, date range (all from `cv-classic-variant.pdf`). Chevron flips to up. Independent accordions — others unaffected. | `ProjectCard` | `xSFYJ` › `Card · expanded — EveryMatrix` `vY7IC` (`Detail` `ukJge`) · wireframe D |
| card collapsed again | Recruiter re-activates the `<summary>` → `Detail` hides, chevron flips down; the section reflows up. | `ProjectCard` | `xSFYJ` › `Card · collapsed — Exoft` `zdPAQ` |
| quantified impact | The RGS Platform card's impact carries real figures — "tens of millions of business transactions/day", "MySQL tables of billions of records", "7 backend engineers" (`cv-classic-variant.pdf`), rendered prominently (AC-11). | `ProjectCard` | `xSFYJ` › `vY7IC` › `Impact` |
| qualitative impact | The Exoft / SoftServe cards state a concrete qualitative outcome instead, same weight (AC-11). | `ProjectCard` | `xSFYJ` › `zdPAQ` › `Impact` |
| N/A: empty | The schema requires 3–5 projects and rejects an empty/placeholder impact, naming the project (AC-12, ADR-0007). | — | — |
| N/A: loading / error | Static disclosure, no runtime data path (SAD §8). | — | — |

```text
wireframe D — SCR-03 (accordion, vertical stack)
+--------------------------------------------------------------+
|                    SELECTED PROJECTS                          |
|                        ------                                 |
|  +--------------------------------------------------------+   |
|  | RGS Platform — EveryMatrix                        [^]  |   |  ← expanded
|  | Role · Java Team Lead / Solution Architect             |   |
|  | Impact: scaled reactive microservices to tens of      |   |
|  |   millions of txns/day; MySQL tables of billions of    |   |
|  |   records; led 7 backend engineers.                    |   |
|  | ----------------------------------------------------   |   |
|  | Led backend for a business-critical RGS platform ...   |   |
|  | Stack: Java 17/19/21 · Spring WebFlux · Kafka · ...    |   |
|  | 2023 – 2026                                            |   |
|  +--------------------------------------------------------+   |
|  +--------------------------------------------------------+   |
|  | Spotlight.ai Value Intelligence — Exoft           [v]  |   |  ← collapsed
|  | Role · Senior Software Engineer                        |   |
|  | Impact: built the backend microservices + Salesforce   |   |
|  |   CRM integrations for an AI sales-discovery platform. |   |
|  +--------------------------------------------------------+   |
|  +--------------------------------------------------------+   |
|  | CompuGroup Medical platform — SoftServe           [v]  |   |  ← collapsed
|  | Role · Software Engineer                               |   |
|  | Impact: enterprise components for a large-scale        |   |
|  |   hospital platform; architecture, features, prod.     |   |
|  +--------------------------------------------------------+   |
+--------------------------------------------------------------+
  phone: same single-column stack
```

### SCR-04 — Phone-line chooser — **REMOVED**

Roman: *"SCR-04 phone line — is not valid anymore."* Phone is dropped from this feature (D-2
resolved). The `SCR-04` artboard and the `PhoneChooser` / `ContactActions` / `ContactButton`
component frames are deleted from `screens.pen`. **`tasks` / a spec edit must drop US-03, AC-03,
`ux-flows.md` Flow US-03, and `sad.md` §6 Flow 3** to match. The `contact.phones` content field
becomes CV-only (the CV route still shows the numbers as text — `sad.md` §1 / spec §1).

## New components

Additions beyond the SAD §5 building-block list — all registered in `docs/design-system.md`
§Component inventory:

| Component | Why it is new | Upstream status |
|---|---|---|
| `Header` | **Fixed / sticky** top chrome, dark-navy. Left: name + `LinkedIn` + `Gmail` **icon controls** (→ the LinkedIn URL / `mailto:` — these ARE the LinkedIn and email contact actions). Right: `About me` (`#about`), `Download CV`, `Contact` (`#contact`) **menu items**. **No phone.** | ⚠ D-1 / D-3 — not in `sad.md` §5 or `ux-flows.md`. Requested by Roman; drawn, pending spec ratification. |
| `Footer` | Bottom chrome, dark-navy, centered "Copyright © Hrupskyi R. Bio 2026". Flush to the viewport bottom (`min-height: 100vh` page). | ⚠ D-3 — pending spec ratification. |
| `AboutMe` (block inside `Section`) | `SCR-05` — two columns: a **narrative** (from `linkedin-about.md`) + a **HIGHLIGHTS** bullet list (Roman's own text). | ⚠ D-4 — pending an About user-story in spec §4. |
| `Industries` (block inside `Hero`) | Hero right column — the INDUSTRIES list from `linkedin-about.md` (iGaming / FinTech & E-commerce / Healthcare / Retail). Static text. | ⚠ D-7 — two-column hero + `industries` content not in spec §1/§4 or `sad.md` §5. |

`PhoneChooser`, `ContactActions` and `ContactButton` are **deleted** — the contact row left the
hero (D-1) and phone is dropped (D-2).

`screens.pen` draws the primitives as follows — reusable component frames for the atomic, repeated
pieces; the layout-only wrappers are composed inline in the artboards (still built as their own
`.astro` component at `implement`):

| Component | `screens.pen` | Notes |
|---|---|---|
| `Header` | reusable frame `dvllD` | Fixed/sticky dark-navy bar. Left: name + `LinkedIn` (`fusdv`) + `Gmail` (`z9saN`) icon controls. Right: `About me` (`#about`), `Download CV`, `Contact` (`#contact`) menu items. **No phone.** |
| `Footer` | reusable frame `W7AZlV` | Dark-navy bar, centered "Copyright © Hrupskyi R. Bio 2026". Flush to bottom. |
| `Industries` | inline (`Sh75H` › `Industries` `QfCVa`; `XKUfO` › `Industries` `WMCWv`) | Hero right column (laptop) / below availability (phone). 4 industry lines, static text, no assets. |
| `Section` | inline (`hzNGN`/`xSFYJ`/`GSu58` › `Section` frames, e.g. `mQ0Vj`) | Centered heading + short rule + spacing rhythm; layout-only wrapper. Full-bleed background colour alternates (see §Source). |
| `AboutMe` | inline (`GSu58` › `AboutMe` `k0sIs`) | `narrative` (`B6zSXN`, from `linkedin-about.md`) + `highlights` (`MKVFu`, Roman's own bullets + a LinkedIn link); reflows to one column on phone. Grey band. |
| `Hero` | inline (`Sh75H` › `Hero` `xEwZk`; `XKUfO` › `Hero copy` `Avanx`) | Photo (`me.png`) + name + headline + optional tagline (Roman's ~40-word sentence) + `AvailabilityBlock` (left) + `Industries` (right). **No `positioning` block** (D-10). White band. Laptop and phone differ (responsive-both). **No contact row** (D-1). |
| `AvailabilityBlock` | reusable frame `k6V1ni` | `status` + `location`. No notice period, no work-auth line (not in `docs/reference/`). |
| `ExperienceTimeline` | inline (`hzNGN` › `ExperienceTimeline` `jgvYw`) | 4 real roles (EveryMatrix / Exoft / SoftServe / DevCom) most-recent-first + optional earlier-background line; layout-only wrapper. White band. |
| `SelectedProjects` | inline (`xSFYJ` › `SelectedProjects` `b9PNeG`) | **Vertical stack** of `ProjectCard` accordions; 3 real projects, impact = spec §8 placeholders. Grey band. Layout-only wrapper. |
| `ProjectCard` | reusable frame `J2r0z` | **Accordion** — native `<details>`, no JS. Collapsed: `Summary` (name + role + chevron) + one-line `Impact`. Expanded: adds `Detail` (`ukJge`) — CV description + tech stack + date range. Chevron flips. |
