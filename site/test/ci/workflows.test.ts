import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// T10 — the deploy path (push to main) must enforce the same content gate the
// PR path does, and the now-dead Chromium install is gone (ADR-0008, AC-05/06
// CI-enforcement half).
const repoRoot = fileURLToPath(new URL('../../../', import.meta.url));
const ci = readFileSync(`${repoRoot}.github/workflows/ci.yml`, 'utf8');
const deploy = readFileSync(`${repoRoot}.github/workflows/deploy.yml`, 'utf8');

describe('.github/workflows — site jobs', () => {
  it('neither job installs Playwright/Chromium any more', () => {
    expect(ci).not.toMatch(/playwright install/);
    expect(deploy).not.toMatch(/playwright install/);
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
