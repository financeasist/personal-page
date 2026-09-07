# Tracker — personal-landing

> Status of every task in the epic. `implement` updates `done` as it commits each task.
> States: `todo` · `in_progress` · `blocked` · `review` · `done`.

| # | Task | Layer | Owner | Estimate | Blocked by | Status |
|---|---|---|---|---|---|---|
| T1 | Set up the site test harness | tests | Roman | S | — | done |
| T2 | Profile content schema + invariants + `roman.json` reshape | domain | Roman | M | T1 | done |
| T3 | Shared CV-filename helper | app | Roman | S | T1 | done |
| T4 | Committed CV PDF + build-time "file exists" assertion | wiring | Roman | S | T3 | done |
| T5 | Design tokens + page shell (`Layout`) + `Footer` | ui | Roman | S | T1 | done |
| T6 | `Header` — contact actions + mobile `<details>` menu | ui | Roman | M | T1, T3, T5 | done |
| T7 | `Hero` + `AvailabilityBlock` + optional `Industries` | ui | Roman | M | T1, T2, T5 | done |
| T8 | About section — `Section` + `AboutMe` | ui | Roman | S | T1, T2, T5 | done |
| T9 | Assemble `index.astro` | ui | Roman | S | T1, T2, T5, T6, T7, T8 | done |
| T10 | Build + CI wiring | wiring | Roman | S | T4, T9 | done |
| T11 | Register components in the design canon | docs | Roman | S | T9 | done |

**Total:** 11 tasks, ~6–7 person-days.
