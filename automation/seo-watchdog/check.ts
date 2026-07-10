// SEO watchdog — daily regression guard for tripgenius.in.
// Prevents regressions like the accidental-noindex incident from silently
// returning: samples live pages from the sitemap and checks the invariants
// that, when broken, cost rankings for weeks before anyone notices.
//
// Usage: npx tsx automation/seo-watchdog/check.ts
// Exit 1 on any CRITICAL failure (noindex, non-200, missing canonical);
// exit 0 with warnings otherwise. Writes last-report.json next to itself.

import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const BASE = 'https://www.tripgenius.in';
const SITEMAP_INDEX = `${BASE}/sitemap.xml`;
const UA = 'TripGeniusWatchdog/1.0 (+https://www.tripgenius.in)';
const PER_SITEMAP_SAMPLE = 10;
const CONCURRENCY = 5;

// Always checked, regardless of the random sample — the pages the SEO
// strategy depends on most (per the July 2026 GSC baseline).
const CRITICAL_URLS = [
  `${BASE}/`,
  `${BASE}/itinerary/brazil-5-days`,
  `${BASE}/itinerary/india-3-days`,
  `${BASE}/visit/manali/july`,
  `${BASE}/visit/bengaluru/july`,
  `${BASE}/cities/bali`,
  `${BASE}/countries/india`,
];

type Severity = 'CRITICAL' | 'WARNING';
interface Finding { url: string; severity: Severity; check: string; detail: string }

const findings: Finding[] = [];
const add = (url: string, severity: Severity, check: string, detail: string) =>
  findings.push({ url, severity, check, detail });

async function fetchText(url: string): Promise<Response> {
  return fetch(url, { headers: { 'User-Agent': UA }, redirect: 'manual' });
}

function sample<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

async function buildUrlSet(): Promise<string[]> {
  const res = await fetchText(SITEMAP_INDEX);
  if (!res.ok) throw new Error(`Failed to fetch sitemap index: ${res.status}`);
  const xml = await res.text();
  const $ = cheerio.load(xml, { xmlMode: true });

  const childSitemaps = $('sitemapindex sitemap loc').map((_, el) => $(el).text().trim()).get();
  const urls = new Set<string>(CRITICAL_URLS);

  if (childSitemaps.length === 0) {
    // Single-file sitemap: sample directly from it.
    const locs = $('urlset url loc').map((_, el) => $(el).text().trim()).get();
    for (const u of sample(locs, PER_SITEMAP_SAMPLE * 4)) urls.add(u);
  } else {
    for (const sm of childSitemaps) {
      const smRes = await fetchText(sm);
      if (!smRes.ok) {
        add(sm, 'WARNING', 'sitemap-fetch', `Child sitemap returned ${smRes.status}`);
        continue;
      }
      const $$ = cheerio.load(await smRes.text(), { xmlMode: true });
      const locs = $$('url loc').map((_, el) => $$(el).text().trim()).get();
      for (const u of sample(locs, PER_SITEMAP_SAMPLE)) urls.add(u);
    }
  }
  return [...urls];
}

interface PageMeta { title?: string }
const titles = new Map<string, string[]>(); // normalized title -> urls (uniqueness check)

async function checkUrl(url: string): Promise<void> {
  let res: Response;
  try {
    res = await fetchText(url);
  } catch (err) {
    add(url, 'CRITICAL', 'fetch', `Fetch failed: ${err}`);
    return;
  }

  if (res.status !== 200) {
    add(url, 'CRITICAL', 'status', `HTTP ${res.status}${res.headers.get('location') ? ` → ${res.headers.get('location')}` : ''}`);
    return;
  }

  const xRobots = res.headers.get('x-robots-tag') ?? '';
  if (/noindex/i.test(xRobots)) {
    add(url, 'CRITICAL', 'noindex-header', `X-Robots-Tag: ${xRobots}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  const robotsMeta = $('meta[name="robots"]').attr('content') ?? '';
  if (/noindex/i.test(robotsMeta)) {
    add(url, 'CRITICAL', 'noindex-meta', `<meta name="robots" content="${robotsMeta}">`);
  }

  const title = $('title').first().text().trim();
  if (!title) {
    add(url, 'WARNING', 'title', 'Missing <title>');
  } else {
    if (title.length < 15 || title.length > 60) {
      add(url, 'WARNING', 'title-length', `${title.length} chars: "${title}"`);
    }
    const key = title.toLowerCase();
    titles.set(key, [...(titles.get(key) ?? []), url]);
  }

  const desc = $('meta[name="description"]').attr('content')?.trim() ?? '';
  if (!desc) add(url, 'WARNING', 'description', 'Missing meta description');
  else if (desc.length < 50 || desc.length > 155) {
    add(url, 'WARNING', 'description-length', `${desc.length} chars`);
  }

  const canonical = $('link[rel="canonical"]').attr('href')?.trim();
  if (!canonical) {
    add(url, 'CRITICAL', 'canonical', 'Missing canonical tag');
  } else {
    // new URL() normalizes the bare-domain/trailing-slash equivalence
    // ("https://x.in" and "https://x.in/" are the same resource).
    let same = false;
    try { same = new URL(canonical).href === new URL(url).href; } catch { /* malformed → mismatch */ }
    if (!same) add(url, 'CRITICAL', 'canonical-mismatch', `canonical="${canonical}" ≠ fetched URL`);
  }

  // JSON-LD: at least one valid block; expected @types per route family.
  const ldTypes = new Set<string>();
  let anyValidLd = false;
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const parsed = JSON.parse($(el).text());
      anyValidLd = true;
      for (const node of Array.isArray(parsed) ? parsed : [parsed]) {
        if (node && typeof node['@type'] === 'string') ldTypes.add(node['@type']);
      }
    } catch {
      add(url, 'WARNING', 'jsonld-parse', 'A JSON-LD block failed to parse');
    }
  });
  if (!anyValidLd) add(url, 'WARNING', 'jsonld', 'No valid JSON-LD block found');

  const pathName = new URL(url).pathname;
  if (pathName.startsWith('/itinerary/')) {
    for (const required of ['ItemList', 'FAQPage']) {
      if (!ldTypes.has(required)) add(url, 'WARNING', 'jsonld-type', `/itinerary/ page missing ${required} schema`);
    }
  }
  if (pathName.startsWith('/visit/') && !ldTypes.has('FAQPage')) {
    add(url, 'WARNING', 'jsonld-type', '/visit/ page missing FAQPage schema');
  }

  const h1Count = $('h1').length;
  if (h1Count !== 1) add(url, 'WARNING', 'h1', `Found ${h1Count} <h1> elements (expected exactly 1)`);
}

async function run() {
  console.log('🔍 Building URL sample from sitemap…');
  const urls = await buildUrlSet();
  console.log(`Checking ${urls.length} URLs (concurrency ${CONCURRENCY})…`);

  const queue = [...urls];
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (queue.length) {
        const url = queue.shift()!;
        await checkUrl(url);
      }
    }),
  );

  // Duplicate-title check across the sampled set.
  for (const [, dupUrls] of titles) {
    if (dupUrls.length > 1) {
      add(dupUrls[0], 'WARNING', 'title-duplicate', `Same title on ${dupUrls.length} pages: ${dupUrls.join(', ')}`);
    }
  }

  const critical = findings.filter((f) => f.severity === 'CRITICAL');
  const warnings = findings.filter((f) => f.severity === 'WARNING');

  const report = {
    checkedAt: new Date().toISOString(),
    urlsChecked: urls.length,
    criticalCount: critical.length,
    warningCount: warnings.length,
    findings,
  };
  const dir = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
  fs.writeFileSync(path.join(dir, 'last-report.json'), JSON.stringify(report, null, 2));

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`Checked ${urls.length} URLs — ${critical.length} critical, ${warnings.length} warnings\n`);
  for (const f of critical) console.log(`  🚨 [${f.check}] ${f.url}\n     ${f.detail}`);
  for (const f of warnings) console.log(`  ⚠️  [${f.check}] ${f.url}\n     ${f.detail}`);
  if (findings.length === 0) console.log('  ✅ All checks passed');

  process.exit(critical.length > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
