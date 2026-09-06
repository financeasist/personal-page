---
status: Draft
owner: "Roman (roman.grupskyi@gmail.com)"
updated_at: "2026-09-06"
depth: "medium"
# §8 open questions extended by survey 2026-09-06 (CV-download scope, download-button wiring, PDF filename); one hosting question resolved.
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
- Who can download the CV, and is it gated? Recommendation: **public, ungated** — a form/email wall works against the ten-second scan, and the file is public on static hosting regardless. — owner: Roman / specify
- Does the "Download CV" button route through the tracking service (so a download is a first-class event tied to the recruiter label) or is a plain link + client-side event enough? — owner: specify / design
- What is the downloaded file named? Not `cv.pdf` — something specific, e.g. `Roman-Hrupskyi-Lead-Java-Engineer-CV.pdf`. Exact form depends on the canonical surname spelling (first open question above). — owner: Roman
