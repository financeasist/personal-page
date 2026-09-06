import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * The single structured source of truth Roman edits and commits.
 * Sections mirror docs/reference/cv-template-reference.pdf — the CV print route
 * (cv.astro) reproduces that layout exactly; the landing page (index.astro)
 * reads the same data. Keep the schema single-shaped and locale-clean so a
 * later per-locale content entry stays non-breaking (architecture-map.md).
 */

const link = z.object({
  label: z.string(),
  url: z.string().url(),
});

const experienceEntry = z.object({
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

const skillCategory = z.object({
  category: z.string(),
  items: z.array(z.string()),
});

const educationEntry = z.object({
  degree: z.string(),
  institution: z.string(),
  detail: z.string().optional(),
  year: z.string().optional(),
});

const profile = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/data/profile' }),
  schema: z.object({
    name: z.string(),
    headline: z.string(),
    contact: z.object({
      phones: z.array(z.string()).default([]),
      email: z.string().email(),
      location: z.string(),
      availability: z.string().optional(),
      links: z.array(link).default([]),
    }),
    competencies: z.array(z.string()).default([]),
    languages: z.array(z.object({ name: z.string(), level: z.string() })).default([]),
    summary: z.array(z.string()).min(1),
    skills: z.array(skillCategory).default([]),
    education: z.array(educationEntry).default([]),
    experience: z.array(experienceEntry).default([]),
  }),
});

export const collections = { profile };
