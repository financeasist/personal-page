/**
 * Regenerates every raster image derived from the single source avatar
 * (`docs/reference/avatar-favicon.png`) — the browser favicons and the social
 * share card. Run from `site/`:
 *
 *   npm run gen:brand-images
 *
 * The source is a square, transparent-background cartoon.
 *   - favicon-16/32/48  → transparency kept (browser tab).
 *   - apple-touch-icon   → 180², flattened on white (iOS composites onto black).
 *   - og-image           → 1200×630, avatar centred on the brand navy, for
 *                          Open Graph / Twitter previews (Layout.astro).
 *
 * `Layout.astro` links these files — bump the `?v=` there when the art changes
 * so caches refresh. `sharp` ships with Astro; plain ESM so Node 20 runs it
 * directly, matching the other `scripts/` generators.
 */
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const src = fileURLToPath(new URL('../../docs/reference/avatar-favicon.png', import.meta.url));
const publicDir = fileURLToPath(new URL('../public/', import.meta.url));

const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };
const NAVY = { r: 31, g: 42, b: 63, alpha: 1 }; // --color-navy-dark (#1f2a3f)
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

/** Browser-tab icons — transparency preserved. */
for (const size of [16, 32, 48]) {
  await sharp(src)
    .resize(size, size, { fit: 'contain', background: TRANSPARENT })
    .png()
    .toFile(`${publicDir}favicon/favicon-${size}.png`);
  console.log(`favicon/favicon-${size}.png`);
}

/** Apple touch icon — opaque, flattened on white. */
await sharp(src)
  .resize(180, 180, { fit: 'contain', background: WHITE })
  .flatten({ background: WHITE })
  .png()
  .toFile(`${publicDir}favicon/apple-touch-icon.png`);
console.log('favicon/apple-touch-icon.png');

/** Social share card — avatar centred on the brand navy, 1200×630. */
await sharp(src)
  .resize(600, 600, { fit: 'contain', background: TRANSPARENT })
  .extend({ top: 15, bottom: 15, left: 300, right: 300, background: NAVY })
  .flatten({ background: NAVY })
  .png()
  .toFile(`${publicDir}og-image.png`);
console.log('og-image.png');
