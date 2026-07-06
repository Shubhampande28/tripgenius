import { readFileSync, writeFileSync } from 'node:fs';

const REJECT = ['flag', 'coat_of_arms', 'seal', 'logo', 'locator_map', '.svg', 'locationmap', 'emblem'];
const UA = 'TripGenius-image-audit/1.0 (https://www.tripgenius.in; contact: hello@tripgenius.in)';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Curated, most-specific-first page titles for the slugs that need manual review.
const CANDIDATES: Record<string, string[]> = {
  amboseli: ['Amboseli National Park', 'Amboseli'],
  ayutthaya: ['Ayutthaya Historical Park', 'Phra Nakhon Si Ayutthaya', 'Ayutthaya Kingdom'],
  bumthang: ['Bumthang District', 'Jakar', 'Bumthang'],
  'digha-mandarmani': ['Digha', 'Digha, West Bengal', 'Mandarmani'],
  gangtey: ['Gangteng Monastery', 'Phobjikha Valley', 'Gangtey'],
  'hoi-an': ['Hội An', 'Hoi An'],
  'hong-kong': ['Hong Kong', 'Victoria Harbour', 'Hong Kong Island'],
  konark: ['Konark Sun Temple', 'Konark'],
  lonavala: ['Lonavala', 'Lonavla', 'Lonavala, Maharashtra'],
  'new-york': ['New York City'],
  'tirthan-valley': ['Tirthan Valley', 'Great Himalayan National Park', 'Tirthan River'],
  vadodara: ['Vadodara', 'Laxmi Vilas Palace, Vadodara', 'Laxmi Vilas Palace'],
  'ziro-valley': ['Ziro', 'Ziro, Arunachal Pradesh', 'Apatani'],
};

function toOriginal(url: string): string {
  return url.replace('/commons/thumb/', '/commons/').replace(/\/\d+px-[^/]+$/, '');
}
function isBad(url: string): boolean {
  const u = url.toLowerCase();
  return REJECT.some((b) => u.includes(b));
}
async function fetchSummary(title: string) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA, accept: 'application/json' } });
    if (!res.ok) return null;
    return (await res.json()) as Record<string, any>;
  } catch {
    return null;
  }
}

async function main() {
  const results = JSON.parse(readFileSync('audit/image-fix-results.json', 'utf8'));
  const newlyFixed: Record<string, string> = {};
  const stillReview: string[] = [];

  for (const slug of Object.keys(CANDIDATES)) {
    let done = false;
    const tried: string[] = [];
    for (const title of CANDIDATES[slug]) {
      const s = await fetchSummary(title);
      await sleep(200);
      if (!s) { tried.push(`${title}=no-page`); continue; }
      if (s.type === 'disambiguation') { tried.push(`${title}=disambig`); continue; }
      const raw = s.originalimage?.source || (s.thumbnail?.source ? toOriginal(s.thumbnail.source) : null);
      if (!raw) { tried.push(`${title}=no-image`); continue; }
      if (isBad(raw)) { tried.push(`${title}=rejected`); continue; }
      newlyFixed[slug] = raw;
      console.log(`  ✓ ${slug}  ←  "${title}"`);
      done = true;
      break;
    }
    if (!done) {
      stillReview.push(slug);
      console.log(`  ✗ ${slug}  [${tried.join(', ')}]`);
    }
  }

  // Merge into the canonical results file.
  Object.assign(results.fixed, newlyFixed);
  results['needs-manual-review'] = (results['needs-manual-review'] as string[])
    .filter((s) => !(s in newlyFixed))
    .sort();
  writeFileSync('audit/image-fix-results.json', JSON.stringify(results, null, 2));

  console.log(`\nnewly fixed=${Object.keys(newlyFixed).length}  still-review=${stillReview.length}: ${stillReview.join(', ')}`);
}

main();
