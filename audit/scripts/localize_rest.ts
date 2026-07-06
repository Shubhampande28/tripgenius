import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
import { verifiedCityImages, getCityImageUrl } from '../../src/lib/cityImages';
import { allCities } from '../../src/lib/cities';

const UA = 'TripGenius-image-audit/1.0 (https://www.tripgenius.in; contact: hello@tripgenius.in)';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const OUT = 'public/city-images';
mkdirSync(OUT, { recursive: true });

const REJECT = ['flag', 'coat_of_arms', 'seal', 'logo', 'locator_map', '.svg', 'locationmap', 'emblem', 'map_of', 'topographic'];
const toOriginal = (u: string) => u.replace('/commons/thumb/', '/commons/').replace(/\/\d+px-[^/]+$/, '');
const isBad = (u: string) => { const l = u.toLowerCase(); return REJECT.some((b) => l.includes(b)) || !/\.(jpe?g|png)$/i.test(toOriginal(u)); };

// Flagship full-guide cities keep their curated hero photo (just localised).
const KEEP_CURATED = new Set(['bali', 'bangkok', 'tokyo', 'dubai', 'goa']);

const cityBy = new Map(allCities.map((c) => [c.slug, c]));
const rest = Object.entries(verifiedCityImages).filter(([, e]) => !e.card.startsWith('/city-images/'));

function candidates(slug: string): string[] {
  const c = cityBy.get(slug);
  if (!c) return [slug.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ')];
  const name = c.name, country = c.country, state = (c as { state?: string }).state;
  const out = country === 'India'
    ? [state ? `${name}, ${state}` : '', `${name}, India`, name]
    : [`${name}, ${country}`, name];
  return [...new Set(out.filter(Boolean))];
}

async function getJson(url: string) {
  try { const r = await fetch(url, { headers: { 'User-Agent': UA, accept: 'application/json' } }); return r.ok ? await r.json() : null; }
  catch { return null; }
}
async function wikiImage(slug: string, used: Set<string>): Promise<string | null> {
  for (const title of candidates(slug)) {
    const s = await getJson(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`);
    await sleep(180);
    if (s && s.type !== 'disambiguation') {
      const raw = s.originalimage?.source || (s.thumbnail?.source ? toOriginal(s.thumbnail.source) : null);
      if (raw && !isBad(raw) && !used.has(raw)) return raw;
    }
  }
  // media-list fallback
  for (const title of candidates(slug)) {
    const ml = await getJson(`https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(title.replace(/ /g, '_'))}`);
    await sleep(180);
    for (const it of ml?.items ?? []) {
      if (it.type !== 'image') continue;
      const src = it.srcset?.[0]?.src; if (!src) continue;
      const full = toOriginal(src.startsWith('//') ? 'https:' + src : src);
      if (!isBad(full) && !used.has(full)) return full;
    }
  }
  return null;
}

async function download(url: string): Promise<Buffer | null> {
  for (let a = 1; a <= 4; a++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA, accept: 'image/*' } });
      if (r.status === 429 || r.status === 503) { await sleep(1500 * a); continue; }
      if (!r.ok) return null;
      return Buffer.from(await r.arrayBuffer());
    } catch { await sleep(800 * a); }
  }
  return null;
}
async function saveResized(buf: Buffer, slug: string) {
  await sharp(buf).flatten({ background: '#ffffff' }).resize({ width: 1200, withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true }).toFile(`${OUT}/${slug}.jpg`);
}

async function main() {
  console.log(`Remaining non-local entries: ${rest.length}\n`);
  const map: Record<string, string> = {};
  const viaWiki: string[] = [], curated: string[] = [], failed: string[] = [];
  const usedUrls = new Set<string>();
  let i = 0;

  for (const [slug] of rest) {
    i++;
    let url: string | null = null;
    let source = '';
    if (!KEEP_CURATED.has(slug)) { url = await wikiImage(slug, usedUrls); if (url) source = 'wiki'; }
    if (!url) { url = getCityImageUrl(slug, 'hero'); source = 'curated'; } // localise existing image
    if (!url) { failed.push(slug); console.log(`  ✗ ${slug}`); continue; }

    const buf = await download(url);
    if (!buf) { failed.push(slug); console.log(`  ✗ ${slug} (download)`); await sleep(300); continue; }
    try { await saveResized(buf, slug); } catch { failed.push(slug); console.log(`  ✗ ${slug} (resize)`); await sleep(300); continue; }

    map[slug] = `/city-images/${slug}.jpg`;
    usedUrls.add(url);
    (source === 'wiki' ? viaWiki : curated).push(slug);
    if (i % 15 === 0 || i === rest.length) console.log(`  …${i}/${rest.length}  (wiki=${viaWiki.length} curated=${curated.length} failed=${failed.length})`);
    await sleep(250);
  }

  writeFileSync('audit/localize-rest.json', JSON.stringify({ map, viaWiki, curated, failed }, null, 2));
  console.log(`\nDONE  total=${Object.keys(map).length}  viaWiki=${viaWiki.length}  curated(localised)=${curated.length}  failed=${failed.length} ${failed.join(', ')}`);
}
main();
