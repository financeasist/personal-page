---
status: Draft
owner: "Roman (roman.grupskyi@gmail.com)"
reviewers: ["Roman"]
updated_at: "2026-09-06"
feature_size: "M"
---

# Spec — tracking-system

> **Glossary:** [CONTEXT](../../../CONTEXT.md) (repo-root; no feature-scoped CONTEXT.md)
> **Reference material / channels used:** `docs/roadmap.md` steps 5–7 + open decision D6 · `docs/idea-brief.md` §6–§8 · `docs/architecture-map.md` (Stack, Module inventory, Conventions, Constraints) · `docs/features/personal-landing/spec.md` (the Contact-action / CV-download tracked-click hooks this service must receive) · interview 2026-09-06 · ideation: `sdd:researcher` (competitive scan) + `sdd:devils-advocate` (failure-mode hunt), 2026-09-06 · critic pass 2026-09-06.

## 1. Context

Roman is in an active job search and his landing page (`personal-landing`, already spec'd) gets recruiters to him, but today he has no signal on whether a specific recruiter he reached out to ever opened it, and no account of anonymous traffic reaching the page through other channels (idea-brief §1, §7). This spec covers roadmap steps 5–7 — the small backend piece that turns "I sent a link" into "I know who opened it and when": a labelled-link redirect, cookieless event ingest, and a real-time Telegram notification.

The trigger is immediate and sequencing-driven: `personal-landing`'s Contact actions and Download-CV button already assume a tracked-click hook this service must exist to receive, and roadmap step 8 (the site's beacon script, a separate feature in the `site/` module) depends on this feature's event-ingest endpoint existing first. This feature is scoped to roadmap steps 5 (labelled-link redirect), 6 (cookieless event ingest), and 7 (view notification) only — step 8 is explicitly out of scope here (§3), and so is anything that must run as client-side code on the landing page itself (§3).

**Sizing note:** this bundles three separately-sized roadmap items (step 5 M, step 6 M, step 7 S) plus two capabilities the roadmap didn't itemize — the manual erase path and per-source rate limiting. It stays **M** rather than L: no breaking changes (nothing depends on this service yet), the `tracker/` module, its endpoints, and its migration conventions are already scaffolded, and the erase/rate-limit additions are each a small, contained addition (a manual database operation and a request filter) rather than a new API surface or subsystem of their own.

Ideation (competitive research, medium-depth pass, 2026-09-06) found no adjacent product combining all three things this feature needs in one lightweight, personal-scale package: cookieless analytics tools (Plausible, Fathom, Bitly-style link analytics) are dashboard/webhook-first, not push-first; email/link "read receipt" tools (Mailtrack, HubSpot Sales) nail instant push notification but are pixel/CRM-bound and don't support a self-labelled, degrades-to-anonymous link. A small purpose-built service is the right call, not an off-the-shelf swap.

The committed approach, confirmed by Roman on 2026-09-06: he hand-picks a label per outreach; the redirect propagates that label to the landing page via the URL, so the label survives the hop to the page. (Removing that label from the browser's visible address bar is roadmap step 8's job, a separate feature — out of scope here; this feature only has to keep the label present in the URL step 8 reads and then scrubs.) Every visit — labelled or anonymous, minus filtered link-preview crawlers — fires exactly one real-time Telegram notification, with no deduplication of repeat visits. Visit history is retained indefinitely, offset by a manual, Roman-only capability to erase one label's history on request — a one-off operation Roman runs by hand directly against the database, never a code path the tracker application itself exposes, so it does not conflict with the tracker's append-only convention for `visit_event` (`docs/architecture-map.md` §Conventions). Both public endpoints (the redirect and the event-ingest path) carry a basic per-source rate limit as the sole abuse guardrail.

**Accepted risk, decided with eyes open (interview 2026-09-06, from the devil's-advocate failure-mode pass):** notify-every-time will occasionally fire on corporate email-security link scanners (e.g. Defender Safe Links, Proofpoint, Mimecast) that pre-open a link at delivery time, before the recipient reads the email — producing an occasional false "recruiter opened it" notification. Roman judged the raw, unfiltered signal still worth that noise rather than adding a deduplication window. This decision also resolves roadmap's open decision **D6**: retention is indefinite, with a manual erase path as the mitigation instead of an automatic expiry policy.

## 2. Goals

- Roman knows within seconds whether a specific labelled recruiter opened his page, with no manual checking required.
- Every visit to the landing page — labelled or anonymous — produces exactly one real-time notification; known link-preview crawlers never count as a visit.
- Roman can see not just that someone visited, but how they engaged — which contact channel they used, or whether they downloaded the CV — so he can judge real interest depth, not just presence.
- Roman can honor a request to erase one recruiter's visit history without building or maintaining an admin UI.

## 3. Non-goals

- **No automated retention/expiry policy** — Roman chose indefinite retention offset by a manual, on-request erase path, not automatic deletion after a time period (§1).
- **No dashboard or browsing UI for visit history** — v1 has no built-in way to browse visit history; reviewing it is an out-of-band operational task for Roman, not a feature this spec builds. A browsing/reporting UI is deferred.
- **No authentication on the redirect or event-ingest endpoints** — they must stay open so any recruiter can use them without friction; the only guardrail against abuse is rate limiting, not login.
- **No CAPTCHA or behavioral bot-detection** — link-preview-crawler filtering is best-effort identification of known automated previewers only, not a guaranteed classifier; a stronger anti-bot system is not built in v1.
- **No site-side event-emitting mechanism, and no removal of the label from the browser's visible address bar** — both are roadmap step 8's job, a separate feature in the `site/` module, sequenced after this one; this feature only has to receive events and keep the label present in the redirect's target URL for step 8 to read and then scrub.

## 4. User stories

### US-01: Identify who's visiting via a labelled link

**As** Roman
**I want** a link that carries a label I chose for one recruiter
**So that** opening it tells me it's specifically her.

### US-02: Distinguish organic, anonymous interest

**As** Roman
**I want** an unlabelled visit to still notify me, showing city and referrer
**So that** I don't miss interest reaching the page through channels other than a labelled link.

### US-03: Never lose signal to link-preview bots

**As** Roman
**I want** requests from known link-preview crawlers to never count as a visit
**So that** my notifications stay real signal, not automated noise.

### US-04: A broken or mistyped label never dead-ends a Recruiter

**As a** Recruiter
**I want** an unrecognized or stale label in a link I received to still take me to the landing page
**So that** a mistyped or outdated link never leaves me stuck.

### US-05: Every genuine view gets a notification, without exception

**As** Roman
**I want** a notification for every single visit — including repeats — with no batching
**So that** I never wonder whether I missed one.

### US-06: See how a visitor engaged, not just that they visited

**As** Roman
**I want** to know which contact channel a visitor used, or whether they downloaded the CV
**So that** I understand how deep their interest actually went.

### US-07: Honor a data-erasure request without a management UI

**As** Roman
**I want** a way to erase one recruiter's stored visit history on request, even via a manual command
**So that** I can respond to a request without touching every row by hand.

### US-08: Resist casual probing and flooding

**As** Roman
**I want** basic limits on how fast the redirect and event-ingest paths can be hit from one source
**So that** someone guessing labels or flooding events can't pollute my data or spam my notifications.

## 5. Acceptance criteria

### AC-01 (US-01) — happy path

**Given** Roman has sent a Recruiter a Labelled link carrying a label he chose for her
**When** the Recruiter opens that link
**Then** the Recruiter lands on the landing page and Roman receives a View notification naming her by that label

### AC-02 (US-02) — happy path

**Given** a visitor opens the landing page directly, not through a Labelled link
**When** the visit is recorded
**Then** Roman receives a View notification showing the visitor's city and referrer instead of a name

### AC-03 (US-03) — domain invariant

**Given** a request to the labelled link arrives from a recognized link-preview crawler generating a preview for a messaging or social app
**When** the request is processed
**Then** no Visit is recorded and no View notification is sent — the invariant "a View notification always represents a person, not a bot" holds

### AC-04 (US-04) — happy path (fallback)

**Given** a Recruiter opens a link whose label does not match any label Roman has recorded
**When** the redirect happens
**Then** the Recruiter still reaches the landing page, and the visit is recorded and notified as an ordinary Anonymous visit rather than failing or showing an error

### AC-05 (US-05) — happy path

**Given** the same visitor opens the landing page again — a reload, a second tab, or a repeat visit through the same Labelled link
**When** each such visit is recorded
**Then** Roman receives a separate View notification for it, with no collapsing of repeats into a single message

### AC-06 (US-06) — happy path

**Given** the tracker receives a contact-action or CV-download event for a Visit
**When** that event is ingested
**Then** the tracker records which channel — phone, email, LinkedIn, or CV download — was used, attributed to that same Visit

### AC-07 (US-06) — cross-context

**Given** the tracker has already attributed a Visit to a Labelled link's label
**When** it receives a contact-action or CV-download event for that same Visit
**Then** the resulting event carries the same label, so Roman can see not just that a Recruiter visited but what she actually did while there

### AC-08 (US-07) — happy path

**Given** Roman needs to erase every Visit tied to one specific label — for example in response to a request
**When** he runs the erase operation for that label
**Then** every Visit and related event tied to that label is permanently removed, and no trace of that named history remains

### AC-09 (US-07) — error

**Given** Roman runs the erase operation for a label with no recorded Visits
**When** the operation executes
**Then** the system reports that nothing matched and erases nothing, so Roman is never left believing data was removed when none existed

### AC-10 (US-07) — authorization

**Given** the erase capability exists
**When** anyone other than Roman attempts to invoke it
**Then** there is no way to do so — it is not exposed on any path reachable by a Recruiter or the public, only available to Roman directly

### AC-11 (US-08) — domain invariant

**Given** a single source sends requests to the labelled-link redirect or the event-ingest path far faster than a real person could click
**When** that rate is exceeded
**Then** the system throttles further requests from that source, so neither the visit log nor the notification channel can be flooded from a single source

### AC-12 (US-02) — domain invariant

**Given** a visit is recorded, labelled or anonymous
**When** the system derives the visitor's city
**Then** only the derived city is stored — the visitor's raw IP address is never retained beyond the moment of derivation

## 6. Non-functional requirements

| Aspect | Target | Measurement |
|---|---|---|
| Redirect latency (click → page-load start), p95 | ≤ 300 ms | synthetic/uptime check against the redirect path |
| Event-ingest response time, p95 | ≤ 200 ms | tracker access logs |
| View-notification delivery latency (event recorded → Telegram message delivered), p95 | ≤ 5 s | timestamp diff in tracker logs |
| Redirect availability (recruiter-facing click path) | ≥ 99% monthly | uptime monitor |
| Abuse throttling | ≤ 30 requests/minute per source IP on both public endpoints; excess throttled | rate-limiter metric / throttled-request count in logs |
| Server-side failure visibility | 100% of DB-write or Telegram-send failures logged server-side, even though the browser side always proceeds | tracker error logs |
| Filtered-bot-request visibility | 100% of filtered link-preview-crawler requests counted | a reviewable logged counter |

## 6.1 Security / privacy

- **Data classification:** confidential — touches EU data-protection rules (GDPR) because a Labelled link's label may name a real, identifiable person.
- **Personal data touched:** the label Roman himself chooses per outreach (may name a person and/or company) and the derived city of a visit (never the raw IP — AC-12). No third-party personal data beyond what Roman deliberately labels.
- **AuthZ/AuthN impact:** the redirect and event-ingest endpoints are intentionally unauthenticated and public — a Recruiter must be able to use them with no login. The one privileged capability is the manual erase-by-label operation, which is not exposed on any path reachable by a Recruiter or the public (AC-10).
- **Abuse cases:**
  - **Label probing / event forgery or flooding** — mitigated by the per-source rate limit (AC-11); residual risk accepted: a slow, patient prober staying under the throttle could still map some labels over time — accepted at personal scale, the same posture already accepted for `personal-landing`'s own abuse cases.
  - **Label or Referer-header leak of an internal identifier to the Recruiter it names** — partially mitigated by Roman's own discipline of choosing neutral, professional-looking labels; not eliminated (the label persists in the address bar until step 8's client-side scrub runs, and a screenshot or raw copy-paste taken before that can still carry it).
  - **No way to honor a deletion request** — mitigated by the manual, Roman-only erase-by-label capability (AC-08, AC-09, AC-10); residual risk accepted: there is still no proactive retention limit, only on-request deletion, matching the posture the roadmap already flagged as acceptable for personal-scale use (D6).
- **Security review:** Required — this introduces a new store of personal data tied to real, identifiable individuals (Visit history) and a destructive manual operation (the erase capability); review before `sdd:design` finalizes how the erase operation and the rate limit are implemented.

## 7. Metrics / KPIs

- **Notification signal quality** — Roman's own read on the share of View notifications that correspond to a real, distinguishable human open (not a scanner/bot false-positive he can identify after the fact). Baseline: 0 (no visits recorded yet). Target: ≥ 80% within 30 days of first using labelled links in outreach.
- **Time to notify** — median seconds from a visit being recorded to the Telegram message arriving. Baseline: TBD, measured at launch. Target: ≤ 5 s median (at or under the §6 p95 ceiling).
- **Attribution correctness** — share of labelled visits where the notified name matches who Roman actually contacted, with no forwarding/reuse confusion he's aware of. Baseline: 0. Target: ≥ 90%, reviewed manually per contact round.
- **Abuse containment** — count of rate-limit throttling events per week from non-recruiter sources. Baseline: 0. Target: tracked informationally, no ceiling — a non-zero count only confirms the guardrail is doing something.

## 8. Open questions

- [ ] What is the exact rate-limit threshold for the redirect and event-ingest paths (requests per minute per source)? Default now: 30 requests/minute per source IP, an informal guardrail rather than a hard security control. — owner: Roman / design, due: before sdd:design
- [ ] What form does the manual erase capability take — a one-off command Roman runs by hand against the database, or a small dedicated command shipped with the tracker? Default now: a documented manual database operation is enough at personal scale, no new code surface. — owner: Roman / design, due: before sdd:design
- [ ] Should Roman get any periodic visibility into filtered link-preview-crawler volume, or is "logged, reviewable on request" enough? Default now: logged only, no dashboard. — owner: Roman, due: before sdd:tasks
