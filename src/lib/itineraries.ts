import { countries, getCountryBySlug } from '@/data/countries';
import { getCityBySlug } from '@/lib/cities';
import type { City } from '@/lib/types';

export const ITINERARY_DURATIONS = [3, 5, 7] as const;
export type ItineraryDuration = (typeof ITINERARY_DURATIONS)[number];

export function getItinerarySlug(countrySlug: string, duration: number): string {
  return `${countrySlug}-${duration}-days`;
}

export function parseItinerarySlug(slug: string): { countrySlug: string; duration: number } | null {
  const match = slug.match(/^(.+)-(\d+)-days$/);
  if (!match) return null;
  const duration = parseInt(match[2]);
  if (!(ITINERARY_DURATIONS as readonly number[]).includes(duration)) return null;
  const country = getCountryBySlug(match[1]);
  if (!country) return null;
  return { countrySlug: match[1], duration };
}

export function getAllItinerarySlugs(): string[] {
  return countries.flatMap((c) =>
    ITINERARY_DURATIONS.map((d) => getItinerarySlug(c.slug, d)),
  );
}

export interface ItineraryDay {
  day: number;
  city: City;
  activityIndex: number;
  theme: string | null;
}

const SINGLE_CITY_THEMES = [
  'Arrival & First Impressions',
  'Iconic Highlights',
  'Hidden Gems & Local Life',
  'Adventure & Day Trips',
  'Culture & Cuisine',
  'Relaxation & Slow Travel',
  'Final Exploration & Departure',
];

export function buildItineraryDays(countrySlug: string, duration: number): ItineraryDay[] {
  const country = getCountryBySlug(countrySlug);
  if (!country) return [];

  const citiesData = country.cities
    .map((s) => getCityBySlug(s))
    .filter((c): c is City => c !== undefined && !c.stub);

  return buildItineraryDaysForCities(citiesData, duration);
}

// Same day-by-day distribution logic as buildItineraryDays, but for an
// arbitrary list of cities — used by the trip planner to build single-city
// or custom multi-city itineraries.
export function buildItineraryDaysForCities(citiesData: City[], duration: number): ItineraryDay[] {
  if (citiesData.length === 0) return [];

  const isSingleCity = citiesData.length === 1;
  const daysPerCity = Math.ceil(duration / citiesData.length);
  const days: ItineraryDay[] = [];
  let dayNum = 1;

  for (const city of citiesData) {
    if (dayNum > duration) break;
    const cityDays = Math.min(daysPerCity, duration - dayNum + 1);
    for (let d = 0; d < cityDays; d++) {
      if (dayNum > duration) break;
      days.push({
        day: dayNum,
        city,
        activityIndex: d,
        theme: isSingleCity ? (SINGLE_CITY_THEMES[dayNum - 1] ?? null) : null,
      });
      dayNum++;
    }
  }

  return days;
}

// Returns unique cities and the day range for each — used for the route overview strip
export function buildRouteOverview(days: ItineraryDay[]): { city: City; startDay: number; endDay: number }[] {
  const seen = new Map<string, { city: City; startDay: number; endDay: number }>();
  for (const d of days) {
    if (!seen.has(d.city.slug)) {
      seen.set(d.city.slug, { city: d.city, startDay: d.day, endDay: d.day });
    } else {
      seen.get(d.city.slug)!.endDay = d.day;
    }
  }
  return Array.from(seen.values());
}
