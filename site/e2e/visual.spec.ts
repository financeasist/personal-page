import { expect, test } from '@playwright/test';

// Visual-regression tier (spec.md §Test plan). Tagged @visual — the default
// `test:e2e` run skips these; `npm run test:visual` runs them. Baselines are
// committed per-platform as e2e/visual.spec.ts-snapshots/. Re-baseline
// deliberately with `npx playwright test --grep @visual --update-snapshots`.
//
// NOTE: baselines are platform-specific (font rendering). CI (Linux) needs its
// own baselines generated once in a Playwright container — see T10 / handoff.

test.describe('@visual', () => {
  test('hero baseline', async ({ page }, testInfo) => {
    await page.goto('/');
    await page.locator('h1').waitFor();
    await expect(page).toHaveScreenshot(`hero-${testInfo.project.name}.png`, {
      fullPage: false,
      maxDiffPixelRatio: 0.03,
    });
  });

  test('condensed header baseline', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'phone', 'condensed header is phone-only');
    await page.goto('/');
    await expect(page.locator('header')).toHaveScreenshot('header-condensed-phone.png', {
      maxDiffPixelRatio: 0.03,
    });
  });

  test('about section baseline', async ({ page }, testInfo) => {
    await page.goto('/');
    await page.locator('#about').scrollIntoViewIfNeeded();
    await expect(page.locator('#about')).toHaveScreenshot(`about-${testInfo.project.name}.png`, {
      maxDiffPixelRatio: 0.03,
    });
  });
});
