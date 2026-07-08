/**
 * verify:seo — build-time guard against accidental noindex regressions.
 *
 * Reads the prerendered output in .next/server/app (run `next build` first):
 *  1. Samples 10 known-good URLs per template (/cities, /countries, /visit,
 *     /itinerary, /best-time-to-visit, /compare, /blog, plus the homepage),
 *     taken from the generated sitemap so they are by definition
 *     "should-index" pages, and fails if any page's robots meta contains
 *     noindex.
 *  2. Enforces the global invariant: NO URL listed in the sitemap may carry a
 *     noindex robots meta.
 *
 * Run: npm run verify:seo   (exit 1 on any violation)
 * Note: the site sets robots exclusively via metadata (no X-Robots-Tag headers
 * in next.config or middleware); if headers are ever added, extend this check.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const APP = '.next/server/app';
const SITEMAP = join(APP, 'sitemap.xml.body');

if (!existsSync(SITEMAP)) {
  console.error('verify:seo: no build output found — run `next build` first.');
  process.exit(1);
}

const sitemap = readFileSync(SITEMAP, 'utf8');
const urls: string[] = [...sitemap.matchAll(/<loc>https:\/\/www\.tripgenius\.in([^<]*)<\/loc>/g)]
  .map((m) => m[1] || '/');

const TEMPLATES = ['/cities/', '/countries/', '/visit/', '/itinerary/', '/best-time-to-visit/', '/compare/', '/blog/'];

function htmlPathFor(url: string): string {
  if (url === '/') return join(APP, 'index.html');
  return join(APP, url.replace(/\/$/, '') + '.html');
}

function robotsMeta(url: string): string | null {
  const p = htmlPathFor(url);
  if (!existsSync(p)) return null; // dynamic route — nothing prerendered to check
  const html = readFileSync(p, 'utf8');
  return html.match(/<meta name="robots" content="([^"]+)"/)?.[1] ?? null;
}

let failures = 0;
const fail = (msg: string) => { failures++; console.error('  ✗ ' + msg); };

// ── 1. sampled known-good URLs per template ─────────────────────────────────
console.log('verify:seo — sampled template checks');
for (const t of TEMPLATES) {
  const sample = urls.filter((u) => u.startsWith(t)).slice(0, 10);
  if (sample.length === 0) { fail(`${t} has no URLs in the sitemap`); continue; }
  let bad = 0;
  for (const u of sample) {
    const meta = robotsMeta(u);
    if (meta && /noindex/i.test(meta)) { fail(`${u} → robots="${meta}"`); bad++; }
  }
  console.log(`  ${bad === 0 ? '✓' : '✗'} ${t} (${sample.length} sampled)`);
}
// homepage
const home = robotsMeta('/');
if (home && /noindex/i.test(home)) fail(`/ → robots="${home}"`);

// ── 2. invariant: nothing in the sitemap may be noindex ─────────────────────
console.log('verify:seo — full sitemap invariant');
let checked = 0;
for (const u of urls) {
  const meta = robotsMeta(u);
  if (meta === null) continue;
  checked++;
  if (/noindex/i.test(meta)) fail(`sitemap URL ${u} is noindexed → robots="${meta}"`);
}
console.log(`  checked ${checked}/${urls.length} sitemap URLs against built HTML`);

if (failures > 0) {
  console.error(`\nverify:seo FAILED — ${failures} violation(s).`);
  process.exit(1);
}
console.log('\nverify:seo passed — no known-good page carries noindex.');
