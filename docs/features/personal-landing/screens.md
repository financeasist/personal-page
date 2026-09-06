---
status: draft
feature_size: "M"
tool: "code"
updated_at: "2026-09-06"
---

# Screens — personal-landing

> The canonical **screen manifest** — every screen in every state — produced by `screens` (between
> `api` and `tasks`) and read by `tasks` (each `ui` task cites SCR ids + states), `implement`
> (builds the screen to the declared states) and `review` (the built screen must match this).
> Downstream stages reference **only this manifest** — never a raw design file.

## Source

- **Tool:** `code` — inline markdown wireframes below.
- **File:** «inline wireframes below».
- **Degradation note:** no `docs/design-system.md` exists — there is no tool choice and no
  component inventory to draw from. Run `/sdd:design-system` before the next UI feature. Component
  names below come from `sad.md` §5 (building block view); every one is `NEW` and listed in
  §New components — this feature creates the site's first shared primitives (spec §1).
- **No `api` stage:** the feature has no datastore and no API (`data-model` → N/A → `api` skipped),
  so there are no contract error responses. Non-default states derive from spec §5 ACs and
  `sad.md` §6 `alt`/`else` branches only.
- **Static, zero-JS delivery.** The page is fully rendered at build time (SSG, ADR-0001). There is
  **no runtime `loading` / `empty` / `error` state** on any screen: no client fetch, no
  hydration, and every completeness failure is a build-time gate (AC-05 / AC-06 / AC-12,
  ADR-0007) so an incomplete page never deploys. Each screen therefore carries explicit
  `N/A: <reason>` rows for those classes. The real variation is **content-driven** (optional
  fields present/absent, a figure present/absent) and **viewport-driven** (laptop vs phone).

## Screens

### SCR-01 — Landing hero (above the fold)

| State | Trigger / condition | Components (all NEW — see §New components) | Source-ref |
|---|---|---|---|
| default — laptop | Page load at the reference laptop viewport (1280×800). All above-the-fold essentials present (build-guaranteed). Recruiter sees headshot, name, headline, the optional tagline + positioning block, availability (status + location + remote stance), top stack (≤8), four contact actions — no scrolling. | `Hero`, `AvailabilityBlock`, `ContactActions` | wireframe A below |
| default — phone | Page load at the reference phone viewport (390×844). Same essentials, single column, every contact action a ≥44×44 px tap target, body text ≥16 px, no horizontal scroll at any width. With **both** the tagline and a full-length (~280 char) positioning block present, the contact actions sit near the fold — the positioning block is length-capped in the schema (`data-model` `positioning.max(280)`) precisely to keep AC-08 "no scrolling" holding; verified in the QG-3 manual pass at 390×844. | `Hero`, `AvailabilityBlock`, `ContactActions` | wireframe B below |
| default — tagline omitted | `profile.tagline` is empty (optional, spec §1). Headline renders with no tagline line beneath it; vertical rhythm closes up. | `Hero` | wireframe A below (tagline row absent) |
| default — positioning omitted | `profile.positioning` is empty (optional, spec §1). No positioning paragraph renders; the availability block moves up directly under the headline/tagline. This is the tighter, faster-scanning layout. | `Hero` | wireframe A below (positioning block absent) |
| default — keyboard focus | Recruiter tabs through the page (QG-3). Each of the four contact actions (and the phone `<summary>`) takes a visible focus ring, in DOM order, all operable by Enter/Space. | `ContactActions`, `PhoneChooser` | wireframe A below |
| N/A: loading | Static HTML, no client fetch and no hydration; the headshot is `astro:assets` eager + high fetch-priority with explicit dimensions, so first paint is the `default` layout with no CLS. | — | — |
| N/A: empty | The build fails and names the field if the headline, the availability status, or any of the four contact channels is missing (AC-05, ADR-0007) — an empty hero can never deploy. | — | — |
| N/A: error | No runtime error path exists on static delivery (SAD §8 "Error handling: build-time only"). | — | — |

```text
wireframe A — SCR-01 default (laptop, 1280x800)
+--------------------------------------------------------------+
|  +----------+   Roman Hrupskyi                               |
|  |          |   Senior Java Engineer | Lead Backend Engineer |
|  | headshot |   <optional tagline line>                      |
|  |          |   <optional positioning block — 2-3 short      |
|  +----------+    sentences, schema-capped at ~280 chars>     |
|                 +----------------------------------------+    |
|                 | AVAILABILITY                           |    |
|                 | Open to remote & hybrid · Krakow, PL   |    |
|                 | Work auth: <x>  (optional)             |    |
|                 +----------------------------------------+    |
|                                                              |
|   Top stack:  Java 21 · Spring Boot · Kafka · ... (<= 8)      |
|                                                              |
|   [ Call ]  [ Email ]  [ LinkedIn ^ ]  [ Download CV ]        |
|     ^details    ^mailto:  ^https new tab   ^named .pdf file   |
+--------------------------------------------------------------+
  no scrolling needed to see everything above this line

wireframe B — SCR-01 default (phone, 390x844)
+----------------------------+
|      +--------------+       |
|      |   headshot   |       |
|      +--------------+       |
|   Roman Hrupskyi           |
|   Senior Java Engineer |    |
|   Lead Backend Engineer    |
|   <optional tagline>       |
|   <optional positioning    |
|    block, 2-3 sentences>   |
|                            |
|  +----------------------+  |
|  | AVAILABILITY         |  |
|  | Open to remote ·     |  |
|  | Krakow, PL           |  |
|  | Work auth (optional) |  |
|  +----------------------+  |
|                            |
|  Top stack:                |
|  Java 21 · Spring Boot ·   |
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
+----------------------------+
   vertical scroll only, never horizontal
```

### SCR-02 — Experience timeline (below the fold)

| State | Trigger / condition | Components (all NEW) | Source-ref |
|---|---|---|---|
| default | Recruiter scrolls below the fold. Each role renders most-recent-first with company, date range and Roman's contribution; the single pre-2017 "earlier background" line sits once after the list (AC-09, `sad.md` §6 Flow 4 `alt`). | `Section`, `ExperienceTimeline` | wireframe C below |
| default — current role | The latest entry has no end year → its range reads "&lt;start&gt;–present" (AC-09). | `ExperienceTimeline` | wireframe C below (top row) |
| default — earlier-background omitted | `profile.earlierBackground` is empty (optional field, spec §1) → the "earlier background" line is absent; the section ends at the last timeline row. | `ExperienceTimeline` | wireframe C below (last line absent) |
| N/A: empty | The content schema requires ≥1 experience entry (ADR-0007 invariants); a zero-role timeline can never build. | — | — |
| N/A: loading / error | Static section, no runtime data path (SAD §8). | — | — |

```text
wireframe C — SCR-02 default
+--------------------------------------------------------------+
|  EXPERIENCE                                                   |
|                                                              |
|  <Role>  ·  <Company>                       2023 - present    |
|  <one-line contribution>                                      |
|                                                              |
|  <Role>  ·  <Company>                       2021 - 2023       |
|  <one-line contribution>                                      |
|                                                              |
|  <Role>  ·  <Company>                       2017 - 2021       |
|  <one-line contribution>                                      |
|                                                              |
|  Earlier background: sales & project management, 2004-2017.   |  <- single line, optional
+--------------------------------------------------------------+
```

### SCR-03 — Selected projects (below the fold)

| State | Trigger / condition | Components (all NEW) | Source-ref |
|---|---|---|---|
| default | Recruiter scrolls past the timeline. 3–5 project cards, each with the project name, Roman's role, and an impact statement (AC-11, `sad.md` §6 Flow 4 `else`). Layout reflows for 3 vs 5 cards without leaving an orphan. | `Section`, `SelectedProjects`, `ProjectCard` | wireframe D below |
| default — quantified impact | The Profile impact statement carries a real figure → the card renders the number (latency / throughput / team-size / delivery-time) prominently (AC-11). | `ProjectCard` | wireframe D below (card 1) |
| default — qualitative impact | No number exists in the Profile for that project → the card states a concrete qualitative outcome instead, same weight (AC-11). | `ProjectCard` | wireframe D below (card 2) |
| N/A: empty | The schema requires 3–5 projects and rejects an empty or placeholder impact statement, naming the project (AC-12, ADR-0007) — a project with no outcome can never build. | — | — |
| N/A: loading / error | Static section, no runtime data path (SAD §8). | — | — |

```text
wireframe D — SCR-03 default
+--------------------------------------------------------------+
|  SELECTED PROJECTS                                            |
|                                                              |
|  +---------------------------+  +---------------------------+  |
|  | <Project name>            |  | <Project name>            |  |
|  | Role: <Roman's role>      |  | Role: <Roman's role>      |  |
|  |                           |  |                           |  |
|  | Impact: cut p99 latency   |  | Impact: unblocked a multi-|  |
|  | 400ms -> 90ms across ...   |  | operator rollout that ... |  |
|  |   (quantified)            |  |   (qualitative outcome)   |  |
|  +---------------------------+  +---------------------------+  |
|                                                              |
|  +---------------------------+  ( ... 3 to 5 total ... )       |
|  | <Project name>            |                                |
|  | Role: <Roman's role>      |                                |
|  | Impact: ...               |                                |
|  +---------------------------+                                |
+--------------------------------------------------------------+
  phone: cards stack to a single column
```

### SCR-04 — Phone-line chooser (expanded state of SCR-01)

| State | Trigger / condition | Components (all NEW) | Source-ref |
|---|---|---|---|
| default — collapsed | The phone contact action on SCR-01 is a native `<details>` whose `<summary>` reads "Call" (or similar). No phone digits are rendered as visible text (AC-10). | `PhoneChooser` | wireframe E below (collapsed) |
| expanded | Recruiter activates the phone action. The native disclosure opens with **no JavaScript**, revealing one labelled control per line — "Call — Poland" / "Call — international" — still no digits shown; activating one hands off `tel:` to the dialer (AC-03, `sad.md` §6 Flow 3). | `PhoneChooser` | wireframe E below (expanded) |
| collapsed again | Recruiter changes their mind and collapses the disclosure → returns to the hero unchanged (`sad.md` §6 Flow 3 `else`). | `PhoneChooser` | wireframe E below (collapsed) |
| single line | Only one phone line is published in the Profile (AC-03 is conditioned on "more than one published phone line") → no disclosure; the control degrades to a single direct "Call" link. | `ContactActions` | wireframe E below (single-line) |
| no dialer on the device | Recruiter activates a call control on a device with no dialer/`tel:` handler → the hand-off does not resolve. Accepted, with **no copyable-text fallback** (ADR-0006, `sad.md` §6 Flow 2 `alt`). Nothing new renders. | `PhoneChooser` | — |
| N/A: loading / empty / error | Static disclosure; the `tel:` values are schema-guaranteed present, and there is no runtime path (SAD §8). | — | — |

```text
wireframe E — SCR-04

collapsed (part of SCR-01 contact row):
   [ Call  v ]

expanded (native <details> open, no script):
   [ Call  ^ ]
   +--------------------------+
   |  Call - Poland           |  -> tel: PL line
   |  Call - international     |  -> tel: international line
   +--------------------------+
   (no digits rendered anywhere)

single-line fallback (only one phone in Profile):
   [ Call ]   -> tel: the one line, no disclosure
```

## New components

All components are NEW — no `docs/design-system.md` inventory exists yet. This feature creates the
site's first shared primitives (spec §1); `implement` registers each into
`docs/design-system.md` §Component inventory once `/sdd:design-system` has created that file.

| Component | Why no existing primitive fits | Registered in design-system |
|---|---|---|
| `Section` | No inventory exists; below-the-fold section wrapper (heading + spacing rhythm) reused by SCR-02 and SCR-03. | pending |
| `Hero` | No inventory exists; above-the-fold composition — headshot (LCP), name, headline, optional tagline, optional positioning block (both render conditionally). | pending |
| `AvailabilityBlock` | No inventory exists; structured block — availability `status` (carries the remote stance) + `location` (from `contact`) + optional `workAuthorization`. | pending |
| `ContactActions` | No inventory exists; the four labelled controls, each carrying a stable `data-contact-channel` / `data-cv-download` hook for roadmap step 8 (SAD §8). | pending |
| `PhoneChooser` | No inventory exists; native `<details>` disclosure with two labelled `tel:` controls, no digits as text (ADR-0006). | pending |
| `ExperienceTimeline` | No inventory exists; most-recent-first roles + the optional single "earlier background" line. | pending |
| `SelectedProjects` | No inventory exists; 3–5 card layout wrapper with 3-vs-5 reflow. | pending |
| `ProjectCard` | No inventory exists; one project — name, role, impact statement (quantified or qualitative variant). | pending |
