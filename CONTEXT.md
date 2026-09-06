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
- **Availability block** — the compact panel of hiring-relevant status: availability, location, remote / relocation stance, notice period, work authorisation. NOT a calendar or a booking widget.
- **Contact action** — one above-the-fold tap target (phone, email, LinkedIn, Download CV) that opens the corresponding channel and fires a tracked click event. On the landing page the underlying phone number / email / URL is never shown as text — the action is the only way to reach it (the CV PDF is exempt). NOT a contact form and NOT a message-sending feature.
- **Above-the-fold scan** — everything a Recruiter can see and act on without scrolling, designed for a ~10-second fit judgement. NOT the whole page — depth (experience, projects) sits below it.
- **Labelled link** — a per-recruiter URL (`/t/{label}`) Roman sends in outreach; the tracker 302-redirects it to the site and records who opened it. NOT a public share link and NOT a tracking cookie.

## Invariants

- The landing page and the CV PDF always render from the same **Profile content** entry — they can never present contradictory facts.
- The landing page never exposes data outside the Recruiter's need-to-know: salary / rate expectations and exact home address are never shown, and phone / email / LinkedIn are reachable only through a **Contact action**, never as visible text. This is a **landing-page** rule only — the generated CV PDF renders the contact details as visible text by design (a CV without them is useless). Same **Profile content**, two renderers, two exposure rules.
- Components carry no hard-coded English in non-content-driven markup — copy comes from **Profile content** or is structural only (keeps multi-language additive).

## Out of scope

- Browser-based content admin — v1 content is file + git only (idea-brief §5).
- Identifying anonymous visitors by name / company — "who" comes only from a **Labelled link** (idea-brief §5).
- Blog / articles / personal-life content — deferred to v2 (roadmap step 9 territory).
