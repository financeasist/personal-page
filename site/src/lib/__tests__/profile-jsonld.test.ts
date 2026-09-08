import { describe, expect, it } from 'vitest';
import { profilePersonJsonLd } from '../profile-jsonld';

// Person / ProfilePage structured data for the landing page (SEO — entity
// disambiguation + `sameAs` identity consolidation across the Hrupskyi /
// Grupskiy romanisation split). Derived purely from the `profile` content, so
// it is unit-tested in isolation like the other `src/lib` helpers (ADR-0007).

const base = {
  name: 'Roman Hrupskyi',
  headline: 'Senior Java Engineer | Lead Backend Engineer',
  tagline: 'Java engineer and technical leader with 9+ years of experience.',
  alternateNames: ['Roman Grupskiy'],
  contact: {
    location: 'Krakow, Poland',
    links: [
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/roman-hrupskyi/' },
      { label: 'GitHub', url: 'https://github.com/financeasist' },
    ],
  },
  languages: [
    { name: 'English', level: 'B2+' },
    { name: 'Ukrainian', level: 'native' },
  ],
  education: [
    { degree: 'Physics — Master degree', institution: 'Ivan Franko National University', year: '2004' },
  ],
};

const build = (over: Record<string, unknown> = {}) =>
  profilePersonJsonLd({ ...base, ...over } as never, 'https://romanhrupskyi.com/');

describe('profilePersonJsonLd', () => {
  it('is a schema.org ProfilePage wrapping the person as mainEntity', () => {
    const ld = build();
    expect(ld['@context']).toBe('https://schema.org');
    expect(ld['@type']).toBe('ProfilePage');
    expect((ld.mainEntity as Record<string, unknown>)['@type']).toBe('Person');
  });

  it('names the person and points url at the site root', () => {
    const person = build().mainEntity as Record<string, unknown>;
    expect(person.name).toBe('Roman Hrupskyi');
    expect(person.url).toBe('https://romanhrupskyi.com/');
  });

  it('points image at the absolute share-card URL on the given origin', () => {
    const person = build().mainEntity as Record<string, unknown>;
    expect(person.image).toBe('https://romanhrupskyi.com/og-image.png?v=4');
  });

  it('splits the headline into a jobTitle per pipe-separated role', () => {
    const person = build().mainEntity as Record<string, unknown>;
    expect(person.jobTitle).toEqual(['Senior Java Engineer', 'Lead Backend Engineer']);
  });

  it('uses the tagline as description, and omits description when there is no tagline', () => {
    expect((build().mainEntity as Record<string, unknown>).description).toBe(base.tagline);
    expect((build({ tagline: undefined }).mainEntity as Record<string, unknown>).description).toBeUndefined();
  });

  it('lists every contact link URL in sameAs, in order', () => {
    const person = build().mainEntity as Record<string, unknown>;
    expect(person.sameAs).toEqual([
      'https://www.linkedin.com/in/roman-hrupskyi/',
      'https://github.com/financeasist',
    ]);
  });

  it('carries the alternate-name spellings, and omits alternateName when there are none', () => {
    expect((build().mainEntity as Record<string, unknown>).alternateName).toEqual(['Roman Grupskiy']);
    expect(
      (build({ alternateNames: [] }).mainEntity as Record<string, unknown>).alternateName,
    ).toBeUndefined();
  });

  it('records the home location and the spoken languages', () => {
    const person = build().mainEntity as Record<string, unknown>;
    expect(person.homeLocation).toEqual({ '@type': 'Place', name: 'Krakow, Poland' });
    expect(person.knowsLanguage).toEqual(['English', 'Ukrainian']);
  });

  it('records the first education entry as alumniOf, and omits it when education is empty', () => {
    expect((build().mainEntity as Record<string, unknown>).alumniOf).toEqual({
      '@type': 'CollegeOrUniversity',
      name: 'Ivan Franko National University',
    });
    expect((build({ education: [] }).mainEntity as Record<string, unknown>).alumniOf).toBeUndefined();
  });
});
