import { allCities } from './cities';
import { countries } from '@/data/countries';

// Single source of truth for "how many destinations/countries does
// TripGenius cover" — used in meta descriptions, hero/about/footer copy,
// and JSON-LD across the site. Both numbers are computed live from the data
// model, not hand-maintained, so they can't drift out of sync with reality
// as content is added. Never hardcode either number in copy again — import
// from here instead.

// Real, non-stub city guides — hand-authored destination pages. Excludes
// the large pool of thin, auto-generated stub pages (see City.stub in
// ./types) that exist in the data model but have no real guide content.
export const REAL_CITY_COUNT = allCities.filter((c) => !c.stub).length;

// Every authored country hub in src/data/countries.ts. Unlike cities, there
// is no stub concept for countries — every entry is a real, live page.
export const REAL_COUNTRY_COUNT = countries.length;
