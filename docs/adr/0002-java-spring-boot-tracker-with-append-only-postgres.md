---
status: Accepted
owner: "Roman (roman.grupskyi@gmail.com)"
reviewers: []
updated_at: "2026-09-06"
feature_size: "greenfield-foundation"
ticket: "docs/idea-brief.md"
---

# 0002 — Build the tracking service as a Java / Spring Boot app over an append-only Postgres log

- **Status:** Accepted
- **Date:** 2026-09-06
- **Deciders:** Roman + survey (greenfield foundation session)

## Context

The static page cannot, on its own, do self-labelled per-recruiter links, cookieless visit analytics,
or a real-time "your page was viewed" notification (idea-brief §6). A small server component is
required. Roman explicitly wants it in Java, and Telegram is an acceptable notification channel.

## Decision drivers

- Self-labelled per-recruiter links for "who"; cookieless city/referrer/click analytics; real-time
  view notification (idea-brief §7).
- The redirect (`/t/{label}`) is on a recruiter's click path — it must be fast.
- Must stay small and must not grow into the deferred admin backend (idea-brief §5, §6).
- Roman's stated constraint: Java. Roman's infra: Fly.io + Supabase (chosen in this session).

## Considered options

1. **Java 21 + Spring Boot 3.5, Maven, Spring Data JDBC, Flyway, Postgres (Supabase), Fly.io** —
   append-only `visit_event` log + a small `recruiter_link` table; Telegram Bot API via `RestClient`.
2. **Edge worker (Cloudflare Workers + D1)** — lowest latency and one platform, but not Java.
3. **Spring Boot + JPA/Hibernate** — same stack, heavier persistence layer for what is an
   insert-and-scan event log.

## Decision outcome

**Chosen:** Option 1. It honours the Java constraint, keeps the persistence layer thin (Data JDBC,
no ORM) which suits an append-only log, and runs as one warm Fly.io machine in `waw` so the redirect
never waits on a cold JVM. Option 2 fails the Java constraint. Option 3 adds ORM complexity with no
payoff for insert-mostly access.

## Consequences

**Positive**
- Familiar stack for Roman; the repo itself becomes a work sample.
- Append-only + Data JDBC keeps the data layer simple and auditable (no update/delete paths).
- Flyway-on-boot means schema changes ship with the app, no separate migration step.

**Negative**
- A warm JVM machine costs ~$2–4/mo (vs. $0 scale-to-zero) — the deliberate price of redirect latency.
- Java 21 chosen over the newer Java 25 LTS for maximum tooling/base-image compatibility; revisit at
  a later upgrade.
- Two deploy targets (Pages + Fly) instead of one platform.

**Neutral**
- Supabase Postgres is swappable for any other managed Postgres (Neon, Fly PG) — connection string
  only.
- Telegram can be replaced with email later; the notifier is one class behind an interface.

## Links

- Idea brief: [[../idea-brief.md]]
- Architecture map: [[../architecture-map.md]] §Stack, §Datastores, §Conventions
- Related ADR: [[0003-monorepo-layout-for-site-and-tracker]]
