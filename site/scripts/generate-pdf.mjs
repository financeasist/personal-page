// Build-time CV PDF generator (postbuild hook).
// Serves site/dist, loads /cv in headless Chromium, writes a MEANINGFULLY-NAMED
// A4 PDF into dist/ (derived from the profile name + headline). The site is the
// single source of truth — this PDF is never committed. See docs/adr/0004.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
};

function resolveFile(urlPath) {
  let p = decodeURIComponent(urlPath.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  let full = join(dist, p);
  if (!extname(full) && existsSync(full + '.html')) full += '.html';
  if (!extname(full) && existsSync(join(full, 'index.html'))) full = join(full, 'index.html');
  return full;
}

const server = createServer(async (req, res) => {
  try {
    const full = resolveFile(req.url);
    const body = await readFile(full);
    res.writeHead(200, { 'content-type': MIME[extname(full)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
});

function slug(s) {
  return s
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

const profile = JSON.parse(
  await readFile(new URL('../src/data/profile/roman.json', import.meta.url), 'utf8'),
);
const headlineLead = profile.headline.split('|')[0].trim();
const filename = `${slug(profile.name)}-${slug(headlineLead)}-CV.pdf`;

await new Promise((r) => server.listen(0, r));
const port = server.address().port;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`http://localhost:${port}/cv`, { waitUntil: 'networkidle' });
await page.pdf({
  path: join(dist, filename),
  format: 'A4',
  printBackground: true,
});
await browser.close();
server.close();

console.log(`generated dist/${filename}`);
