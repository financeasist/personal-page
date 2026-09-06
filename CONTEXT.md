---
status: Living
updated_at: "2026-09-06"
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
- **Availability block** — the compact panel of hiring-relevant status: availability status (carries the remote-work stance), location, and optional work authorisation. NOT a calendar or a booking widget.
- **Contact action** — one above-the-fold tap target (phone, email, LinkedIn, Download CV) that opens the corresponding channel and fires a tracked click event. On the landing page the underlying phone number / email / URL is never shown as text — the action is the only way to reach it (the CV PDF is exempt). NOT a contact form and NOT a message-sending feature.
- **Above-the-fold scan** — everything a Recruiter can see and act on without scrolling, designed for a ~20-second fit judgement. NOT the whole page — depth (experience, projects) sits below it. The reference viewports for "fits above the fold" are 1280×800 (laptop) and 390×844 (phone).
- **Labelled link** — a per-recruiter URL (`/t/{label}`) Roman sends in outreach; the tracker 302-redirects it to the site and records who opened it. NOT a public share link and NOT a tracking cookie.
- **Visit** — one recorded instance of the landing page being opened, captured as a visit event in the tracker: either a **Labelled visit** (the page-view carries a **Labelled link**'s label, so it names the Recruiter) or an **Anonymous visit** (no label — carries only city / referrer). NOT deduplicated — opening the same link twice is two Visits. A request from a known link-preview crawler (e.g. LinkedIn, WhatsApp, or Slack unfurling a shared link) is never a Visit — it is filtered out before it becomes one.
- **View notification** — the real-time Telegram message Roman receives for every **Visit**, one message per Visit, never batched or collapsed. Names the Recruiter for a Labelled visit; shows city / referrer only for an Anonymous visit. NOT a daily digest or summary.
- **Headline** — the short pipe-separated positioning line under Roman's name (currently "Senior Java Engineer | Lead Backend Engineer"); a required Profile field, also the source string for the CV PDF filename. NOT the page `<title>` and NOT a full sentence.
- **Tagline** — an optional single sentence shown below the **Headline** in the hero. NOT required, NOT the Headline, NOT a summary paragraph.
- **Positioning block** — an optional short paragraph (two to three sentences, length-capped ~280 chars) shown in the hero, giving a fuller sense of Roman's focus than the **Tagline**. Landing-page only. NOT the **Headline**, NOT the **Tagline**, NOT the CV `summary` array (a separate field rendered only on the CV route).
- **Top stack** — a curated list of at most eight technologies shown in the above-the-fold scan, chosen by Roman in the Profile content. NOT the full skills matrix (that lives below the fold and in the CV).
- **Experience timeline** — the below-the-fold list of Roman's roles from 2017 on, most-recent first, each with company, date range, and contribution. NOT the pre-2017 **earlier background** line, which is a single summary sentence, not a timeline entry.
- **Selected project** — one of three-to-five flagship pieces of work called out below the fold with an **impact statement**. NOT the same as an **Experience timeline** role (a project is curated and impact-led; a role is chronological).
- **Impact statement** — the one- or two-line "what changed because of Roman's work" attached to a **Selected project**, quantified where a real number exists. NOT a responsibilities list and NOT a job description.

## Invariants

- The landing page and the CV PDF always render from the same **Profile content** entry — they can never present contradictory facts.
- The landing page never exposes data outside the Recruiter's need-to-know: salary / rate expectations and exact home address are never shown, and phone / email / LinkedIn are reachable only through a **Contact action**, never as visible text. This is a **landing-page** rule only — the generated CV PDF renders the contact details as visible text by design (a CV without them is useless). Same **Profile content**, two renderers, two exposure rules.
- Components carry no hard-coded English in non-content-driven markup — copy comes from **Profile content** or is structural only (keeps multi-language additive).

## Out of scope

- Browser-based content admin — v1 content is file + git only (idea-brief §5).
- Identifying anonymous visitors by name / company — "who" comes only from a **Labelled link** (idea-brief §5).
- Blog / articles / personal-life content — deferred to v2 (roadmap step 9 territory).
