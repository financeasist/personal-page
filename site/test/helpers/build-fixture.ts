import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHTML } from 'linkedom';

/**
 * Runs a REAL `astro build` in an isolated temp root whose `profile` content
 * entry is replaced with the given fixture, then exposes the emitted `dist/`
 * for assertions. This is the "real pipeline, ephemeral fixtures" integration
 * strategy from spec.md §Test plan — `astro:content` + the Zod schema + its
 * `.refine()` invariants + the `postbuild` step, not a mock.
 *
 * `src/` is copied (a handful of small files); `node_modules`, `astro.config`,
 * `tsconfig`, `public` are symlinked. Builds are cached by a hash of the inputs
 * so a repeated fixture within a run costs nothing.
 */
const siteRoot = fileURLToPath(new URL('../../', import.meta.url));
const cacheRoot = join(tmpdir(), 'personal-landing-build-fixture');

export interface BuildResult {
  ok: boolean;
  stderr: string;
  distDir: string;
  /** Parsed document for a built route, e.g. `html('/')` or `html('/_probe')`. */
  html(route: string): Document;
  /** Raw text of a file under `dist/`, or `null` if absent. */
  file(relPath: string): string | null;
  exists(relPath: string): boolean;
}

export interface BuildFixtureOptions {
  /** The `profile` document — an object (JSON-stringified) or a raw JSON string. */
  profile?: unknown;
  /** Extra pages to drop into `src/pages/`, keyed by filename (`_probe.astro`). */
  pages?: Record<string, string>;
  /** Remove these paths (relative to the temp root) before building. */
  remove?: string[];
  /** Skip the `postbuild` step (CV PDF assertion / generation). Default true. */
  skipPostbuild?: boolean;
}

export function buildFixture(opts: BuildFixtureOptions = {}): BuildResult {
  const { profile, pages = {}, remove = [], skipPostbuild = true } = opts;

  const key = createHash('sha1')
    .update(JSON.stringify({ profile, pages, remove, skipPostbuild }))
    .digest('hex')
    .slice(0, 16);
  const root = join(cacheRoot, key);
  const distDir = join(root, 'dist');

  if (!existsSync(join(root, '.built'))) {
    rmSync(root, { recursive: true, force: true });
    mkdirSync(root, { recursive: true });

    for (const entry of ['node_modules', 'tsconfig.json', 'public']) {
      const target = join(siteRoot, entry);
      if (existsSync(target)) symlinkSync(target, join(root, entry));
    }
    cpSync(join(siteRoot, 'src'), join(root, 'src'), { recursive: true });
    // Per-fixture astro.config that re-exports the real one but pins Vite's
    // cacheDir INSIDE the temp root — otherwise every parallel `astro build`
    // shares the real `node_modules/.vite` dep-optimizer cache and races.
    writeFileSync(
      join(root, 'astro.config.mjs'),
      `import base from ${JSON.stringify(join(siteRoot, 'astro.config.mjs'))};\n` +
        `export default { ...base, vite: { ...(base.vite ?? {}), ` +
        `cacheDir: new URL('./.vite/', import.meta.url).pathname } };\n`,
    );
    // package.json: keep build, drop/neutralise postbuild for a clean unit of work.
    const pkg = JSON.parse(readFileSync(join(siteRoot, 'package.json'), 'utf8'));
    if (skipPostbuild) delete pkg.scripts.postbuild;
    writeFileSync(join(root, 'package.json'), JSON.stringify(pkg, null, 2));

    if (profile !== undefined) {
      const body = typeof profile === 'string' ? profile : JSON.stringify(profile, null, 2);
      writeFileSync(join(root, 'src/data/profile/roman.json'), body);
    }
    for (const [name, source] of Object.entries(pages)) {
      const dest = join(root, 'src/pages', name);
      mkdirSync(dirname(dest), { recursive: true });
      writeFileSync(dest, source);
    }
    for (const rel of remove) rmSync(join(root, rel), { recursive: true, force: true });

    try {
      execFileSync('npx', ['astro', 'build'], { cwd: root, stdio: 'pipe' });
      writeFileSync(join(root, '.built'), 'ok');
      writeFileSync(join(root, '.stderr'), '');
    } catch (err: unknown) {
      const e = err as { stderr?: Buffer; stdout?: Buffer; message?: string };
      const stderr = `${e.stdout?.toString() ?? ''}${e.stderr?.toString() ?? ''}${e.message ?? ''}`;
      writeFileSync(join(root, '.built'), 'fail');
      writeFileSync(join(root, '.stderr'), stderr);
    }
  }

  const ok = readFileSync(join(root, '.built'), 'utf8') === 'ok';
  const stderr = existsSync(join(root, '.stderr')) ? readFileSync(join(root, '.stderr'), 'utf8') : '';

  return {
    ok,
    stderr,
    distDir,
    html(route: string) {
      const rel = route.replace(/^\//, '').replace(/\/$/, '');
      const path = join(distDir, rel === '' ? 'index.html' : `${rel}/index.html`);
      return parseHTML(readFileSync(path, 'utf8')).document as unknown as Document;
    },
    file(relPath: string) {
      const p = join(distDir, relPath);
      return existsSync(p) ? readFileSync(p, 'utf8') : null;
    },
    exists(relPath: string) {
      return existsSync(join(distDir, relPath));
    },
  };
}

/** Wipe the build cache — call from a global teardown if disk pressure matters. */
export function clearBuildFixtureCache(): void {
  rmSync(cacheRoot, { recursive: true, force: true });
}
