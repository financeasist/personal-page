---
status: Accepted
owner: "Roman (Architect)"
reviewers: ["Roman"]
updated_at: "2026-09-07"
feature_size: "M"
ticket: "roadmap step 3 — personal-landing"
---

# 0009 — Scroll-spy active-section indicator ships one small progressive-enhancement script

- **Status:** Accepted
- **Date:** 2026-09-07
- **Deciders:** Roman (post-review polish pass, 2026-09-07)

## Context

The header carries one in-page nav link, **About me** (`#about`). Roman asked
for the behaviour of a reference resume header (a Bootstrap ScrollSpy theme):
as the reader scrolls, the current section's nav link is visually marked
(a filled block behind it), updating on free scroll — not only on click.

This feature committed to **0 KB client JavaScript** (spec §6 NFR, SAD §8,
inherited from ADR-0001; ADR-0006 leaned on it for the contact-value
decision). Scroll-position tracking that updates on free scroll cannot be done
in CSS today across the browsers this page supports:

- `:target` only reflects the URL hash — it updates on a click on the link,
  never on free scroll.
- Scroll-driven animations (`animation-timeline: view()`) that style a
  *different* element than the scrolled one need `timeline-scope`, which is
  Chrome-only (no Safari, no Firefox) — too fragile to ship.

So the choice is: keep 0 KB and accept click-only highlighting, or ship a
small script.

## Decision drivers

- Roman's explicit request for the reference's scroll-driven active-link
  behaviour (post-review polish pass, 2026-09-07).
- Spec §6 NFR: client JavaScript shipped by this feature (was 0 KB).
- SAD QG-3 / spec §6: the page and every **contact action** must work with
  JavaScript disabled; Lighthouse Accessibility ≥ 95.
- The indicator is decorative — it changes no content, blocks no action, and
  its absence leaves the page fully usable.
- Astro 5 inlines a script this small directly into the page — no separate
  bundle, no extra request.

## Considered options

1. **One inline `IntersectionObserver` module in `Header.astro`** — toggles
   `.is-active` on the About-me link + menu item while `#about` sits in a band
   around the viewport middle. ~320 bytes, inlined by Astro (no bundle, no
   request), `type="module"` so deferred by default. Pure progressive
   enhancement: script blocked / JS off ⇒ the class is never added and the
   link styles like any other.
2. **CSS-only, `:has()` + `:target`** — `header:has(~ main #about:target)
   [data-nav-link="about"]`. 0 KB, but only highlights *after a click* on the
   link (hash = `#about`); no update on free scroll. Does not match the
   reference.
3. **CSS scroll-driven animation** (`view-timeline` + `timeline-scope`) —
   matches the behaviour, 0 KB, but Chrome-only; broken (no highlight) in
   Safari and Firefox.
4. **Drop the indicator** — keep 0 KB, ship nothing.

## Decision outcome

**Chosen: Option 1.** The behaviour Roman asked for needs a script; the
script is tiny, inlined, deferred, and a strict progressive enhancement with
no effect on content, contact actions, accessibility, or the no-JS
experience. Options 2 and 3 don't deliver the scroll-driven behaviour on the
supported browsers. Option 4 declines the request.

This **amends the "0 KB client JavaScript" NFR** to **"≤ 1 KB — one inline
progressive-enhancement script; no JS bundle, no framework island, no
hydration."** ADR-0006 is unaffected in substance: contact values still live
only in link attributes with no script assembling or revealing them; the
"page is script-free" phrasing in ADR-0006 is narrowed to "no script touches
the contact controls."

## Consequences

**Positive**
- The header matches the reference's scroll-driven active-section behaviour.
- No JS bundle and no extra network request — Astro inlines the ~320 B module.
- `data-nav-link="about"` is the only new markup; the observer binds to it and
  to `#about`, both already present.

**Negative**
- The feature is no longer literally 0 KB JS — a reader now has to know the
  one allowed exception and its shape (this ADR; the two build/component tests
  encode it).
- A second small script (the roadmap step-8 click beacon) will join it later;
  the NFR now reads as a small budget rather than an absolute.

**Neutral**
- With JavaScript disabled the page is unchanged except the active-link
  highlight is absent — no layout shift, no dead control.
- Reversible: delete the `<script>` and the `.is-active` rule; the tests flip
  back to asserting zero scripts.

## Links

- Spec: [[../spec.md]] §6 (client-JS NFR + NFR-verification row)
- SAD: [[../sad.md]] §1 (goal 3), §2 (constraints), §8 (Client JavaScript row),
  §9 (decision table), §10 (QG-1, QG-3)
- Amends: this feature's **0 KB client JavaScript** NFR (spec §6) → ≤ 1 KB, one
  inline PE script
- Narrows: [[0006-contact-details-as-actionable-only-link-attributes-zero-js]]
  ("script-free page" → "no script touches the contact controls")
- Inherits: `docs/adr/0001` (zero client JS *by default*)
- Tests: `site/test/build/index-page.build.test.ts`,
  `site/test/components/header.test.ts`
