import { readFileSync, writeFileSync } from 'node:fs';

const REJECT = ['flag', 'coat_of_arms', 'seal', 'logo', 'locator_map', '.svg', 'locationmap', 'emblem', 'map_of', 'topographic'];
const UA = 'TripGenius-image-audit/1.0 (https://www.tripgenius.in; contact: hello@tripgenius.in)';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Pull the page's media gallery and pick the first real photo.
const CANDIDATES: Record<string, string[]> = {
  amboseli: ['Amboseli National Park', 'Amboseli'],
  'hoi-an': ['Hội An Ancient Town', 'Hội An', 'Hoi An'],
};

function toOriginal(url: string): string {
  return url.replace('/commons/thumb/', '/commons/').replace(/\/\d+px-[^/]+$/, '');
}
function isBad(url: string): boolean {
  const u = url.toLowerCase();
  return REJECT.some((b) => u.includes(b)) || !/\.(jpe?g|png)$/i.test(toOriginal(url));
}

async function mediaList(title: string) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(title.replace(/ /g, '_'))}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA, accept: 'application/json' } });
    if (!res.ok) return null;
    return (await res.json()) as { items?: Array<{ type?: string; srcset?: Array<{ src?: string }> }> };
  } catch {
    return null;
  }
}

async function main() {
  const results = JSON.parse(readFileSync('audit/image-fix-results.json', 'utf8'));
  const newlyFixed: Record<string, string> = {};
  const stillReview: string[] = [];

  for (const slug of Object.keys(CANDIDATES)) {
    let picked: string | null = null;
    for (const title of CANDIDATES[slug]) {
      const ml = await mediaList(title);
      await sleep(200);
      if (!ml?.items) continue;
      for (const item of ml.items) {
        if (item.type !== 'image') continue;
        const src = item.srcset?.[0]?.src;
        if (!src) continue;
        const full = (src.startsWith('//') ? 'https:' + src : src);
        if (isBad(full)) continue;
        picked = toOriginal(full);
        console.log(`  ✓ ${slug}  ←  "${title}"  ${picked}`);
        break;
      }
      if (picked) break;
    }
    if (picked) newlyFixed[slug] = picked;
    else { stillReview.push(slug); console.log(`  ✗ ${slug}`); }
  }

  Object.assign(results.fixed, newlyFixed);
  results['needs-manual-review'] = (results['needs-manual-review'] as string[])
    .filter((s) => !(s in newlyFixed))
    .sort();
  writeFileSync('audit/image-fix-results.json', JSON.stringify(results, null, 2));
  console.log(`\nnewly fixed=${Object.keys(newlyFixed).length}  still-review=${stillReview.join(', ') || 'none'}`);
}

main();
