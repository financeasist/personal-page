import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

// Contact email is content — read it from the committed profile rather than
// pin a literal (it moved to the apex domain on 2026-09-08).
const profileEmail = (
  JSON.parse(
    readFileSync(new URL('../src/data/profile/roman.json', import.meta.url), 'utf8'),
  ) as { contact: { email: string } }
).contact.email;

// T9 — the assembled landing page driven through the built static output at
// both reference viewports (playwright.config.ts: laptop 1280×800 / phone
// 390×844). Structural / source assertions live in the Vitest build tier;
// this file owns the behaviour that needs a real browser.

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('AC-01 — every hero essential renders from content', async ({ page }) => {
  await expect(page.locator('h1')).toHaveText('Roman Hrupskyi');
  await expect(page.getByText('Senior Java Engineer | Lead Backend Engineer').first()).toBeVisible();
  await expect(page.getByText('Open to Remote & Hybrid Opportunities')).toBeVisible();
  await expect(page.getByText('Krakow, Poland')).toBeVisible();
  await expect(page.locator('.hero__photo')).toBeVisible();
  await expect(page.locator('[data-contact-channel="email"]').first()).toBeVisible();
  await expect(page.locator('[data-contact-channel="linkedin"]').first()).toBeVisible();

  // The top stack is an AC-01 essential rendered as one line (screens.pen
  // redesign — no longer chips). Every technology from the content is present…
  const stack = page.locator('.hero__stack');
  await expect(stack).toContainText('Java');
  await expect(stack).toContainText('Kubernetes');
  // …and AC-08 "all text is legible" / spec §6 "body text ≥ 16px" holds for it.
  const stackFont = await page
    .locator('.hero__stack-text')
    .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(stackFont).toBeGreaterThanOrEqual(16);
});

test('AC-01 / AC-08 — the hero reads top-to-bottom with no horizontal scroll', async ({
  page,
}, testInfo) => {
  // The redesign (screens.pen) drops the binding "everything within the fold"
  // constraint — the page is a natural vertical flow. What still holds: the
  // essentials are on the page, in reading order, and the document never scrolls
  // sideways at either reference viewport.
  const order = ['.hero__photo', 'h1', '.hero__rule', '.hero__headline', '.hero__stack'];
  let previousBottom = -1;
  for (const selector of order) {
    const box = await page.locator(selector).boundingBox();
    expect(box, `${selector}: has a layout box`).not.toBeNull();
    expect(
      box!.y,
      `${selector} follows the previous essential at ${testInfo.project.name}`,
    ).toBeGreaterThanOrEqual(previousBottom - 1);
    previousBottom = box!.y + box!.height;
  }

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow, `no horizontal scroll at ${testInfo.project.name}`).toBeLessThanOrEqual(0);
});

test('AC-02 — the email action hands off a pre-addressed mailto', async ({ page }) => {
  const href = await page
    .locator('[data-contact-channel="email"]')
    .first()
    .getAttribute('href');
  expect(href).toBe(`mailto:${profileEmail}`);
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

test('AC-14 — About follows the hero and reflows to one column ≥ 16px on phone', async ({
  page,
}, testInfo) => {
  const about = page.locator('#about');
  const aboutBox = await about.boundingBox();
  const heroBox = await page.locator('.hero__stack').boundingBox();
  // The redesign drops "below the fold at load"; About still comes after the
  // whole hero in the flow.
  expect(aboutBox!.y).toBeGreaterThanOrEqual(heroBox!.y + heroBox!.height - 1);

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
