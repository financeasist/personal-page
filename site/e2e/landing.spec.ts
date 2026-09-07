import { expect, test } from '@playwright/test';

// T9 — the assembled landing page driven through the built static output at
// both reference viewports (playwright.config.ts: laptop 1280×800 / phone
// 390×844). Structural / source assertions live in the Vitest build tier;
// this file owns the behaviour that needs a real browser.

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('AC-01 — every above-the-fold essential is visible', async ({ page }) => {
  await expect(page.locator('h1')).toHaveText('Roman Hrupskyi');
  await expect(page.getByText('Senior Java Engineer | Lead Backend Engineer').first()).toBeVisible();
  await expect(page.getByText('Open to Remote & Hybrid Opportunities')).toBeVisible();
  await expect(page.getByText('Krakow, Poland')).toBeVisible();
  await expect(page.locator('.hero__chips li')).toHaveCount(8);
  await expect(page.locator('img').first()).toBeVisible();
  await expect(page.locator('[data-contact-channel="email"]').first()).toBeVisible();
  await expect(page.locator('[data-contact-channel="linkedin"]').first()).toBeVisible();
});

test('AC-01 / AC-08 — every above-the-fold essential sits within the fold, no scrolling', async ({
  page,
}, testInfo) => {
  // `toBeVisible()` is true for an element rendered below the viewport, so the
  // fold guarantee ("visible without scrolling at 1280×800 and 390×844",
  // spec.md §6 "Above-the-fold fit (binding)") needs an explicit geometry check.
  // The optional Industries list and Tagline are NOT essentials — when the hero
  // would overflow the phone fold they collapse per the §6 drop order; only the
  // AC-01 canonical essentials are asserted here.
  const viewportHeight = page.viewportSize()!.height;
  const essentials: Record<string, ReturnType<typeof page.locator>> = {
    headshot: page.locator('.hero__photo'),
    name: page.locator('h1'),
    headline: page.locator('.hero__headline'),
    'availability + location': page.locator('.availability'),
    'top stack': page.locator('.hero__stack'),
  };
  for (const [label, locator] of Object.entries(essentials)) {
    const box = await locator.boundingBox();
    expect(box, `${label}: has a layout box`).not.toBeNull();
    expect(
      Math.round(box!.y + box!.height),
      `${label}: bottom edge within the ${viewportHeight}px fold at ${testInfo.project.name}`,
    ).toBeLessThanOrEqual(viewportHeight);
  }
});

test('AC-02 — the email action hands off a pre-addressed mailto', async ({ page }) => {
  const href = await page
    .locator('[data-contact-channel="email"]')
    .first()
    .getAttribute('href');
  expect(href).toBe('mailto:roman.grupskyi@gmail.com');
});

test('AC-13 — LinkedIn opens a new tab; Download CV is a file download', async ({
  page,
  context,
}, testInfo) => {
  const li = page.locator('[data-contact-channel="linkedin"]').first();
  expect(await li.getAttribute('target')).toBe('_blank');
  expect(await li.getAttribute('rel')).toContain('noopener');

  // Download CV — visible inline on laptop, inside the menu on phone.
  if (testInfo.project.name === 'phone') {
    await page.locator('header details > summary').click();
  }
  const cv = page.locator('a[data-cv-download]:visible').first();
  await expect(cv).toHaveAttribute('download', '');
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    cv.click(),
  ]);
  expect(download.suggestedFilename()).toBe('Roman-Hrupskyi-Senior-Java-Engineer-CV.pdf');
  void context;
});

test('AC-08 — phone header: icon controls + native <details> menu, all tap targets ≥ 44×44', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'phone', 'phone viewport only');

  for (const sel of ['[data-contact-channel="linkedin"]', '[data-contact-channel="email"]']) {
    const box = await page.locator(sel).first().boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }

  // Inline About / Download CV are hidden until the menu opens.
  await expect(page.locator('.site-header__action--inline').first()).toBeHidden();

  const summary = page.locator('header details > summary');
  const summaryBox = await summary.boundingBox();
  expect(summaryBox!.width).toBeGreaterThanOrEqual(44);
  expect(summaryBox!.height).toBeGreaterThanOrEqual(44);

  await summary.click();
  const menu = page.locator('.site-header__menu-panel');
  await expect(menu.getByRole('link', { name: 'About me' })).toBeVisible();
  await expect(menu.locator('a[data-cv-download]')).toBeVisible();
  for (const item of await menu.locator('a').all()) {
    const box = await item.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
});

test('AC-08 — the header menu works with JavaScript disabled', async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== 'phone', 'phone viewport only');
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto('/');
  const details = page.locator('header details');
  await expect(details).not.toHaveAttribute('open', /.*/);
  await page.locator('header details > summary').click();
  await expect(details).toHaveAttribute('open', '');
  await expect(page.locator('.site-header__menu-panel a[data-cv-download]')).toBeVisible();
  await context.close();
});

test('AC-08 — header focus order is Name → LinkedIn → email → About → Download CV', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'laptop', 'inline actions — laptop viewport');
  const ids: string[] = [];
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('Tab');
    ids.push(
      await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el) return '?';
        if (el.dataset.contactChannel) return el.dataset.contactChannel;
        if (el.hasAttribute('data-cv-download')) return 'cv';
        const href = el.getAttribute('href') ?? '';
        return href.startsWith('#') ? href : 'name';
      }),
    );
  }
  expect(ids).toEqual(['name', 'linkedin', 'email', '#about', 'cv']);
});

test('AC-14 — About sits below the fold and reflows to one column ≥ 16px on phone', async ({
  page,
}, testInfo) => {
  const about = page.locator('#about');
  const box = await about.boundingBox();
  const viewportHeight = page.viewportSize()!.height;
  expect(box!.y).toBeGreaterThanOrEqual(viewportHeight); // below the fold at load

  const bodyFontOk = await about.evaluate((el) => {
    const p = el.querySelector('.about__narrative p') as HTMLElement;
    return parseFloat(getComputedStyle(p).fontSize) >= 16;
  });
  expect(bodyFontOk).toBe(true);

  if (testInfo.project.name === 'phone') {
    const stacked = await about.evaluate((el) => {
      const grid = el.querySelector('.about') as HTMLElement;
      return getComputedStyle(grid).gridTemplateColumns.split(' ').length === 1;
    });
    expect(stacked).toBe(true);
  }
});
