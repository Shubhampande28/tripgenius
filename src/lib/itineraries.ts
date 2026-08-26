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

// ── Day-fill activity pool ───────────────────────────────────────────────────
// A handful of cities (Hong Kong, Singapore, Prague, Budapest, Rio, Buenos
// Aires, Cusco, Muscat, Tbilisi, Baku, Doha, Zanzibar, Mauritius, Maldives)
// have exactly 10 thingsToDo entries — enough for 3 full days at 3/day, then
// nothing — while a longer, hand-authored `areas[].spots[]` breakdown for the
// same city sits unused. Those spots name real, distinct places; merging them
// into the fill pool (deduped against thingsToDo so near-duplicates like
// "Star Ferry Crossing" vs "Star Ferry crossing" don't double up) is what lets
// 5- and 7-day single-city itineraries actually fill every day instead of
// running dry after day 3.
export interface ItineraryActivity {
  name: string;
  description?: string;
}

function normalizePlaceName(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export function buildCityActivityPool(city: City): ItineraryActivity[] {
  const pool: ItineraryActivity[] = (city.thingsToDo ?? []).map((t) => ({
    name: t.name,
    description: t.description,
  }));
  const seen = pool.map((p) => normalizePlaceName(p.name));

  for (const area of city.areas ?? []) {
    for (const spot of area.spots) {
      const n = normalizePlaceName(spot.name);
      if (seen.some((s) => s.includes(n) || n.includes(s))) continue;
      seen.push(n);
      pool.push({ name: spot.name });
    }
  }

  return pool;
}

// ── Genuine data-gap remediation ─────────────────────────────────────────────
// A handful of itinerary slugs cover cities whose authored place inventory
// (thingsToDo + areas.spots, deduped) genuinely isn't enough to fill every
// advertised day with 2+ activities — merging in areas.spots (above) doesn't
// help because there's nothing extra to merge. Two different remedies:
//
//   ITINERARY_FLEXIBLE_PLANS — the thin day(s) are a small fraction of the
//   page (≤29%), so the honest fix is to caption those specific days as
//   flexible/rest/transfer days instead of full sightseeing content, both on
//   the visible day card and in every FAQ/schema field that references day
//   counts.
//
//   ITINERARY_COMING_SOON — the thin days are too large a fraction of the
//   page (≥43%) for any caption to be an honest description of a "{duration}
//   day itinerary"; those variants are noindexed and show a maintenance
//   state instead, pointing at whichever shorter duration for that country
//   *is* fully real.
//
// See itinerary-day-fill-audit.md for the per-page reasoning and thresholds.
export interface ItineraryFlexibleDay {
  day: number;
  /** Short heading shown on the day card in place of a theme/city name. */
  label: string;
  /** Honest, city-specific suggestion — must match the visible card and the schema exactly. */
  suggestion: string;
}

export interface ItineraryFlexiblePlan {
  /** Real days actually filled with 2+ activities. */
  solidDays: number;
  days: ItineraryFlexibleDay[];
}

export const ITINERARY_FLEXIBLE_PLANS: Record<string, ItineraryFlexiblePlan> = {
  'bulgaria-3-days': {
    solidDays: 2,
    days: [
      {
        day: 3,
        label: 'Flexible Day — Beach & Rest',
        suggestion: "Sleep in, spend a slow morning on Varna's Central Beach and the Sea Garden promenade, and use the afternoon for a half-day trip to the Stone Forest (Pobiti Kamani) if you want one more thing to do.",
      },
    ],
  },
  'slovakia-3-days': {
    solidDays: 2,
    days: [
      {
        day: 3,
        label: 'Flexible Day — Optional Day Trip',
        suggestion: "Bratislava's old town is genuinely a 2-day city. Use day 3 for a slow morning, or take the hour-long train to Vienna for a half-day add-on before heading home.",
      },
    ],
  },
  'estonia-3-days': {
    solidDays: 2,
    days: [
      {
        day: 3,
        label: 'Flexible Day — Slow Morning',
        suggestion: "Tallinn's Old Town and Kadriorg cover 2 solid days. Spend day 3 revisiting a favourite café at a slower pace, or browsing Telliskivi's design shops again before your flight.",
      },
    ],
  },
  'serbia-5-days': {
    solidDays: 4,
    days: [
      {
        day: 3,
        label: 'Flexible Day — Belgrade at Your Pace',
        suggestion: 'Belgrade\'s essential sights are covered in 2 focused days. Use day 3 to revisit Skadarlija for a long lunch, wander Zemun without an agenda, or simply rest before continuing to Novi Sad.',
      },
    ],
  },
  'montenegro-5-days': {
    solidDays: 4,
    days: [
      {
        day: 3,
        label: 'Flexible Day — Kotor at Your Pace',
        suggestion: "Kotor's old town and fortress hike fill 2 solid days. Use day 3 for a boat trip to Perast and Our Lady of the Rocks, or simply relax before continuing to Budva.",
      },
    ],
  },
  'slovenia-7-days': {
    solidDays: 5,
    days: [
      {
        day: 3,
        label: 'Flexible Day — Ljubljana at Your Pace',
        suggestion: "Ljubljana's castle, riverfront and market cover 2 solid days. Use day 3 for a relaxed café morning in the old town, or a half-day trip to Postojna Cave before continuing to Lake Bled.",
      },
      {
        day: 6,
        label: 'Flexible Day — Lake Bled at Your Pace',
        suggestion: 'The lake circuit, island and castle cover 2 solid days at Bled. Use day 6 for Vintgar Gorge if you skipped it, or a quieter second lap of the lake shore before continuing to Piran.',
      },
    ],
  },
  'bahrain-7-days': {
    solidDays: 6,
    days: [
      {
        day: 4,
        label: 'Manama Wrap-Up & Transfer to Muharraq',
        suggestion: 'A short final morning in Manama — revisit the souq or grab a last coffee at Bahrain Bay — before the 20-minute causeway crossing to Muharraq for the rest of the trip.',
      },
    ],
  },
};

export interface ItineraryComingSoon {
  /** The shorter duration for the same country that IS fully real content today. */
  redirectSlug: string;
}

export const ITINERARY_COMING_SOON: Record<string, ItineraryComingSoon> = {
  'bulgaria-5-days': { redirectSlug: 'bulgaria-3-days' },
  'bulgaria-7-days': { redirectSlug: 'bulgaria-3-days' },
  'slovakia-5-days': { redirectSlug: 'slovakia-3-days' },
  'slovakia-7-days': { redirectSlug: 'slovakia-3-days' },
  'estonia-5-days': { redirectSlug: 'estonia-3-days' },
  'estonia-7-days': { redirectSlug: 'estonia-3-days' },
  'serbia-7-days': { redirectSlug: 'serbia-5-days' },
  'montenegro-7-days': { redirectSlug: 'montenegro-5-days' },
};

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

// ── Trip cost estimation ─────────────────────────────────────────────────────
// City budgets are strings like "$25–$100/day", "EUR 60-180/day",
// "₹2,500–₹8,000/day". Parse them and sum per-day ranges across the itinerary.
// Approximate static FX to USD — totals are labelled as estimates on the page.
const USD_RATES: Record<string, number> = {
  USD: 1, INR: 1 / 86, EUR: 1.08, GBP: 1.27, AUD: 0.65, CAD: 0.73, CHF: 1.12,
  NZD: 0.59, AED: 0.272, JPY: 0.0066, KRW: 0.00072, THB: 0.028, IDR: 0.000061,
  VND: 0.000039, PHP: 0.0172, MYR: 0.21, LKR: 0.0033, NPR: 0.0074, BTN: 0.0119,
  EGP: 0.02, MAD: 0.10, JOD: 1.41, ZAR: 0.054,
};
const USD_TO_INR = 86;

function parseDailyBudgetUSD(budget: string): { min: number; max: number } | null {
  const m = budget.replace(/,/g, '').match(/^(₹|\$|[A-Z]{3})\s?(\d+(?:\.\d+)?)\s?[–-]\s?(?:₹|\$)?(\d+(?:\.\d+)?)/);
  if (!m) return null;
  const cur = m[1] === '$' ? 'USD' : m[1] === '₹' ? 'INR' : m[1];
  const rate = USD_RATES[cur];
  if (!rate) return null;
  return { min: parseFloat(m[2]) * rate, max: parseFloat(m[3]) * rate };
}

export interface TripCostEstimate {
  usdMin: number; usdMax: number;
  inrMin: number; inrMax: number;
}

/** Sums each day's city budget range. Null when any day's budget can't be
 *  parsed — callers fall back to per-day budget strings (never fabricate). */
export function estimateTripCost(days: ItineraryDay[]): TripCostEstimate | null {
  let min = 0, max = 0;
  for (const d of days) {
    const b = parseDailyBudgetUSD(d.city.stats.budget);
    if (!b) return null;
    min += b.min; max += b.max;
  }
  const round = (n: number, step: number) => Math.round(n / step) * step;
  return {
    usdMin: round(min, 5), usdMax: round(max, 5),
    inrMin: round(min * USD_TO_INR, 500), inrMax: round(max * USD_TO_INR, 500),
  };
}

export const fmtINR = (n: number) => `₹${n.toLocaleString('en-IN')}`;
export const fmtUSD = (n: number) => `$${n.toLocaleString('en-US')}`;

// ── Single-city duration framing ─────────────────────────────────────────────
// Countries with exactly one city (Brazil→Rio, Argentina→Buenos Aires, etc.)
// otherwise produce 3/5/7-day itinerary pages that differ only by a digit —
// same route, same "covered end to end" description every time. These
// candidates key the title's suffix and the description's theme summary off
// the SINGLE_CITY_THEMES actually rendered on the page for that duration
// (see buildItineraryDaysForCities), so each duration variant both reads
// differently and reflects genuinely different on-page content.
const SINGLE_CITY_TITLE_SUFFIX: Record<number, string> = {
  3: 'The Essentials',
  5: 'The Well-Rounded Trip',
  7: 'The Deep-Dive Trip',
};

const SINGLE_CITY_THEME_SHORT: Record<string, string> = {
  'Arrival & First Impressions': 'arrival',
  'Iconic Highlights': 'icons',
  'Hidden Gems & Local Life': 'hidden gems',
  'Adventure & Day Trips': 'day trips',
  'Culture & Cuisine': 'culture and food',
  'Relaxation & Slow Travel': 'slow travel',
  'Final Exploration & Departure': 'departure',
};

function joinWithAnd(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

function buildSingleCityTitle(city: string, duration: number, year: number): string {
  const suffix = SINGLE_CITY_TITLE_SUFFIX[duration] ?? `${duration}-Day Plan`;
  const candidates = [
    `${city} ${duration}-Day Itinerary from India: ${suffix}`,
    `${city} ${duration}-Day Itinerary from India (${year})`,
    `${city} ${duration}-Day Itinerary (${year})`,
  ];
  return candidates.find((t) => t.length <= 60) ?? candidates[candidates.length - 1];
}

function buildSingleCityDescription(countryName: string, city: string, duration: number): string {
  const themes = SINGLE_CITY_THEMES.slice(0, duration).map((t) => SINGLE_CITY_THEME_SHORT[t] ?? t.toLowerCase());
  const candidates = [
    `${duration}-day ${countryName} plan for Indian travellers: ${city} — ${joinWithAnd(themes)}. Trip costs in INR, visa notes for Indian passports and where to stay.`,
    `${duration}-day ${countryName} plan for Indian travellers: ${city}, from ${themes[0]} to ${themes[themes.length - 1]}. Trip costs in INR, visa notes for Indian passports included.`,
    // Last resort — always keeps the concrete place name even if the
    // theme-based phrasing runs long for an unusually long city/country name.
    `Day-by-day ${countryName} plan for Indian travellers: ${city} covered end to end. Trip costs in INR, visa notes for Indian passports and where to stay.`,
  ];
  return candidates.find((c) => c.length <= 155) ?? candidates[candidates.length - 1].slice(0, 155);
}

// ── SERP metadata builders ───────────────────────────────────────────────────
// Shared by generateMetadata and the on-page answer block so title, meta and
// visible content always agree. CTR-focused formulas (2026-07):
//   title: "{Country} {N}-Day Itinerary: {Stop1}, {Stop2} & Budget ({Year})"
//   desc:  day-by-day + costs + concrete place names, unique per page.
export function buildItineraryTitle(
  countryName: string,
  duration: number,
  route: { city: City }[],
  year: number,
): string {
  const h1 = route[0]?.city.name;
  const h2 = route[1]?.city.name;
  // Single-city countries have nothing to differentiate 3/5/7-day variants
  // beyond the digit if we use the generic country-level formula below — use
  // duration-specific framing instead (see buildSingleCityTitle above).
  if (route.length === 1 && h1) return buildSingleCityTitle(h1, duration, year);
  // "from India" is deliberate SERP targeting, not decoration: GSC shows these
  // pages earning thousands of impressions in Brazil/US/etc. at ~0% CTR — the
  // wrong audience. Naming the audience in the title trades those dead
  // impressions for Indian searchers who actually click.
  // Progressively shorter candidates; country + day count are never truncated.
  const candidates = [
    h1 && h2 ? `${countryName} ${duration}-Day Itinerary from India: ${h1}, ${h2} & Costs` : null,
    // Drops "from India" and the year to buy back characters while still
    // naming both stops. Must come before the h1-only candidate below —
    // otherwise a 3+ stop route (e.g. Cape Town, Johannesburg, Kruger)
    // whose first candidate is too long would accept the shorter h1-only
    // title before ever trying to keep both stops, silently losing a
    // named city even though a 2-stop title would fit.
    h1 && h2 ? `${countryName} ${duration}-Day Itinerary: ${h1} & ${h2}` : null,
    h1 ? `${countryName} ${duration}-Day Itinerary from India: ${h1} & Costs` : null,
    `${countryName} ${duration}-Day Itinerary from India (${year})`,
    `${countryName} ${duration}-Day Itinerary (${year})`,
  ].filter((t): t is string => t !== null);
  return candidates.find((t) => t.length <= 60) ?? candidates[candidates.length - 1];
}

export function buildItineraryDescription(
  countryName: string,
  duration: number,
  route: { city: City }[],
): string {
  const names = route.map((r) => r.city.name);
  if (route.length === 1) return buildSingleCityDescription(countryName, names[0], duration);
  const stops =
    names.length <= 3 ? names.join(' → ') :
    `${names[0]} → ${names[names.length - 1]} via ${names.length - 2} more stops`;
  const desc = `Day-by-day ${countryName} plan for Indian travellers: ${stops}. Trip costs in INR, visa notes for Indian passports and where to stay.`;
  if (desc.length <= 155) return desc;
  // fall back to first stop only — always keeps a concrete place name
  return `Day-by-day ${countryName} plan for Indian travellers, from ${names[0]}. Trip costs in INR, visa notes for Indian passports and where to stay.`.slice(0, 155);
}
