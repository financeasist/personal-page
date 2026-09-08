import { beforeAll, describe, expect, it } from 'vitest';
import { buildFixture, type BuildResult } from '../helpers/build-fixture';
import { validProfile } from '../fixtures/profile';

// T8 — About section. AC-14 structural half (phone reflow / >=16px body text
// run through the browser in T9).
const P = validProfile();
const PROBE = `---
import AboutMe from '../components/AboutMe.astro';
const p = ${JSON.stringify(P)};
---
<html lang="en"><head><title>about</title></head><body><main>
<AboutMe narrative={p.about.narrative} highlights={p.about.highlights} linkedInUrl={p.contact.links[0].url} />
</main></body></html>
`;

let build: BuildResult;
let doc: Document;

beforeAll(() => {
  build = buildFixture({ pages: { 'zz-about.astro': PROBE } });
  if (!build.ok) throw new Error(build.stderr);
  doc = build.html('/zz-about');
});

describe('AboutMe.astro', () => {
  it('anchors at id="about" to match the Header menu link', () => {
    expect(doc.querySelector('#about')).not.toBeNull();
  });

  it('renders the narrative paragraphs straight from content — no hard-coded copy', () => {
    const rendered = doc.querySelector('.about__narrative')!.textContent ?? '';
    for (const para of P.about.narrative.split(/\n{2,}/)) {
      expect(rendered).toContain(para.trim());
    }
    // paragraph count matches the content's blank-line splits
    expect(doc.querySelectorAll('.about__narrative p')).toHaveLength(
      P.about.narrative.split(/\n{2,}/).length,
    );
  });

  it('renders every highlight as its own list item, verbatim', () => {
    const items = Array.from(doc.querySelectorAll('.about__highlights li')).map((li) =>
      li.textContent?.trim(),
    );
    expect(items).toEqual(P.about.highlights);
  });

  it('includes a "See my LinkedIn profile" link to the profile URL', () => {
    const link = doc.querySelector('.about__link')!;
    expect(link.getAttribute('href')).toBe(P.contact.links[0].url);
    expect(link.textContent).toMatch(/LinkedIn/i);
  });

  it('has a centered section heading + rule and ships no script', () => {
    expect(doc.querySelector('.section__heading')?.textContent?.toLowerCase()).toContain('about');
    expect(doc.querySelector('.section__rule')).not.toBeNull();
    expect(doc.querySelectorAll('script')).toHaveLength(0);
  });
});
