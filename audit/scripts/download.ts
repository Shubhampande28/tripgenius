import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
import { verifiedCityImages } from '../../src/lib/cityImages';

const UA = 'TripGenius-image-audit/1.0 (https://www.tripgenius.in; contact: hello@tripgenius.in)';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const OUT = 'public/city-images';
mkdirSync(OUT, { recursive: true });

// Only localise the Wikimedia-hosted entries (Unsplash/Pexels are reliable CDNs).
const targets = Object.entries(verifiedCityImages).filter(([, e]) => /wikimedia\.org/.test(e.card));

async function download(url: string): Promise<Buffer | null> {
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, accept: 'image/*' } });
      if (res.status === 429 || res.status === 503) { await sleep(1500 * attempt); continue; }
      if (!res.ok) return null;
      return Buffer.from(await res.arrayBuffer());
    } catch {
      await sleep(800 * attempt);
    }
  }
  return null;
}

async function main() {
  const map: Record<string, string> = {};
  const failures: string[] = [];
  console.log(`Localising ${targets.length} Wikimedia images → ${OUT}/\n`);

  let i = 0;
  for (const [slug, entry] of targets) {
    i++;
    const buf = await download(entry.card);
    if (!buf) { failures.push(slug); console.log(`  ✗ ${slug}`); await sleep(350); continue; }
    try {
      await sharp(buf)
        .flatten({ background: '#ffffff' })
        .resize({ width: 1200, withoutEnlargement: true })
        .jpeg({ quality: 80, mozjpeg: true })
        .toFile(`${OUT}/${slug}.jpg`);
      map[slug] = `/city-images/${slug}.jpg`;
    } catch (e) {
      failures.push(slug);
      console.log(`  ✗ ${slug} (resize: ${(e as Error).message})`);
      await sleep(350);
      continue;
    }
    if (i % 15 === 0 || i === targets.length) console.log(`  …${i}/${targets.length} done`);
    await sleep(300);
  }

  writeFileSync('audit/local-images.json', JSON.stringify({ map, failures }, null, 2));
  console.log(`\nDONE  saved=${Object.keys(map).length}  failed=${failures.length}  ${failures.join(', ')}`);
}
main();
