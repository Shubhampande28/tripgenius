import { allCities } from './cities';
import { countries } from '@/data/countries';
import type { City } from './types';

export type DestinationSuggestion =
  | { type: 'city';    label: string; sub: string; href: string; city: City }
  | { type: 'country'; label: string; sub: string; href: string; flag: string };

export function getDestinationSuggestions(q: string): DestinationSuggestion[] {
  if (!q || q.length < 2) return [];
  const lower = q.toLowerCase();

  // Country matches — show first (country page is the destination hub)
  const matchedCountries = countries
    .filter((c) =>
      c.name.toLowerCase().startsWith(lower) ||
      c.name.toLowerCase().includes(lower) ||
      c.capital.toLowerCase().startsWith(lower),
    )
    .slice(0, 3);

  const countrySuggestions: DestinationSuggestion[] = matchedCountries.map((c) => ({
    type: 'country',
    label: c.name,
    sub: `${c.continent} · ${c.cities.length} cities`,
    href: `/countries/${c.slug}`,
    flag: c.flag,
  }));

  // City matches
  const matchedCities = allCities
    .filter((c) => !c.stub && (
      c.name.toLowerCase().startsWith(lower) ||
      c.name.toLowerCase().includes(lower)
    ))
    .slice(0, 3);

  const citySuggestions: DestinationSuggestion[] = matchedCities.map((city) => ({
    type: 'city',
    label: city.name,
    sub: city.country,
    href: `/cities/${city.slug}`,
    city,
  }));

  return [...countrySuggestions, ...citySuggestions].slice(0, 7);
}
