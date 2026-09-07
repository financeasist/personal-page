---
status: Draft
owner: "Roman (roman.grupskyi@gmail.com)"
reviewers: ["Roman"]
updated_at: "2026-09-07"
feature_size: "S"
---

# Spec — personal-landing

> **Glossary:** [CONTEXT](../../../CONTEXT.md) (repo-root; no feature-scoped CONTEXT.md)
> **Reference material / channels used:** `docs/idea-brief.md` §2–§8 · `docs/roadmap.md` step 3 + open decisions D5/D7 · `docs/architecture-map.md` (Stack, Frontend/UI foundation, Constraints) · `docs/reference/cv-template-reference.pdf`, `docs/reference/cv-classic-variant.pdf`, `docs/reference/linkedin-about.md`, `docs/reference/me.png` (headshot) · interview 2026-09-06.

## 1. Context

Roman is in an active job search from Krakow, targeting senior / lead Java and backend roles across the EU and remote. Today his story is split between two divergent CV PDFs and a LinkedIn profile that disagree on his surname spelling, employment dates, and years of experience, and a **Recruiter** screening him spends only seconds before moving on. He needs one link — for his CV, his LinkedIn, and his outreach email — that lets a Recruiter judge his fit in roughly twenty seconds and reach him in a single tap.

The trigger is immediate: Roman is interviewing this month and wants the link live within the week. The monorepo scaffold, the static site, and the typed **Profile content** collection shipped in `b1583df` (roadmap step 1), so the landing page is the next thing standing between him and a shareable link. This feature is roadmap step 3, and its technical shape is already fixed upstream by `docs/architecture-map.md` and ADR-0001 (a static site rendered from a typed content collection, zero client JavaScript by default) — that stack is a constraint here, not a decision this spec makes.

The roadmap sized step 3 as **L**; it was re-classified **M** at spec time, then **S** on 2026-09-07 (`.size` → `S`; `.route` kept at `standard` — the SAD and ADRs already exist) when the below-the-fold depth was cut from v1 (see "Scope narrowing" below). Rationale: no API, no migration, no backend, no breaking change; the scaffold already established the component and styling conventions; and v1 is now an above-the-fold hero plus its contact actions and one short About section — seven user stories (US-01/02/06/10 Recruiter-facing, US-05 cross-context, US-07/08 build-time; US-03 phone removed, US-04/US-09 deferred to v2), two page sections. `ux-flows` and `screens` already ran against the M-size spec and need a re-sync pass (drop the cut flows/screens, drop the phone-chooser, add the About section).

The committed approach is one static landing page rendered at build time entirely from the single typed **Profile content** entry. **v1 is the above-the-fold scan plus one short About section below it** — the deeper below-the-fold depth (experience timeline, selected-work) is cut to v2 (see "Scope narrowing" below). The **above-the-fold scan** carries Roman's headshot, his name, his **headline** (the pipe-separated positioning line — currently "Senior Java Engineer | Lead Backend Engineer" — which is also the source for the CV filename) with an optional short **tagline** below it (a sentence or two, length-capped at ~300 characters so the above-the-fold fit still holds — this absorbs what an earlier draft split into a separate "positioning block"), the **Availability block** (availability status carrying the remote-work / relocation stance, location, notice period, optional work authorisation), his **top stack** (a curated list of four to eight technologies chosen in the Profile content), an optional **Industries list** (a short hero-column list of the domains he's delivered in — iGaming, fintech, healthcare, retail), and three **Contact actions** — email, LinkedIn, and Download CV, all three mandatory — presented in a **persistent header** at the top of the page (sticky, CSS-only). On the phone viewport the header condenses to Roman's name, the email and LinkedIn actions as icon controls, and a native-disclosure (`<details>`, no JavaScript) menu holding Download CV and an in-page About link. Below the fold sits the **About section** — a short prose `narrative` (reconciled from `docs/reference/linkedin-about.md`) and a `highlights` bullet list (Roman's own text) — both required Profile fields. Each contact action is a plain link that opens its channel directly and works with no JavaScript; a later inline script (roadmap step 8) adds fire-and-forget click beacons that never block the action — this confirms roadmap decision D8 (plain link + inline-script beacon, not a redirect through the tracker). **On the landing page, Roman's email address and LinkedIn URL are never rendered as visible text** — a Recruiter reaches him by activating a labelled control, not by reading and copying a string. The values live only in the controls' link attributes so the controls can function (resolved in §8 / ADR-0006: link attributes only, no visible text, no script, in v1). **The phone is not on the landing page at all in v1** (removed 2026-09-07): `contact.phones` stays in the Profile content but renders only on the CV route. This exposure rule is scoped to the landing page only: the **CV PDF** **does show the contact details as visible text** — that is the point of a CV, and the Recruiter obtains it by a deliberate download. Same source of truth (the Profile content), two exposure rules.

**CV delivery in v1 is a committed static PDF, not a generated one** (decided 2026-09-07 — reverses the build-time generation ADR-0004 established for step 4). The Download-CV control points at a hand-committed PDF under `site/public/` (the reconciled "Classic" variant), named through the shared filename helper. Build-time generation of `/cv` (roadmap step 4, `cv.astro` print route) moves to the next version. **This is accepted v1 debt:** a committed PDF can drift from the Profile content the page renders from — exactly the "two divergent CVs" problem in the first paragraph — so v1 adds a manual parity check at each release (page vs committed CV: surname, headline, dates) and a revisit trigger to generation. A missing committed PDF fails the build (postbuild assertion → "file exists"). **This decision needs its own ADR (supersedes/amends ADR-0004) and a `CLAUDE.md` edit** — both are follow-ups outside this spec (see §8).

This feature ships **one small inline progressive-enhancement script** — the scroll-spy active-section indicator that marks the header "About me" link while the About section is in view (ADR-0009, added in the 2026-09-07 polish pass) — and no JS bundle, no framework island, no hydration. The sticky header, the scroll-shrink animation and the mobile disclosure menu are all CSS-only; with the script blocked the page is fully usable, only the active-link highlight is absent. The click-tracking beacon is still roadmap step 8. Hand-rolled header, footer, hero, section, contact-actions, availability-block, industries, and about components (SAD §5) become the site's first shared primitives.

**Layout decisions ratified 2026-09-07** (came out of the Pencil iteration, `screens.md` § Divergence D-1/D-3/D-7/D-10): the three contact actions live in a **persistent sticky header**, not a hero block (D-1); the page has header + footer chrome and CSS-only in-page `#about` anchoring, which does not make it a multi-route app (D-3); the hero's right column is an optional **Industries list** backed by a new optional `industries` Profile field (D-7); and the **tagline absorbs the old "positioning block"** — one optional field, a sentence or two, ~300-char cap, no separate `positioning` field (D-10).

Content is derived from `docs/reference/` (the CV template, the "Classic" variant, the LinkedIn "About", and the `me.png` headshot), reconciled into the Profile content entry. The canonical reconciliation (roadmap step 2) is **confirmed by Roman on 2026-09-06**: surname → **Hrupskyi** (email stays `roman.grupskyi@gmail.com`); experience → **"9+ years"**; headline → **"Senior Java Engineer | Lead Backend Engineer"** (the committed CV text is reconciled to match). The experience timeline, the selected-work section, and the pre-2017 "earlier background" line are all v2 (see "Scope narrowing"), so the exact employment date ranges are no longer a v1 blocker — they move to §8 as a v2 item.

**Scope narrowing vs roadmap step 3 (updated 2026-09-07):** v1 is the above-the-fold scan plus the About section. Deferred to v2:
- the **experience timeline** (was US-04 / AC-09) and its "earlier background" line;
- the **selected-work** section (was US-09 / AC-11 / AC-12) and the `ProjectCard` component;
- the full **skills matrix** (glossary listed it "below the fold"; it was never in scope here and is now explicitly a non-goal — §3);
- the **recommendation / testimonial** block (no quote material exists yet).

**Removed from v1 entirely (not deferred), 2026-09-07:** the landing-page **phone control** and its no-JavaScript line chooser (was US-03 / AC-03). The phone is not a landing-page channel in v1; `contact.phones` stays in the Profile content and renders only on the CV route. Re-instating a landing phone control is a fresh decision, not a v2 backlog item.

**Added back to v1, 2026-09-07:** one short **About section** below the fold (US-10 / AC-14) — a `narrative` paragraph and a `highlights` list, both required Profile fields. This is the only below-the-fold content in v1.

Roadmap step 3's scope is amended to match; nothing above the fold is dropped. The deferred sections remain **schema-additive** later (the Profile content shape does not need to change to bring them back). `ux-flows.md` and `screens.md` predate these changes and need a re-sync pass.

**Template redesign, 2026-09-07 (Roman):** the hero was re-laid-out to a **centered vertical column** (circular headshot → name with a navy rule → headline → tagline → Availability + Industries two-column block → top stack as one middot-joined line, no chips), the About narrative renders in one uniform ink colour, and the page is now a **natural top-to-bottom flow**. This **supersedes the binding "above-the-fold fit" constraint**: the "Above-the-fold fit (binding)" row in §6, the "without scrolling" / "within the fold" clauses of AC-01 and AC-08, and "About sits below the fold" in AC-14 are **withdrawn** — the essentials must render, be legible (≥16 px body), and in reading order, with no horizontal scroll at any width, but no element is required to sit within a viewport height. The §6 drop order (Industries → Tagline → top-stack truncation) is likewise withdrawn: Industries now renders at every width, on phone too. The **header** additionally gains a `Contact` item (a `mailto:` — same channel as the email icon) and a CSS-only scroll-shrink (scroll-driven animation, no client JS; degrades to a plain sticky bar). The mockups live in `screens.pen` (`s7Hhu` laptop hero, `A3vORR` laptop About, `XKUfO` phone). Source of truth for copy is now the mockups → `roman.json` was updated to match. The committed CV PDF was swapped to `docs/reference/cv-template-reference.pdf`. Full AC-by-AC rewrite of the fold language is deferred; this note governs.

**Header polish + scroll-spy, 2026-09-07 (Roman), post-review:** the header bar was made taller with the name set to the same size as the hero name (`Hero.astro` `.hero__name`), the nav-link type bumped, and the footer given a slimmer band than the header (the earlier `Footer` `:global(.band__inner)` padding override never won its specificity fight — fixed by a `--band-pad-block` custom property on `Band`). The section rule under a heading (`Section.astro`) now matches the rule under the hero name. The footer copy reads `Copyright © <year> <owner>` (the bare `©` gained the word — note: "Copyright" is now a hard-coded English string, a small locale-clean debt for a future i18n pass). The header also gained a **scroll-spy active-section indicator**: one inline `IntersectionObserver` (~320 B, inlined by Astro — no bundle) toggles a filled-block active state on the "About me" link + menu item while `#about` is in the reading band. This is the feature's only script and a strict progressive enhancement — **see ADR-0009**, which amends the §6 client-JS NFR from 0 KB to ≤ 1 KB.

**Sequencing:** roadmap step 4 (the `cv.astro` print route and its build-generated PDF) moves **after** this feature (was: sequenced together). v1 ships a **committed static PDF** under `site/public/` — the reconciled "Classic" variant, which already renders Roman's contact details as visible text. The Download-CV control and its tracked click hook are built here and point at that committed file. The filename is still resolved through a shared helper (from the Profile content name + headline), never a hand-copied string, so step 4 can later swap the generated file in with no control change. A missing committed PDF fails the build (postbuild assertion → "file exists"). AC-04 is satisfied by the committed file in v1. The page-vs-CV parity that generation would enforce structurally is, in v1, a **manual check at each release** (see §7 Content-drift KPI and §8).

## 2. Goals

- A Recruiter can state Roman's seniority, stack, location, and availability from the above-the-fold scan alone, without scrolling.
- A Recruiter can reach Roman through any primary channel — email, LinkedIn, or CV — from a persistent header that stays in reach as they scroll: one tap on a laptop; on a phone, email and LinkedIn are one tap and Download CV is one tap inside the header menu.
- A Recruiter who wants a fuller sense of Roman before reaching out can read a short About section (his own narrative + highlights) one scroll below the fold.
- The page reflects the same reconciled professional history as the committed CV — surname, headline, and dates match at each release (a manual parity check in v1; structurally enforced once the CV is generated from the Profile content, next version).

## 3. Non-goals

- **No contact form or in-page messaging** — a tap-to-open channel (mail client, LinkedIn) is faster for a Recruiter and needs no backend.
- **No salary or rate on the page** — a number invites premature filtering; Roman handles compensation in conversation (roadmap D5).
- **No blog or articles, no long-form personal-life content** — the twenty-second scan doesn't need it; deferred to v2. The one exception is the **About section** (US-10) — a short reconciled narrative + a highlights list, both drawn from `docs/reference/linkedin-about.md` and Roman's own text; it is not a blog and carries no personal-life material.
- **No deep below-the-fold depth in v1** — the experience timeline (was US-04 / AC-09), the selected-work section (was US-09 / AC-11 / AC-12), the pre-2017 "earlier background" line, the full skills matrix, and the recommendation / testimonial block are all deferred to v2. v1 below the fold is the About section and nothing else. Section composition stays additive (no schema change needed to bring the deferred sections back). This narrows roadmap step 3 (see §1).
- **No phone on the landing page** (v1, removed 2026-09-07 — not deferred) — no `tel:` control and no phone-line chooser. `contact.phones` stays a Profile field, rendered only on the CV route.
- **No tracker wiring** — the click-beacon script and event ingest are roadmap steps 6 and 8; this feature only renders the actions and leaves stable `data-*` hooks for them (naming per ADR-0006). A scroll-past-fold marker and a page-open timestamp are *not* built here — the KPIs that need them (§7) depend on step-8 markup.
- **No CV generation in v1** — v1 links to a committed static PDF (`site/public/`). The `cv.astro` print route and build-time generation are deferred to the next version (was roadmap step 4, sequenced together). No CV *layout* work either way — the template stays locked to `docs/reference/cv-template-reference.pdf`.

## 4. User stories

### US-01: Scan Roman's fit in seconds

**As a** Recruiter
**I want** the essentials — headshot, name, headline, top stack, location, availability — visible without scrolling
**So that** I can decide in about twenty seconds whether to pursue him.

### US-02: Reach Roman in one tap

**As a** Recruiter
**I want** email, LinkedIn, and CV download as immediate actions in a persistent header at the top of the page
**So that** I can contact him through my preferred channel without hunting, and the actions stay in reach as I scroll.

### US-03: Choose which number to call — REMOVED FROM v1 (not deferred)

_Removed 2026-09-07 (scope change, §1). The phone is not a landing-page channel in v1 — no `tel:` control, no line chooser. `contact.phones` stays in the Profile content and renders only on the CV route. AC-03 is withdrawn. ID retained for traceability; re-instating a landing phone control is a fresh decision, not a v2 backlog item._

**As a** Recruiter
**I want** to pick between Roman's two phone lines when I choose to call, by label rather than by reading digits
**So that** I ring the one that suits me — the local Polish line or the international one.

### US-04: Verify the headline claims — DEFERRED TO v2

_Cut from v1 on 2026-09-07 (scope narrowing, §1). Below-the-fold depth is v2; a Recruiter verifies history via the committed CV in v1. AC-09 is withdrawn. ID retained for traceability._

**As a** Recruiter
**I want** a most-recent-first experience timeline below the fold
**So that** I can check the above-the-fold claims against his actual history before I reach out.

### US-05: Download an identifiable CV

**As a** Recruiter
**I want** the CV download to produce a file named for Roman and his role
**So that** it is recognisable in my downloads folder and in our applicant tracking system.

### US-06: Review the page on my phone

**As a** Recruiter
**I want** the page legible and every action tappable on a phone-sized screen
**So that** I can review a link from my inbox while away from my desk.

### US-07: Publish by committing one file

**As** Roman
**I want** the page to render entirely from the Profile content entry
**So that** a one-file edit and commit updates the live page — and the CV — with no code change.

### US-08: Never ship a broken page

**As** Roman
**I want** the build to fail when the Profile content is missing an above-the-fold essential
**So that** I never publish a page with a blank headline or a missing contact channel.

### US-09: Gauge the scale and outcome of his work — DEFERRED TO v2

_Cut from v1 on 2026-09-07 (scope narrowing, §1). Selected-work is v2. AC-11 and AC-12 are withdrawn. ID retained for traceability._

**As a** Recruiter
**I want** three to five flagship projects called out with what changed because of Roman's work — the impact, in numbers where there are numbers
**So that** I can judge the scale and results of what he has built, not just where he has worked.

### US-10: Read a short "about" in Roman's own words

**As a** Recruiter
**I want** a short About section one scroll below the fold — a few sentences of narrative plus a handful of highlights
**So that** I get a fuller sense of his focus and strengths in his own words before I decide to reach out.

### US-11: See the domains he has worked in

**As a** Recruiter
**I want** a short list of the industries Roman has delivered in, in the hero
**So that** I can judge domain fit at a glance alongside his stack.

_Added 2026-09-07 (ratified divergence D-7). Backed by an **optional** `industries` Profile field — when it is absent the hero simply renders without that column; it is not an above-the-fold essential and never fails the build._

## 5. Acceptance criteria

### AC-01 (US-01) — happy path

**Given** a Recruiter opens the landing page at either reference viewport (1280×800 laptop or 390×844 phone, see §6)
**When** the page finishes loading
**Then** without scrolling, the Recruiter sees every **above-the-fold essential**: Roman's headshot, his name, his headline, his current availability status (carrying the remote-work / relocation stance), his location, his top stack (four to eight technologies), and the three contact actions (email, LinkedIn, Download CV) — the contact actions rendered in the persistent header (on the phone viewport, email and LinkedIn as icon controls and Download CV inside the header menu, per AC-08). This is the same list AC-05 enforces at build time — the render AC and the build gate point at one canonical set. _(The About section is below the fold — not an above-the-fold essential; it is covered by AC-14. The optional Industries list and Tagline are hero content but not essentials — absent is valid.)_

### AC-02 (US-02) — happy path

**Given** a Recruiter is viewing the landing page (the header is persistent, so this holds at any scroll position)
**When** the Recruiter activates the email action — a header icon control on the phone viewport, a header control on the laptop viewport
**Then** their mail client opens a new message already addressed to Roman, with no further steps.

### AC-03 (US-03) — WITHDRAWN (removed from v1, not deferred)

_Withdrawn 2026-09-07 with US-03 (scope change, §1). No phone control on the landing page in v1; `contact.phones` renders only on the CV route. ID retained for traceability._

### AC-04 (US-05) — cross-context

**Given** the Profile content specifies Roman's name and headline
**When** the site is built
**Then** the CV download is served under a filename derived from that same name and headline through the shared filename helper — not a generic "cv" name — and the reconciled name and headline in the committed CV match what the landing page shows (enforced in v1 by the release parity check, §7; structurally once the CV is generated, next version).

### AC-05 (US-08) — domain invariant

**Given** the Profile content is missing a **required landing field** — Roman's name, the headshot (image path *and* its alt text), the headline, the availability status, the location, fewer than four entries in the top stack, any of the three contact channels (email, LinkedIn, CV — all required), or the About section (`about.narrative` *and* a non-empty `about.highlights` list)
**When** Roman or CI builds the site
**Then** the build fails with a message naming the missing field, and the incomplete page is never published (the invariant "the landing page is always complete" holds). The above-the-fold subset of this list is the same canonical essentials list AC-01 renders; `about.*` is required too but is below the fold (AC-14).

_The "CV channel" has no Profile-content field of its own: it is satisfied when the committed PDF exists at the expected path (postbuild "file exists" assertion) and the name + headline needed to derive its filename are present._

### AC-06 (US-07) — error

**Given** Roman edits the Profile content and enters a value that does not match the required shape — an email address with no "@", an empty headline, a malformed link, a top stack with more than eight entries
**When** Roman builds or commits
**Then** the build stops and reports which field is invalid and why, and nothing is published until it is corrected.

_The optional Tagline and the optional Industries list are exempt: absent is valid; present-but-empty is not (an empty `tagline` string, or an `industries` entry with an empty `domain`, fails as a malformed value). The Tagline, when present, is capped at ~300 characters; `industries` at 6 entries._

### AC-07 (US-01) — authorization (need-to-know exposure)

**Given** the page is public and served to an anonymous Recruiter
**When** anyone views the page or its delivered source
**Then** no salary or rate expectation, no exact home address, no phone number, and none of the tracker's per-recruiter link labels appear anywhere in it, and Roman's email address and LinkedIn URL / handle are never rendered as visible text on the landing page — the page exposes only what a Recruiter needs to assess fit and lets them make contact through the labelled controls. (Phone numbers are not on the landing page in any form in v1 — not as text, not in a link attribute; they live only in the Profile content and the CV route. The committed CV PDF deliberately shows the contact details — that boundary is out of this criterion's scope.)

### AC-08 (US-06) — happy path

**Given** a Recruiter opens the page at the reference phone viewport (390×844)
**When** the page loads
**Then** every above-the-fold essential (AC-01 list) is visible without scrolling, all text is legible, and there is no horizontal scrolling. The header condenses to Roman's name, the email and LinkedIn actions as icon controls, and a menu control; the email and LinkedIn icon controls, the menu control, and every item the menu discloses (Download CV, an in-page About link) are each a full tap target (≥44×44 px); the menu is a **native disclosure** (`<details>` / `<summary>`, no JavaScript). At the narrower 360 px width only the no-horizontal-scroll guarantee is binding — essentials may reflow below the fold there (see §6 for the fold-fit viewports and the drop order when the mobile hero overflows).

### AC-09 (US-04) — WITHDRAWN (deferred to v2)

_Withdrawn 2026-09-07 with US-04 (scope narrowing, §1). The experience timeline is v2. ID retained for traceability; re-instate with US-04._

### AC-10 (US-02) — domain invariant

**Given** the rendered landing page — not the CV download
**When** a Recruiter views the contact area
**Then** neither the email address nor the profile URL appears as visible text — each is reachable only by activating its labelled control (the invariant "contact details are actionable-only on the landing page" holds; the committed CV PDF is the deliberate exception). The values do live in the controls' link attributes so the controls function; keeping them out of the HTML source entirely was considered and **rejected for v1** (ADR-0006 — no script; script-assembled-on-click is the documented fallback if scraping abuse appears). _(Phone is not on the landing page at all in v1 — see AC-07 — so it is out of this invariant's scope.)_

### AC-11 (US-09) — WITHDRAWN (deferred to v2)

_Withdrawn 2026-09-07 with US-09 (scope narrowing, §1). Selected-work is v2. ID retained for traceability._

### AC-12 (US-09) — WITHDRAWN (deferred to v2)

_Withdrawn 2026-09-07 with US-09. The placeholder-detection rule (was §8) moves to v2 with the section._

### AC-13 (US-02) — happy path

**Given** a Recruiter is viewing the header contact actions
**When** the Recruiter activates the LinkedIn action or the Download-CV action (on the phone viewport, Download CV is inside the header menu — one tap to open the menu, one to activate)
**Then** LinkedIn opens Roman's profile in a new browser tab with the landing page left open, and Download CV saves the named PDF to the Recruiter's device as a file download rather than opening it inline.

### AC-14 (US-10) — happy path

**Given** the Profile content carries `about.narrative` (a non-empty paragraph) and `about.highlights` (a non-empty list of short lines)
**When** a Recruiter scrolls one screen below the fold at either reference viewport (1280×800 / 390×844)
**Then** the About section renders the narrative and the highlights straight from the Profile content — no hard-coded copy — and on the phone viewport it reflows to a single column with body text ≥ 16 px and no horizontal scroll.

_The About section is below the fold by design — it is not part of the AC-01 / AC-08 above-the-fold guarantee. Both `about.narrative` and a non-empty `about.highlights` are build-required (AC-05); an empty narrative string or an empty highlights list fails the build (AC-06)._

### AC-15 (US-11) — content-driven, optional

**Given** the Profile content carries an `industries` list (one to six entries, each a `domain` and an optional `note`) **or** omits it entirely
**When** the hero renders
**Then** if the list is present the hero shows it as a short column straight from the Profile content (no hard-coded copy), reflowing below the availability block on the phone viewport; if the list is absent the hero renders without that column and the build still succeeds. An `industries` entry with an empty `domain`, or more than six entries, fails the build with a message naming the field (AC-06).

_`industries` is not an above-the-fold essential — it is not in the AC-01 / AC-05 canonical list, never blocks a build by being absent, and collapses on the phone viewport as step 1 of the §6 drop order so the essentials stay above the fold at 390×844 (AC-08). <!-- added-by-fix: 2026-09-07 --> "Reflowing below the availability block" above describes the layout on viewports wide enough to show the list (below the two-column breakpoint on a wider phone, before it collapses)._

## 6. Non-functional requirements

| Aspect | Target | Measurement |
|---|---|---|
| Above-the-fold render (Largest Contentful Paint), Lighthouse "mobile" preset (mid-tier device, throttled 4G) | ≤ 2.5 s | Lighthouse mobile audit, run manually pre-launch |
| Initial page weight (HTML + CSS + fonts + images; excludes the later analytics beacon) | ≤ 500 KB transferred | Lighthouse / build size report |
| Client JavaScript shipped by this feature | ≤ 1 KB — one inline progressive-enhancement script (scroll-spy active-section indicator, ADR-0009); no JS bundle, no framework island, no hydration | build output inspection |
| Accessibility | Lighthouse Accessibility ≥ 95; every interactive element keyboard-reachable and operable | Lighthouse mobile audit + manual keyboard pass |
| Above-the-fold fit (binding) | every above-the-fold essential (AC-01 list) visible with no scrolling at **1280×800** (reference laptop) and **390×844** (reference phone) | manual check at both viewports pre-launch |
| Above-the-fold fit (narrow) | at 360 px width the essentials may reflow below the fold; only "no horizontal scroll" is guaranteed. When the mobile hero overflows the fold, optional elements are dropped / collapsed in this order: **1. Industries list → 2. Tagline → 3. top-stack wraps and truncates toward its 8-item cap.** The essentials themselves never drop. | manual check at 360 px pre-launch |
| Readability & hit area | body text ≥ 16 px; every interactive target ≥ 44×44 px (WCAG 2.5.8) | manual audit + Lighthouse |
| Supported viewports | no horizontal scroll at 360, 768, 1280, and 1920 px width | manual responsive check pre-launch |
| Content completeness enforced at build | 100% of missing / malformed required fields fail the build | `astro check` + content-collection schema validation in CI |

**Enforcement of the manual pre-launch rows.** The LCP, page-weight, and Accessibility targets are checked manually before each launch (not in CI). A miss on any of them **blocks the launch** until it is fixed or Roman explicitly waives it in the release checklist with a written reason. They are gates, not aspirations. (The "Content completeness" and "Client JS = 0 KB" rows are enforced automatically in the build.)

## 6.1 Security / privacy

- **Data classification:** public. Everything rendered is content Roman chooses to publish to recruiters; the CV is already public on static hosting.
- **Personal data touched:** Roman's own contact details (email, LinkedIn URL on the landing page; phone numbers held in the Profile content but rendered only on the CV route in v1), his headshot (a Profile-content field: image path + alt text; source `docs/reference/me.png`), and the About narrative + highlights — all self-published. On the landing page the email and LinkedIn URL are actionable-only (never visible text) and the phone is absent entirely; in the committed CV PDF the contact details are shown by design. No third-party personal data. This feature collects **no** visitor data (tracking is roadmap steps 6–8).
- **AuthZ/AuthN impact:** none — the page is public and static, no authentication, no per-user state, no session.
- **Abuse cases:**
  - **Scraping Roman's email for spam** — mitigated on the landing page: the email and LinkedIn URL are never rendered as visible text there, only as labelled controls (AC-07, AC-10); the values sit in the controls' link attributes so the controls work (going stricter — script-assembled on click — is the documented fallback if abuse appears, ADR-0006). The phone is not on the landing page at all in v1, so there is nothing to scrape there. The **committed CV PDF** does carry all the contact details in plain text by design — a CV without them is useless — so the residual exposure is the download, which the Recruiter initiates deliberately. Accepted.
  - **A Recruiter's device has no handler for a channel** (no default mail client) — the `mailto:` activation is simply inert, and because AC-07 / AC-10 forbid a visible value there is nothing to copy as a fallback. **Accepted for v1:** LinkedIn and the CV download cover the handler-less case, and adding a visible-on-activation reveal or a copy affordance would breach the actionable-only invariant. Revisit if outreach feedback shows Recruiters are stuck.
  - **Content injection through Profile fields** — prevented: Profile content is authored only by Roman via git and validated by the schema at build; no visitor-supplied content is ever rendered.
  - **Over-exposure (salary / address leaking into the page or its source)** — prevented by keeping those fields out of the Profile schema entirely (AC-07).
  - **Re-hosting or framing the page elsewhere** — accepted: it is public marketing material; no framing protection in v1.
- **Security review:** N/A — no new authorization boundary, no new personal-data store, no backend; static public content only.

## 7. Metrics / KPIs

> The contact-behaviour KPIs are measured once the tracker beacon (roadmap step 8) ships; this feature provides the tracked action hooks that make them measurable. Baselines are 0 because no page exists today.
>
> **What this feature does and does not leave for step 8.** It emits stable `data-*` attributes on the three contact actions (naming per ADR-0006) — enough for **Contact-action rate**. It does **not** emit a scroll-past-fold marker or a page-open timestamp, so **Above-the-fold sufficiency** and **Time to first contact action** need markup added in step 8 (a fold sentinel element + a page-open time captured by the beacon script). Those two KPIs are not measurable on this feature's output alone — flagged here so step 8 picks them up.

- **Contact-action rate** — of Recruiter sessions that open the page, the share that activate at least one contact action (email / LinkedIn / CV). Baseline: 0. Target: ≥ 25% within 60 days of the link entering outreach.
- **Above-the-fold sufficiency** — of sessions that make contact, the share that do so without scrolling past the fold (proxy for "judged fit from the scan alone"). Baseline: 0. Target: ≥ 60% within 60 days. _Needs the step-8 fold sentinel (see note above)._
- **Time to first contact action** — median seconds from page open to the first contact action, over contacting sessions. Baseline: TBD — measured in the first two weeks after the tracker ships. Target: ≤ 20 s. _Needs the step-8 page-open timestamp (see note above)._
- **Content-drift incidents** — occasions where the live page and the committed CV disagree on a fact (surname, title, a date). Baseline: TBD. Target: 0. In v1 this is held by a **manual page-vs-CV parity check at each release and each content edit** (surname, headline, dates); it becomes structurally enforced once the CV is generated from the Profile content (next version). This is accepted v1 debt (§1, §8).

## 8. Open questions

### v1 follow-ups (do not block the spec, but must land)

- [x] **ADR for the committed-static-CV decision.** v1 ships a hand-committed CV PDF and defers build-time `/cv` generation — this supersedes/amends **ADR-0004** (site is the single source of truth, CV generated at build). Write the ADR (Accepted), link it from ADR-0004, and record the revisit trigger (move to generation with roadmap step 4 / next version). Default now: title "CV delivery is a committed static PDF in v1"; consequences section carries the drift risk and the manual-parity mitigation. — owner: Roman + design, due: before sdd:tasks (via `/sdd:decide-adr personal-landing`). **Done 2026-09-07: `adr/0008-cv-delivery-is-a-committed-static-pdf-in-v1.md` (Accepted); ADR-0004 carries a v1-exception note + back-link.**
- [x] **`CLAUDE.md` edit.** The `## site` section states "CV PDF is generated, never committed" and describes the `postbuild` generation step as current. Reword to: v1 ships a committed static PDF under `site/public/`; generation returns with roadmap step 4. — owner: Roman, due: with the ADR above. **Done 2026-09-07: `## site` now reads "CV PDF is committed."**
- [x] **Re-sync `ux-flows.md` and `screens.md`** to the current scope: drop the US-04 / US-09 flows and the timeline/projects screens; drop the phone-chooser flow + screen (US-03 / AC-03 removed); add the About flow + screen (US-10 / AC-14); contact actions are now three. **Done 2026-09-07: `ux-flows.md` (b75fc9f), `screens.md` (0fbb877).**
- [x] **Re-sync `sad.md` and `data-model.md`** to the same scope: `sad.md` §5 building blocks + §6 + §8 crosscutting + §10/§11 + glossary; `data-model.md` (required `about.narrative` + `about.highlights`; `contact.phones` CV-route-only; dropped v2 fields). **Done 2026-09-07: `data-model.md` (0fbb877), `sad.md` §6 (9930320), `sad.md` §5/§8/§10/§11/§12 (this pass).**
- [ ] **Release parity check** (accepted v1 debt): before each launch and after each content edit, confirm the live page and the committed CV agree on surname, headline, and dates. Revisit trigger: retire this check when the CV is generated from the Profile content. — owner: Roman, due: ongoing from first launch

### Resolved

- [x] **Four Pencil-iteration divergences ratified (D-1 / D-3 / D-7 / D-10).** **Resolved 2026-09-07 (Roman, in conversation):**
  - **D-1** — the three contact actions live in a **persistent sticky header** (CSS-only), not a hero block. Still above the fold, still one tap on a laptop.
  - **D-3** — the page has **header + footer chrome** and a CSS-only in-page `#about` anchor; this does not make it a multi-route app. `sad.md` §5 gains `Header` / `Footer`.
  - **D-7** — the hero's right column is an optional **Industries list**, backed by a **new optional `industries` Profile field** (US-11 / AC-15). Absent → no column, no build failure.
  - **D-10** — the **tagline absorbs the old "positioning block"**: one optional field, a sentence or two, **~300-char cap**; the separate `positioning` field is **removed** (it was never in the live schema).
  - **Mobile** keeps the drawn hamburger: the header condenses to name + email/LinkedIn icon controls + a native-`<details>` menu holding Download CV + About (AC-08). Download CV is two taps on mobile — accepted.
  §1, §2, §4 (US-02 reworded, US-11 added), §5 (AC-01/02/06/08/13 reworded, AC-15 added), §6 (drop order) updated. `CONTEXT.md`, `data-model.md`, `sad.md`, `screens.md` re-synced.
- [x] Should the contact values (phone, email) be assembled by a small script on click so they are absent from the delivered HTML entirely, or is keeping them in the controls' link attributes (not visible text) acceptable? **Resolved 2026-09-06 by ADR-0006:** link attributes only — no visible text (AC-07, AC-10), no script, in v1. Script-assembled-on-click is the documented fallback if scraping abuse appears (SAD §11 accepted-debt revisit trigger).
- [x] Above-the-fold essentials — one canonical list for AC-01 and AC-05, and a `topStack` minimum. **Resolved 2026-09-07:** the two ACs point at one list (name, headshot + alt, headline, availability status, location, top stack 4–8, and the contact channels); `topStack` is min 4 / max 8, build-enforced. **Amended later 2026-09-07:** contact channels went from four to three (phone removed — see below).
- [x] **Phone removed from the landing page; About section added.** **Resolved 2026-09-07 (Roman):** the v1 landing page has no phone control and no line chooser — US-03 / AC-03 withdrawn, `contact.phones` renders only on the CV route; contact actions are now email / LinkedIn / CV. In its place, a short **About section** below the fold (US-10 / AC-14) — required `about.narrative` + `about.highlights` Profile fields. §1 (Context + Scope narrowing), §2, §3, §4, §5 (AC-01/03/05/07/10/14), §6.1, §7 updated. `CONTEXT.md` glossary updated. Downstream re-syncs tracked in the follow-ups above.
- [x] Is a green build inside this feature's Definition of Done given §3 excludes CV work? **Resolved 2026-09-07:** yes — v1 ships a committed static PDF so the build is green here; `cv.astro` generation is deferred (see follow-ups above).
- [x] "Positioning line" in AC-06 / US-08 vs the optional Positioning block. **Resolved 2026-09-07:** AC-06 means the **headline**. The Tagline stays optional (absent = valid, present-but-empty = invalid). _(Superseded 2026-09-07 by D-10: the separate "Positioning block" is removed — merged into the Tagline.)_
- [x] Single-line phone behaviour and the `phones` array minimum. **Resolved 2026-09-07, then superseded the same day:** originally min 1 line with a `<details>` disclosure for 2+; the phone control was then removed from the landing page entirely (see "Phone removed…" above). `contact.phones` shape is now the CV route's concern only.
- [x] Is the LinkedIn URL covered by the visible-text ban? **Resolved 2026-09-07:** yes — AC-07 matches AC-10 and §1 (email and LinkedIn URL / handle; phone is not on the page at all).

### Moved to v2 (with the sections they belong to)

- [ ] Roman's exact, non-overlapping employment date ranges — needed by the v2 experience timeline (was: before sdd:tasks). The CV template and the "Classic" variant disagree and partly overlap (EveryMatrix reads "2021–2023" on one page, "2023–2026" on another). — owner: Roman, due: v2 (before the experience-timeline feature)
- [ ] Per-project impact statements and the "placeholder" detection rule (empty / < ~40 chars / blocked-words list) — needed by the v2 selected-work section. — owner: Roman (content) / design (the rule), due: v2 (before the selected-work feature)

## Test plan

> Inline per the size matrix (feature size **S**). Maps every §5 acceptance criterion to ≥ 1
> named test. `target_surfaces: [web-frontend]` (sad.md) → the frontend tiers apply:
> **component** (a UI component exercised in isolation), **visual-regression** (rendered UI
> diffed against a baseline), **e2e-through-UI** (the flow driven through the built page).
> There is no datastore and no API, so there are no **contract** rows; "integration" here means
> a test against the **real Astro build pipeline** (`astro:content` + the Zod schema + its
> `.refine()` invariants + the `postbuild` step), not a mock. Test *tools* are not named — `implement` detects what
> the repo already uses and picks the unit/component runner, the browser-driver and the
> visual-diff tool.
> Withdrawn ACs (AC-03, AC-09, AC-11, AC-12) are listed for traceability with **no test** —
> they carry no v1 behaviour.

### Coverage table

| AC | Intent | Test name | Level(s) |
|---|---|---|---|
| AC-01 | Every above-the-fold essential renders at both reference viewports | `above-the-fold essentials render from profile content` | component |
| AC-01 | | `laptop and phone hero show every essential with no scroll` | e2e-through-UI (1280×800, 390×844) |
| AC-01 | | `hero baseline unchanged — laptop + phone` | visual-regression |
| AC-02 | Email action opens a pre-addressed message | `header email control carries a mailto addressed to Roman` | component |
| AC-02 | | `activating the header email action hands off a mailto` | e2e-through-UI |
| AC-04 | CV filename derived from name + headline; committed PDF present | `cv-filename helper derives the name-and-headline filename` | unit |
| AC-04 | | `build asserts the committed CV PDF exists at the derived path` | integration |
| AC-05 | Missing required field fails the build, naming the field | `schema rejects a profile missing a required landing field` | unit (fixtures per `data-model.md` §Test fixtures) |
| AC-05 | | `astro build fails and names the missing field` | integration |
| AC-06 | Malformed value fails the build, naming the field and why | `schema rejects a malformed field value with a named reason` | unit |
| AC-06 | | `astro build fails and names the malformed field` | integration |
| AC-07 | Need-to-know exposure — nothing over-shared in the delivered page or source | `delivered HTML contains no salary, address, phone, or recruiter-link label` | integration (assertion over `dist/` build output) |
| AC-07 | | `email and LinkedIn never appear as visible text in the rendered page` | component + integration (over `dist/`) |
| AC-08 | Phone viewport — fit, legibility, tap targets, native `<details>` menu, zero JS | `phone hero: essentials visible, no horizontal scroll, tap targets ≥ 44×44` | e2e-through-UI (390×844) |
| AC-08 | | `header menu is a native <details> and works with JavaScript disabled` | e2e-through-UI (JS off) |
| AC-08 | | `condensed header baseline — phone` | visual-regression |
| AC-10 | Contact values actionable-only on the landing page | `contact controls hold email/URL in link attributes, not in text content` | component |
| AC-10 | | `rendered page exposes no contact value as visible text` | integration (over `dist/`) |
| AC-13 | LinkedIn opens a new tab; Download CV saves as a file | `LinkedIn control opens a new tab; CV control is a download, not inline` | component |
| AC-13 | | `activating LinkedIn opens a new tab with the page still open; Download CV saves the named PDF` | e2e-through-UI |
| AC-14 | About section renders from content; phone reflows to one column | `About renders narrative + highlights straight from profile content` | component |
| AC-14 | | `About visible one scroll below the fold; single column ≥ 16px on phone` | e2e-through-UI (1280×800, 390×844) |
| AC-14 | | `About section baseline — laptop + phone` | visual-regression |
| AC-15 | Optional industries list — present renders from content, absent still builds | `hero renders the industries column from content when present, omits it when absent` | component |
| AC-15 | | `build succeeds with industries omitted` | integration |
| AC-03 | — | WITHDRAWN (phone removed from v1) — no test | — |
| AC-09 | — | WITHDRAWN (experience timeline → v2) — no test | — |
| AC-11 | — | WITHDRAWN (selected work → v2) — no test | — |
| AC-12 | — | WITHDRAWN (placeholder-impact rule → v2) — no test | — |

### Edge cases & error paths (each its own row)

| # | AC | Case | Expected outcome | Level |
|---|---|---|---|---|
| E1 | AC-05 | `contact.email` absent | build fails naming `contact.email` | unit + integration |
| E2 | AC-05 | no `linkedin.com` entry in `contact.links` | build fails naming the missing LinkedIn link | unit + integration |
| E3 | AC-05 | committed CV PDF missing at the derived path | postbuild "file exists" assertion fails the build | integration |
| E4 | AC-05 | `about` object omitted entirely | build fails naming `about` | unit + integration |
| E5 | AC-05 | `about.highlights` is an empty list | build fails naming `about.highlights` | unit + integration |
| E6 | AC-05 | `topStack` has fewer than 4 entries | build fails naming `topStack` | unit + integration |
| E7 | AC-06 | `contact.email` has no `@` | build fails naming `contact.email` and why | unit + integration |
| E8 | AC-06 | `headline` is an empty string | build fails naming `headline` | unit + integration |
| E9 | AC-06 | a link `url` does not parse | build fails naming that link | unit + integration |
| E10 | AC-06 | `topStack` has more than 8 entries | build fails naming `topStack` | unit + integration |
| E11 | AC-06 | `tagline` present but empty | build fails naming `tagline` | unit + integration |
| E12 | AC-06 | an `industries` entry has an empty `domain` | build fails naming the `industries` domain field | unit + integration |
| E13 | AC-06 | `industries` has more than 6 entries | build fails naming `industries` | unit + integration |
| E14 | AC-07 | over-exposure token (salary / rate / home address / recruiter-link label) present anywhere in `dist/` | assertion over the built output finds none | integration |
| E15 | AC-02 / AC-10 | device has no `mailto:` handler | the action is inert and there is **no** visible or copyable contact value as a fallback (accepted, ADR-0006) | e2e-through-UI (assert no reveal/copy affordance) |
| E16 | AC-08 | viewport at 360 px width | no horizontal scroll (only binding guarantee); optional elements drop in order Industries → Tagline → top-stack truncates | e2e-through-UI (360 px) |
| E17 | AC-08 / QG-3 | no-horizontal-scroll at 360 / 768 / 1280 / 1920 px | no horizontal scroll at any of the four widths | e2e-through-UI (parametrized) |

### Integration strategy — real pipeline, ephemeral fixtures

- **No datastore, no container.** The "real dependency" under integration test is the **Astro
  build pipeline** itself: `astro:content` loading a fixture `profile` document against the
  Zod schema + `.refine()` invariants (`site/src/content/config.ts`), plus the `postbuild`
  CV-file assertion.
- **Seed:** the fixture factories already enumerated in `data-model.md` §Test fixtures —
  `validProfile()` (the green baseline) and the invalid/edge variants
  (`missingChannelProfile`, `missingAboutProfile`, `emptyAboutProfile`, `malformedProfile`,
  `undersizeTopStackProfile`, `oversizeTopStackProfile`, `oversizeTaglineProfile`,
  `industriesOmittedProfile`, `oversizeIndustriesProfile`, `missingCvPdfProfile`). PII guard:
  invalid/edge fixtures use `example.test`, never Roman's real details.
- **Cleanup:** per-test. Each test writes its fixture profile into a throwaway content
  location (temp dir or an overridden content path), runs the schema parse or a scoped
  `astro build`, asserts, and removes the fixture. No shared state between tests; no fixture
  is left in `site/src/data/profile/`.
- **e2e-through-UI + visual-regression** run against the built static output of `validProfile()`
  (a real `astro build` into a temp `dist/`), served statically and driven at the two
  reference viewports. Baselines are committed; a diff fails the test.

### NFR verification (§6 / sad.md §10)

| NFR | Check | Level |
|---|---|---|
| Client JavaScript shipped by this feature ≤ 1 KB — no JS bundle / framework island, only one inline PE `<script>` (scroll-spy, ADR-0009) | assert the built `dist/` ships no `.m?js` bundle and no `astro-island`, and exactly one inline `type="module"` script < 1 KB | integration (build-output inspection) |
| Every interactive element keyboard-reachable and operable, one `<h1>`, semantic landmarks | keyboard-tab pass through the header + About; structure assertions | e2e-through-UI + component |
| LCP ≤ 2.5 s · initial page weight ≤ 500 KB · Lighthouse Accessibility ≥ 95 | Lighthouse "mobile" audit | **manual pre-launch** (§6 "run manually pre-launch"; not CI in v1 — sad.md §11 accepted debt). A miss blocks launch unless Roman waives it in the release checklist with a written reason. |
| Above-the-fold fit at 1280×800 and 390×844 | every essential visible with no scrolling | e2e-through-UI (automated) **+** manual pre-launch confirmation |
| Content completeness — 100 % of missing/malformed required fields fail the build | covered by AC-05 / AC-06 rows above | unit + integration |

### Load

<!-- N/A: no numeric NFR — none carries a throughput or concurrency target. The §6 numbers
     (LCP ≤ 2.5 s, ≤ 500 KB, 0 KB JS, a11y ≥ 95) are single-client budgets for a static page
     on a CDN, verified by Lighthouse + build-output inspection — not load scenarios. -->

### CI placement

- **Every PR (fast):** unit (schema + `cv-filename` helper), component, and the build-output
  inspection integration tests (`astro build` against fixtures + the zero-JS + `dist/`
  exposure assertions).
- **Every PR (heavier, still gating):** e2e-through-UI and visual-regression against the
  `validProfile()` build. If these grow slow, move visual-regression to a pre-merge job.
- **Pre-launch, manual (not CI in v1):** the Lighthouse mobile audit (LCP, weight, a11y),
  the manual keyboard pass, the manual responsive check at 360 / 768 / 1280 / 1920 px, and
  the page-vs-committed-CV parity check (§7, §8). Wiring Lighthouse CI and an `astro check`
  step onto the `deploy.yml` push path is a `tasks` follow-up (sad.md §7, §11).
