// One-off generator: builds a lightweight India state -> city index for the
// nav's cascading dropdown, without pulling full City objects (descriptions,
// images, itineraries, etc.) into the client bundle.
import { allCities } from '../src/lib/cities';
import { countries } from '../src/data/countries';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const india = countries.find((c) => c.slug === 'india')!;
const indiaCitySlugs = new Set(india.cities);

const authoredStateBySlug = new Map<string, string>();
for (const region of india.regions ?? []) {
  for (const slug of region.cities) authoredStateBySlug.set(slug, region.name);
}

const stateMap = new Map<string, { name: string; slug: string }[]>();
for (const city of allCities) {
  if (city.country !== 'India' || !indiaCitySlugs.has(city.slug) || city.stub) continue;
  const state = city.state ?? authoredStateBySlug.get(city.slug);
  if (!state) continue;
  const list = stateMap.get(state) ?? [];
  list.push({ name: city.name, slug: city.slug });
  stateMap.set(state, list);
}

const result = Array.from(stateMap.entries())
  .map(([state, cities]) => ({
    state,
    cities: cities.sort((a, b) => a.name.localeCompare(b.name)),
  }))
  .sort((a, b) => b.cities.length - a.cities.length || a.state.localeCompare(b.state));

const outPath = join(__dirname, '..', 'src', 'data', 'indiaNavIndex.json');
writeFileSync(outPath, JSON.stringify(result, null, 2) + '\n');
console.log(`Wrote ${result.length} states / ${result.reduce((n, s) => n + s.cities.length, 0)} cities to ${outPath}`);
