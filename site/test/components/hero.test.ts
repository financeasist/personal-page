import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { buildFixture, type BuildResult } from '../helpers/build-fixture';
import { industriesOmittedProfile, validProfile } from '../fixtures/profile';

// T7 — Hero + AvailabilityBlock + Industries. AC-01 essentials, AC-15 optional
// industries. Viewport / no-scroll checks run through the browser in T9.
const P = validProfile();

function probe(varName: string, profileExpr: string): string {
  return `---
import Hero from '../components/Hero.astro';
const ${varName} = ${profileExpr};
---
<html lang="en"><head><title>hero</title></head><body><main>
<Hero name={${varName}.name} headline={${varName}.headline} tagline={${varName}.tagline}
  topStack={${varName}.topStack} headshot={${varName}.headshot} location={${varName}.contact.location}
  availability={${varName}.availability} industries={${varName}.industries} />
</main></body></html>
`;
}

let withIndustries: BuildResult;
let noIndustries: BuildResult;
let doc: Document;

beforeAll(() => {
  withIndustries = buildFixture({
    pages: { 'zz-hero.astro': probe('p', JSON.stringify(P)) },
  });
  noIndustries = buildFixture({
    pages: { 'zz-hero-plain.astro': probe('p', JSON.stringify(industriesOmittedProfile())) },
  });
  if (!withIndustries.ok) throw new Error(withIndustries.stderr);
  if (!noIndustries.ok) throw new Error(noIndustries.stderr);
  doc = withIndustries.html('/zz-hero');
});

describe('Hero — AC-01 essentials render from content', () => {
  it('name is the single <h1>', () => {
    const h1s = doc.querySelectorAll('h1');
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toBe(P.name);
  });

  it('headline and tagline are verbatim from content — no hard-coded copy', () => {
    const text = doc.body.textContent ?? '';
    expect(text).toContain(P.headline);
    expect(text).toContain(P.tagline!);
  });

  it('availability status + location are shown', () => {
    const text = doc.body.textContent ?? '';
    expect(text).toContain(P.availability.status);
    expect(text).toContain(P.contact.location);
  });

  it('every top-stack technology is listed', () => {
    const chips = Array.from(doc.querySelectorAll('.hero__chips li')).map((li) => li.textContent);
    for (const tech of P.topStack) expect(chips).toContain(tech);
  });

  it('headshot: astro:assets output, content alt text, eager + high priority', () => {
    const img = doc.querySelector('img')!;
    expect(img.getAttribute('alt')).toBe(P.headshot.alt);
    expect(img.getAttribute('loading')).toBe('eager');
    expect(img.getAttribute('fetchpriority')).toBe('high');
    expect(img.getAttribute('width')).toBeTruthy();
    expect(img.getAttribute('height')).toBeTruthy();
    expect(img.getAttribute('src') ?? '').toMatch(/_astro\//);
  });

  it('headshot asset is < 100 KB at display size (sad.md §11 budget)', () => {
    const dir = join(withIndustries.distDir, '_astro');
    const images = readdirSync(dir).filter((f) => /\.(webp|avif|jpe?g|png)$/.test(f));
    expect(images.length).toBeGreaterThan(0);
    const smallest = Math.min(...images.map((f) => statSync(join(dir, f)).size));
    expect(smallest).toBeLessThan(100 * 1024);
  });
});

describe('Hero — AC-15 optional Industries', () => {
  it('renders the Industries list from content when present', () => {
    const section = doc.querySelector('[aria-label="Industries"]')!;
    expect(section).not.toBeNull();
    const text = section.textContent ?? '';
    for (const it of P.industries!) {
      expect(text).toContain(it.domain);
      if (it.note) expect(text).toContain(it.note);
    }
  });

  it('omits the Industries column and still builds when the field is absent', () => {
    expect(noIndustries.ok).toBe(true);
    const plain = noIndustries.html('/zz-hero-plain');
    expect(plain.querySelector('[aria-label="Industries"]')).toBeNull();
    // essentials still present
    expect(plain.querySelectorAll('h1')).toHaveLength(1);
  });
});
