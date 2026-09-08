import { describe, expect, it } from 'vitest';
import { buildFixture } from '../helpers/build-fixture';
import {
  emptyAboutProfile,
  industriesOmittedProfile,
  malformedProfile,
  missingChannelProfile,
  oversizeTopStackProfile,
  validProfile,
} from '../fixtures/profile';

// AC-05 / AC-06 — the REAL astro build pipeline (astro:content + the Zod schema
// + .superRefine) fails and names the field (spec.md §Test plan integration
// rows). One representative case per invariant class; the exhaustive per-field
// coverage is the unit tier (test/schema/profile-schema.test.ts).
describe('astro build — content invariants', () => {
  it('builds green with the valid baseline', () => {
    expect(buildFixture({ profile: validProfile() }).ok).toBe(true);
  });

  it('builds green with `industries` omitted (AC-15)', () => {
    expect(buildFixture({ profile: industriesOmittedProfile() }).ok).toBe(true);
  });

  it('fails and names contact.email when the email channel is missing (AC-05)', () => {
    const b = buildFixture({ profile: missingChannelProfile('email') });
    expect(b.ok).toBe(false);
    expect(b.stderr).toMatch(/contact\.email/);
  });

  it('fails and names the LinkedIn requirement when no linkedin.com link is present (AC-05)', () => {
    const b = buildFixture({ profile: missingChannelProfile('linkedin') });
    expect(b.ok).toBe(false);
    expect(b.stderr).toMatch(/links/);
    expect(b.stderr).toMatch(/linkedin/i);
  });

  it('fails and names about.highlights for an empty list (AC-05)', () => {
    const b = buildFixture({ profile: emptyAboutProfile('highlights') });
    expect(b.ok).toBe(false);
    expect(b.stderr).toMatch(/about\.highlights|highlights/);
  });

  it('fails and names topStack for more than 12 entries (AC-06)', () => {
    const b = buildFixture({ profile: oversizeTopStackProfile() });
    expect(b.ok).toBe(false);
    expect(b.stderr).toMatch(/topStack/);
  });

  it('fails and names contact.email and why for a value with no @ (AC-06)', () => {
    const b = buildFixture({ profile: malformedProfile('email') });
    expect(b.ok).toBe(false);
    expect(b.stderr).toMatch(/contact\.email/);
  });
});
