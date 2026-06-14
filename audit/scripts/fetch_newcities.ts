import { writeFileSync } from 'node:fs';

const UA = 'TripGenius-image-audit/1.0 (https://www.tripgenius.in)';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const REJECT = ['flag', 'coat_of_arms', 'seal', 'logo', 'locator_map', '.svg', 'locationmap', 'emblem', 'map_of'];
const toOriginal = (u: string) => u.replace('/commons/thumb/', '/commons/').replace(/\/\d+px-[^/]+$/, '');
const isBad = (u: string) => { const l = u.toLowerCase(); return REJECT.some((b) => l.includes(b)) || !/\.(jpe?g|png)$/i.test(toOriginal(u)); };

// slug -> ordered Wikipedia title candidates
const TITLES: Record<string, string[]> = {
  dehradun: ['Dehradun'],
  trivandrum: ['Thiruvananthapuram'],
  kozhikode: ['Kozhikode'],
  thrissur: ['Thrissur'],
  vrindavan: ['Vrindavan'],
  shirdi: ['Shirdi'],
  patna: ['Patna'],
  nagpur: ['Nagpur'],
  indore: ['Indore'],
  raipur: ['Raipur'],
  vijayawada: ['Vijayawada'],
  'port-blair': ['Port Blair'],
  ranchi: ['Ranchi'],
  salem: ['Salem, Tamil Nadu', 'Salem district, India'],
};

async function summary(title: string) {
  const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`, { headers: { 'User-Agent': UA } });
  if (!r.ok) return null;
  return (await r.json()) as any;
}
async function mediaImg(title: string): Promise<string | null> {
  const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(title.replace(/ /g, '_'))}`, { headers: { 'User-Agent': UA } });
  if (!r.ok) return null;
  const j = (await r.json()) as any;
  for (const it of j.items ?? []) {
    if (it.type !== 'image') continue;
    const src = it.srcset?.[0]?.src;
    if (!src) continue;
    const full = src.startsWith('//') ? 'https:' + src : src;
    if (!isBad(full)) return toOriginal(full);
  }
  return null;
}

async function main() {
  const out: Record<string, any> = {};
  for (const slug of Object.keys(TITLES)) {
    let rec: any = null;
    for (const title of TITLES[slug]) {
      const s = await summary(title);
      await sleep(220);
      if (!s || s.type === 'disambiguation') continue;
      let img = s.originalimage?.source || (s.thumbnail?.source ? toOriginal(s.thumbnail.source) : null);
      if (img && isBad(img)) img = null;
      if (!img) { img = await mediaImg(title); await sleep(220); }
      rec = {
        title: s.title,
        extract: s.extract,
        coordinates: s.coordinates ? { lat: s.coordinates.lat, lng: s.coordinates.lon } : null,
        image: img,
      };
      break;
    }
    out[slug] = rec;
    console.log(`${rec?.image ? '✓' : '✗'} ${slug}  coords=${rec?.coordinates ? 'yes' : 'no'}  img=${rec?.image ? 'yes' : 'NO'}`);
  }
  writeFileSync('audit/new-cities.json', JSON.stringify(out, null, 2));
  console.log('\nwrote audit/new-cities.json');
}
main();
