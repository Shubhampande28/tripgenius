import { writeFileSync } from 'node:fs';
import { allCities } from '../../src/lib/cities';
import { verifiedCityImages } from '../../src/lib/cityImages';

const missing: { slug: string; name: string; country: string; state?: string }[] = [];
for (const c of allCities) {
  if (!(c.slug in verifiedCityImages)) {
    missing.push({ slug: c.slug, name: c.name, country: c.country, state: (c as { state?: string }).state });
  }
}

// Duplicate image values currently in verifiedCityImages.
const byVal = new Map<string, string[]>();
for (const [slug, e] of Object.entries(verifiedCityImages)) {
  (byVal.get(e.card) ?? byVal.set(e.card, []).get(e.card)!).push(slug);
}
const dupGroups = [...byVal.entries()].filter(([, s]) => s.length >= 2).map(([id, s]) => ({ id, slugs: s }));

// Entries in verifiedCityImages with no matching city (orphans).
const citySlugs = new Set(allCities.map((c) => c.slug));
const orphans = Object.keys(verifiedCityImages).filter((s) => !citySlugs.has(s));

writeFileSync('audit/coverage.json', JSON.stringify({ missing, dupGroups, orphans }, null, 2));

console.log(`Total cities (allCities):        ${allCities.length}`);
console.log(`verifiedCityImages entries:      ${Object.keys(verifiedCityImages).length}`);
console.log(`Cities WITH an image:            ${allCities.length - missing.length}`);
console.log(`Cities MISSING an image:         ${missing.length}`);
console.log(`Remaining duplicate groups:      ${dupGroups.length}  -> ${dupGroups.map((g) => g.slugs.join('/')).join(', ') || 'none'}`);
console.log(`Orphan entries (no city):        ${orphans.length}  ${orphans.join(', ')}`);
console.log(`\nMissing by country:`);
const byCountry = new Map<string, number>();
for (const m of missing) byCountry.set(m.country, (byCountry.get(m.country) ?? 0) + 1);
for (const [c, n] of [...byCountry.entries()].sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(3)}  ${c}`);
