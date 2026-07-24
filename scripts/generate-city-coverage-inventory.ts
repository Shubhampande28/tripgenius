import { writeFileSync } from 'node:fs';
import { allCities } from '../src/lib/cities';
import { countries } from '../src/data/countries';
import { rankedIndianTouristCities } from '../src/lib/rankedIndianTouristCities';

const grouped = new Map<string, string[]>();
for (const city of allCities) {
  const names = grouped.get(city.country) ?? [];
  names.push(city.name);
  grouped.set(city.country, names);
}

const mapsReady = allCities.filter((city) => city.coordinates).length;
const authoredFull = allCities.filter((city) =>
  !city.offbeatSynthetic &&
  !city.restaurantsSynthetic &&
  !city.proTipsSynthetic &&
  !city.gettingAroundSynthetic
).length;

const rows = [...grouped.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([country, names]) => {
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    return `| ${country} | ${sorted.length} | ${sorted.join(', ')} |`;
  })
  .join('\n');

const hubs = countries.map((country) => country.name).sort((a, b) => a.localeCompare(b)).join(', ');
const snapshot = `# TripGenius City Coverage Inventory

Generated: ${new Date().toISOString().slice(0, 10)}

This file is generated from the application data. Regenerate it with:

\`\`\`bash
npx tsx scripts/generate-city-coverage-inventory.ts
\`\`\`

## Coverage summary

- City guides: **${allCities.length}**
- Country hubs: **${countries.length}**
- Fully authored deep city sections: **${authoredFull}**
- Safely derived deep city sections: **${allCities.length - authoredFull}**
- Cities with map coordinates: **${mapsReady}**
- Cities using the map placeholder: **${allCities.length - mapsReady}**

## Covered cities by country

| Country | Count | Covered cities |
|---|---:|---|
${rows}

## Country hubs

${hubs}

## Validation

\`\`\`bash
npm run verify:parity
\`\`\`
`;

writeFileSync('docs/city-coverage-inventory.md', snapshot, 'utf8');

const rankedRows = rankedIndianTouristCities
  .map((city, index) => `| ${index + 1} | ${Math.floor(index / 10) + 5} | ${city.name} | ${city.state} | Complete |`)
  .join('\n');
writeFileSync('docs/ranked-indian-expansion-50.md', `# Ranked India Tourist Expansion: 50

Generated: ${new Date().toISOString().slice(0, 10)}

Ranking is a composite editorial priority based on traveller-review signals,
official tourism coverage, heritage importance, and geographic balance. It is
not presented as a single platform's numerical rating.

| Rank | Delivery batch | Destination | State or union territory | Status |
|---:|---:|---|---|---|
${rankedRows}
`, 'utf8');

const indianCities = allCities.filter((city) => city.country === 'India');
const stateCounts = new Map<string, number>();
for (const city of indianCities) {
  const state = city.state || 'Unassigned';
  stateCounts.set(state, (stateCounts.get(state) ?? 0) + 1);
}
const stateRows = [...stateCounts]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([state, count]) => `| ${state} | ${count} |`)
  .join('\n');
writeFileSync('docs/india-state-tourism-coverage.md', `# India State Tourism Coverage

Generated: ${new Date().toISOString().slice(0, 10)}

- Indian destination guides: **${indianCities.length}**
- States, union territories, and cross-border state groupings represented: **${stateCounts.size}**

| State or union territory | Guides |
|---|---:|
${stateRows}

Dzukou Valley retains the cross-border label \`Nagaland / Manipur\`.
`, 'utf8');
