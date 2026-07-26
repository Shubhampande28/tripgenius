import { countries } from '../src/data/countries';
import { getCityBySlug } from '../src/lib/cities';

const rows = countries.map((c) => {
  const cities = c.cities.map((s) => getCityBySlug(s)).filter(Boolean) as NonNullable<ReturnType<typeof getCityBySlug>>[];
  const indexable = cities.filter((ci) => !ci.stub);
  return { slug: c.slug, name: c.name, total: c.cities.length, indexable: indexable.length };
}).sort((a, b) => b.total - a.total);

console.log('country'.padEnd(18), 'total'.padStart(6), 'indexable'.padStart(11));
for (const r of rows) {
  console.log(r.name.padEnd(18), String(r.total).padStart(6), String(r.indexable).padStart(11));
}
