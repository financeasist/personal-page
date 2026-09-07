import { execFileSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { afterAll, describe, expect, it } from 'vitest';

// T1 smoke — build-pipeline integration tier. The "real dependency" under
// integration test in this feature is the Astro build itself (spec.md §Test plan
// › Integration strategy). This asserts a clean `astro build` produces the page;
// T2/T4 layer the fixture-driven failure assertions on top.
const siteRoot = fileURLToPath(new URL('../../', import.meta.url));
const dist = fileURLToPath(new URL('../../dist/', import.meta.url));

describe('astro build pipeline', () => {
  afterAll(() => {
    rmSync(dist, { recursive: true, force: true });
  });

  it('produces dist/index.html from the current content', () => {
    execFileSync('npx', ['astro', 'build'], { cwd: siteRoot, stdio: 'pipe' });
    expect(existsSync(`${dist}index.html`)).toBe(true);
  }, 120_000);
});
