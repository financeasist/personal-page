import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Static output — deployed to GitHub Pages. `site` / `base` are set once the
// Pages URL is known (personal-landing feature work).
export default defineConfig({
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
