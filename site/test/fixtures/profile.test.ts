import { describe, expect, it } from 'vitest';
import {
  emptyAboutProfile,
  industriesOmittedProfile,
  malformedProfile,
  missingAboutProfile,
  missingChannelProfile,
  oversizeIndustriesProfile,
  undersizeTopStackProfile,
  validProfile,
} from './profile';

// T1 smoke — unit/component tier. Asserts the fixture factories the later tasks
// import actually produce the shapes their tests will rely on. The real schema
// assertions land in T2.
describe('profile fixtures', () => {
  it('validProfile() is a complete, coherent baseline', () => {
    const p = validProfile();
    expect(p.name).toBeTruthy();
    expect(p.headline).toBeTruthy();
    expect(p.contact.email).toContain('@');
    expect(p.contact.links.some((l) => l.url.includes('linkedin.com'))).toBe(true);
    expect(p.topStack.length).toBeGreaterThanOrEqual(4);
    expect(p.topStack.length).toBeLessThanOrEqual(8);
    expect(p.about.narrative).toBeTruthy();
    expect(p.about.highlights.length).toBeGreaterThan(0);
    // PII guard — no real address leaks through the baseline.
    expect(p.contact.email.endsWith('example.test')).toBe(true);
  });

  it('the invalid/edge factories each break exactly one invariant', () => {
    expect(missingChannelProfile('email').contact).not.toHaveProperty('email');
    expect(missingChannelProfile('linkedin').contact.links.some((l) => l.url.includes('linkedin.com'))).toBe(
      false,
    );
    expect(missingAboutProfile()).not.toHaveProperty('about');
    expect(emptyAboutProfile('narrative').about.narrative).toBe('');
    expect(emptyAboutProfile('highlights').about.highlights).toEqual([]);
    expect(malformedProfile('email').contact.email).not.toContain('@');
    expect(undersizeTopStackProfile().topStack.length).toBeLessThan(4);
    expect(industriesOmittedProfile()).not.toHaveProperty('industries');
    expect(oversizeIndustriesProfile().industries).toHaveLength(7);
  });
});
