import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { profileSchema } from './profile-schema';

/**
 * The single structured source of truth Roman edits and commits
 * (`src/data/profile/*.json`). The shape + build-time invariants live in
 * `./profile-schema.ts` (importable without the Astro pipeline, so they can be
 * unit-tested); this file only binds them to the content collection.
 */
const profile = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/data/profile' }),
  schema: profileSchema,
});

export const collections = { profile };
