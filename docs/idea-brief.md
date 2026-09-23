---
status: Draft
owner: "Roman (roman.grupskyi@gmail.com)"
updated_at: "2026-09-09"
depth: "medium"
# §8 open questions extended by survey 2026-09-06 (CV-download scope, download-button wiring, PDF filename); one hosting question resolved.
# 2026-09-09: interview grilled the "gated CV download" idea (roadmap step 10) to a resolved mechanism, including a native no-JS form delivery — §6 risks + §8 open questions updated; scraping-reliability + the tracker's new HTML-response shape carried forward to design.
---

# Idea brief — personal-landing

## 1. Raw idea

> its a landin page of me. it should contain a short very well structured information about me and my professional skils. target auditory is recruiters. you can use my CV and linkedin profile. once they land on it they should be able to contact me via phone, mail or linkedIn profile. For me this page should be opened for changes. Also I would like to track who and when visited this landing

## 2. Problem

Roman is in an active job search (based in Krakow, open to remote and hybrid) and needs one link to put in his CV, LinkedIn, and outreach that lets a recruiter judge his fit in roughly ten seconds and contact him in one tap. Today that story is split between a PDF CV (in two competing versions) and a LinkedIn profile that drift apart and carry inconsistencies: the surname is spelled three different ways across the same documents, employment dates conflict and overlap, years of experience reads as "8" in one place and "9+" in another, and the 2004→2017 period is explained only in a LinkedIn "About" line about a prior sales and project-management background. He also has no signal about whether a recruiter he contacted actually looked.

## 3. Users

- **Primary — technical recruiters and hiring managers** screening senior / lead Java and backend roles, mostly EU / Poland plus remote. They spend seconds per candidate and filter hard on availability, location, seniority, and stack.
- **Secondary — Roman himself**, as the page's editor and as the reader of the visit analytics.

## 4. Why now

Roman is actively interviewing this month and needs the link live immediately for his CV, LinkedIn, and email outreach. There is no fixed external deadline, but "ship this week" beats "ship complete".

## 5. Out of scope

- **Browser-based admin panel / content-management UI** — deferred to a later, separate feature. v1 content is edited in one file and committed, then auto-published. An editing backend roughly doubles the build and delays launch, and file-plus-git editing is fine for a backend engineer.
- **Identifying anonymous visitors by name or company** — not achievable on a public URL. "Who" is delivered only through self-labelled per-recruiter links.
- **Blog / articles / long-form writing** — not what the ten-second recruiter scan needs.
- **Multiple language versions** — the audience reads English; extra languages add ongoing content upkeep.
- **Search-engine optimisation** — traffic comes from links Roman sends, not from search.
- **PDF generation from the page (at launch)** — v1 ships with the existing "Classic" CV as a downloadable file; generating the PDF from the page content is an iteration-two improvement.

## 6. Risks

- **The page is only as strong as the content Roman writes.** The differentiating blocks — selected projects with impact numbers, and the per-recruiter "why I fit you" intro — are empty without his input. Assumes Roman invests content time; weak if he treats this as a pure engineering task.
- **Source data is inconsistent.** Surname spelling, employment dates, years of experience, and the two CV variants disagree. These transfer straight onto the page unless one canonical version is chosen first. Assumes that reconciliation happens before page content is written.
- **The iGaming / gambling domain can be an automatic filter-out** at some employers. Assumes neutral or openly-owned framing is enough.
- **Per-recruiter tracked links are fragile.** If a recruiter forwards the link internally, the label is now wrong; and storing named-recruiter visit data touches EU data-protection rules. Assumes low volume and informal use keep this acceptable.
- **Tracking needs a small server component even though the page is static** — a real-time "your page was viewed" notification and the link log cannot run on a pure static host. Assumes that service stays small and is not allowed to grow into the deferred admin backend.
- **Scope creep.** "Page as single source of truth + generated PDF + personalised intros + tracking" is already well past a static page. Assumes disciplined phasing: the static page and the tracking service first, everything else later.
- **Automated CV-download gating's verification step (explored 2026-09-09, roadmap step 10) leans on unreliable data.** The agreed mechanism scrapes the stated company's careers page first, falling back to a job-board aggregator API — but company career pages are inconsistently scrapeable (missing, JS-rendered, bot-blocked). The honest "couldn't verify automatically" email fallback covers this gracefully, but if it ends up handling most submissions rather than a rare few, the feature is effectively a lead-capture form with occasional automation rather than the fully-automated gate first imagined. Assumes a scraping spike validates real-world hit rate before this is built as designed.
- ~~CV-download gating (step 10) has not been checked against the site's "zero client JS by default" posture.~~ — **resolved (interview, 2026-09-09):** stays zero client JS. The gate is a native HTML `<form method="POST">` submitted straight to the tracker (a real page navigation, no fetch/JS) — the tracker does the check server-side and responds with either a redirect to the CV PDF, or a plain HTML page carrying the no-match / couldn't-verify-leave-email message. Chosen over a JS-driven async form specifically because a JS-only form has no fallback when script is blocked (a real risk on a locked-down corporate recruiter laptop — the exact audience this feature serves) and a live-checking spinner UX would need real accessibility work (`aria-live` state announcements, focus management) that native navigation gets for free. **New open point this creates:** the tracker today speaks JSON only (fire-and-forget event ingest, a JSON `{error, message}` envelope) — serving a plain HTML response for this flow is a new interaction shape for it, left for `design` to work out. **For v1, that response page is plain** — the message plus a "back to home" link, a real page reload when the visitor returns to the site. See the parked popup idea in the next §6 bullet for a fancier v2 alternative Roman likes but isn't ready to commit to yet.

- **Parked idea, not v1 (2026-09-09):** instead of the plain "back to home" reload above, render the tracker's gate-response page as a full visual clone of the landing page with a CSS-only modal (the `:target` technique — no JS) already open on top of it; closing the modal needs no reload, because the page underneath already looks like home. Roman likes this and wants to revisit it once **some mechanism exists to keep the tracker's cloned copy in sync with the real landing page** — today that would mean duplicating the page's markup/styles into the tracker (a second Java-side copy of what Astro renders) or sharing a build artifact between the two, either of which cuts against "content is the single source of truth" and "no direct code sharing between site and tracker" (`CLAUDE.md`). Not a v1 commitment — a candidate for a later roadmap step once a sync approach is found.

## 7. Recommendation

Build one static, fast landing page whose content lives in a single structured file that Roman edits and commits; the page auto-publishes on commit. Lay it out for a ten-second recruiter scan — name, one-line positioning, an availability block (status, location, remote / relocation, notice period, work authorisation), top stack, and contact actions for phone, email, and LinkedIn — with the depth (experience, selected projects, recommendations) below the fold. Pair it with a small tracking service: self-labelled per-recruiter links for "who", cookieless anonymous analytics for city / referrer / which contact button was clicked, and a real-time notification when the page is opened. Ship v1 with the existing "Classic" CV as a downloadable file and treat generating that PDF from the page content as iteration two. Defer the browser admin panel to a later, separate feature. Before writing any page content, reconcile the surname spelling, the employment dates, and the years-of-experience figure into one canonical version.

## 8. Open questions

- Which surname spelling is canonical — Hrupskyi / Grupskyi / Grupskiy? — owner: Roman
- Which CV variant is the base for the page — the three-page "Classic" version? — owner: Roman
- How should the iGaming / EveryMatrix experience be framed for gambling-averse employers? — owner: Roman
- What are the corrected employment dates, and how is the 2004→2017 sales / project-management period presented (shown, summarised, or omitted)? — owner: Roman
- ~~Where is the page hosted, and does that host also run the tracking service or is it a separate deployment?~~ — **resolved by `survey` (2026-09-06):** site on GitHub Pages, tracker on Fly.io (`waw`), Postgres on Supabase — separate deployments in one monorepo. See `docs/architecture-map.md` + `docs/adr/0002`–`0003`.
- Is salary or rate expectation shown on the page? — owner: Roman
- Is informal storage of named-recruiter visit logs acceptable as-is, or is a retention / notice line needed? — owner: Roman
- Which contact channel is primary — the CV lists two phone numbers plus email plus LinkedIn? — owner: Roman
- The landing page has a prominent **"Download CV" button** among the primary above-the-fold actions (phone / email / LinkedIn / Download CV); the click fires a tracked `cv_download` event. (Decided 2026-09-06.)
- Who can download the CV, and is it gated? Recommendation: **public, ungated** — a form/email wall works against the ten-second scan, and the file is public on static hosting regardless. — owner: Roman / specify. **Superseded in direction by roadmap step 10** (recruiter-gated download) — Roman wants anonymous visitors gated behind a company/name check, with labelled-link visitors bypassing it unconditionally; see the three resolved questions immediately below.
- ~~If CV-download gating (step 10) proceeds, what real-time data source verifies "company has an open role matching my stack"?~~ — **resolved (interview, 2026-09-09):** a fallback chain — first live-scrape the stated company's own careers page; if that's inconclusive (no page, unparseable, blocked), fall back to a job-board aggregator API search under that company name.
- ~~How does CV-download gating (step 10) handle agency/staffing recruiters?~~ — **resolved (interview, 2026-09-09):** no agency/in-house branch at all — one form field for every submitter, "which company's role are you presenting me for," and the same company gets verified either way (the recruiter's own employer if in-house, the end client if agency). Rejected the alternative of exempting self-declared agencies outright — trivially game-able, and "is this an agency" is itself an unverified check.
- ~~What happens when the automated check itself fails (can't reach/parse the company's page, the aggregator has nothing)?~~ — **resolved (interview, 2026-09-09):** neither fail-open (silently let everyone through) nor fail-closed with the "no match" message (which would misrepresent a technical failure as a real non-match). Instead: a distinct, honest message — "couldn't verify automatically, leave your email and I'll send the CV" — captures a lead and preserves manual gatekeeping without falsely rejecting a genuine recruiter. **Flagged risk:** company-careers-page scraping is inherently unreliable (no public page, JS rendering, bot-blocking); this fallback path may end up carrying most traffic rather than being a rare edge case — worth validating with a real scraping spike before committing to the fully-automated framing.
- Does the "Download CV" button route through the tracking service (so a download is a first-class event tied to the recruiter label) or is a plain link + client-side event enough? — owner: specify / design
- What is the downloaded file named? Not `cv.pdf` — something specific, e.g. `Roman-Hrupskyi-Lead-Java-Engineer-CV.pdf`. Exact form depends on the canonical surname spelling (first open question above). — owner: Roman
