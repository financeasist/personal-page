import { z } from 'zod';
import { hasLinkedInLink } from '../lib/content-checks';

/**
 * The Zod shape + build-time invariants for the single `profile` content
 * document (ADR-0005 / ADR-0007 / data-model.md). Kept in its own module —
 * importing only `zod`, not `astro:content` — so it is unit-testable without the
 * Astro build pipeline. `content/config.ts` wraps this in `defineCollection`.
 *
 * Two renderers read the entry: the landing page (`index.astro`) and the CV
 * print route (`cv.astro`). Some fields are landing-only, some CV-only, most
 * shared. Every invariant names the offending field so a failing build tells
 * Roman exactly what to fix (AC-05, AC-06).
 *
 * INV-08 (AC-07): this shape carries NO `salary` / `rate` / `compensation` /
 * `homeAddress` / per-recruiter-link-label key — over-exposure is prevented
 * structurally, and Zod strips any such key that appears in the JSON.
 */

export const link = z.object({
  label: z.string(),
  url: z.string().url(),
});

export const experienceEntry = z.object({
  role: z.string(),
  company: z.string(),
  companyUrl: z.string().url().optional(),
  project: z.string().optional(),
  projectUrl: z.string().url().optional(),
  dateRange: z.string(),
  description: z.string().optional(),
  bullets: z.array(z.string()).default([]),
  techStack: z.array(z.string()).default([]),
});

export const skillCategory = z.object({
  category: z.string(),
  items: z.array(z.string()),
});

export const educationEntry = z.object({
  degree: z.string(),
  institution: z.string(),
  detail: z.string().optional(),
  year: z.string().optional(),
});

/** Hero right column — optional as a whole; each present entry is validated (AC-15). */
export const industry = z.object({
  domain: z.string().min(1),
  note: z.string().min(1).optional(),
});

/** Availability block — `status` carries the remote / hybrid / relocation stance (INV-02). */
export const availability = z.object({
  status: z.string().min(1),
  noticePeriod: z.string().min(1).optional(),
  workAuthorization: z.string().min(1).optional(),
});

/** The one below-the-fold content block on the v1 landing page (US-10 / AC-14 / INV-09). */
export const about = z.object({
  narrative: z.string().min(1),
  highlights: z.array(z.string().min(1)).min(1),
});

/**
 * Headshot — an above-the-fold essential (AC-01, AC-05: "image path AND its alt
 * text"). `src` is a filename resolved against `src/assets/` by the Hero.
 *
 * NOTE: data-model.md's abridged §Schema-change list did not enumerate this
 * field, but AC-05 requires a missing headshot path/alt to fail the build — so
 * it is modelled here. Flagged in the T2 handoff.
 */
export const headshot = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
});

export const contact = z.object({
  phones: z.array(z.string()).default([]), // CV route only — never read on the landing page
  email: z.string().email(),
  location: z.string().min(1),
  links: z.array(link).min(1),
});

/**
 * The raw object shape — exported for unit tests. `profileSchema` wraps it with
 * the INV-03 cross-field check.
 */
export const profileObjectSchema = z.object({
  name: z.string().min(1),
  // Other romanisations of `name` (the surname transliterates as both
  // "Hrupskyi" and "Grupskiy"). Landing-page-only: fed to `sameAs`/`alternateName`
  // in the Person JSON-LD so Google ties the identities together (profile-jsonld.ts).
  alternateNames: z.array(z.string().min(1)).default([]),
  headline: z.string().min(1),
  tagline: z.string().min(1).max(300).optional(),
  // Rendered as one middot-joined sentence in the hero (not chips), so the cap
  // is generous — it only guards against an unbounded list.
  topStack: z.array(z.string().min(1)).min(4).max(12),
  headshot,
  industries: z.array(industry).max(6).optional(),
  contact,
  availability,
  about,
  // CV-route-only fields — shape unchanged from the scaffold (data-model.md §Scope note).
  competencies: z.array(z.string()).default([]),
  languages: z.array(z.object({ name: z.string(), level: z.string() })).default([]),
  summary: z.array(z.string()).min(1),
  skills: z.array(skillCategory).default([]),
  education: z.array(educationEntry).default([]),
  experience: z.array(experienceEntry).default([]),
});

export const profileSchema = profileObjectSchema.superRefine((data, ctx) => {
  // INV-03 — LinkedIn is a required contact channel; name it if missing (E2).
  if (!hasLinkedInLink(data.contact.links)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['contact', 'links'],
      message: 'contact.links must include a linkedin.com URL (the LinkedIn contact channel)',
    });
  }
});

export type ProfileData = z.infer<typeof profileSchema>;
