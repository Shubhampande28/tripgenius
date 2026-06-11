import { countries, getCountryBySlug, type CountryData } from '@/data/countries';
import { allCities, getCityBySlug } from '@/lib/cities';
import { buildItineraryDaysForCities, buildRouteOverview, type ItineraryDay } from '@/lib/itineraries';
import type { City, ThingToDo, TripPlanRequest, TripItinerary, DayPlan, BudgetItem } from '@/lib/types';

const STYLE_LABELS: Record<string, string> = {
  adventure: 'Adventure',
  romantic: 'Romantic',
  family: 'Family',
  budget: 'Budget',
  luxury: 'Luxury',
};

// Maps the planner form's "interests" values to the `category` field used
// across the city data (thingsToDo[].category).
const INTEREST_CATEGORY_MAP: Record<string, string[]> = {
  food: ['Culinary'],
  culture: ['Cultural', 'Art & Culture', 'Iconic'],
  nature: ['Nature', 'Scenic', 'Day Trip'],
  nightlife: ['Nightlife', 'Entertainment'],
  shopping: ['Shopping'],
  wellness: ['Wellness', 'Relaxation'],
};

const TIME_LABELS = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' } as const;

function normalize(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
}

function namesMatch(name: string, input: string): boolean {
  const n = normalize(name);
  if (!n || !input) return false;
  return n === input || n.includes(input) || input.includes(n);
}

interface DestinationMatch {
  city?: City;
  country: CountryData;
}

// Matches free-text "destination" input (city, country, or region) against
// the existing cities/countries data. Prefers an exact city match, falls
// back to a country match.
export function matchDestination(input: string): DestinationMatch | null {
  const norm = normalize(input);
  if (!norm) return null;

  const slugCandidate = norm.replace(/\s+/g, '-');

  const exactCity = allCities.find((c) => c.slug === slugCandidate);
  if (exactCity) {
    const country = countries.find((c) => c.name.toLowerCase() === exactCity.country.toLowerCase());
    if (country) return { city: exactCity, country };
  }

  const cityMatches = allCities
    .filter((c) => !c.stub && namesMatch(c.name, norm))
    .sort((a, b) => {
      const aRich = (a.thingsToDo?.length ?? 0) > 0 ? 0 : 1;
      const bRich = (b.thingsToDo?.length ?? 0) > 0 ? 0 : 1;
      if (aRich !== bRich) return aRich - bRich;
      return a.name.length - b.name.length;
    });

  if (cityMatches.length > 0) {
    const city = cityMatches[0];
    const country = countries.find((c) => c.name.toLowerCase() === city.country.toLowerCase());
    if (country) return { city, country };
  }

  const countryMatches = countries
    .filter((c) => c.slug === slugCandidate || namesMatch(c.name, norm))
    .sort((a, b) => a.name.length - b.name.length);

  if (countryMatches.length > 0) return { country: countryMatches[0] };

  return null;
}

function computeDuration(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return Math.min(Math.max(diff, 1), 10);
}

function formatDayDate(startDate: string, dayOffset: number): string {
  const d = new Date(startDate);
  d.setDate(d.getDate() + dayOffset);
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(d);
}

// Picks the cities to build the itinerary around — a single city if it has
// rich activity data, otherwise the country's full-guide cities, with a
// generic single-city fallback if neither has activity data.
function selectCitiesForItinerary(match: DestinationMatch): City[] {
  if (match.city && (match.city.thingsToDo?.length ?? 0) > 0) {
    return [match.city];
  }

  const countryCities = match.country.cities
    .map((s) => getCityBySlug(s))
    .filter((c): c is City => c !== undefined && !c.stub);

  const richCities = countryCities.filter((c) => (c.thingsToDo?.length ?? 0) > 0);
  if (richCities.length > 0) return richCities;

  if (match.city) return [match.city];
  return countryCities.length > 0 ? [countryCities[0]] : [];
}

function rankActivities(things: ThingToDo[], interests: string[]): ThingToDo[] {
  const wanted = new Set(interests.flatMap((i) => INTEREST_CATEGORY_MAP[i] ?? []));
  if (wanted.size === 0) return things;
  const matched = things.filter((t) => wanted.has(t.category));
  const rest = things.filter((t) => !wanted.has(t.category));
  return [...matched, ...rest];
}

function genericActivities(city: City): { name: string; description: string }[] {
  return [
    {
      name: `Explore ${city.name}`,
      description: `Spend the morning getting oriented — wander the main streets and soak in ${city.name}'s atmosphere: ${city.tagline.toLowerCase()}.`,
    },
    {
      name: 'Local Food & Markets',
      description: `Sample regional specialties at a local market or well-reviewed restaurant — one of the best ways to experience ${city.name}'s food culture.`,
    },
    {
      name: `Evening in ${city.name}`,
      description: 'Wind down with a relaxed evening — catch the sunset, take a stroll, or enjoy the local atmosphere at your own pace.',
    },
  ];
}

function getActivitiesForCity(city: City, interests: string[]): { name: string; description: string }[] {
  const things = city.thingsToDo ?? [];
  if (things.length > 0) return rankActivities(things, interests);
  return genericActivities(city);
}

function buildDayPlan(itinDay: ItineraryDay, req: TripPlanRequest): DayPlan {
  const activities = getActivitiesForCity(itinDay.city, req.interests);
  const baseIdx = itinDay.activityIndex * 3;
  const proTips = itinDay.city.proTips ?? [];

  const slots = (['morning', 'afternoon', 'evening'] as const).map((slot, i) => {
    const activity = activities[(baseIdx + i) % activities.length];
    const tip = i === 1 && proTips.length > 0 ? proTips[itinDay.day % proTips.length] : undefined;
    return {
      slot,
      block: {
        time: TIME_LABELS[slot],
        activity: activity.name,
        description: activity.description,
        ...(tip ? { tip } : {}),
      },
    };
  });

  return {
    day: itinDay.day,
    date: formatDayDate(req.startDate, itinDay.day - 1),
    theme: itinDay.theme ?? `Discovering ${itinDay.city.name}`,
    morning: slots[0].block,
    afternoon: slots[1].block,
    evening: slots[2].block,
  };
}

function mapStyleToTier(style: string): 'Budget' | 'Mid-range' | 'Luxury' {
  if (style === 'budget') return 'Budget';
  if (style === 'luxury') return 'Luxury';
  return 'Mid-range';
}

function buildBudget(citiesData: City[], req: TripPlanRequest): BudgetItem[] {
  const tierLabel = mapStyleToTier(req.style);
  const primary = citiesData.find((c) => c.budgetBreakdown) ?? citiesData[0];
  const peopleNote = req.people > 1
    ? ` (per person — multiply by ${req.people} travellers)`
    : ' (per person)';

  if (primary.budgetBreakdown) {
    const tier = primary.budgetBreakdown.tiers.find((t) => t.label === tierLabel) ?? primary.budgetBreakdown.tiers[1];
    return [
      { category: 'Accommodation', amount: tier.accommodation, note: `Per night${peopleNote}` },
      { category: 'Food & Dining', amount: tier.food, note: `Per day${peopleNote}` },
      { category: 'Transport', amount: tier.transport, note: `Per day${peopleNote}` },
      { category: 'Activities', amount: tier.activities, note: `Per day${peopleNote}` },
      { category: 'Daily Total', amount: tier.perDay, note: tier.tip },
    ];
  }

  return [
    { category: 'Daily Budget', amount: primary.stats.budget, note: `Estimated total cost per day in ${primary.name}${peopleNote}.` },
    { category: 'Currency', amount: primary.stats.currency, note: 'Carry a mix of cash and cards, and check current exchange rates before you travel.' },
  ];
}

function buildPackingTips(req: TripPlanRequest): string[] {
  const tips = new Set<string>();
  tips.add('Comfortable walking shoes for full days of exploring');
  tips.add('Reusable water bottle to stay hydrated');
  tips.add('Portable phone charger / power bank for long days out');
  tips.add('Digital and printed copies of your passport, ID, and bookings');

  const month = new Date(req.startDate).getMonth();
  if ([5, 6, 7, 8].includes(month)) {
    tips.add('Lightweight rain jacket or umbrella — monsoon-season conditions are possible');
  } else {
    tips.add('Sunscreen, sunglasses, and a hat for daytime sightseeing');
  }

  if (req.style === 'adventure') {
    tips.add('A daypack and quick-dry clothing for excursions');
    tips.add('A basic first-aid kit and any personal medication');
  }
  if (req.style === 'romantic' || req.style === 'luxury') {
    tips.add('A smart-casual outfit for nicer dinners and experiences');
  }
  if (req.style === 'family') {
    tips.add('Snacks and entertainment for younger travellers');
  }
  if (req.style === 'budget') {
    tips.add('Travel-sized toiletries to avoid checked-baggage fees');
  }

  if (req.interests.includes('wellness')) {
    tips.add('Swimwear and a sarong or cover-up for spas, pools, or beaches');
  }
  if (req.interests.includes('nightlife')) {
    tips.add('A going-out outfit for evenings');
  }

  return Array.from(tips).slice(0, 8);
}

function buildBestAdvice(citiesData: City[]): string {
  const withTips = citiesData.find((c) => (c.proTips?.length ?? 0) > 0);
  if (withTips?.proTips) return withTips.proTips[0];

  const city = citiesData[0];
  return `${city.name} is best enjoyed at a relaxed pace — leave room in your schedule for spontaneous discoveries, and keep a little extra cash on hand for small vendors and tips.`;
}

function buildOverview(citiesData: City[], route: { city: City }[], req: TripPlanRequest, duration: number): string {
  const styleLabel = (STYLE_LABELS[req.style] ?? req.style).toLowerCase();
  const cityNames = route.map((r) => r.city.name);
  const placesText = cityNames.length > 1
    ? `${cityNames.slice(0, -1).join(', ')} and ${cityNames[cityNames.length - 1]}`
    : cityNames[0];
  const peopleText = req.people === 1 ? 'a solo traveller' : `${req.people} travellers`;

  return `A ${duration}-day ${styleLabel} trip through ${placesText}, planned for ${peopleText}. Expect a balanced mix of must-see highlights and unhurried time to soak in what makes ${citiesData[0].name} special — ${citiesData[0].tagline.toLowerCase()}.`;
}

function buildDestinationLabel(match: DestinationMatch, citiesData: City[], route: { city: City }[]): string {
  if (citiesData.length === 1) {
    return `${citiesData[0].name}, ${citiesData[0].country}`;
  }
  return `${match.country.name} — ${route.map((r) => r.city.name).join(', ')}`;
}

// Builds a complete TripItinerary from existing static city/country data —
// no external API calls, so this is free and instant.
export function generateTripItinerary(req: TripPlanRequest): TripItinerary | null {
  const match = matchDestination(req.destination);
  if (!match) return null;

  const citiesData = selectCitiesForItinerary(match);
  if (citiesData.length === 0) return null;

  const duration = computeDuration(req.startDate, req.endDate);
  const days = buildItineraryDaysForCities(citiesData, duration);
  if (days.length === 0) return null;

  const route = buildRouteOverview(days);

  return {
    destination: buildDestinationLabel(match, citiesData, route),
    duration: `${duration} ${duration === 1 ? 'Day' : 'Days'}`,
    style: STYLE_LABELS[req.style] ?? req.style,
    overview: buildOverview(citiesData, route, req, duration),
    days: days.map((d) => buildDayPlan(d, req)),
    budget: buildBudget(citiesData, req),
    packingTips: buildPackingTips(req),
    bestAdvice: buildBestAdvice(citiesData),
  };
}
