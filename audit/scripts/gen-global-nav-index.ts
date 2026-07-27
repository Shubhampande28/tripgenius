// One-off generator for src/data/globalNavIndex.json
// Run with: npx tsx audit/scripts/gen-global-nav-index.ts
import fs from 'fs';
import path from 'path';
import { countries } from '../../src/data/countries';
import { getCityBySlug } from '../../src/lib/cities';

const TARGET_SLUGS = ['thailand', 'indonesia', 'uae', 'vietnam', 'sri-lanka', 'nepal', 'singapore'];

type NavCity = { name: string; slug: string };
type NavGroup = { name: string; cities: NavCity[] };
type NavCountry = { countrySlug: string; countryLabel: string; groups: NavGroup[] };

function cityName(slug: string): string {
  const c = getCityBySlug(slug);
  if (c) return c.name;
  // Fallback: title-case the slug
  return slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}

const result: NavCountry[] = [];

for (const countrySlug of TARGET_SLUGS) {
  const country = countries.find(c => c.slug === countrySlug);
  if (!country) {
    console.warn(`Country not found: ${countrySlug}`);
    continue;
  }

  let groups: NavGroup[];
  if (country.regions && country.regions.length > 0) {
    groups = country.regions.map(r => ({
      name: r.name,
      cities: r.cities.map(slug => ({ name: cityName(slug), slug })),
    }));
  } else {
    groups = [
      {
        name: '',
        cities: country.cities.map(slug => ({ name: cityName(slug), slug })),
      },
    ];
  }

  result.push({
    countrySlug: country.slug,
    countryLabel: country.name,
    groups,
  });

  console.log(`${country.name}: ${groups.length} group(s), ${country.cities.length} total cities`);
}

const outPath = path.join(__dirname, '../../src/data/globalNavIndex.json');
fs.writeFileSync(outPath, JSON.stringify(result, null, 2) + '\n');
console.log(`Wrote ${outPath}`);
