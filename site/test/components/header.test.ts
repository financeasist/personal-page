import { beforeAll, describe, expect, it } from 'vitest';
import { buildFixture, type BuildResult } from '../helpers/build-fixture';
import { validProfile } from '../fixtures/profile';

// T6 — Header. AC-02 / AC-07 / AC-10 / AC-13 structural half (the viewport,
// JS-disabled and tap-target halves are verified through the browser in T9).
const P = validProfile();
const PROBE = `---
import Header from '../components/Header.astro';
const p = ${JSON.stringify(P)};
---
<html lang="en"><head><title>hdr</title></head><body>
<Header name={p.name} headline={p.headline} email={p.contact.email} links={p.contact.links} />
<main id="about"><h1>x</h1></main>
</body></html>
`;

let build: BuildResult;
let doc: Document;

beforeAll(() => {
  build = buildFixture({ pages: { 'zz-header.astro': PROBE } });
  if (!build.ok) throw new Error(build.stderr);
  doc = build.html('/zz-header');
});

describe('Header.astro', () => {
  it('is one <header> landmark, CSS-only (no script / island)', () => {
    expect(doc.querySelectorAll('header')).toHaveLength(1);
    expect(doc.querySelectorAll('script')).toHaveLength(0);
    expect(doc.querySelectorAll('astro-island')).toHaveLength(0);
  });

  it('email control: mailto in href, addressed to Roman, value never in text (AC-02, AC-10)', () => {
    const email = doc.querySelector('a[data-contact-channel="email"]')!;
    expect(email.getAttribute('href')).toBe(`mailto:${P.contact.email}`);
    expect(email.textContent).not.toContain(P.contact.email);
    expect(email.getAttribute('aria-label')).toBeTruthy();
  });

  it('LinkedIn control: url in href, opens a new tab with rel=noopener, value never in text (AC-13, AC-10)', () => {
    const li = doc.querySelector('a[data-contact-channel="linkedin"]')!;
    expect(li.getAttribute('href')).toBe(P.contact.links[0].url);
    expect(li.getAttribute('target')).toBe('_blank');
    expect(li.getAttribute('rel') ?? '').toContain('noopener');
    expect(li.textContent).not.toContain('linkedin.com');
  });

  it('Download CV control: derived filename, download attribute, step-8 hook (AC-04, AC-13)', () => {
    const cv = doc.querySelectorAll('a[data-cv-download]');
    expect(cv.length).toBeGreaterThanOrEqual(1);
    for (const el of cv) {
      expect(el.getAttribute('href')).toMatch(/Jordan-Rivera-Senior-Java-Engineer-CV\.pdf$/);
      expect(el.hasAttribute('download')).toBe(true);
    }
  });

  it('phone menu is a native <details>/<summary> disclosure holding About + Download CV (AC-08)', () => {
    const details = doc.querySelector('header details')!;
    expect(details).not.toBeNull();
    expect(details.querySelector('summary')).not.toBeNull();
    const items = Array.from(details.querySelectorAll('a')).map((a) => a.getAttribute('href'));
    expect(items).toContain('#about');
    expect(items.some((h) => /-CV\.pdf$/.test(h ?? ''))).toBe(true);
  });

  it('exposes no contact value as visible text anywhere on the page (AC-07, AC-10)', () => {
    const text = doc.body.textContent ?? '';
    expect(text).not.toContain(P.contact.email);
    expect(text).not.toContain('linkedin.com');
    for (const phone of P.contact.phones) expect(text).not.toContain(phone);
  });

  it('focus/DOM order is Name → LinkedIn → email → About → Download CV (screens SCR-01)', () => {
    const focusables = Array.from(
      doc.querySelectorAll('header a, header summary'),
    ).map((el) =>
      el.tagName.toLowerCase() === 'summary'
        ? 'menu'
        : (el.getAttribute('data-contact-channel') ??
          (el.hasAttribute('data-cv-download')
            ? 'cv'
            : (el.getAttribute('href') ?? '').replace(import.meta.env.BASE_URL, '') || 'name')),
    );
    // first five, ignoring the duplicated menu entries
    expect(focusables.slice(0, 5)).toEqual(['name', 'linkedin', 'email', '#about', 'cv']);
  });
});
