/**
 * Regenerates the favicon set in `public/favicon/` from the single source
 * avatar (`docs/reference/avatar-favicon.png`). Run from `site/`:
 *
 *   node scripts/gen-favicons.mjs
 *
 * The source is a square, transparent-background cartoon. The browser-tab PNGs
 * keep the transparency; the Apple touch icon is flattened onto white because
 * iOS composites transparent icons onto black. `Layout.astro` links these four
 * files (bump the `?v=` query there when the art changes so caches refresh).
 *
 * `sharp` ships with Astro — no extra dependency. Plain ESM so Node 20 runs it
 * directly, matching the other `scripts/` generators.
 */
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const src = fileURLToPath(new URL('../../docs/reference/avatar-favicon.png', import.meta.url));
const outDir = fileURLToPath(new URL('../public/favicon/', import.meta.url));

/** Browser-tab icons — transparency preserved. */
const tabIcons = [16, 32, 48];
/** Apple touch icon — opaque, flattened on white (iOS ignores transparency). */
const appleTouch = { size: 180, name: 'apple-touch-icon.png', background: '#ffffff' };

for (const size of tabIcons) {
  await sharp(src)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(`${outDir}favicon-${size}.png`);
  console.log(`favicon-${size}.png`);
}

await sharp(src)
  .resize(appleTouch.size, appleTouch.size, { fit: 'contain', background: appleTouch.background })
  .flatten({ background: appleTouch.background })
  .png()
  .toFile(`${outDir}${appleTouch.name}`);
console.log(appleTouch.name);
