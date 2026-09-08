import { beforeAll, describe, expect, it } from 'vitest';
import { buildFixture, type BuildResult } from '../helpers/build-fixture';

// T5 — the page shell. AC-08 (shell half): the Layout structure the responsive
// work builds on, and one <footer> flush to the bottom. Exercised through a real
// build of a probe page that uses Layout.
const PROBE = `---
import Layout from '../layouts/Layout.astro';
---
<Layout title="Probe Title — Shell" owner="Casey Probe">
  <main id="probe"><p>placeholder content</p></main>
</Layout>
`;

let build: BuildResult;
let doc: Document;

beforeAll(() => {
  build = buildFixture({ pages: { 'zzprobe-shell.astro': PROBE } });
  if (!build.ok) throw new Error(build.stderr);
  doc = build.html('/zzprobe-shell');
});

describe('Layout.astro', () => {
  it('renders <html lang="en"> and the title from its prop', () => {
    expect(doc.documentElement.getAttribute('lang')).toBe('en');
    expect(doc.querySelector('title')?.textContent).toBe('Probe Title — Shell');
  });

  it('renders exactly one <footer>', () => {
    expect(doc.querySelectorAll('footer')).toHaveLength(1);
  });

  it('places the footer as the last flow child of <body>, after the slotted content', () => {
    expect(doc.body.lastElementChild?.tagName.toLowerCase()).toBe('footer');
    expect(doc.body.querySelector('#probe')).not.toBeNull();
  });

  it('emits a document author meta from the owner prop', () => {
    expect(doc.querySelector('meta[name="author"]')?.getAttribute('content')).toBe('Casey Probe');
  });

  it('renders the copyright line from the owner prop + the build year, no hard-coded name (US-07)', () => {
    const copy = doc.querySelector('footer')?.textContent ?? '';
    expect(copy).toContain('Casey Probe');
    expect(copy).toMatch(new RegExp(`©\\s*${new Date().getFullYear()}`));
  });

  it('ships no <script> and no hydrated island', () => {
    expect(doc.querySelectorAll('script')).toHaveLength(0);
    expect(doc.querySelectorAll('astro-island')).toHaveLength(0);
  });
});
