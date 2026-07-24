import { countries } from '@/data/countries';
import { allCities } from '@/lib/cities';
import { getCityFaqs } from '@/lib/cityFaqs';
import { getCityImageUrl } from '@/lib/cityImages';
import { similarityMap } from '@/lib/similarity';

describe('city and country feature parity', () => {
  const cityBySlug = new Map(allCities.map((city) => [city.slug, city]));

  test('every city belongs to exactly one valid country hub', () => {
    const memberships = new Map<string, string[]>();

    for (const country of countries) {
      expect(country.cities.length).toBeGreaterThan(0);
      for (const citySlug of country.cities) {
        expect(cityBySlug.has(citySlug)).toBe(true);
        memberships.set(citySlug, [...(memberships.get(citySlug) ?? []), country.slug]);
      }
    }

    for (const city of allCities) {
      expect(memberships.get(city.slug)).toHaveLength(1);
    }
  });

  test.each(allCities)('$slug has the canonical planning modules', (city) => {
    expect(city.thingsToDo?.length).toBeGreaterThan(0);
    expect(city.neighbourhoods?.length).toBeGreaterThan(0);
    expect(city.monthByMonth?.months).toHaveLength(12);
    expect(city.budgetBreakdown?.tiers).toHaveLength(3);
    expect(city.offbeatPlaces?.length).toBeGreaterThan(0);
    expect(city.restaurants?.length).toBeGreaterThan(0);
    expect(city.proTips?.length).toBeGreaterThan(0);
    expect(city.gettingAround?.length).toBeGreaterThan(0);
    expect(getCityFaqs(city.slug).length).toBeGreaterThanOrEqual(4);
    expect(similarityMap[city.slug]?.length).toBeGreaterThan(0);
  });

  test.each(allCities)('$slug has local card and hero images', (city) => {
    expect(getCityImageUrl(city.slug, 'card')).toBeTruthy();
    expect(getCityImageUrl(city.slug, 'hero')).toBeTruthy();
  });
});
