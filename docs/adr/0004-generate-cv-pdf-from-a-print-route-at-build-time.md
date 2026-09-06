---
status: Accepted
owner: "Roman (roman.grupskyi@gmail.com)"
reviewers: []
updated_at: "2026-09-06"
feature_size: "greenfield-foundation"
ticket: "docs/idea-brief.md"
---

# 0004 — Generate cv.pdf from a print route rendered with headless Chromium at build time

- **Status:** Accepted
- **Date:** 2026-09-06
- **Deciders:** Roman + survey (greenfield foundation session)

## Context

The idea brief (§5) planned to ship v1 with the existing "Classic" CV PDF as a committed static file
and defer generating the PDF from the page to iteration two. Roman has decided the **site must be the
single source of truth** now: a CV change should be one content edit that updates both the landing
page and the downloadable PDF, with no risk of the two drifting (drift between the two CV PDFs and
LinkedIn is a named risk — idea-brief §6). This ADR records that pulled-forward decision.

Roman has also fixed the **visual template**: the generated `cv.pdf` must reproduce the layout of
`docs/reference/cv-template-reference.pdf` — a two-column CV (dark header band with photo; light
sidebar for CONTACT / COMPETENCIES / LANGUAGES / EDUCATION; main column for PROFESSIONAL SUMMARY /
SKILLS as categorized bullet groups / WORK EXPERIENCE as a vertical timeline), navy accent, section
headers with a rule and a circular icon marker, A4, ~3 pages. Only the data slotted into each
section is editable; the template and layout are not a design decision left open to `screens`/`design`.

## Decision drivers

- One content source for the page and the CV — no manual PDF maintenance, no drift (idea-brief §6).
- The PDF must reproduce the `cv-template-reference.pdf` layout faithfully (Roman's explicit
  requirement) — full CSS control over a bespoke multi-column, timeline layout is required.
- Keep it a build-time artifact — no runtime PDF service, nothing on the recruiter's request path.
- Minimal new toolchain surface on a personal project.

## Considered options

1. **Print route + headless Chromium at build time** — `site/src/pages/cv.astro` consumes the same
   `profile` content collection with a print/CV layout; `site/scripts/generate-pdf.mjs` (Playwright)
   renders it into `dist/` under a meaningful name (e.g. `Roman-Hrupskyi-Lead-Java-Engineer-CV.pdf`,
   not `cv.pdf`) in a `postbuild` step; CI installs Chromium.
2. **Typst/LaTeX template from the same YAML** — render the content data through a separate Typst
   template. Excellent typography, lightweight, but a second layout language and the CV design lives
   apart from the web components.
3. **JS PDF builder (react-pdf / pdfmake)** — construct the PDF from the data in a PDF DSL.
   Reimplements layout, weaker typography, no CSS reuse.
4. **Keep the committed "Classic" PDF for v1** (the original brief plan) — zero build cost, but the
   PDF is hand-maintained and drifts from the page — exactly what Roman wants to eliminate.

## Decision outcome

**Chosen:** Option 1. The CV layout stays in the same Astro/Tailwind toolchain as the site, driven by
the same typed content, so "source of truth" is real and enforced by the build. It also gives the
full CSS control needed to reproduce the reference template pixel-close. Chromium-in-CI is a
routine, well-supported cost. Option 2 could reproduce the template but splits the design across two
systems and two layout languages; Option 3 cannot match the template; Option 4 is the drift problem
this decision exists to remove.

**Scope note:** `cv.astro`'s layout is a fixed reproduction of `cv-template-reference.pdf`, not an
open design question. `index.astro` (the landing page) is a separate, freely-designed layout over
the same content collection.

## Consequences

**Positive**
- A CV change is a content-collection edit only; the PDF regenerates on every deploy and cannot drift.
- Full CSS control over the print layout (page breaks, A4 margins, print typography).
- `cv.astro` doubles as a human-viewable `/cv` web page.

**Negative**
- The site CI job installs Chromium (`npx playwright install --with-deps chromium`) — slower, larger
  job.
- `cv.astro` is a second layout to build and maintain alongside `index.astro`, and reproducing the
  reference template (two-column, timeline, print pagination) is non-trivial CSS work.
- The generated PDF is only as good as the reconciled content — it does not remove the
  content-reconciliation prerequisite (architecture-map constraints, idea-brief §8).
- The content-collection schema is now partly shaped by the reference template's sections
  (competencies, categorized skill groups, timeline experience entries with tech-stack lines).

**Neutral**
- `cv.pdf` is now a build artifact, not a tracked file — it lives only in the Pages deploy.
- Swapping Playwright for Puppeteer, or to Typst later, is a contained change to one script + route.

## Links

- Idea brief: [[../idea-brief.md]] §5 (this supersedes the "defer PDF generation" decision)
- Reference: `docs/reference/cv-template-reference.pdf` (the locked layout) + `docs/reference/README.md`
- Architecture map: [[../architecture-map.md]] §Stack (PDF generation), §Conventions, §Constraints
- Related ADR: [[0001-astro-static-site-with-typed-content-collection]]
