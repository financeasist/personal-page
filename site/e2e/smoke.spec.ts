import { expect, test } from '@playwright/test';

// T1 smoke — e2e-through-UI tier. Loads the REAL built page (served by
// `astro preview`) and asserts it renders. Runs at both reference viewports
// (laptop + phone projects, playwright.config.ts). The AC-driven flows land in
// T6–T9.
test('landing page renders with a single top-level heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toBeVisible();
});

test('no horizontal scroll at the current viewport', async ({ page }) => {
  await page.goto('/');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
