# Reference material

Source documents for the `personal-landing` feature. Not build inputs — inputs to `specify`
(content reconciliation) and to `cv.astro` (visual template).

| File | Role |
|---|---|
| `cv-template-reference.pdf` | **The locked visual template for the generated `cv.pdf`.** `site/src/pages/cv.astro` replicates this layout exactly — two-column (dark header + light sidebar for contact / competencies / languages / education; main column for summary / skills / work-experience timeline), navy accent, section headers with rule + icon marker, A4. Only the data slotted into each section changes; the template and layout do not. See `docs/adr/0004`. |
| `cv-classic-variant.pdf` | The alternate ("Classic") CV. Kept for content reconciliation — `specify` picks the canonical content base and resolves the disagreements between the two (surname spelling, employment dates, years-of-experience). |
| `linkedin-about.md` | Roman's LinkedIn "About" text. Extra context for content reconciliation: the industry breakdown, the sales/project-management background, the AI-tools positioning paragraph. Note it says "over 8 years" where the template PDF says "over 9". |

Known inconsistencies to resolve in `specify` (idea-brief §8): surname is spelled **Hrupskyi**
(page title), **grupskyi** (email), **grupskiy** (LinkedIn); employment date ranges differ between
the two PDFs; experience figure reads "over 9 years" (template PDF), "over 8 years" (LinkedIn), "8"
elsewhere; the 2004→2017 sales / project-management period is described only in the LinkedIn About.

**Resolution note (2026-09-08):** these source docs still carry the old `roman.grupskyi@gmail.com`
address. The canonical contact email is now **`roman@romanhrupskyi.com`** (personal-landing spec §5
/ roadmap D1); the committed CV PDF (`site/public/`) was regenerated the same day to match.
