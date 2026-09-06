---
status: Living
tool: pencil
figma_file: ""
pen_file: "docs/design-system.pen"
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

- **Posture:** responsive-both — recruiters reach the page from phone inboxes (outreach, CV
  footers) and from a laptop while writing up a candidate, so neither viewport is a second-class
  reflow of the other; both are designed as first-class targets
  (`docs/features/personal-landing/ux-flows.md`).
- **Breakpoints / device classes:** two fixed reference viewports — **390×844** (phone) and
  **1280×800** (laptop); no horizontal scroll at any width between them. Tailwind v4 default
  breakpoints (`sm 640` / `md 768` / `lg 1024` …); a one-screen landing page realistically needs
  a single phone→laptop step. The `cv.astro` print route is **A4 only**, locked to
  `docs/reference/cv-template-reference.pdf` — not part of the responsive posture.

## Design tool

- **Tool:** `pencil` — screens are drawn in a `.pen` file and each feature's `screens.md`
  references the nodes. The Pencil MCP is in the session; a shared `.pen` library holds the token
  variables and the foundations frame every screen composes from.
- **Library location:** `docs/design-system.pen` — the token variables (light + dark) and a
  **Foundations** frame with the core primitives. Per-feature screens live in
  `docs/features/{slug}/screens.pen`, drawn against this library.

## Token source

- **Colors:** Tailwind v4 `@theme` block — `site/src/styles/global.css`
  (`--color-navy #2b3a55`, `--color-navy-dark #1f2a3f`, `--color-ink #1a1a1a`,
  `--color-muted #5b6472`). Navy accent matches the CV template. Seeded into the `.pen` library as
  variables; the code file stays the source of truth and a screen never re-declares a colour
  inline.
- **Spacing / sizing:** Tailwind v4 default spacing scale (utility classes in `.astro`
  templates). No custom spacing tokens; the first UI feature may add `@theme` entries if a rhythm
  value is reused across sections.
- **Typography:** `--font-sans` in `site/src/styles/global.css` (system UI stack) + Tailwind v4
  default font-size scale. Body text ≥16 px on phone (AC-08). No web fonts.

## Component inventory

> `site/src/components/` is empty today. The rows below are the first shared primitives, all
> created by **personal-landing** (`docs/features/personal-landing/screens.md` §New components).
> `implement` replaces `pending` with the real `file:line` anchor as it registers each one; the
> `.pen` node id is filled in as `screens` draws it. A later UI feature reuses these names or
> declares `NEW: <name>` with a why-no-primitive-fits justification and registers it back here.

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
