import { countries } from '@/data/countries';

export function getCountrySlugForCity(citySlug: string): string | null {
  for (const country of countries) {
    if (country.cities.includes(citySlug)) return country.slug;
  }
  return null;
}
