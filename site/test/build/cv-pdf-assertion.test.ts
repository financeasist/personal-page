import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { cvFilename } from '../../src/lib/cv-filename.js';

// AC-04 / AC-05 (CV channel) / E3 — the postbuild "file exists" assertion
// (ADR-0008). The committed PDF lives at the filename derived from name +
// headline; a missing or empty file fails the build naming the path.
const siteRoot = fileURLToPath(new URL('../../', import.meta.url));
const realProfile = JSON.parse(
  execFileSync('cat', [join(siteRoot, 'src/data/profile/roman.json')]).toString(),
) as { name: string; headline: string };

let scratch: string[] = [];
afterEach(() => {
  for (const dir of scratch) rmSync(dir, { recursive: true, force: true });
  scratch = [];
});

/** A throwaway mini-tree the assertion script can run against. */
function stageTree(opts: { profile?: object; pdf?: 'present' | 'empty' | 'absent' }): {
  cwd: string;
  run(): { code: number; out: string };
} {
  const root = mkdtempSync(join(tmpdir(), 'cv-pdf-assert-'));
  scratch.push(root);
  mkdirSync(join(root, 'scripts'), { recursive: true });
  mkdirSync(join(root, 'src/lib'), { recursive: true });
  mkdirSync(join(root, 'src/data/profile'), { recursive: true });
  mkdirSync(join(root, 'public'), { recursive: true });

  cpSync(join(siteRoot, 'scripts/assert-cv-pdf.mjs'), join(root, 'scripts/assert-cv-pdf.mjs'));
  cpSync(join(siteRoot, 'src/lib/cv-filename.js'), join(root, 'src/lib/cv-filename.js'));
  const profile = opts.profile ?? realProfile;
  writeFileSync(join(root, 'src/data/profile/roman.json'), JSON.stringify(profile));

  const pdf = opts.pdf ?? 'present';
  if (pdf !== 'absent') {
    const name = cvFilename(profile as { name: string; headline: string });
    writeFileSync(join(root, 'public', name), pdf === 'empty' ? '' : '%PDF-1.4 stub');
  }

  return {
    cwd: root,
    run() {
      try {
        const out = execFileSync('node', ['scripts/assert-cv-pdf.mjs'], {
          cwd: root,
          stdio: 'pipe',
        }).toString();
        return { code: 0, out };
      } catch (err) {
        const e = err as { status?: number; stdout?: Buffer; stderr?: Buffer };
        return { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
      }
    },
  };
}

describe('cv-filename ↔ committed PDF (AC-04)', () => {
  it('the committed site/public/ PDF is at the derived filename', () => {
    const name = cvFilename(realProfile);
    expect(name).toBe('Roman-Hrupskyi-Senior-Java-Engineer-CV.pdf');
    expect(existsSync(join(siteRoot, 'public', name))).toBe(true);
  });
});

describe('assert-cv-pdf postbuild', () => {
  it('passes against the real site tree (committed PDF in place)', () => {
    const out = execFileSync('node', ['scripts/assert-cv-pdf.mjs'], {
      cwd: siteRoot,
      stdio: 'pipe',
    }).toString();
    expect(out).toMatch(/ok — public\/Roman-Hrupskyi-Senior-Java-Engineer-CV\.pdf/);
  });

  it('passes when the derived PDF is present and non-empty', () => {
    expect(stageTree({ pdf: 'present' }).run().code).toBe(0);
  });

  it('fails and names the expected path when the file is missing (E3)', () => {
    const r = stageTree({ pdf: 'absent' }).run();
    expect(r.code).toBe(1);
    expect(r.out).toContain('Roman-Hrupskyi-Senior-Java-Engineer-CV.pdf');
    expect(r.out).toMatch(/public/);
  });

  it('treats a 0-byte file as missing', () => {
    expect(stageTree({ pdf: 'empty' }).run().code).toBe(1);
  });

  it('looks for the new name when name/headline change — surfacing drift (spec §7)', () => {
    const r = stageTree({
      profile: { name: 'Roman Hrupskyi', headline: 'Staff Engineer' },
      pdf: 'absent',
    }).run();
    expect(r.code).toBe(1);
    expect(r.out).toContain('Roman-Hrupskyi-Staff-Engineer-CV.pdf');
  });
});
