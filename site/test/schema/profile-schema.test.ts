import { describe, expect, it } from 'vitest';
import { profileSchema } from '../../src/content/profile-schema';
import {
  emptyAboutProfile,
  industriesOmittedProfile,
  malformedProfile,
  missingAboutProfile,
  missingChannelProfile,
  oversizeIndustriesProfile,
  oversizeTaglineProfile,
  oversizeTopStackProfile,
  undersizeTopStackProfile,
  validProfile,
} from '../fixtures/profile';

/** All issue paths of a failed parse, dotted (`contact.email`, `about.highlights`). */
function failurePaths(input: unknown): string[] {
  const result = profileSchema.safeParse(input);
  expect(result.success).toBe(false);
  if (result.success) return [];
  return result.error.issues.map((i) => i.path.join('.'));
}

// AC-05 / AC-06 / AC-14 / AC-15 schema half (data-model.md §Invariants). Every
// failure names the offending field.
describe('profileSchema', () => {
  it('accepts the valid baseline (AC-05 / AC-14 / AC-15 happy path)', () => {
    expect(profileSchema.safeParse(validProfile()).success).toBe(true);
  });

  it('accepts a profile with no `industries` key — optional (AC-15)', () => {
    expect(profileSchema.safeParse(industriesOmittedProfile()).success).toBe(true);
  });

  describe('AC-05 — a missing required landing field fails the build, naming the field', () => {
    it('names contact.email (E1)', () => {
      expect(failurePaths(missingChannelProfile('email'))).toContain('contact.email');
    });

    it('names contact.links for a missing LinkedIn channel (E2)', () => {
      const paths = failurePaths(missingChannelProfile('linkedin'));
      expect(paths).toContain('contact.links');
      const msg = profileSchema.safeParse(missingChannelProfile('linkedin'));
      expect(msg.success).toBe(false);
      if (!msg.success) {
        expect(msg.error.issues.map((i) => i.message).join(' ')).toMatch(/linkedin/i);
      }
    });

    it('names `about` when the object is omitted (E4)', () => {
      expect(failurePaths(missingAboutProfile()).some((p) => p.startsWith('about'))).toBe(true);
    });

    it('names about.highlights for an empty list (E5)', () => {
      expect(failurePaths(emptyAboutProfile('highlights'))).toContain('about.highlights');
    });

    it('names about.narrative for an empty string', () => {
      expect(failurePaths(emptyAboutProfile('narrative'))).toContain('about.narrative');
    });

    it('names topStack for fewer than 4 entries (E6)', () => {
      expect(failurePaths(undersizeTopStackProfile())).toContain('topStack');
    });
  });

  describe('AC-06 — a malformed value fails the build, naming the field', () => {
    it('names contact.email for a value with no @ (E7)', () => {
      expect(failurePaths(malformedProfile('email'))).toContain('contact.email');
    });

    it('names headline for an empty string (E8)', () => {
      expect(failurePaths(malformedProfile('headline'))).toContain('headline');
    });

    it('names the offending link for an unparseable url (E9)', () => {
      expect(failurePaths(malformedProfile('url')).some((p) => p.startsWith('contact.links'))).toBe(
        true,
      );
    });

    it('names tagline for a present-but-empty string (E11)', () => {
      expect(failurePaths(malformedProfile('tagline'))).toContain('tagline');
    });

    it('names topStack for more than 8 entries (E10)', () => {
      expect(failurePaths(oversizeTopStackProfile())).toContain('topStack');
    });

    it('names tagline for more than 300 characters', () => {
      expect(failurePaths(oversizeTaglineProfile())).toContain('tagline');
    });

    it('names industries for more than 6 entries (E13)', () => {
      expect(failurePaths(oversizeIndustriesProfile())).toContain('industries');
    });

    it('names the industries entry for an empty domain (E12)', () => {
      const bad = validProfile();
      bad.industries = [{ domain: '' }];
      expect(failurePaths(bad).some((p) => p.startsWith('industries'))).toBe(true);
    });
  });

  it('INV-08 (AC-07) — strips any over-exposure key rather than carrying it through', () => {
    const withSalary = { ...validProfile(), salary: 120_000, homeAddress: '1 Main St' };
    const result = profileSchema.safeParse(withSalary);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty('salary');
      expect(result.data).not.toHaveProperty('homeAddress');
    }
  });
});
