# Tracker — personal-landing

> Status of every task in the epic. `implement` updates `done` as it commits each task.
> States: `todo` · `in_progress` · `blocked` · `review` · `done`.

| # | Task | Layer | Owner | Estimate | Blocked by | Status |
|---|---|---|---|---|---|---|
| T1 | Set up the site test harness | tests | Roman | S | — | done |
| T2 | Profile content schema + invariants + `roman.json` reshape | domain | Roman | M | T1 | todo |
| T3 | Shared CV-filename helper | app | Roman | S | T1 | todo |
| T4 | Committed CV PDF + build-time "file exists" assertion | wiring | Roman | S | T3 | todo |
| T5 | Design tokens + page shell (`Layout`) + `Footer` | ui | Roman | S | T1 | todo |
| T6 | `Header` — contact actions + mobile `<details>` menu | ui | Roman | M | T1, T3, T5 | todo |
| T7 | `Hero` + `AvailabilityBlock` + optional `Industries` | ui | Roman | M | T1, T2, T5 | todo |
| T8 | About section — `Section` + `AboutMe` | ui | Roman | S | T1, T2, T5 | todo |
| T9 | Assemble `index.astro` | ui | Roman | S | T1, T2, T5, T6, T7, T8 | todo |
| T10 | Build + CI wiring | wiring | Roman | S | T4, T9 | todo |
| T11 | Register components in the design canon | docs | Roman | S | T9 | todo |

**Total:** 11 tasks, ~6–7 person-days.
