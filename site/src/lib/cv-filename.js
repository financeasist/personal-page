/**
 * The single filename-derivation function for the CV download (AC-04).
 *
 * Both the landing page's Download-CV control (`Header.astro`) and the
 * build-time "file exists" assertion (`scripts/assert-cv-pdf.mjs`) call this —
 * the name is computed once from the Profile content, never hand-copied.
 * Roadmap step 4 (`cv.astro` build-time generation) will produce a file at the
 * same derived name with no control change.
 *
 * Plain ESM (not `.ts`) so a Node script can `import` it directly — Node 20
 * cannot load TypeScript. Pure and dependency-free. Ported from the derivation
 * in `scripts/generate-pdf.mjs`, with dash-run collapsing added (T3 edge rows).
 */

/** NFKD-fold, strip non-`[A-Za-z0-9_ -]`, collapse space/dash runs to one `-`. */
function slug(value) {
  return value
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * @param {{ name: string, headline: string }} profile
 * @returns {string} e.g. `Roman-Hrupskyi-Senior-Java-Engineer-CV.pdf`
 */
export function cvFilename({ name, headline }) {
  const headlineLead = headline.split('|')[0].trim();
  return `${slug(name)}-${slug(headlineLead)}-CV.pdf`;
}
