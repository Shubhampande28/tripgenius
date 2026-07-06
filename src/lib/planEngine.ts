import { countries, getCountryBySlug, type CountryData } from '@/data/countries';
import { allCities, getCityBySlug } from '@/lib/cities';
import { buildItineraryDaysForCities, buildRouteOverview, type ItineraryDay } from '@/lib/itineraries';
import type { City, ThingToDo, TripPlanRequest, TripItinerary, DayPlan, BudgetItem, TimeOfDay } from '@/lib/types';

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
type TimeSlot = keyof typeof TIME_LABELS;
const SLOT_ORDER: TimeSlot[] = ['morning', 'afternoon', 'evening'];

// A candidate activity for a day's itinerary — either a real `ThingToDo`
// (which may carry an `idealTime`) or a generated/generic placeholder.
type ActivityCandidate = { name: string; description: string; idealTime?: TimeOfDay[] };

function normalize(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
}

function activityKey(name: string): string {
  return normalize(name).replace(/\s+/g, ' ');
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
  if (wanted.size === 0) return dedupeActivities(things);
  const matched = things.filter((t) => wanted.has(t.category));
  const rest = things.filter((t) => !wanted.has(t.category));
  return dedupeActivities([...matched, ...rest]);
}

function dedupeActivities<T extends { name: string }>(activities: T[]): T[] {
  const seen = new Set<string>();
  return activities.filter((activity) => {
    const key = activityKey(activity.name);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function genericActivities(city: City): ActivityCandidate[] {
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

function getActivitiesForCity(city: City, interests: string[]): ActivityCandidate[] {
  const things = city.thingsToDo ?? [];
  if (things.length > 0) return rankActivities(things, interests);
  return genericActivities(city);
}

function fallbackActivity(city: City, day: number, slot: TimeSlot): ActivityCandidate {
  const label = TIME_LABELS[slot];

  if (slot === 'morning') {
    return {
      name: `${city.name} ${label} Orientation - Day ${day}`,
      description: `Start day ${day} with a fresh, self-guided route through a different part of ${city.name}, using cafes, markets, and viewpoints as flexible anchors.`,
    };
  }

  if (slot === 'afternoon') {
    return {
      name: `${city.name} ${label} Local Detour - Day ${day}`,
      description: `Use the afternoon for a new neighbourhood, gallery, waterfront, garden, or easy side trip in ${city.name} that was not already used earlier in the itinerary.`,
    };
  }

  return {
    name: `${city.name} ${label} Slow Finish - Day ${day}`,
    description: `Close day ${day} with a different dinner area, sunset point, cultural venue, or low-pressure walk so the itinerary stays varied.`,
  };
}

// Looks ahead at the next `count` not-yet-used activities in rotation order,
// without consuming them — used to anticipate time-locked activities before
// committing this day's slot layout.
function peekUnusedActivities(
  activities: ActivityCandidate[],
  startIdx: number,
  usedActivityNames: Set<string>,
  count: number,
): ActivityCandidate[] {
  const picks: ActivityCandidate[] = [];
  for (let offset = 0; offset < activities.length && picks.length < count; offset++) {
    const activity = activities[(startIdx + offset) % activities.length];
    if (!usedActivityNames.has(activityKey(activity.name))) picks.push(activity);
  }
  return picks;
}

// Adjusts this day's default slot labels so a time-locked activity coming up
// next in rotation (e.g. an evening-only performance) has a slot it can
// legally be placed in, instead of being skipped entirely. Swaps out the
// lowest-priority default slot for the one the activity actually needs.
function resolveDaySlots(
  activities: ActivityCandidate[],
  startIdx: number,
  usedActivityNames: Set<string>,
  defaultSlots: TimeSlot[],
): TimeSlot[] {
  const upcoming = peekUnusedActivities(activities, startIdx, usedActivityNames, defaultSlots.length);

  for (const candidate of upcoming) {
    const ideal = candidate.idealTime;
    if (!ideal || ideal.length === 0) continue;
    if (ideal.some((slot) => defaultSlots.includes(slot))) continue;

    const needed = ideal.find((slot) => !defaultSlots.includes(slot));
    if (!needed) continue;

    const lowestPriority = [...defaultSlots].sort((a, b) => SLOT_ORDER.indexOf(b) - SLOT_ORDER.indexOf(a))[0];
    const next = defaultSlots.map((slot) => (slot === lowestPriority ? needed : slot));
    return next.sort((a, b) => SLOT_ORDER.indexOf(a) - SLOT_ORDER.indexOf(b));
  }

  return defaultSlots;
}

// Picks the best unused activity for a specific slot. An activity with an
// `idealTime` is only eligible for slots within that range, so an
// evening-only experience can never be placed in a morning slot.
function selectActivityForSlot(
  activities: ActivityCandidate[],
  startIdx: number,
  usedActivityNames: Set<string>,
  slot: TimeSlot,
  city: City,
  day: number,
): ActivityCandidate {
  for (let offset = 0; offset < activities.length; offset++) {
    const activity = activities[(startIdx + offset) % activities.length];
    const key = activityKey(activity.name);
    if (usedActivityNames.has(key)) continue;
    if (activity.idealTime && !activity.idealTime.includes(slot)) continue;
    usedActivityNames.add(key);
    return activity;
  }

  let fallback = fallbackActivity(city, day, slot);
  let attempt = 2;
  while (usedActivityNames.has(activityKey(fallback.name))) {
    fallback = {
      name: `${fallback.name} ${attempt}`,
      description: fallback.description,
    };
    attempt++;
  }
  usedActivityNames.add(activityKey(fallback.name));
  return fallback;
}

function activityCountForDay(itinDay: ItineraryDay, totalDays: number, availableCount: number): number {
  if (availableCount <= 0) return 1;
  if (totalDays <= 2) return Math.min(3, availableCount);
  if (itinDay.day === 1 || itinDay.day === totalDays) return 1;
  return Math.min(2, availableCount);
}

function slotsForCount(count: number): TimeSlot[] {
  if (count <= 1) return ['morning'];
  if (count === 2) return ['morning', 'afternoon'];
  return ['morning', 'afternoon', 'evening'];
}

function countAvailableActivities(activities: { name: string }[], usedActivityNames: Set<string>): number {
  return activities.filter((activity) => !usedActivityNames.has(activityKey(activity.name))).length;
}

function buildDayPlan(itinDay: ItineraryDay, req: TripPlanRequest, usedActivityNames: Set<string>, totalDays: number): DayPlan {
  const activities = getActivitiesForCity(itinDay.city, req.interests);
  const baseIdx = itinDay.activityIndex * 3;
  const proTips = itinDay.city.proTips ?? [];
  const count = activityCountForDay(itinDay, totalDays, countAvailableActivities(activities, usedActivityNames));
  const defaultSlots = slotsForCount(count);
  const daySlots = resolveDaySlots(activities, baseIdx, usedActivityNames, defaultSlots);

  const dayActivities = daySlots.map((slot, i) => {
    const activity = selectActivityForSlot(activities, baseIdx, usedActivityNames, slot, itinDay.city, itinDay.day);
    const tip = i === 1 && proTips.length > 0 ? proTips[itinDay.day % proTips.length] : undefined;
    return {
      time: TIME_LABELS[slot],
      activity: activity.name,
      description: activity.description,
      ...(tip ? { tip } : {}),
    };
  });

  return {
    day: itinDay.day,
    date: formatDayDate(req.startDate, itinDay.day - 1),
    theme: itinDay.theme ?? `Discovering ${itinDay.city.name}`,
    activities: dayActivities,
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
  const usedActivityNames = new Set<string>();

  return {
    destination: buildDestinationLabel(match, citiesData, route),
    duration: `${duration} ${duration === 1 ? 'Day' : 'Days'}`,
    style: STYLE_LABELS[req.style] ?? req.style,
    overview: buildOverview(citiesData, route, req, duration),
    days: days.map((d) => buildDayPlan(d, req, usedActivityNames, duration)),
    budget: buildBudget(citiesData, req),
    packingTips: buildPackingTips(req),
    bestAdvice: buildBestAdvice(citiesData),
  };
}
