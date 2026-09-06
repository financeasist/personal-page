---
status: Draft
owner: "Roman (roman.grupskyi@gmail.com)"
reviewers: ["Roman"]
updated_at: "2026-09-06"
feature_size: "M"
---

# Spec — personal-landing

> **Glossary:** [CONTEXT](../../../CONTEXT.md) (repo-root; no feature-scoped CONTEXT.md)
> **Reference material / channels used:** `docs/idea-brief.md` §2–§8 · `docs/roadmap.md` step 3 + open decisions D5/D7 · `docs/architecture-map.md` (Stack, Frontend/UI foundation, Constraints) · `docs/reference/cv-template-reference.pdf`, `docs/reference/cv-classic-variant.pdf`, `docs/reference/linkedin-about.md`, `docs/reference/me.png` (headshot) · interview 2026-09-06.

## 1. Context

Roman is in an active job search from Krakow, targeting senior / lead Java and backend roles across the EU and remote. Today his story is split between two divergent CV PDFs and a LinkedIn profile that disagree on his surname spelling, employment dates, and years of experience, and a **Recruiter** screening him spends only seconds before moving on. He needs one link — for his CV, his LinkedIn, and his outreach email — that lets a Recruiter judge his fit in roughly twenty seconds and reach him in a single tap.

The trigger is immediate: Roman is interviewing this month and wants the link live within the week. The monorepo scaffold, the static site, and the typed **Profile content** collection shipped in `b1583df` (roadmap step 1), so the landing page is the next thing standing between him and a shareable link. This feature is roadmap step 3, and its technical shape is already fixed upstream by `docs/architecture-map.md` and ADR-0001 (a static site rendered from a typed content collection, zero client JavaScript by default) — that stack is a constraint here, not a decision this spec makes.

The roadmap sized step 3 as **L**; it is re-classified **M** here (`.size` / `.route` updated to `M` / `standard`). Rationale: no API, no migration, no backend, no breaking change, and the scaffold has already established the component and styling conventions the "L" estimate assumed this feature would set. It stays above S because it is the site's foundational UI feature — nine user stories, four new shared components — so the `ux-flows` and `screens` stages are worth offering rather than auto-skipping.

The committed approach is one static landing page rendered at build time entirely from the single typed **Profile content** entry. The **above-the-fold scan** carries Roman's headshot, his name, his **headline** (the pipe-separated positioning line — currently "Senior Java Engineer | Lead Backend Engineer" — which is also the source for the CV filename) with an optional one-line **tagline** below it and an optional short **positioning block** (a two- to three-sentence paragraph, length-capped so the above-the-fold fit still holds), the **Availability block** (availability status, location, notice period, work authorisation), his **top stack** (a curated list of at most eight technologies chosen in the Profile content), and four **Contact actions** — phone, email, LinkedIn, and Download CV, all four mandatory. Each contact action is a plain link that opens its channel directly and works with no JavaScript; a later inline script (roadmap step 8) adds fire-and-forget click beacons that never block the action — this confirms roadmap decision D8 (plain link + inline-script beacon, not a redirect through the tracker). **On the landing page, Roman's phone numbers, email address, and LinkedIn URL are never rendered as visible text** — a Recruiter reaches him by activating a labelled control, not by reading and copying a string. The values live only in the controls' link attributes so the controls can function; whether that is tight enough or the values should be assembled by script on click is §8. This rule is scoped to the landing page only: the **generated CV PDF** (roadmap step 4, the `cv.astro` print route, rendered from the same Profile content) **does show the contact details as visible text** — that is the point of a CV, and the Recruiter obtains it by a deliberate download. Same source, two renderers, two exposure rules; no schema split. Depth — an experience timeline and a selected-work section — sits below the fold. This feature ships zero client JavaScript; the click-tracking beacon is roadmap step 8. Hand-rolled section, contact-button, availability-block, and project-card components become the site's first shared primitives.

Content is derived from `docs/reference/` (the CV template, the "Classic" variant, the LinkedIn "About", and the `me.png` headshot), reconciled into the Profile content entry. The canonical reconciliation (roadmap step 2) is **confirmed by Roman on 2026-09-06**: surname → **Hrupskyi** (email stays `roman.grupskyi@gmail.com`); experience → **"9+ years"**; headline → **"Senior Java Engineer | Lead Backend Engineer"** (the CV template text is updated to match); the 2004–2017 sales / project-management period is shown as **a single "earlier background" line** — a distinct optional Profile field rendered once after the experience timeline, not a timeline entry (exempt from AC-09). Only the exact non-overlapping employment date ranges remain open (§8).

**Scope narrowing vs roadmap step 3:** the roadmap lists "recommendations" below the fold; this spec defers the recommendation / testimonial block to v2 (no quote material exists yet). Roadmap step 3's scope is amended to match. No other roadmap step-3 item is dropped.

**Sequencing:** roadmap step 4 (the CV print route and its build-generated, meaningfully-named PDF) is sequenced to land together with this feature. The Download-CV control and its tracked click hook are built here; the file they point at is step 4's generated output — there is no interim committed PDF. AC-04 is satisfied by step 4's generated file. Step 4 owns the filename derivation (from the Profile content name + headline); the landing page's Download-CV control resolves the same name through a shared helper, never a hand-copied string. A missing generated PDF fails the build (postbuild assertion) rather than shipping a dead download. Note for step 4: the CV PDF **must** render Roman's contact details as visible text (contact block of the locked template) — the "actionable-only" rule is a landing-page rule, not a Profile-content rule.

## 2. Goals

- A Recruiter can state Roman's seniority, stack, location, and availability from the above-the-fold scan alone, without scrolling.
- A Recruiter can reach Roman through any primary channel — phone, email, LinkedIn, or CV — from the top of the page (one tap; the phone action adds one tap to pick a line), on a phone or a laptop.
- The page presents one reconciled professional history that never contradicts the generated CV.

## 3. Non-goals

- **No contact form or in-page messaging** — a tap-to-open channel (dialer, mail client, LinkedIn) is faster for a Recruiter and needs no backend.
- **No salary or rate on the page** — a number invites premature filtering; Roman handles compensation in conversation (roadmap D5).
- **No blog, articles, or personal-life content** — not what the twenty-second scan needs; deferred to v2. Section composition stays open so it is additive later, but nothing is built now.
- **No recommendation / testimonial block in v1** — no quote material exists yet; deferred to v2. This narrows roadmap step 3, which listed "recommendations" below the fold (see §1).
- **No tracker wiring** — the click-beacon script and event ingest are roadmap steps 6 and 8; this feature only renders the actions and leaves stable hooks for them.
- **No CV PDF layout work** — the CV print route and its generated file are roadmap step 4, locked to the reference template; this feature only links to the download.

## 4. User stories

### US-01: Scan Roman's fit in seconds

**As a** Recruiter
**I want** the essentials — headshot, name, headline, top stack, location, availability — visible without scrolling
**So that** I can decide in about twenty seconds whether to pursue him.

### US-02: Reach Roman in one tap

**As a** Recruiter
**I want** phone, email, LinkedIn, and CV download as immediate actions at the top of the page
**So that** I can contact him through my preferred channel without hunting.

### US-03: Choose which number to call

**As a** Recruiter
**I want** to pick between Roman's two phone lines when I choose to call, by label rather than by reading digits
**So that** I ring the one that suits me — the local Polish line or the international one.

### US-04: Verify the headline claims

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
**So that** I never publish a page with a blank positioning line or a missing contact channel.

### US-09: Gauge the scale and outcome of his work

**As a** Recruiter
**I want** three to five flagship projects called out with what changed because of Roman's work — the impact, in numbers where there are numbers
**So that** I can judge the scale and results of what he has built, not just where he has worked.

## 5. Acceptance criteria

### AC-01 (US-01) — happy path

**Given** a Recruiter opens the landing page at the reference laptop viewport (1280×800, see §6)
**When** the page finishes loading
**Then** without scrolling, the Recruiter sees Roman's headshot, his name, his headline, his current availability with location and remote-work stance, and his top stack (at most eight technologies).

### AC-02 (US-02) — happy path

**Given** a Recruiter is viewing the top of the landing page
**When** the Recruiter activates the email action
**Then** their mail client opens a new message already addressed to Roman, with no further steps.

### AC-03 (US-03) — happy path

**Given** a Recruiter activates the phone action and Roman has more than one published phone line
**When** the action expands (a native disclosure control that needs no JavaScript)
**Then** the Recruiter sees one labelled call control per line (for example "Call — Poland" / "Call — international"), with no phone digits shown as text, and activating one starts a call to that line.

### AC-04 (US-05) — cross-context

**Given** the Profile content specifies Roman's name and headline
**When** the site is built
**Then** the downloadable CV is named from that same name and headline — not a generic "cv" name — and the landing page and the CV reflect an identical name and headline, because both are rendered from the one Profile content entry.

### AC-05 (US-08) — domain invariant

**Given** the Profile content is missing an above-the-fold essential — the headline, the availability status, or any of the four contact channels (phone, email, LinkedIn, CV — all required)
**When** Roman or CI builds the site
**Then** the build fails with a message naming the missing field, and the incomplete page is never published (the invariant "the above-the-fold scan is always complete" holds).

### AC-06 (US-07) — error

**Given** Roman edits the Profile content and enters a value that does not match the required shape — an email address with no "@", an empty positioning line, a malformed link
**When** Roman builds or commits
**Then** the build stops and reports which field is invalid and why, and nothing is published until it is corrected.

### AC-07 (US-01 / US-04) — authorization (need-to-know exposure)

**Given** the page is public and served to an anonymous Recruiter
**When** anyone views the page or its delivered source
**Then** no salary or rate expectation, no exact home address, and none of the tracker's per-recruiter link labels appear anywhere in it, and Roman's phone numbers and email address are never rendered as visible text on the landing page — the page exposes only what a Recruiter needs to assess fit and lets them make contact through the labelled controls. (The generated CV PDF deliberately shows the contact details — that boundary is out of this criterion's scope.)

### AC-08 (US-06) — happy path

**Given** a Recruiter opens the page on a phone-sized screen
**When** the page loads
**Then** all text is legible with no horizontal scrolling, every contact action is a full tap target, and the same above-the-fold essentials are present as on desktop.

### AC-09 (US-04) — happy path

**Given** a Recruiter scrolls below the fold
**When** the experience section renders
**Then** each role shows the company, the date range, and Roman's contribution, ordered most-recent first, with date ranges that match the reconciled history and never overlap or contradict each other; a current role may read "<start>–present", and the pre-2017 "earlier background" summary is a single line, not a timeline entry, and is exempt from this criterion.

### AC-10 (US-02 / US-03) — domain invariant

**Given** the rendered landing page — not the CV download
**When** a Recruiter views the contact area
**Then** no phone number, email address, or profile URL appears as visible text — each is reachable only by activating its labelled control (the invariant "contact details are actionable-only on the landing page" holds; the CV PDF is the deliberate exception). Whether the values are also kept out of the HTML source entirely is the stricter option tracked in §8.

### AC-11 (US-09) — happy path

**Given** the Profile content lists three to five selected projects, each with a name, Roman's role, and an impact statement
**When** a Recruiter reads the selected-work section below the fold
**Then** each project shows what changed because of Roman's work, stated as a concrete outcome and quantified wherever the Profile content provides a number (for example a latency, throughput, team-size, or delivery-time figure).

### AC-12 (US-09) — domain invariant

**Given** a selected project entry in the Profile content has an empty or placeholder impact statement
**When** Roman or CI builds the site
**Then** the build fails and names that project, so no selected project is ever published without a stated outcome (what counts as a "placeholder" — minimum length, a blocked-words list — is §8).

### AC-13 (US-02) — happy path

**Given** a Recruiter is viewing the contact actions at the top of the page
**When** the Recruiter activates the LinkedIn action or the Download-CV action
**Then** LinkedIn opens Roman's profile in a new browser tab with the landing page left open, and Download CV saves the named PDF to the Recruiter's device as a file download rather than opening it inline.

## 6. Non-functional requirements

| Aspect | Target | Measurement |
|---|---|---|
| Above-the-fold render (Largest Contentful Paint), Lighthouse "mobile" preset (mid-tier device, throttled 4G) | ≤ 2.5 s | Lighthouse mobile audit, run manually pre-launch |
| Initial page weight (HTML + CSS + fonts + images; excludes the later analytics beacon) | ≤ 500 KB transferred | Lighthouse / build size report |
| Client JavaScript shipped by this feature | 0 KB | build output inspection |
| Accessibility | Lighthouse Accessibility ≥ 95; every interactive element keyboard-reachable and operable | Lighthouse mobile audit + manual keyboard pass |
| Above-the-fold fit | every above-the-fold essential visible with no scrolling at 1280×800 (reference laptop) and 390×844 (reference phone) | manual check at both viewports pre-launch |
| Readability & hit area | body text ≥ 16 px; every interactive target ≥ 44×44 px (WCAG 2.5.8) | manual audit + Lighthouse |
| Supported viewports | no horizontal scroll at 360, 768, 1280, and 1920 px width | manual responsive check pre-launch |
| Content completeness enforced at build | 100% of missing / malformed required fields fail the build | `astro check` + content-collection schema validation in CI |

## 6.1 Security / privacy

- **Data classification:** public. Everything rendered is content Roman chooses to publish to recruiters; the CV is already public on static hosting.
- **Personal data touched:** Roman's own contact details (two phone numbers, email, LinkedIn URL) and headshot (`docs/reference/me.png`) — all self-published. On the landing page the contact details are actionable-only (never visible text); in the generated CV PDF they are shown by design. No third-party personal data. This feature collects **no** visitor data (tracking is roadmap steps 6–8).
- **AuthZ/AuthN impact:** none — the page is public and static, no authentication, no per-user state, no session.
- **Abuse cases:**
  - **Scraping Roman's phone / email for spam** — mitigated on the landing page: contact details are never rendered as visible text there, only as labelled controls (AC-07, AC-10); the values sit in the controls' link attributes so the controls work, and tightening that further (script-assembled on click) is an §8 question. The **generated CV PDF** does carry the contact details in plain text by design — a CV without them is useless — so the residual exposure is the download, which the Recruiter initiates deliberately. Accepted.
  - **Content injection through Profile fields** — prevented: Profile content is authored only by Roman via git and validated by the schema at build; no visitor-supplied content is ever rendered.
  - **Over-exposure (salary / address leaking into the page or its source)** — prevented by keeping those fields out of the Profile schema entirely (AC-07).
  - **Re-hosting or framing the page elsewhere** — accepted: it is public marketing material; no framing protection in v1.
- **Security review:** N/A — no new authorization boundary, no new personal-data store, no backend; static public content only.

## 7. Metrics / KPIs

> The contact-behaviour KPIs are measured once the tracker beacon (roadmap step 8) ships; this feature provides the tracked action hooks that make them measurable. Baselines are 0 because no page exists today.

- **Contact-action rate** — of Recruiter sessions that open the page, the share that activate at least one contact action (phone / email / LinkedIn / CV). Baseline: 0. Target: ≥ 25% within 60 days of the link entering outreach.
- **Above-the-fold sufficiency** — of sessions that make contact, the share that do so without scrolling past the fold (proxy for "judged fit from the scan alone"). Baseline: 0. Target: ≥ 60% within 60 days.
- **Time to first contact action** — median seconds from page open to the first contact action, over contacting sessions. Baseline: TBD — measured in the first two weeks after the tracker ships. Target: ≤ 20 s.
- **Content-drift incidents** — occasions where the live page and the generated CV disagree on a fact (surname, title, a date). Baseline: TBD — reviewed at each launch and content edit. Target: 0, structurally enforced by the single Profile content source.

## 8. Open questions

- [ ] What are Roman's exact, non-overlapping employment date ranges? The CV template and the "Classic" variant disagree and partly overlap (EveryMatrix reads "2021–2023" on one page and "2023–2026" on another), and AC-09 requires ranges that are consistent across the page and the CV and never overlap. Default now: take the CV-template page-2/3 ranges as the base and resolve the EveryMatrix overlap into one continuous range. — owner: Roman, due: before sdd:tasks
- [ ] What is the impact statement for each selected project, and how does the build detect a "placeholder" one (AC-12)? The reference material describes responsibilities, not measured impact. Default now: Roman supplies one impact statement per selected project — with a number where a real one exists, otherwise a concrete qualitative outcome; the build rejects an impact statement that is empty, shorter than ~40 characters, or matches a small blocked-words list (TODO / TBD / lorem / …). — owner: Roman (content) / design (the detection rule), due: before sdd:implement
- [x] Should the contact values (phone, email) be assembled by a small script on click so they are absent from the delivered HTML entirely, or is keeping them in the controls' link attributes (not visible text) acceptable? **Resolved 2026-09-06 by ADR-0006:** link attributes only — no visible text (AC-07, AC-10), no script, in v1. Script-assembled-on-click is the documented fallback if scraping abuse appears (SAD §11 accepted-debt revisit trigger).
