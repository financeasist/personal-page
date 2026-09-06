# Reference material

Source documents for the `personal-landing` feature. Not build inputs — inputs to `specify`
(content reconciliation) and to `cv.astro` (visual template).

| File | Role |
|---|---|
| `cv-template-reference.pdf` | **The locked visual template for the generated `cv.pdf`.** `site/src/pages/cv.astro` replicates this layout exactly — two-column (dark header + light sidebar for contact / competencies / languages / education; main column for summary / skills / work-experience timeline), navy accent, section headers with rule + icon marker, A4. Only the data slotted into each section changes; the template and layout do not. See `docs/adr/0004`. |
| `cv-classic-variant.pdf` | The alternate ("Classic") CV. Kept for content reconciliation — `specify` picks the canonical content base and resolves the disagreements between the two (surname spelling, employment dates, years-of-experience). |

Known inconsistencies to resolve in `specify` (idea-brief §8): surname is spelled **Hrupskyi**
(page title), **grupskyi** (email), **grupskiy** (LinkedIn); employment date ranges differ between
the two PDFs; "over 9 years" vs "8" experience figure.
