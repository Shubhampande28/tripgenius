import { writeFileSync, readFileSync } from 'node:fs';
import { allCities } from '../../src/lib/cities';

interface Group { imageId: string; count: number; slugs: string[] }

const REJECT = ['flag', 'coat_of_arms', 'seal', 'logo', 'locator_map', '.svg', 'locationmap', 'emblem'];
// Not fetched: leh/ladakh share a correct regional photo; bodh_gaya is a literal
// duplicate slug (removed in apply step); bodh-gaya keeps its correct Mahabodhi photo.
const SKIP_FETCH = new Set(['leh', 'ladakh', 'bodh_gaya', 'bodh-gaya']);
const SKIPPED_INTENTIONAL = ['leh', 'ladakh', 'bodh_gaya'];

const UA = 'TripGenius-image-audit/1.0 (https://www.tripgenius.in; contact: hello@tripgenius.in)';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const cityBySlug = new Map(allCities.map((c) => [c.slug, c]));

function titleCase(slug: string): string {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Ordered Wikipedia page-title candidates for a slug, most specific first.
function candidates(slug: string): string[] {
  const city = cityBySlug.get(slug);
  const out: string[] = [];
  if (city) {
    const name = city.name;
    const country = city.country;
    const state = (city as { state?: string }).state;
    if (country === 'India') {
      if (state) out.push(`${name}, ${state}`);
      out.push(`${name}, India`);
      out.push(name);
    } else {
      if (country) out.push(`${name}, ${country}`);
      out.push(name);
    }
  } else {
    out.push(titleCase(slug));
  }
  return [...new Set(out)];
}

// Resolve to the full-size original Commons file URL (same shape as existing
// 'edinburgh' entry). Wikimedia only serves specific cached thumbnail widths
// per file — arbitrary widths 400 — so we use the always-valid base file and
// let Next/image handle display resizing.
function toOriginal(url: string): string {
  return url.replace('/commons/thumb/', '/commons/').replace(/\/\d+px-[^/]+$/, '');
}
function pickImage(summary: {
  thumbnail?: { source?: string };
  originalimage?: { source?: string };
}): string | null {
  const orig = summary.originalimage?.source;
  const thumb = summary.thumbnail?.source;
  if (orig) return orig;
  return thumb ? toOriginal(thumb) : null;
}

function isBadImage(url: string): boolean {
  const u = url.toLowerCase();
  return REJECT.some((bad) => u.includes(bad));
}

async function fetchSummary(title: string) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA, accept: 'application/json' } });
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function resolveImage(slug: string): Promise<{ url: string; via: string } | null> {
  for (const title of candidates(slug)) {
    const summary = await fetchSummary(title);
    await sleep(200); // rate-limit every API call
    if (!summary) continue;
    if (summary.type === 'disambiguation') continue;
    const img = pickImage(summary as Parameters<typeof pickImage>[0]);
    if (!img) continue;
    if (isBadImage(img)) continue;
    return { url: img, via: title };
  }
  return null;
}

async function main() {
  const groups: Group[] = JSON.parse(readFileSync('audit/duplicate-images.json', 'utf8'));
  const affected = [...new Set(groups.flatMap((g) => g.slugs))].sort();
  const toFetch = affected.filter((s) => !SKIP_FETCH.has(s));

  const fixed: Record<string, string> = {};
  const needsReview: string[] = [];

  const BATCH = 12;
  console.log(`Affected: ${affected.length} | fetching: ${toFetch.length} | skipped: ${affected.length - toFetch.length}\n`);

  for (let i = 0; i < toFetch.length; i += BATCH) {
    const batch = toFetch.slice(i, i + BATCH);
    console.log(`── Batch ${i / BATCH + 1} (${i + 1}-${Math.min(i + BATCH, toFetch.length)} of ${toFetch.length}) ──`);
    for (const slug of batch) {
      const result = await resolveImage(slug);
      if (result) {
        fixed[slug] = result.url;
        console.log(`  ✓ ${slug}  ←  "${result.via}"`);
      } else {
        needsReview.push(slug);
        console.log(`  ✗ ${slug}  (needs manual review)`);
      }
    }
  }

  const out = {
    fixed,
    'needs-manual-review': needsReview.sort(),
    'skipped-intentional': SKIPPED_INTENTIONAL,
  };
  writeFileSync('audit/image-fix-results.json', JSON.stringify(out, null, 2));

  console.log(`\nDONE  fixed=${Object.keys(fixed).length}  needs-review=${needsReview.length}  skipped=${SKIPPED_INTENTIONAL.length}`);
}

main();
