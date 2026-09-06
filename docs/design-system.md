---
status: Living
tool: code
figma_file: ""
pen_file: ""
updated_at: "2026-09-06"
---

# Design system — personal-landing

> The project's **design canon**, produced once per repo by `design-system` and read by
> `ux-flows` / `screens` / `implement` / `review`. Committed — the tool choice and the inventory
> are team-wide, not per-developer. `architecture-map.md` §Frontend / UI foundation stays the
> inventory of the **code**; this file is the **design-side** canon (tool, posture, tokens,
> component inventory, cross-screen conventions). Refresh via `/sdd:design-system` when the
> foundation changes.

## Platform posture

- **Posture:** responsive, mobile-first content priority — recruiters reach the page from
  outreach and CVs and often open it first from a phone inbox, so the phone layout is the
  primary target and the laptop layout is the widened version of it
  (`docs/features/personal-landing/ux-flows.md`).
- **Breakpoints / device classes:** two fixed reference viewports — **390×844** (phone) and
  **1280×800** (laptop). No horizontal scroll at any width between them. Tailwind v4 default
  breakpoints (`sm 640` / `md 768` / `lg 1024` …); the landing page realistically only needs a
  single phone→laptop step. The `cv.astro` print route is **A4 only** and locked to
  `docs/reference/cv-template-reference.pdf` — not part of the responsive posture.

## Design tool

- **Tool:** `code` — screens are markdown wireframes inline in each feature's `screens.md`. No
  Figma/Pencil MCP in use, and a hand-rolled ~one-screen Astro site does not justify a design
  file separate from the components themselves.
- **Library location:** «the in-repo components are the library» — `site/src/components/*.astro`,
  composed into `site/src/pages/index.astro`. There is no external design file to keep in sync.

## Token source

- **Colors:** Tailwind v4 `@theme` block — `site/src/styles/global.css`
  (`--color-navy #2b3a55`, `--color-navy-dark #1f2a3f`, `--color-ink #1a1a1a`,
  `--color-muted #5b6472`). Navy accent matches the CV template. A screen never re-declares a
  colour inline.
- **Spacing / sizing:** Tailwind v4 default spacing scale (utility classes in `.astro`
  templates). No custom spacing tokens; the first UI feature may add `@theme` entries if a
  rhythm value is reused across sections.
- **Typography:** `--font-sans` in `site/src/styles/global.css` (system UI stack) + Tailwind v4
  default font-size scale. Body text ≥16 px on phone (AC-08). No web fonts.

## Component inventory

> Greenfield: `site/src/components/` is empty today. The rows below are the first shared
> primitives, all created by **personal-landing** (`docs/features/personal-landing/screens.md`
> §New components). `implement` replaces `pending` with the real `file:line` anchor as it
> registers each one; a later UI feature reuses these names or declares `NEW: <name>` with a
> why-no-primitive-fits justification and registers it back here.

| Component | Source (`file:line` / node / URL) | States it supports | Notes |
|---|---|---|---|
| `Section` | `site/src/components/` — pending (personal-landing) | default | Below-the-fold section wrapper: heading + spacing rhythm. Reused by SCR-02, SCR-03. |
| `Hero` | `site/src/components/` — pending (personal-landing) | default / tagline-omitted / positioning-omitted | Above-the-fold composition: headshot (LCP, `astro:assets` eager), name, headline, optional tagline, optional positioning block. |
| `AvailabilityBlock` | `site/src/components/` — pending (personal-landing) | default / work-auth-omitted | Structured block: availability `status` (carries remote stance) + `location` + optional `workAuthorization`. |
| `ContactActions` | `site/src/components/` — pending (personal-landing) | default / keyboard-focus | Four labelled controls (Call / Email / LinkedIn / Download CV), each ≥44×44 px on phone, each carrying a stable `data-contact-channel` / `data-cv-download` hook for the tracking roadmap step (SAD §8). |
| `PhoneChooser` | `site/src/components/` — pending (personal-landing) | collapsed / expanded / single-line | Native `<details>` disclosure, no JS; two labelled `tel:` controls, no phone digits rendered as text (ADR-0006). |
| `ExperienceTimeline` | `site/src/components/` — pending (personal-landing) | default / current-role / earlier-background-omitted | Roles most-recent-first + the optional single "earlier background" line. |
| `SelectedProjects` | `site/src/components/` — pending (personal-landing) | default (3-vs-5 reflow) | Card layout wrapper, reflows for 3–5 cards without an orphan. |
| `ProjectCard` | `site/src/components/` — pending (personal-landing) | quantified-impact / qualitative-impact | One project: name, Roman's role, impact statement (number rendered prominently when present). |

## Interaction & writing conventions

- **Errors:** no runtime error state — the site is static (SSG, ADR-0001) with zero client JS by
  default. Every completeness failure is a **build-time gate** that fails the build and names the
  missing field (AC-05 / AC-06 / AC-12, ADR-0007); an incomplete page never deploys.
- **Empty states:** none at runtime — optional content fields (tagline, positioning,
  `workAuthorization`, `earlierBackground`) simply don't render and the layout closes up. Required
  fields are schema-enforced, so a section is never empty at runtime.
- **Loading:** none — no client fetch, no hydration. The headshot is eager + explicit dimensions
  so first paint is the final layout with no CLS. The one inline tracking `<script>` is
  fire-and-forget and never blocks or changes what's rendered.
- **Validation:** N/A — no forms. The only inputs are `tel:` / `mailto:` / link hand-offs to the
  visitor's own tools; a device with no handler is an accepted no-op (ADR-0006), no fallback text.
- **Microcopy tone:** plain, recruiter-facing, action-first. Contact controls are verbs
  ("Call", "Email", "Download CV"). No marketing voice. Locale-clean — no hard-coded English in
  non-content-driven components (CLAUDE.md); visible strings come from the content collection.
