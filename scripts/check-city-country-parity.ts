import { allCities } from '../src/lib/cities';
import { countries } from '../src/data/countries';
import { getCityFaqs } from '../src/lib/cityFaqs';
import { getCityImageUrl } from '../src/lib/cityImages';
import { similarityMap } from '../src/lib/similarity';

const failures: string[] = [];

function assert(condition: unknown, message: string) {
  if (!condition) failures.push(message);
}

function duplicates(values: string[]) {
  return [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
}

const cityBySlug = new Map(allCities.map((city) => [city.slug, city]));
const memberships = new Map<string, string[]>();

for (const country of countries) {
  assert(country.cities.length > 0, `Country has no cities: ${country.slug}`);
  for (const citySlug of country.cities) {
    assert(cityBySlug.has(citySlug), `Broken country city reference: ${country.slug} -> ${citySlug}`);
    memberships.set(citySlug, [...(memberships.get(citySlug) ?? []), country.slug]);
  }
}

assert(duplicates(allCities.map((city) => city.slug)).length === 0, 'Duplicate city slugs found');
assert(duplicates(countries.map((country) => country.slug)).length === 0, 'Duplicate country slugs found');

for (const city of allCities) {
  const memberOf = memberships.get(city.slug) ?? [];
  assert(memberOf.length === 1, `${city.slug} belongs to ${memberOf.length} country hubs`);
  assert(Boolean(city.thingsToDo?.length), `${city.slug} has no things to do`);
  assert(Boolean(city.neighbourhoods?.length), `${city.slug} has no destination areas`);
  assert(Boolean(city.monthByMonth?.months.length === 12), `${city.slug} has incomplete month data`);
  assert(Boolean(city.budgetBreakdown?.tiers.length === 3), `${city.slug} has incomplete budget tiers`);
  assert(Boolean(city.offbeatPlaces?.length), `${city.slug} has no hidden-gem guidance`);
  assert(Boolean(city.restaurants?.length), `${city.slug} has no food guidance`);
  assert(Boolean(city.proTips?.length), `${city.slug} has no practical tips`);
  assert(Boolean(city.gettingAround?.length), `${city.slug} has no transport guidance`);
  assert(getCityFaqs(city.slug).length >= 4, `${city.slug} has fewer than four FAQs`);
  assert(Boolean(similarityMap[city.slug]?.length), `${city.slug} has no similar destinations`);
  assert(Boolean(getCityImageUrl(city.slug, 'card')), `${city.slug} has no local card image`);
  assert(Boolean(getCityImageUrl(city.slug, 'hero')), `${city.slug} has no local hero image`);
}

if (failures.length > 0) {
  console.error(`City/country parity check failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

const mapsReady = allCities.filter((city) => city.coordinates).length;
const authoredFull = allCities.filter((city) =>
  !city.offbeatSynthetic &&
  !city.restaurantsSynthetic &&
  !city.proTipsSynthetic &&
  !city.gettingAroundSynthetic
).length;

console.log(`Parity check passed: ${allCities.length} cities, ${countries.length} countries.`);
console.log(`Maps ready: ${mapsReady}; map placeholders: ${allCities.length - mapsReady}.`);
console.log(`Fully authored deep sections: ${authoredFull}; safely derived: ${allCities.length - authoredFull}.`);
