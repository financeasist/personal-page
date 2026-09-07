import { defineConfig, devices } from '@playwright/test';

// e2e-through-UI + visual-regression tier (spec.md §Test plan). Drives the REAL
// static build output (`astro build` → `astro preview`) at the two reference
// viewports: 1280×800 laptop and 390×844 phone (spec.md §6). Visual baselines
// are committed next to each spec under e2e/ as `<file>-snapshots/`.
const PORT = 4321;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  // One shared build; `astro preview` serves `dist/` exactly as GitHub Pages will.
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --host`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  projects: [
    {
      name: 'laptop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'phone',
      // 390×844 — iPhone-class. Keep an explicit viewport rather than a device
      // preset so the number matches spec.md §6 exactly.
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } },
    },
  ],
});
