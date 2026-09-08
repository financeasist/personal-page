import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Static output — deployed to GitHub Pages, served from the custom apex domain
// romanhrupskyi.com (site/public/CNAME). Root domain → no `base`; the Header's
// `import.meta.env.BASE_URL` stays '/'.
export default defineConfig({
  output: 'static',
  site: 'https://romanhrupskyi.com',
  integrations: [
    // Emits sitemap-index.xml + sitemap-0.xml (referenced from public/robots.txt).
    // The CV print route is a build-time PDF-rendering target with no inbound
    // links and stub content — keep it out of the index.
    sitemap({ filter: (page) => !page.startsWith('https://romanhrupskyi.com/cv') }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
