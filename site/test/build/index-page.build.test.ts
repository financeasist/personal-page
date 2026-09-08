import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { buildFixture, type BuildResult } from '../helpers/build-fixture';

// Contact channels are content — assert against the committed profile, never a
// hard-coded address (the email moved to the apex domain on 2026-09-08).
const profileEmail = (
  JSON.parse(
    readFileSync(new URL('../../src/data/profile/roman.json', import.meta.url), 'utf8'),
  ) as { contact: { email: string } }
).contact.email;

// T9 — the assembled page, verified over the REAL delivered `dist/` (built from
// the committed roman.json). AC-07 / AC-10 delivered-source half + the client-JS
// NFR (spec.md §Test plan integration + NFR rows): no JS bundle / island, only
// the one small inline progressive-enhancement script from ADR-0009.
let build: BuildResult;
let html: string;
let visibleText: string;

beforeAll(() => {
  build = buildFixture({}); // no profile override → the real committed content
  if (!build.ok) throw new Error(build.stderr);
  html = build.file('index.html') ?? '';
  visibleText = html
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ');
});

describe('assembled index.astro — structure', () => {
  it('has exactly one <h1> and the semantic landmarks', () => {
    expect(html.match(/<h1[\s>]/g) ?? []).toHaveLength(1);
    expect(html).toMatch(/<header[\s>]/);
    expect(html).toMatch(/<main[\s>]/);
    expect(html).toMatch(/<footer[\s>]/);
    expect(html).toMatch(/<html lang="en"/);
  });

  it('titles the page "<name> — <headline>"', () => {
    expect(html).toMatch(/<title>Roman Hrupskyi — Senior Java Engineer \| Lead Backend Engineer<\/title>/);
  });

  it('the About section anchor is present', () => {
    expect(html).toMatch(/id="about"/);
  });
});

describe('assembled index.astro — client JS is one tiny inline PE script (NFR, ADR-0009)', () => {
  it('ships no JS bundle and no framework island — only one small inline <script>', () => {
    const walk = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
        e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
      );
    const js = walk(build.distDir).filter((f) => /\.m?js$/.test(f));
    expect(js).toEqual([]); // no hoisted/bundled JS
    expect(html).not.toMatch(/astro-island/); // no hydration

    // Exactly one <script>: the scroll-spy active-section indicator (ADR-0009).
    // Inline module, no src, < 1 KB, progressive enhancement.
    const openTags = html.match(/<script\b[^>]*>/g) ?? [];
    expect(openTags).toHaveLength(1);
    expect(openTags[0]).toMatch(/type="module"/);
    expect(openTags[0]).not.toMatch(/\bsrc=/);
    const body = html.match(/<script\b[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? '';
    expect(body).toContain('IntersectionObserver');
    expect(body.length).toBeGreaterThan(0);
    expect(body.length).toBeLessThan(1024);
  });
});

describe('assembled index.astro — need-to-know exposure (AC-07 / AC-10)', () => {
  it('renders neither the email address nor the LinkedIn URL as visible text', () => {
    expect(visibleText).not.toContain(profileEmail);
    expect(visibleText).not.toMatch(/linkedin\.com\/in\//i);
    expect(visibleText.toLowerCase()).not.toContain('roman-grupskiy');
  });

  it('contains no phone number anywhere in the delivered page — not even in an attribute', () => {
    expect(html).not.toMatch(/\+?\s*38[\s\d]{6,}/);
    expect(html).not.toMatch(/\+?\s*48[\s\d]{6,}/);
    expect(html).not.toMatch(/tel:/);
  });

  it('leaks no salary / rate / home-address / recruiter-link-label token (E14)', () => {
    // Scope: the delivered landing document (index.html). The committed CV PDF
    // that also ships in dist/ deliberately carries contact details — AC-07
    // exempts it, so the assertion is over the page, not the whole dist/ tree.
    expect(html.toLowerCase()).not.toMatch(/salary|day rate|rate expectation|compensation|expected salary/);
    expect(html.toLowerCase()).not.toMatch(/home address|street|apt\b/);
    // No per-recruiter tracker link label (roadmap step 5 `/t/{label}` redirects)
    // — the landing page never carries one (AC-07, spec §3 "No tracker wiring").
    expect(html).not.toMatch(/\/t\/[a-z0-9-]+/i);
    expect(html.toLowerCase()).not.toMatch(/recruiter-link|link-label|utm_/);
  });

  it('still makes contact reachable — mailto, new-tab LinkedIn, downloadable CV in href', () => {
    expect(html).toContain(`mailto:${profileEmail}`);
    expect(html).toMatch(
      /href="https:\/\/www\.linkedin\.com\/in\/roman-grupskiy\/"[^>]*target="_blank"/,
    );
    expect(html).toMatch(/href="\/Roman-Hrupskyi-Senior-Java-Engineer-CV\.pdf"[^>]*download/);
  });
});
