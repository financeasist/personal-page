---
id: T6
title: "Header — sticky CSS-only bar with the three contact actions + mobile disclosure menu"
layer: ui
deps: ["T1", "T3", "T5"]
blocks: ["T9"]
acs: ["AC-02", "AC-07", "AC-08", "AC-10", "AC-13"]
files_hint: ["site/src/components/Header.astro"]
owner: "Roman"
estimate: "M"
context_budget: "M"
status: "todo"
---

<!-- Inline the slice the task needs, name where it came from, keep the link as fallback. -->

# T6 — Header: contact actions + mobile menu

## Place in the sequence

- **Blocked by:** T1 — test harness, T3 — CV-filename helper (Download-CV `href`), T5 — tokens + shell. · **Blocks:** T9 — assemble index.astro. · **Wave:** 3.
- **Lane:** own file (`Header.astro`). Parallel with T7 (About) and T8 (Hero).

## Why (user story)

> **As a** Recruiter
> **I want** email, LinkedIn, and CV download as immediate actions in a persistent header at the
> top of the page
> **So that** I can contact him through my preferred channel without hunting, and the actions
> stay in reach as I scroll.
>
> — `spec.md §4, US-02, verbatim` · full text: [spec.md](../spec.md)

This task builds the persistent header and its three contact controls — the whole of US-02.

## Inlined context

> **Chosen:** … email / LinkedIn never render as visible text on the landing page; each is a
> plain link (`mailto:` / `https:` new tab). The phone is not a landing-page channel in v1. The
> three contact controls live in a persistent, sticky, CSS-only `Header`; on the phone viewport
> the header condenses to Roman's name, the email + LinkedIn icon controls, and a native
> `<details>` disclosure menu holding Download CV and an About link. No script assembles or
> obfuscates the values in v1.
>
> — `adr/0006 §Decision outcome (as restated in sad.md §4 ¶2), verbatim` · full text: [adr/0006](../adr/0006-contact-details-as-actionable-only-link-attributes-zero-js.md)

> `Header` — persistent sticky top bar (CSS only) … mobile: name + email/LinkedIn icons + a
> native `<details>` menu (Download CV, About). Each contact control … carries a stable `data-*`
> hook for step 8.
> `ContactActions` — The three labelled controls (email, LinkedIn, Download CV), rendered inside
> `Header`. Each carries a stable `data-contact-channel` (`email` / `linkedin`) or
> `data-cv-download` hook for step 8. Email + LinkedIn values live only in `href` (AC-10).
>
> — `sad.md §5 + screens.md §Components, abridged` · full text: [sad.md](../sad.md) · [screens.md](../screens.md)

**SCR-01 Header states to build** (`screens.md`): **default — laptop** (`Sh75H` › Header `dvllD`):
white-on-navy bar, name + the three controls visible; **default — phone** (`XKUfO`): condenses to
name + LinkedIn (`fusdv`) + email (`z9saN`) icon controls + a menu affordance opening a native
`<details>` with Download CV + an `#about` link; **keyboard focus** (`heCTv`): every control takes
a visible focus ring in DOM order (Name link → LinkedIn → email → About me → Download CV →
Contact), operable by Enter / Space, **zero client JS**.

> **Hard rule (NFR):** 0 KB client JavaScript. Every interactive target ≥ 44×44 px. The mobile
> header menu is a **native `<details>` disclosure**. Body text ≥ 16 px. Lighthouse a11y ≥ 95;
> every interactive element keyboard-reachable and operable.
>
> _(Amended 2026-09-07 by **ADR-0009**: the Header now also carries the inline scroll-spy
> active-section indicator — ~320 B, inlined, PE only. NFR is ≤ 1 KB, no bundle / island. The
> `<details>` menu and every contact control stay script-free.)_
>
> — `spec.md §6 NFR + §5 AC-08, abridged` · full text: [spec.md](../spec.md)

Values come from content (T2): `contact.email` → `mailto:`; the `contact.links` entry with a
`linkedin.com` host → LinkedIn `href`; Download CV `href` = `/` + `cvFilename({name, headline})`
(T3) with the `download` attribute. Icon labels/`aria-label`s are structural strings (locale-clean
— not content-driven copy), but must exist for a11y.

**Fallback:** if `<details>` styling for the menu fights the sticky bar, the binding constraints
are *native disclosure, no JS, ≥44×44 targets* (AC-08) — keep those; restyle freely. Read
[adr/0006](../adr/0006-contact-details-as-actionable-only-link-attributes-zero-js.md) in full.

## Data delta

No DB changes. Reads `contact.email`, `contact.links` (LinkedIn), `name`, `headline` (for the CV
filename). Never renders `contact.phones`.

## API contract

Internal — no API surface. The three controls are browser-native hand-offs (`mailto:` / new-tab
`https:` / file download).

## Acceptance criteria

### AC-02 (US-02) — happy path

> **Given** a Recruiter is viewing the landing page (the header is persistent, so this holds at
> any scroll position)
> **When** the Recruiter activates the email action — a header icon control on the phone viewport,
> a header control on the laptop viewport
> **Then** their mail client opens a new message already addressed to Roman, with no further steps.
>
> — `spec.md §5, AC-02, verbatim` · full text: [spec.md](../spec.md)

### AC-07 (US-01) — authorization (contact-text half)

> **Then** … Roman's email address and LinkedIn URL / handle are never rendered as visible text
> on the landing page — the page exposes only what a Recruiter needs to assess fit and lets them
> make contact through the labelled controls. (Phone numbers are not on the landing page in any
> form in v1 — not as text, not in a link attribute …)
>
> — `spec.md §5, AC-07, abridged` · full text: [spec.md](../spec.md)

### AC-08 (US-06) — happy path (header half)

> **Then** … The header condenses to Roman's name, the email and LinkedIn actions as icon
> controls, and a menu control; the email and LinkedIn icon controls, the menu control, and every
> item the menu discloses (Download CV, an in-page About link) are each a full tap target
> (≥44×44 px); the menu is a **native disclosure** (`<details>` / `<summary>`, no JavaScript).
>
> — `spec.md §5, AC-08, abridged` · full text: [spec.md](../spec.md)

### AC-10 (US-02) — domain invariant

> **Given** the rendered landing page — not the CV download
> **When** a Recruiter views the contact area
> **Then** neither the email address nor the profile URL appears as visible text — each is
> reachable only by activating its labelled control … The values do live in the controls' link
> attributes so the controls function …
>
> — `spec.md §5, AC-10, verbatim` · full text: [spec.md](../spec.md)

### AC-13 (US-02) — happy path

> **Given** a Recruiter is viewing the header contact actions
> **When** the Recruiter activates the LinkedIn action or the Download-CV action (on the phone
> viewport, Download CV is inside the header menu — one tap to open the menu, one to activate)
> **Then** LinkedIn opens Roman's profile in a new browser tab with the landing page left open,
> and Download CV saves the named PDF to the Recruiter's device as a file download rather than
> opening it inline.
>
> — `spec.md §5, AC-13, verbatim` · full text: [spec.md](../spec.md)

## Checklist

- [ ] `site/src/components/Header.astro` — `<header>` landmark, `position: sticky; top: 0`, full-bleed navy, CSS-only. Props: the profile slice it needs.
- [ ] Three controls: email (`mailto:contact.email`, `data-contact-channel="email"`), LinkedIn (`href` = the linkedin.com link, `target="_blank" rel="noopener"`, `data-contact-channel="linkedin"`), Download CV (`href="/" + cvFilename(...)`, `download`, `data-cv-download`). Each ≥ 44×44 px, labelled (`aria-label` on icon-only forms).
- [ ] Responsive: laptop shows all three as bar controls; phone condenses to name + email/LinkedIn icons + a `<details><summary>` menu containing Download CV + `<a href="#about">`.
- [ ] Visible focus ring on every control; DOM order = Name → LinkedIn → email → About → Download CV → Contact.
- [ ] No email/LinkedIn/phone string anywhere in the rendered **text content** — only in `href`.

## Edge cases

| Case | Behaviour |
|---|---|
| device has no `mailto:` handler (E15) | the action is inert; there is **no** visible or copyable contact value as a fallback (accepted, ADR-0006); LinkedIn + CV still work |
| JS disabled | `<details>` menu still opens/closes; all links work |
| very long headline-derived CV filename | `download` attribute carries it verbatim; no layout impact (it's an attribute) |
| 360 px width | header stays single-row or wraps without horizontal scroll; targets stay ≥ 44 px |

## Definition of Done

- [ ] Component tests (`spec.md` §Test plan): `header email control carries a mailto addressed to Roman`; `contact controls hold email/URL in link attributes, not in text content`; `LinkedIn control opens a new tab; CV control is a download, not inline`.
- [ ] e2e-through-UI: `activating the header email action hands off a mailto`; `header menu is a native <details> and works with JavaScript disabled` (390×844); `phone hero: … tap targets ≥ 44×44`.
- [ ] Build output ships 0 KB JS from this component.
- [ ] Every Hard Rule inlined above still holds (no visible contact text; native `<details>`; zero JS).
