/**
 * The single filename-derivation function for the CV download (AC-04).
 *
 * Both the landing page's Download-CV control (`index.astro` / `Header.astro`)
 * and the build-time "file exists" assertion (`scripts/assert-cv-pdf.mjs`) call
 * this — the name is computed once from the Profile content, never hand-copied.
 * Roadmap step 4 (`cv.astro` build-time generation) will produce a file at the
 * same derived name with no control change.
 *
 * Pure and dependency-free — importable from `.astro` frontmatter and a Node
 * script alike. Ported from the derivation in `scripts/generate-pdf.mjs`, with
 * dash-run collapsing added (edge rows in the T3 task).
 */

/** NFKD-fold, strip non-`[A-Za-z0-9_ -]`, collapse space/dash runs to one `-`. */
function slug(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function cvFilename({ name, headline }: { name: string; headline: string }): string {
  const headlineLead = headline.split('|')[0].trim();
  return `${slug(name)}-${slug(headlineLead)}-CV.pdf`;
}
