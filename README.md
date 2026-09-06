# personal-landing

Roman's recruiter landing page + a cookieless visit tracker. Monorepo, two independent apps.

| App | Path | Stack | Hosting |
|---|---|---|---|
| **site** | [`site/`](site/) | Astro 5 (static), TypeScript, Tailwind v4 | GitHub Pages |
| **tracker** | [`tracker/`](tracker/) | Java 21, Spring Boot 3.5, Spring Data JDBC, Flyway, Postgres | Fly.io (`waw`) |

The site is the **single source of truth** for profile content: the landing page and the
generated CV PDF are both rendered from one typed Astro content collection
(`site/src/data/profile/`). The CV PDF is a build artifact (`postbuild` → headless Chromium
renders `/cv`), never a committed file.

Architecture, conventions and ADRs live in [`docs/`](docs/) — start with
[`docs/architecture-map.md`](docs/architecture-map.md).

## Run the site

Requires **Node 20+**.

```bash
npm --prefix site install
npm --prefix site run dev      # http://localhost:4321
npm --prefix site run build    # -> site/dist/ + the named CV PDF
npm --prefix site run check    # astro check (types)
```

## Run the tracker

Requires **JDK 21+** and a running **Docker** daemon (Testcontainers).

```bash
./mvnw -f tracker/pom.xml test      # unit + @SpringBootTest (Testcontainers Postgres)
./mvnw -f tracker/pom.xml package   # build the jar
./mvnw -f tracker/pom.xml spring-boot:run   # needs a local Postgres + env (see tracker/README)
```

`GET /healthz` → `200` once booted.
