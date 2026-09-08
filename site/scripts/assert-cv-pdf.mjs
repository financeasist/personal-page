// postbuild — assert the committed CV PDF exists (ADR-0008, spec.md §1, AC-04 /
// AC-05 CV channel). v1 ships a hand-maintained PDF under `site/public/`; a
// missing or empty file fails the build rather than shipping a dead
// Download-CV link. Build-time generation of `/cv` returns with roadmap step 4
// (see scripts/generate-pdf.mjs, deferred).
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { cvFilename } from '../src/lib/cv-filename.js';

const profilePath = new URL('../src/data/profile/roman.json', import.meta.url);
const profile = JSON.parse(await readFile(profilePath, 'utf8'));

const filename = cvFilename({ name: profile.name, headline: profile.headline });
const expected = new URL(`../public/${filename}`, import.meta.url);
const expectedPath = fileURLToPath(expected);

let size = -1;
try {
  size = (await stat(expected)).size;
} catch {
  /* missing — handled below */
}

if (size <= 0) {
  console.error(
    `\n[assert-cv-pdf] Missing committed CV PDF.\n` +
      `  expected a non-empty file at: ${expectedPath}\n` +
      `  derived from profile name + headline via src/lib/cv-filename.js.\n` +
      `  Commit the reconciled CV PDF there (ADR-0008), or if name/headline\n` +
      `  changed, rename the committed file to match.\n`,
  );
  process.exit(1);
}

console.log(`[assert-cv-pdf] ok — public/${filename} (${size} bytes)`);
