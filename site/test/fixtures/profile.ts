/**
 * Test fixtures for the `profile` content document (data-model.md §Test fixtures).
 *
 * `validProfile()` is the GREEN baseline — a fully-populated profile that passes
 * every invariant (INV-01..04, 07..09). The other factories derive an invalid or
 * edge variant from it so a schema / build test can assert the failure names the
 * offending field.
 *
 * PII guard: these fixtures use `example.test` addresses and a placeholder
 * identity — never Roman's real contact details (data-model.md §Test fixtures).
 *
 * T1 ships the factory signatures + the `validProfile()` body; later tasks (T2)
 * fill in the parts of the shape they exercise. The names are the contract the
 * dependent tasks import.
 */

export interface ProfileLink {
  label: string;
  url: string;
}

export interface ProfileInput {
  name: string;
  headline: string;
  tagline?: string;
  topStack: string[];
  headshot: { src: string; alt: string };
  industries?: { domain: string; note?: string }[];
  contact: {
    phones: string[];
    email: string;
    location: string;
    links: ProfileLink[];
  };
  availability: {
    status: string;
    noticePeriod?: string;
    workAuthorization?: string;
  };
  about: {
    narrative: string;
    highlights: string[];
  };
  // CV-route-only fields — kept so a fixture parses against the full schema.
  competencies: string[];
  languages: { name: string; level: string }[];
  summary: string[];
  skills: { category: string; items: string[] }[];
  education: { degree: string; institution: string; detail?: string; year?: string }[];
  experience: unknown[];
}

export function validProfile(): ProfileInput {
  return {
    name: 'Jordan Rivera',
    headline: 'Senior Java Engineer | Lead Backend Engineer',
    tagline:
      'Backend engineer and technical leader with 9+ years designing, building and scaling high-load distributed systems and the engineering teams around them.',
    topStack: ['Java', 'Spring Boot', 'Kafka', 'PostgreSQL', 'Redis', 'Kubernetes'],
    // `me.png` is the asset committed under src/assets/ (T7) — buildFixture
    // copies src/ verbatim, so a fixture build resolves it.
    headshot: { src: 'me.png', alt: 'Portrait of Jordan Rivera' },
    industries: [
      { domain: 'iGaming', note: 'Remote Game Servers (RGS)' },
      { domain: 'FinTech & E-commerce', note: 'AI-driven value intelligence platform' },
      { domain: 'Healthcare', note: 'Hospital software' },
      { domain: 'Retail', note: 'Automated decision intelligence' },
    ],
    contact: {
      phones: ['+00 000 000 0000'],
      email: 'jordan@example.test',
      location: 'Krakow, Poland',
      links: [{ label: 'LinkedIn', url: 'https://linkedin.com/in/example' }],
    },
    availability: {
      status: 'Open to Remote & Hybrid Opportunities',
      noticePeriod: '1 month',
      workAuthorization: 'EU work permit — Poland',
    },
    about: {
      narrative:
        'Seasoned Java professional with 9+ years designing and building scalable, high-performance business applications.\n\nMy way of working is rooted in systems thinking — the big picture and the deep implementation detail at once.',
      highlights: [
        'Experience managing engineers',
        'Projects from legacy systems to greenfield startups',
        'Architectures from monolith to microservices',
        'Teams from co-located to hundreds worldwide',
      ],
    },
    competencies: ['STUB'],
    languages: [
      { name: 'English', level: 'B2+' },
      { name: 'Ukrainian', level: 'native' },
    ],
    summary: ['STUB professional summary.'],
    skills: [{ category: 'Frameworks / Libraries', items: ['STUB'] }],
    education: [{ degree: 'MSc Physics', institution: 'Example University', year: '2004' }],
    experience: [],
  };
}

/** Drops one of the three contact channels → INV-03 must name it (AC-05, E1/E2). */
export function missingChannelProfile(channel: 'email' | 'linkedin'): ProfileInput {
  const p = validProfile();
  if (channel === 'email') {
    // @ts-expect-error — deliberately removing a required field for the test
    delete p.contact.email;
  } else {
    p.contact.links = [{ label: 'GitHub', url: 'https://github.com/example' }];
  }
  return p;
}

/**
 * Drops (or blanks) one of the AC-05 canonical essentials that the other
 * factories don't already cover — `name`, the headshot `src` / `alt` pair,
 * `availability.status`, or `contact.location` → the schema failure must name
 * that field (AC-05: "the headshot (image path *and* its alt text), the
 * availability status, the location …").
 */
export function missingEssentialProfile(
  field: 'name' | 'headshot.src' | 'headshot.alt' | 'availability.status' | 'contact.location',
): ProfileInput {
  const p = validProfile();
  if (field === 'name') p.name = '';
  else if (field === 'headshot.src') p.headshot.src = '';
  else if (field === 'headshot.alt') p.headshot.alt = '';
  else if (field === 'availability.status') p.availability.status = '';
  else if (field === 'contact.location') p.contact.location = '';
  return p;
}

/** Omits `about` entirely → the required-object failure names `about` (AC-05, E4). */
export function missingAboutProfile(): ProfileInput {
  const p = validProfile();
  // @ts-expect-error — deliberately removing a required field for the test
  delete p.about;
  return p;
}

/** `about.narrative: ""` or `about.highlights: []` → INV-09 names the part (AC-05/AC-06, E5). */
export function emptyAboutProfile(part: 'narrative' | 'highlights'): ProfileInput {
  const p = validProfile();
  if (part === 'narrative') p.about.narrative = '';
  else p.about.highlights = [];
  return p;
}

/** email without `@`, empty headline, unparseable url, or empty tagline → INV-04 (AC-06). */
export function malformedProfile(field: 'email' | 'headline' | 'url' | 'tagline'): ProfileInput {
  const p = validProfile();
  if (field === 'email') p.contact.email = 'not-an-email';
  else if (field === 'headline') p.headline = '';
  else if (field === 'url') p.contact.links = [{ label: 'LinkedIn', url: 'linkedin dot com' }];
  else if (field === 'tagline') p.tagline = '';
  return p;
}

/** 3 `topStack` entries → INV-07 min (AC-06, E6). */
export function undersizeTopStackProfile(): ProfileInput {
  const p = validProfile();
  p.topStack = ['Java', 'Spring Boot', 'Kafka'];
  return p;
}

/** 13 `topStack` entries → INV-07 max (AC-06, E10). */
export function oversizeTopStackProfile(): ProfileInput {
  const p = validProfile();
  p.topStack = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'];
  return p;
}

/** `tagline` > 300 chars → the `.max(300)` bound (spec §1 / §6 fold-fit guard). */
export function oversizeTaglineProfile(): ProfileInput {
  const p = validProfile();
  p.tagline = 'x'.repeat(301);
  return p;
}

/** No `industries` key → the build passes and the hero omits the column (AC-15). */
export function industriesOmittedProfile(): ProfileInput {
  const p = validProfile();
  delete p.industries;
  return p;
}

/** 7 `industries` entries → the `.max(6)` bound (AC-06, E13). */
export function oversizeIndustriesProfile(): ProfileInput {
  const p = validProfile();
  p.industries = Array.from({ length: 7 }, (_, i) => ({ domain: `Domain ${i + 1}` }));
  return p;
}

/**
 * A valid profile whose derived CV filename has no committed PDF behind it — the
 * postbuild "file exists" assertion must fail (AC-04, AC-05 CV channel, E3).
 * The profile itself is well-formed; T4's test removes the file.
 */
export function missingCvPdfProfile(): ProfileInput {
  return validProfile();
}
