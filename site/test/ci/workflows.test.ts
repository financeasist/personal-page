import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// T10 — the deploy path (push to main) must enforce the same content gate the
// PR path does. The PR path also runs the e2e-through-UI tier (spec.md §Test
// plan CI placement: "Every PR (heavier, still gating)"); the CV-PDF postbuild
// no longer needs Chromium (ADR-0008), so the deploy path installs no browser.
const repoRoot = fileURLToPath(new URL('../../../', import.meta.url));
const ci = readFileSync(`${repoRoot}.github/workflows/ci.yml`, 'utf8');
const deploy = readFileSync(`${repoRoot}.github/workflows/deploy.yml`, 'utf8');

describe('.github/workflows — site jobs', () => {
  it('the PR job installs a browser and runs the gating e2e tier', () => {
    expect(ci).toMatch(/playwright install .*chromium/);
    expect(ci).toContain('npm run test:e2e');
  });

  it('the deploy job installs no browser — its postbuild no longer needs one (ADR-0008)', () => {
    expect(deploy).not.toMatch(/playwright install/);
  });

  it('the PR job runs the browser tier only after the build it drives', () => {
    const site = ci.slice(ci.indexOf('jobs:'), ci.indexOf('tracker:'));
    expect(site.indexOf('npm run build')).toBeLessThan(site.indexOf('npm run test:e2e'));
  });

  it('the deploy job type-checks and runs the invariant tests before building', () => {
    const site = deploy.slice(deploy.indexOf('jobs:'));
    const order = ['npm run check', 'npm test', 'npm run build'];
    const positions = order.map((step) => site.indexOf(step));
    expect(positions.every((p) => p >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('the PR job still runs check + test + build for the site', () => {
    for (const step of ['npm run check', 'npm test', 'npm run build']) {
      expect(ci).toContain(step);
    }
  });
});
