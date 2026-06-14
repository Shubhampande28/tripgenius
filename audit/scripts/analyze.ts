import { writeFileSync, mkdirSync } from 'node:fs';
import { verifiedCityImages } from '../../src/lib/cityImages';

// Group slugs by identical image ID (card value; card === hero throughout).
const byId = new Map<string, string[]>();
for (const [slug, entry] of Object.entries(verifiedCityImages)) {
  const id = entry.card;
  const arr = byId.get(id) ?? [];
  arr.push(slug);
  byId.set(id, arr);
}

const groups = [...byId.entries()]
  .filter(([, slugs]) => slugs.length >= 2)
  .map(([imageId, slugs]) => ({ imageId, count: slugs.length, slugs: slugs.sort() }))
  .sort((a, b) => b.count - a.count);

const totalEntries = Object.keys(verifiedCityImages).length;
const affectedSlugs = groups.flatMap((g) => g.slugs);

mkdirSync('audit', { recursive: true });
writeFileSync('audit/duplicate-images.json', JSON.stringify(groups, null, 2));

console.log(`Total entries:          ${totalEntries}`);
console.log(`Duplicate groups (2+):  ${groups.length}`);
console.log(`Total affected slugs:   ${affectedSlugs.length}`);
console.log('');
console.log('Top groups by size:');
for (const g of groups.slice(0, 12)) {
  console.log(`  ${String(g.count).padStart(2)}x  ${g.imageId}  ->  ${g.slugs.join(', ')}`);
}
