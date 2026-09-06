---
status: Accepted
owner: "Roman (roman.grupskyi@gmail.com)"
reviewers: []
updated_at: "2026-09-06"
feature_size: "greenfield-foundation"
ticket: "docs/idea-brief.md"
---

# 0001 — Build the landing page as an Astro static site with a typed content collection

- **Status:** Accepted
- **Date:** 2026-09-06
- **Deciders:** Roman + survey (greenfield foundation session)

## Context

The landing page must load fast for a ten-second recruiter scan, be editable by committing one
structured file (no admin UI at v1 — idea-brief §5), and auto-publish on commit. Roman is a backend
engineer; the content model matters more than a rich frontend framework.

## Decision drivers

- Ten-second scan → top Lighthouse / minimal client JS (idea-brief §7).
- "Content edited in one file and committed, then auto-published" (idea-brief §5, §7).
- Source data is inconsistent and must be reconciled — a typed schema should force the required
  fields explicit (idea-brief §6 risks).
- Low ongoing maintenance; single-language English only (idea-brief §5).

## Considered options

1. **Astro 5, static output, content collection + Zod schema** — content as typed YAML/Markdown,
   components in `.astro`, ~zero client JS.
2. **Plain hand-written HTML + CSS** — no build step, but no content/presentation split and no schema
   validation of the reconciled data.
3. **Next.js / SvelteKit static export** — heavier runtime and toolchain than a one-screen page needs.

## Decision outcome

**Chosen:** Option 1 (Astro static + content collection). It gives the content/presentation split and
schema-validated data the reconciliation risk demands, ships almost no JS so the scan stays fast, and
keeps the edit-and-commit workflow trivial. Option 2 loses the schema safety net; Option 3 adds
runtime weight with no benefit here.

## Consequences

**Positive**
- Zod schema catches a missing/again-inconsistent field at build time, before it ships.
- Near-perfect Lighthouse by default; deploys as static files to GitHub Pages.
- Adding a browser admin panel later (deferred feature) can write the same content files.

**Negative**
- A JS build toolchain (Node 20+) for what could have been static HTML — and this machine is on
  Node 18 today.
- Astro is a less familiar ecosystem for a Java engineer than plain HTML.

**Neutral**
- Tailwind v4 is the paired styling choice; swapping it later is a restyle, not a rebuild.
- Moving off Astro later means porting `.astro` templates, but the content files (YAML/MD) carry over.
- The same content collection also feeds the generated `cv.pdf` (ADR 0004) — the site is the single
  source of truth for both the page and the CV.

## Links

- Idea brief: [[../idea-brief.md]]
- Architecture map: [[../architecture-map.md]] §Stack, §Frontend / UI foundation
- Related ADR: [[0003-monorepo-layout-for-site-and-tracker]], [[0004-generate-cv-pdf-from-a-print-route-at-build-time]]
