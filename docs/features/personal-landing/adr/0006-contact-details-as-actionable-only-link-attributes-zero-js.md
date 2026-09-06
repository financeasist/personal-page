---
status: Accepted
owner: "Roman (Architect)"
reviewers: ["Roman"]
updated_at: "2026-09-06"
feature_size: "M"
ticket: "roadmap step 3 — personal-landing"
---

# 0006 — Contact details as actionable-only link attributes, zero client JavaScript

- **Status:** Accepted
- **Date:** 2026-09-06
- **Deciders:** Roman

## Context

Roman requires that his phone numbers, email address, and LinkedIn URL never appear as visible text on the landing page — a Recruiter contacts him by activating a labelled control, not by reading and copying a string. The generated CV PDF is exempt (it shows the details by design). The feature also commits to shipping zero client JavaScript. These two requirements interact: the strictest reading of "hidden" would need script to assemble the values, which conflicts with the zero-JS commitment.

## Decision drivers

- Roman's explicit requirement: no plain-text contact details on the page (spec §1, AC-07, AC-10).
- Spec §6 NFR: 0 KB client JavaScript shipped by this feature.
- Spec §6 NFR: Lighthouse Accessibility ≥ 95; every control keyboard-operable — favours native elements.
- Spec §6.1 abuse case: casual scraping — residual risk accepted (same data is in the public CV).

## Considered options

1. **Values only in link attributes (`tel:` / `mailto:` / `https:`), phone chooser is a native `<details>`** — no visible text, no script; the digits/address remain greppable in the delivered HTML.
2. **Script-assembled on click** — the values are absent from the HTML and built by JavaScript when the Recruiter activates a control; defeats the 0 KB JS row and the no-JS accessibility story.
3. **Image / encoded rendering** — render the details as an image or entity-encoded blob; hostile to accessibility and to the "activate a control" model.

## Decision outcome

**Chosen:** Option 1 for v1. It satisfies Roman's "no visible text" requirement and keeps the page script-free and fully accessible. The residual exposure (values present in link attributes) is accepted — it is the same information already public in Roman's CV and LinkedIn. Option 2 is recorded as the stricter fallback if scraping abuse actually appears (spec §8 Q3, §11 open question); it would cost the zero-JS property for the contact controls only.

## Consequences

**Positive**
- "No visible text" holds; the page ships 0 KB JavaScript; controls are native and accessible.
- The phone chooser (`<details>`/`<summary>`) works with no script, keyboard-operable by default.

**Negative**
- Phone numbers and email remain in the page source (in `href`s) — casual scraping is still possible.
- The "one tap" goal is one-tap-plus-one for the phone (open the chooser, pick a line).

**Neutral**
- Moving to script-assembled values later is a localised change to the contact components only.
- On a device with no dialer / mail client the corresponding action may not resolve; the plain-text fallback was deliberately rejected.

## Links

- Spec: [[../spec.md]] §1, §5 (AC-02, AC-03, AC-07, AC-10, AC-13), §8 Q3
- SAD: [[../sad.md]] §4, §8
- Inherits: `docs/adr/0001` (zero client JS by default)
