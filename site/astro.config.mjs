import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Static output — deployed to GitHub Pages, served from the custom apex domain
// romanhrupskyi.com (site/public/CNAME). Root domain → no `base`; the Header's
// `import.meta.env.BASE_URL` stays '/'.
export default defineConfig({
  output: 'static',
  site: 'https://romanhrupskyi.com',
  vite: {
    plugins: [tailwindcss()],
  },
});
