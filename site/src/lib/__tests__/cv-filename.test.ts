import { describe, expect, it } from 'vitest';
import { cvFilename } from '../cv-filename';

// AC-04 (spec.md §5, §Test plan AC-04 row) — the CV download filename is derived
// from `name` + `headline` through this one shared helper, never a generic "cv"
// name and never hand-copied. Consumed by the Header `href` (T6) and the
// postbuild "file exists" assertion (T4).
describe('cvFilename', () => {
  it('derives the name-and-headline filename for the current profile', () => {
    expect(
      cvFilename({
        name: 'Roman Hrupskyi',
        headline: 'Senior Java Engineer | Lead Backend Engineer',
      }),
    ).toBe('Roman-Hrupskyi-Senior-Java-Engineer-CV.pdf');
  });

  it('is not a generic "cv" name', () => {
    const out = cvFilename({ name: 'Roman Hrupskyi', headline: 'Senior Java Engineer' });
    expect(out).not.toBe('cv.pdf');
    expect(out.toLowerCase()).not.toMatch(/^cv[.-]/);
    expect(out).toMatch(/-CV\.pdf$/);
  });

  it('slugs the whole headline when there is no pipe', () => {
    expect(cvFilename({ name: 'Ada Lovelace', headline: 'Principal Engineer' })).toBe(
      'Ada-Lovelace-Principal-Engineer-CV.pdf',
    );
  });

  it('folds diacritics / non-ASCII to an ASCII-safe filename', () => {
    const out = cvFilename({ name: 'Ámélie Dupré', headline: 'Señor Développeur' });
    expect(out).toBe('Amelie-Dupre-Senor-Developpeur-CV.pdf');
    expect(out).toMatch(/^[\w.-]+$/);
  });

  it('trims whitespace around the pipe segment', () => {
    expect(
      cvFilename({ name: 'Roman Hrupskyi', headline: '  Senior Java Engineer  |  Lead ' }),
    ).toBe('Roman-Hrupskyi-Senior-Java-Engineer-CV.pdf');
  });

  it('collapses double spaces and punctuation runs to a single dash, no leading/trailing dash', () => {
    expect(cvFilename({ name: 'Roman   Hrupskyi', headline: 'Java // Kotlin Engineer' })).toBe(
      'Roman-Hrupskyi-Java-Kotlin-Engineer-CV.pdf',
    );
  });
});
