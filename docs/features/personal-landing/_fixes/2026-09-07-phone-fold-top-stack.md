---
slug: personal-landing
date: 2026-09-07
triage: regression
acs: [AC-08, AC-15]
commit: bdb20dd
recurrence_of: none
---

# Fix: the top stack renders below the fold at the reference phone viewport

## Symptom

Opening the landing page at the reference phone viewport (390×844), expected every
AC-01 above-the-fold essential — including the top stack — visible without scrolling;
got the top stack rendering with its bottom edge at **1102px**, ~258px below the 844px
fold. Hits every recruiter opening the link on an iPhone-class phone (the primary
outreach channel). Present since the hero shipped (`46b7681`, 2026-09-07); surfaced by
the `sdd:review` browser measurement pass, never caught by CI.

## Root cause

Spec §6 defines a drop order for when the mobile hero overflows the fold — *1. Industries
list → 2. Tagline → 3. top-stack truncates; the essentials themselves never drop*. The hero
implemented only step 1 and bound it to `@media (max-width: 359.98px)` (`Hero.astro:176`),
i.e. it fired **only below 360px**, where spec §6 says the fold guarantee is *not* binding —
and never at 390px, where it **is** binding. With the optional `industries` list (4 entries)
stacked into the single column between the availability block and the top stack, the hero
was ~258px too tall.

It slipped past the tests because the AC-01/AC-08 e2e check (`landing.spec.ts`) asserted
only `toBeVisible()` on each essential — which is `true` for an element rendered 300px below
the viewport — and checked the top stack only with `toHaveCount(8)` (DOM presence, not
position). No test asserted fold geometry.

A second defect blocked verification: `buildFixture` symlinks `node_modules` into each
temp root, so every parallel `astro build` shared **one** Astro content-layer store
(`node_modules/.astro/data-store.json`). Fixture `profile` content (`validProfile()` —
"Jordan Rivera") leaked into `buildFixture({})` in `index-page.build.test.ts`, and a warm
stale build cache (keyed only on fixture inputs, not `src/`) hid it on a normal run. Fixed
here so the pinning test is trustworthy at the gate.

## The pinning test

`e2e/landing.spec.ts` › **"AC-01 / AC-08 — every above-the-fold essential sits within the
fold, no scrolling"** (e2e-through-UI, phone + laptop projects). For each AC-01 essential it
asserts `Math.round(box.y + box.height) <= viewportSize().height`.

RED (before the fix), phone project:

```
Error: top stack: bottom edge within the 844px fold at phone
expect(received).toBeLessThanOrEqual(expected)
Expected: <= 844
Received:    1102
      at e2e/landing.spec.ts:46:7
```

Laptop project passed both before and after. GREEN after the fix: top-stack bottom = 827px.

## Spec patch

**AC-08 / §6 — regression, no wording change.** The spec was right: §6 "Above-the-fold fit
(binding)" requires every essential visible with no scrolling at 390×844, and §6's drop
order already prescribed the fix (collapse Industries first). Re-verified.

**AC-15 — clarifying amendment (`added-by-fix: 2026-09-07`).** AC-15 read *"the hero shows
[Industries] … reflowing below the availability block on the phone viewport"*, which a
reader could take as a guarantee it renders at 390px — contradicting AC-08 once the drop
order applies there. Closing note extended:

- before: _`industries` is not an above-the-fold essential — it is not in the AC-01 / AC-05
  canonical list and never blocks a build by being absent._
- after: _`industries` is not an above-the-fold essential — it is not in the AC-01 / AC-05
  canonical list, never blocks a build by being absent, and collapses on the phone viewport
  as step 1 of the §6 drop order so the essentials stay above the fold at 390×844 (AC-08).
  "Reflowing below the availability block" above describes the layout on viewports wide
  enough to show the list (below the two-column breakpoint on a wider phone, before it
  collapses)._

## Follow-ups

- The Tagline drop (§6 drop-order step 2) and top-stack truncation (step 3) are still not
  implemented — not needed for the committed content, but a future ~300-char tagline could
  re-overflow 390×844. Not touched here (minimal fix). Owner: Roman, revisit if a longer
  tagline lands.
- At 360px the hero is still ~51px over the fold even with Industries dropped — within spec
  (§6: only no-horizontal-scroll binds there), noted for awareness.
- Open `sdd:review` findings not in this fix's scope: the browser test tier is unwired from
  CI (review finding 4 — needs a decision), `Footer.astro` hard-codes the surname + year
  (finding 5), and several minor coverage gaps (findings 6–9). Tracked in the review record.
