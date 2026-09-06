---
status: Living
updated_at: "2026-09-07"
---

# Domain Context — personal-landing

<!--
Project-wide domain glossary. Feature-scoped terms live in docs/features/<slug>/CONTEXT.md
and win on conflict. NO implementation detail here — only domain words and their boundaries.
-->

## Glossary

- **Recruiter** — a technical recruiter or hiring manager evaluating Roman for a senior / lead Java or backend role; the landing page's primary, anonymous audience. NOT an authenticated user (the page is public, no login) and NOT a recruitment agency as an organisation.
- **Roman** — the site owner: authors profile content via git and reads the visit analytics. The page's secondary actor (editor / analytics reader), never a page visitor in the KPI sense.
- **Profile content** — the single typed content-collection entry (`site/src/data/profile/*.json`, Zod schema in `site/src/content/config.ts`) that BOTH the landing page and the CV route render from. NOT page-specific copy embedded in components, and NOT a hand-edited PDF.
- **Availability block** — the compact panel of hiring-relevant status: availability status (carries the remote-work / relocation stance), location, notice period, and optional work authorisation. NOT a calendar or a booking widget. (Field list per ADR-0005.)
- **Contact action** — one above-the-fold tap target (email, LinkedIn, Download CV) that opens the corresponding channel and fires a tracked click event. On the landing page the underlying email / URL is never shown as text — the action is the only way to reach it (the CV PDF is exempt). _The **phone** was removed from the landing page in v1 (2026-09-07): `contact.phones` stays a Profile field but renders only on the CV route, so there are three Contact actions on the landing page, not four._ NOT a contact form and NOT a message-sending feature.
- **About section** — the one below-the-fold block on the v1 landing page (added 2026-09-07): a short prose **narrative** (reconciled from `docs/reference/linkedin-about.md`) and a **highlights** bullet list (Roman's own text). Both are required **Profile content** fields (`about.narrative`, `about.highlights`). NOT a blog, NOT personal-life content, NOT the CV `summary` array. It is the only v1 content below the fold — the **Experience timeline** and **Selected project**s stay v2.
- **Above-the-fold scan** — everything a Recruiter can see and act on without scrolling, designed for a ~20-second fit judgement. NOT the whole page — depth (experience, projects) sits below it. The reference viewports for "fits above the fold" are 1280×800 (laptop) and 390×844 (phone).
- **Labelled link** — a per-recruiter URL (`/t/{label}`) Roman sends in outreach; the tracker 302-redirects it to the site and records who opened it. NOT a public share link and NOT a tracking cookie.
- **Visit** — one recorded instance of the landing page being opened, captured as a visit event in the tracker: either a **Labelled visit** (the page-view carries a **Labelled link**'s label, so it names the Recruiter) or an **Anonymous visit** (no label — carries only city / referrer). NOT deduplicated — opening the same link twice is two Visits. A request from a known link-preview crawler (e.g. LinkedIn, WhatsApp, or Slack unfurling a shared link) is never a Visit — it is filtered out before it becomes one.
- **View notification** — the real-time Telegram message Roman receives for every **Visit**, one message per Visit, never batched or collapsed. Names the Recruiter for a Labelled visit; shows city / referrer only for an Anonymous visit. NOT a daily digest or summary.
- **Headline** — the short pipe-separated positioning line under Roman's name (currently "Senior Java Engineer | Lead Backend Engineer"); a required Profile field, also the source string for the CV PDF filename. NOT the page `<title>` and NOT a full sentence.
- **Tagline** — an optional single sentence shown below the **Headline** in the hero. NOT required, NOT the Headline, NOT a summary paragraph.
- **Positioning block** — an optional short paragraph (two to three sentences, length-capped ~280 chars) shown in the hero, giving a fuller sense of Roman's focus than the **Tagline**. Landing-page only. NOT the **Headline**, NOT the **Tagline**, NOT the CV `summary` array (a separate field rendered only on the CV route).
- **Top stack** — a curated list of four to eight technologies shown in the above-the-fold scan, chosen by Roman in the Profile content. Build-enforced: min 4, max 8. NOT the full skills matrix (deferred to v2; it also lives in the CV).
- **Experience timeline** — _v2 (cut from the v1 landing page 2026-09-07)._ The below-the-fold list of Roman's roles from 2017 on, most-recent first, each with company, date range, and contribution. NOT the pre-2017 **earlier background** line, which is a single summary sentence, not a timeline entry.
- **Selected project** — _v2 (cut from the v1 landing page 2026-09-07)._ One of three-to-five flagship pieces of work called out below the fold with an **impact statement**. NOT the same as an **Experience timeline** role (a project is curated and impact-led; a role is chronological).
- **Impact statement** — _v2 (with **Selected project**)._ The one- or two-line "what changed because of Roman's work" attached to a **Selected project**, quantified where a real number exists. NOT a responsibilities list and NOT a job description.

## Invariants

- The landing page and the CV must present one reconciled professional history — same surname, headline, and dates. This is **structurally guaranteed** once the CV is generated from the **Profile content** entry (the target — roadmap step 4 / v2). In **v1** the CV is a committed static PDF, so the guarantee is held by a **manual page-vs-CV parity check at each release and content edit** (accepted debt; see spec §1, §7, §8).
- The landing page never exposes data outside the Recruiter's need-to-know: salary / rate expectations, exact home address, and phone numbers are never shown or embedded, and email / LinkedIn are reachable only through a **Contact action**, never as visible text. This is a **landing-page** rule only — the generated CV PDF renders all the contact details (phone included) as visible text by design (a CV without them is useless). Same **Profile content**, two renderers, two exposure rules.
- Components carry no hard-coded English in non-content-driven markup — copy comes from **Profile content** or is structural only (keeps multi-language additive). **"Structural only"** = fixed UI chrome that never names Roman's data: section headings, control captions ("Download CV"), aria labels, visually-hidden helper text. Anything that names or describes Roman's specifics — including the per-phone-line labels ("Call — Poland") — is **Profile content**, not a component string, and not derived from the data (e.g. not inferred from a country code).

## Out of scope

- Browser-based content admin — v1 content is file + git only (idea-brief §5).
- Identifying anonymous visitors by name / company — "who" comes only from a **Labelled link** (idea-brief §5).
- Blog / articles / personal-life content — deferred to v2 (roadmap step 9 territory).
- Below-the-fold depth on the v1 landing page **beyond the About section** — the **Experience timeline**, **Selected project**s, the pre-2017 earlier-background line, the full skills matrix, and recommendations are all v2 (cut 2026-09-07; spec §1 / §3). v1 below the fold is the **About section** and nothing else.
- CV generation on the v1 landing page — v1 links to a committed static PDF; `cv.astro` build-time generation is v2 (spec §8 follow-up; amends ADR-0004).
