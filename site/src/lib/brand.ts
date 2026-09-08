/**
 * Shared brand-asset paths — kept in one place so the generator, the page shell
 * and the structured data can't drift apart.
 *
 * `OG_IMAGE_PATH` is the generated 1200×630 share card
 * (`scripts/gen-brand-images.mjs` writes `public/og-image.png` from the single
 * source avatar `docs/reference/avatar-favicon.png`). `Layout.astro` links it as
 * `og:image`; `profile-jsonld.ts` points `Person.image` at the same file. Bump
 * the `?v=` query when the art changes so caches refresh.
 */
export const OG_IMAGE_PATH = '/og-image.png?v=4';
