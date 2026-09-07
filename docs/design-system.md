---
status: Living
tool: pencil
figma_file: ""
pen_file: "docs/design-system.pen"
updated_at: "2026-09-07"
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

> The first shared primitives, all created by **personal-landing** (registered by `implement`,
> task T11). A later UI feature reuses these names or declares `NEW: <name>` with a
> why-no-primitive-fits justification and registers it back here.
>
> **Removed** (personal-landing revision, `screens.md` §Divergence D-1/D-2): `ContactActions`,
> `ContactButton`, `PhoneChooser` — the hero contact row moved into the `Header` and phone was
> dropped. Not re-add unless a spec revision brings phone back. `ContactActions` was ultimately
> **folded into `Header`** rather than shipped as its own file (the three controls are `<a>`
> elements inside `Header.astro`).

| Component | Source (`file:line` / node / URL) | States it supports | Notes |
|---|---|---|---|
| `Layout` | `site/src/layouts/Layout.astro:1` · new (not in the screens manifest) | default | Base page shell: `<html lang="en">`, `<title>` from a prop, imports `global.css`, `min-height:100vh` flex column with `Footer` as the last flow child. Zero JS. |
| `Band` | `site/src/components/Band.astro:1` · new primitive (not in the screens manifest) | tone: surface / canvas / navy | Full-bleed colour band + centered max-width column; `as` picks the element (`section`/`header`/`footer`). The primitive `Hero` / `Section` / `Footer` compose from — keeps the alternating-band rhythm consistent, no inline colours. |
| `Header` | `site/src/components/Header.astro:1` · `screens.pen` reusable `dvllD` | default / phone-condensed / keyboard-focus | **Fixed / sticky** dark-navy top bar (CSS only). Name + LinkedIn / Email **icon controls** (→ LinkedIn URL / `mailto:`, value only in `href`) + `About me` (`#about`) + `Download CV` (derived filename, `download`). Phone: name + icons + native `<details>` menu holding About + Download CV. **No phone number. No "Contact" item** (no `#contact` section in v1). Each contact control carries a `data-contact-channel` / `data-cv-download` step-8 hook. |
| `Footer` | `site/src/components/Footer.astro:1` · `screens.pen` reusable `W7AZlV` | default | Dark-navy bottom bar (via `Band` navy), centered "Copyright © Hrupskyi R. Bio 2026". Flush to the viewport bottom. |
| `Section` | `site/src/components/Section.astro:1` · `screens.pen` inline `mQ0Vj` | default | Below-the-fold section wrapper (wraps `Band`): centered heading + short navy rule + spacing rhythm + `scroll-margin-top` for `#anchor` jumps. Reused by About now; Experience / Selected-projects in v2. |
| `AboutMe` | `site/src/components/AboutMe.astro:1` · `screens.pen` inline (`GSu58` › `k0sIs`) | default / phone-reflow / ai-line-omitted | Grey band (`Section` canvas, `id="about"`), two columns → one on phone: `narrative` (paragraphs split on blank lines) + `highlights` list + a "See my LinkedIn profile" link. All from content — no hard-coded copy. |
| `Industries` | `site/src/components/Industries.astro:1` · `screens.pen` inline (`Sh75H` › `QfCVa` / `XKUfO` › `WMCWv`) | default / phone-stacked / absent | Hero right column — renders the optional `industries` content field (`{domain, note?}`, ≤ 6); renders nothing when absent (AC-15). Static text. |
| `Hero` | `site/src/components/Hero.astro:1` · `screens.pen` `xEwZk` (laptop) / `Avanx` (phone) | default / tagline-omitted / industries-absent | White band (`Band` surface), fills the fold. `astro:assets` `<Image>` headshot (eager, high fetch-priority, < 100 KB) + `<h1>` name + headline + optional tagline + `AvailabilityBlock` (left) + optional `Industries` (right) + top-stack chips. Two-column laptop → single-column phone; `<360px` drops Industries first. |
| `AvailabilityBlock` | `site/src/components/AvailabilityBlock.astro:1` · `screens.pen` reusable `k6V1ni` | default / notice-omitted / work-auth-omitted | Structured block: `status` (carries the remote/hybrid stance) + `location` + optional `noticePeriod` + optional `workAuthorization`, all content-driven. |
| `ExperienceTimeline` | **v2 — not built** (SCR-02, US-04) | — | Re-instate with US-04; `screens.pen` inline `jgvYw`. |
| `SelectedProjects` | **v2 — not built** (SCR-03, US-09) | — | Re-instate with US-09; `screens.pen` inline `b9PNeG`. |
| `ProjectCard` | **v2 — not built** (SCR-03, US-09, D-8) | — | Native `<details>` accordion; re-instate with US-09; `screens.pen` reusable `J2r0z`. |

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
  ("Email", "Download CV"). No marketing voice. Locale-clean — no hard-coded English in
  non-content-driven components (CLAUDE.md); visible strings come from the content collection.
- **Section rhythm:** full-bleed background bands **alternate** `surface` (white) / `canvas`
  (grey) down the page — `Header` navy · Hero white · About me grey · Experience white · Selected
  projects grey · `Footer` navy. Content sits in a centered max-width column inside each band.
  Section headings are centered with a short navy rule beneath (personal-landing SCR-02/03/05).
- **`Header` / `Footer`:** the `Header` is position-sticky (CSS, no JS) and always visible; the
  `Footer` is flush to the viewport bottom (`min-height: 100vh` page).
