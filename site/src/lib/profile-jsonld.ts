import type { ProfileData } from '../content/profile-schema';

/**
 * `Person` / `ProfilePage` JSON-LD for the landing page — the structured-data
 * half of the SEO work (the rest is robots.txt + sitemap + Search Console).
 *
 * Purpose: hand Google an unambiguous entity record so the fresh domain is
 * understood as "a real person named Roman Hrupskyi", and `sameAs` consolidates
 * the identity across the profile URLs and the two romanisations of the surname
 * (site/domain "Hrupskyi" vs the older "Grupskiy" on external profiles —
 * `profile.alternateNames`).
 *
 * Derived entirely from the single `profile` content document (CLAUDE.md —
 * content is the source of truth; nothing here is hand-authored English), and
 * kept as a pure function importing no `astro:*` so it is unit-testable without
 * the build pipeline (ADR-0007), like `content-checks` / `cv-filename`.
 *
 * Emitted as `<script type="application/ld+json">` by `Layout.astro`. That is a
 * data block, not executable JS — no bundle, no island — so it is compatible
 * with the site's zero-client-JS posture (CLAUDE.md).
 */
type JsonLd = Record<string, unknown>;

/** Structural subset of the profile this derivation reads. */
type ProfileInput = Pick<ProfileData, 'name' | 'headline' | 'contact' | 'languages' | 'education'> & {
  tagline?: string;
  alternateNames?: string[];
};

function pruned(obj: JsonLd): JsonLd {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && !(Array.isArray(v) && v.length === 0)),
  );
}

export function profilePersonJsonLd(profile: ProfileInput, siteUrl: string | URL): JsonLd {
  const url = siteUrl.toString();
  const jobTitle = profile.headline
    .split('|')
    .map((role) => role.trim())
    .filter(Boolean);

  const person = pruned({
    '@type': 'Person',
    name: profile.name,
    alternateName: profile.alternateNames ?? [],
    jobTitle,
    description: profile.tagline,
    url,
    homeLocation: { '@type': 'Place', name: profile.contact.location },
    knowsLanguage: profile.languages.map((l) => l.name),
    alumniOf: profile.education[0]
      ? { '@type': 'CollegeOrUniversity', name: profile.education[0].institution }
      : undefined,
    sameAs: profile.contact.links.map((l) => l.url),
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: person,
  };
}
