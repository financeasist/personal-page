import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Static output — deployed to GitHub Pages.
// LAUNCH-CHECKLIST TODO (docs/features/personal-landing/launch-checklist.md):
// set `site: 'https://<user>.github.io'` and, for a project page, `base:
// '/landingpage'`, once the Pages URL is confirmed. The Header derives absolute
// hrefs from `import.meta.env.BASE_URL`, so setting `base` here is all that is
// needed — no component change.
export default defineConfig({
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
