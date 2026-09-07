import { expect, test } from '@playwright/test';

// Shared responsive guard (spec.md §6 / QG-3 / E17): no horizontal scroll at
// 360 / 768 / 1280 / 1920 px. T5 stands this up against the page shell; T9
// re-runs it against the fully assembled landing page.
const WIDTHS = [360, 768, 1280, 1920];

for (const width of WIDTHS) {
  test(`no horizontal scroll at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `document overflows horizontally at ${width}px`).toBeLessThanOrEqual(0);
  });
}
