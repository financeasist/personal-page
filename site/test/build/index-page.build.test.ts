import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { buildFixture, type BuildResult } from '../helpers/build-fixture';

// Everything is content — assert against the committed profile, never a
// hard-coded value (the email moved to the apex domain on 2026-09-08).
const profile = JSON.parse(
  readFileSync(new URL('../../src/data/profile/roman.json', import.meta.url), 'utf8'),
) as {
  name: string;
  tagline?: string;
  alternateNames?: string[];
  contact: { email: string; location: string; links: { url: string }[] };
  languages: { name: string }[];
};
const profileEmail = profile.contact.email;

// T9 — the assembled page, verified over the REAL delivered `dist/` (built from
// the committed roman.json). AC-07 / AC-10 delivered-source half + the client-JS
// NFR (spec.md §Test plan integration + NFR rows): no JS bundle / island, only
// the one small inline progressive-enhancement script from ADR-0009. Also the
// Person/ProfilePage JSON-LD data block (SEO — `src/lib/profile-jsonld.ts`).
let build: BuildResult;
let html: string;
let visibleText: string;
/** Parsed `application/ld+json` head block, and its `mainEntity`. */
let ld: Record<string, unknown>;
let person: Record<string, unknown>;

beforeAll(() => {
  build = buildFixture({}); // no profile override → the real committed content
  if (!build.ok) throw new Error(build.stderr);
  html = build.file('index.html') ?? '';
  const ldBlock = html.match(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/,
  )?.[1];
  if (!ldBlock) throw new Error('no application/ld+json script in index.html');
  ld = JSON.parse(ldBlock);
  person = ld.mainEntity as Record<string, unknown>;
  visibleText = html
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<script[\s\S]*?<\/script>/g, '') // <script> content (incl. the ld+json data block) is never visible text
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

    // The only EXECUTABLE script is the scroll-spy active-section indicator
    // (ADR-0009): one inline module, no src, < 1 KB, progressive enhancement.
    // A `type="application/ld+json"` block is inert data (SEO), not client JS —
    // it does not count against the zero-JS posture (CLAUDE.md).
    const openTags = html.match(/<script\b[^>]*>/g) ?? [];
    const dataBlocks = openTags.filter((t) => /type="application\/ld\+json"/.test(t));
    const executable = openTags.filter((t) => !/type="application\/ld\+json"/.test(t));
    expect(executable).toHaveLength(1);
    expect(executable[0]).toMatch(/type="module"/);
    expect(executable[0]).not.toMatch(/\bsrc=/);
    const body = html.match(/<script\b[^>]*type="module"[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? '';
    expect(body).toContain('IntersectionObserver');
    expect(body.length).toBeGreaterThan(0);
    expect(body.length).toBeLessThan(1024);

    // The ld+json block, when present, is inert and parses as JSON.
    expect(dataBlocks.length).toBeLessThanOrEqual(1);
    for (const tag of dataBlocks) expect(tag).not.toMatch(/\bsrc=|type="module"/);
    const ld = html.match(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)?.[1];
    if (ld) expect(() => JSON.parse(ld)).not.toThrow();
  });
});

describe('assembled index.astro — need-to-know exposure (AC-07 / AC-10)', () => {
  it('renders neither the email address nor the LinkedIn URL as visible text', () => {
    expect(visibleText).not.toContain(profileEmail);
    expect(visibleText).not.toMatch(/linkedin\.com\/in\//i);
    expect(visibleText.toLowerCase()).not.toContain('roman-hrupskyi');
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
      /href="https:\/\/www\.linkedin\.com\/in\/roman-hrupskyi\/"[^>]*target="_blank"/,
    );
    expect(html).toMatch(/href="\/Roman-Hrupskyi-Senior-Java-Engineer-CV\.pdf"[^>]*download/);
  });
});

describe('assembled index.astro — Person/ProfilePage JSON-LD (SEO entity data)', () => {
  it('is a single schema.org ProfilePage data block in the <head>', () => {
    expect(html.slice(0, html.indexOf('</head>'))).toMatch(/type="application\/ld\+json"/);
    expect(html.match(/type="application\/ld\+json"/g) ?? []).toHaveLength(1);
    expect(ld['@context']).toBe('https://schema.org');
    expect(ld['@type']).toBe('ProfilePage');
    expect(person['@type']).toBe('Person');
  });

  it('describes the person from the committed profile content', () => {
    expect(person.name).toBe(profile.name);
    expect(person.description).toBe(profile.tagline);
    expect((person.homeLocation as Record<string, unknown>).name).toBe(profile.contact.location);
    expect(person.knowsLanguage).toEqual(profile.languages.map((l) => l.name));
    expect(person.image).toMatch(/^https:\/\/romanhrupskyi\.com\/[^"]+\.(png|jpg|webp)(\?.*)?$/);
  });

  it('lists every contact link in sameAs, and the alternate-name spelling, so Google ties the identities together', () => {
    expect(person.sameAs).toEqual(profile.contact.links.map((l) => l.url));
    expect(person.alternateName).toEqual(profile.alternateNames);
  });
});

const SITE = 'https://romanhrupskyi.com';

describe('assembled index.astro — canonical + Open Graph (link previews)', () => {
  const meta = (prop: string) =>
    html.match(
      new RegExp(`<meta[^>]*(?:property|name)="${prop.replace('/', '\\/')}"[^>]*content="([^"]*)"`),
    )?.[1] ??
    html.match(
      new RegExp(`<meta[^>]*content="([^"]*)"[^>]*(?:property|name)="${prop.replace('/', '\\/')}"`),
    )?.[1];

  it('has a self-referencing canonical URL at the site root', () => {
    expect(html).toMatch(
      new RegExp(`<link[^>]*rel="canonical"[^>]*href="${SITE}/"`),
    );
  });

  it('names the document author', () => {
    expect(meta('author')).toBe(profile.name);
  });

  it('carries og:title / og:description / og:type / og:url from the page + content', () => {
    expect(meta('og:title')).toBe(`${profile.name} — Senior Java Engineer | Lead Backend Engineer`);
    expect(meta('og:description')).toBe(profile.tagline);
    expect(meta('og:type')).toBe('profile');
    expect(meta('og:url')).toBe(`${SITE}/`);
  });

  it('points og:image and twitter:card at an absolute social image', () => {
    expect(meta('og:image')).toMatch(new RegExp(`^${SITE}/[^"]+\\.(png|jpg|webp)(\\?.*)?$`));
    expect(meta('twitter:card')).toBe('summary_large_image');
  });
});

describe('build output — robots.txt + sitemap (crawler discovery)', () => {
  it('emits a robots.txt that allows all and points at the sitemap index', () => {
    const robots = build.file('robots.txt') ?? '';
    expect(robots).toMatch(/User-agent:\s*\*/i);
    expect(robots).toMatch(/Allow:\s*\/\s*$/im);
    expect(robots).toMatch(new RegExp(`Sitemap:\\s*${SITE}/sitemap-index\\.xml`, 'i'));
  });

  it('emits a sitemap that lists the landing page but not the CV print route', () => {
    const sitemap =
      (build.file('sitemap-index.xml') ?? '') + (build.file('sitemap-0.xml') ?? '');
    expect(sitemap).toContain(`${SITE}/`);
    expect(sitemap).not.toContain(`${SITE}/cv`);
  });
});
