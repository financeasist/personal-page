import { describe, expect, it } from 'vitest';
import { hasLinkedInLink } from '../content-checks';

// INV-03 helper (data-model.md §Invariants). Unit-tested in isolation
// (ADR-0007).
describe('hasLinkedInLink', () => {
  it('is true for a linkedin.com URL in any position', () => {
    expect(
      hasLinkedInLink([
        { label: 'GitHub', url: 'https://github.com/x' },
        { label: 'LinkedIn', url: 'https://linkedin.com/in/x' },
      ]),
    ).toBe(true);
  });

  it('accepts a linkedin.com subdomain and is case-insensitive', () => {
    expect(hasLinkedInLink([{ label: 'in', url: 'https://www.LinkedIn.com/in/x' }])).toBe(true);
  });

  it('is false when no link is LinkedIn', () => {
    expect(hasLinkedInLink([{ label: 'GitHub', url: 'https://github.com/x' }])).toBe(false);
    expect(hasLinkedInLink([])).toBe(false);
  });

  it('does not treat a look-alike host as LinkedIn', () => {
    expect(hasLinkedInLink([{ label: 'x', url: 'https://linkedin.com.evil.example/in/x' }])).toBe(
      false,
    );
  });

  it('never throws on a malformed URL — it just does not count', () => {
    expect(hasLinkedInLink([{ label: 'x', url: 'linkedin dot com' }])).toBe(false);
  });
});
