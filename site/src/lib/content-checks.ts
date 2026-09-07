/**
 * Helper predicates for the build-time content invariants (ADR-0007 /
 * data-model.md §Invariants). Kept out of `config.ts` so they are unit-testable
 * in isolation; `config.ts` `.superRefine()` calls them.
 */

export interface LinkLike {
  label: string;
  url: string;
}

/**
 * INV-03 — is there at least one contact link whose URL host is `linkedin.com`
 * (or a `linkedin.com` subdomain)? A malformed URL never counts as LinkedIn —
 * the base schema's `.url()` check reports that separately (INV-04 / E9).
 */
export function hasLinkedInLink(links: readonly LinkLike[]): boolean {
  return links.some((link) => {
    let host: string;
    try {
      host = new URL(link.url).hostname.toLowerCase();
    } catch {
      return false;
    }
    return host === 'linkedin.com' || host.endsWith('.linkedin.com');
  });
}
