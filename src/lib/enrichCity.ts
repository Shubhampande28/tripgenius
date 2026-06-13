import { City, MonthInfo, MonthRating, TimeOfDay } from './types';
import { verifiedCityImages } from './cityImages';

const monthNames = [
  ['January', 'Jan'], ['February', 'Feb'], ['March', 'Mar'], ['April', 'Apr'],
  ['May', 'May'], ['June', 'Jun'], ['July', 'Jul'], ['August', 'Aug'],
  ['September', 'Sep'], ['October', 'Oct'], ['November', 'Nov'], ['December', 'Dec'],
] as const;

const winterBest = new Set(['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']);
const mountainBest = new Set(['Mar', 'Apr', 'May', 'Jun', 'Sep', 'Oct', 'Nov']);
const coastalBest = new Set(['Nov', 'Dec', 'Jan', 'Feb', 'Mar']);

function monthRating(city: City, short: string): MonthRating {
  const vibes = new Set(city.vibes);
  const isMountain = vibes.has('Nature') || vibes.has('Adventure') || city.stats.bestTime.includes('Jun');
  const isCoastal = vibes.has('Beach') || city.stats.bestTime.includes('Nov');
  const bestSet = isCoastal ? coastalBest : isMountain ? mountainBest : winterBest;

  if (bestSet.has(short)) return 'excellent';
  if (['Jul', 'Aug'].includes(short) && !city.stats.bestTime.includes('Jul')) return 'avoid';
  if (['Apr', 'Sep'].includes(short)) return 'good';
  return 'average';
}

function buildMonths(city: City): [MonthInfo, MonthInfo, MonthInfo, MonthInfo, MonthInfo, MonthInfo, MonthInfo, MonthInfo, MonthInfo, MonthInfo, MonthInfo, MonthInfo] {
  return monthNames.map(([month, short]) => {
    const rating = monthRating(city, short);
    return {
      month,
      short,
      rating,
      weather: rating === 'excellent' ? 'Best overall conditions' : rating === 'good' ? 'Good shoulder-season conditions' : rating === 'avoid' ? 'Weather can disrupt outdoor plans' : 'Usable but less ideal',
      temp: rating === 'excellent' ? 'Pleasant' : rating === 'avoid' ? 'Variable' : 'Moderate',
      crowds: rating === 'excellent' ? 'High' : rating === 'good' ? 'Moderate' : 'Low',
      price: rating === 'excellent' ? 'High' : rating === 'good' ? 'Moderate' : 'Low',
      highlight: rating === 'excellent' ? `A strong month for ${city.name}` : rating === 'avoid' ? 'Plan around weather and closures' : 'Works if your dates are fixed',
    };
  }) as [MonthInfo, MonthInfo, MonthInfo, MonthInfo, MonthInfo, MonthInfo, MonthInfo, MonthInfo, MonthInfo, MonthInfo, MonthInfo, MonthInfo];
}

function topSpots(city: City): string[] {
  return city.areas?.flatMap((area) => area.spots.map((spot) => spot.name)).slice(0, 6) ?? [];
}

const categoryAliases: Record<string, string> = {
  Architecture: 'Cultural',
  Art: 'Art & Culture',
  'Day trip': 'Day Trip',
  Experience: 'Iconic',
  Family: 'Entertainment',
  Food: 'Culinary',
  Heritage: 'Historical',
  'Hidden Gem': 'Hidden gem',
  History: 'Historical',
  'Local Life': 'Cultural',
  Local: 'Cultural',
  'Must-do': 'Iconic',
  'Must-see': 'Iconic',
  Neighbourhood: 'Walking',
  Novelty: 'Unique',
  Seasonal: 'Festival',
  Signature: 'Iconic',
  UNESCO: 'Historical',
};

const categoryRules: Array<{ category: string; patterns: RegExp[] }> = [
  { category: 'Wellness', patterns: [/\b(spa|massage|ayurved|wellness|onsen|thermal|sauna|bathhouse|sulphur bath|sulfur bath|hot spring|hot pools|mud bath|yoga|meditation|mindfulness|healing)\b/i, /\b(hammam|hamam)\b.*\b(experience|bath|baths|spa|ritual)\b/i] },
  { category: 'Culinary', patterns: [/\b(culinary|cooking|dinner|breakfast|lunch|restaurant|cafe|cafes|street food|food crawl|food tour|hawker|thali|bbq|barbecue|kebab|noodle|ramen|sushi|dim sum|tapas|paella|eating house|wine|beer|brewery|tea tasting|coffee|chocolate|cheese|spice farm|pepper farm)\b/i] },
  { category: 'Shopping', patterns: [/\b(shopping|souq|souk|bazaar|market|mall|boutique|craft shop|textile|silk|jewellery|jewelry|antiques|carpet|ceramics|workshop|trading domes)\b/i] },
  { category: 'Nightlife', patterns: [/\b(nightlife|club|pub crawl|bar hop|busking|rooftop bar|live music|party)\b/i] },
  { category: 'Entertainment', patterns: [/\b(theme park|universal studios|disney|ferrari world|show|circus show|theatre|theater|stadium|match|concert|fountain show|performance|opera)\b/i] },
  { category: 'Spiritual', patterns: [/\b(wat|temple|mosque|church|cathedral|basilica|synagogue|shrine|stupa|monastery|pagoda|ashram|abbey|aarti|puja|pilgrim|pilgrimage|prayer|sacred|buddha|gurdwara|gurudwara|dargah)\b/i] },
  { category: 'Historical', patterns: [/\b(fort|fortress|castle|palace|citadel|ruin|tomb|mausoleum|memorial|battlefield|archaeolog|ancient|old city|old town|heritage|unesco|colonial|historic|history|museum|war|caves|roman baths)\b/i] },
  { category: 'Art & Culture', patterns: [/\b(art|arts|gallery|mural|street art|cultural|culture|dance|flamenco|music|festival|folklore|craft|library|architecture|design)\b/i] },
  { category: 'Wildlife', patterns: [/\b(safari|wildlife|zoo|sanctuary|elephant|rhino|lion|tiger|giraffe|monkey|bird|whale|dolphin|tarsier|tortoise|crane|game drive|national park)\b/i] },
  { category: 'Beach', patterns: [/\b(beach|island|lagoon|coast|shore|seaside|bay|sandbar|reef|atoll|marine park)\b/i] },
  { category: 'Adventure', patterns: [/\b(rafting|kayak|kayaking|diving|snorkel|surf|paraglid|bungee|zipline|quad|jeep safari|canyoning|balloon|helicopter|cable car|ski|snow trip)\b/i] },
  { category: 'Trekking', patterns: [/\b(trek|hike|trail|walk|climb|mountain|peak|summit|pass|valley|gorge)\b/i] },
  { category: 'Nature', patterns: [/\b(garden|gardens|park|forest|waterfall|lake|river|botanic|botanical|viewpoint|sunrise|sunset|volcano|canyon|glacier|rainforest|mangrove|cave|falls)\b/i] },
  { category: 'Scenic', patterns: [/\b(view|viewpoint|skyline|observation|tower|cruise|ferry|promenade|bridge|sunset|sunrise|lookout|panorama|gondola)\b/i] },
  { category: 'Walking', patterns: [/\b(walk|walking|lane|quarter|district|neighbourhood|neighborhood|village|old quarter|backstreets)\b/i] },
  { category: 'Festival', patterns: [/\b(festival|fair|carnival|mela|new year|dussehra|ramadan|eid|christmas)\b/i] },
];

function normalizeThingCategory(category: string | undefined): string {
  if (!category) return 'Iconic';
  return categoryAliases[category] ?? category;
}

function categoryFromText(text: string): string | undefined {
  return categoryRules.find((rule) => rule.patterns.some((pattern) => pattern.test(text)))?.category;
}

function classifierDescription(description: string): string {
  return description
    .replace(/nearby food, viewpoints, and slower local exploring/gi, '')
    .replace(/nearby meal, viewpoint, market, or neighbourhood walk/gi, '')
    .replace(/nearby meal or neighbourhood walk/gi, '')
    .replace(/neighbourhood walk for the best rhythm/gi, '')
    .replace(/peak season/gi, '');
}

function inferThingCategory(name: string, description: string, category?: string): string {
  return categoryFromText(name) ?? categoryFromText(`${name} ${classifierDescription(description)}`) ?? normalizeThingCategory(category);
}

// Curated overrides for named experiences that are genuinely time-locked but
// whose name/description doesn't necessarily say so (e.g. a performance that
// only runs at a fixed hour). Matched as a lowercase substring of the name.
const timeOverrides: Record<string, TimeOfDay[]> = {
  kecak: ['evening'],
  'barong dance': ['morning', 'afternoon'],
  'legong dance': ['evening'],
  tsukiji: ['morning'],
  gion: ['evening'],
  geisha: ['evening'],
  maiko: ['evening'],
  'tea ceremony': ['afternoon'],
  sumo: ['morning'],
  durbar: ['morning'],
  qawwali: ['evening'],
  'sema ceremony': ['evening'],
  'floating market': ['morning'],
  'damnoen saduak': ['morning'],
  'alms giving': ['morning'],
  'monk chant': ['morning'],
  'changing of the guard': ['morning'],
};

// Regex fallback for time-of-day signals embedded in the name/description —
// mirrors `categoryRules`. Order matters: more specific groups first.
const timeRules: Array<{ time: TimeOfDay[]; patterns: RegExp[] }> = [
  {
    time: ['morning'],
    patterns: [
      /\bsunrise\b/i,
      /\bdawn\b/i,
      /\bdaybreak\b/i,
      /\bhot air balloon/i,
      /\bfish market\b/i,
      /\bbird ?watching\b/i,
      /\bbreakfast\b/i,
      /\bmorning (market|ritual|prayer|safari|cruise|hike|trek|walk|yoga)\b/i,
    ],
  },
  {
    time: ['evening'],
    patterns: [
      /\bnight (market|safari|cruise|tour|walk|bazaar|food|life)\b/i,
      /\bnightlife\b/i,
      /\baarti\b/i,
      /\bevening (ritual|prayer|show|cruise|walk|market|safari|service|aarti)\b/i,
      /\bdinner cruise\b/i,
      /\bcultural (show|performance)\b/i,
      /\bdance (show|performance|ceremony)\b/i,
      /\b(sound\s*(and|&)\s*light|light\s*(and|&)\s*sound)\b/i,
      /\billumination/i,
      /\bfountain show\b/i,
      /\bfireworks\b/i,
      /\bwhirling dervish/i,
      /\bcabaret\b/i,
      /\bpub crawl\b/i,
      /\brooftop bar\b/i,
      /\bstargazing\b/i,
      /\bfull moon party\b/i,
      /\blantern (festival|release)\b/i,
    ],
  },
  {
    time: ['afternoon', 'evening'],
    patterns: [
      /\bsunset\b/i,
      /\bdusk\b/i,
      /\bgolden hour\b/i,
      /\bsun (dips|sets|melts|dissolves|dissolve|disappears|goes down|sinks)\b/i,
      /\bdesert safari\b/i,
      /\bdune bashing\b/i,
    ],
  },
];

function timeFromOverride(name: string): TimeOfDay[] | undefined {
  const lower = name.toLowerCase();
  return Object.entries(timeOverrides).find(([key]) => lower.includes(key))?.[1];
}

function timeFromText(text: string): TimeOfDay[] | undefined {
  return timeRules.find((rule) => rule.patterns.some((pattern) => pattern.test(text)))?.time;
}

function inferActivityTime(name: string, description: string, existing?: TimeOfDay[]): TimeOfDay[] | undefined {
  if (existing && existing.length > 0) return existing;
  return timeFromOverride(name) ?? timeFromText(`${name} ${description}`);
}

export function enrichCity(city: City): City {
  const spots = topSpots(city);
  const firstArea = city.areas?.[0]?.name ?? 'Central Area';
  const mainSpot = spots[0] ?? city.name;
  const secondarySpot = spots[1] ?? firstArea;
  const thirdSpot = spots[2] ?? 'local markets';
  const usePhoto = city.country !== 'India' || Boolean(verifiedCityImages[city.slug]);

  return {
    ...city,
    image: usePhoto ? city.image : '',
    heroImage: usePhoto ? city.heroImage : '',
    areas: usePhoto ? city.areas : city.areas?.map((area) => ({ ...area, image: '' })),
    heroDescription: city.heroDescription || city.description,
    monthByMonth: city.monthByMonth ?? {
      summary: `${city.name} is best planned around ${city.stats.bestTime}. Shoulder months usually give better prices and fewer crowds.`,
      bestMonths: city.stats.bestTime.split(/[·,-]/).map((part) => part.trim()).filter(Boolean).slice(0, 3),
      avoidMonths: ['July', 'August'],
      months: buildMonths(city),
    },
    budgetBreakdown: city.budgetBreakdown ?? {
      disclaimer: 'Indicative USD ranges for a solo traveller. Prices vary by season, room quality, and transport style.',
      tiers: [
        {
          label: 'Budget',
          icon: '🎒',
          perDay: city.stats.budget,
          accommodation: 'Hostels, simple guesthouses, or budget homestays',
          food: 'Local restaurants, dhabas, cafes, and street snacks',
          transport: 'Shared taxis, buses, autos, walking, or scooter rental where practical',
          activities: 'Major sights, viewpoints, markets, and self-guided walks',
          tip: `Stay close to ${firstArea} to reduce local transport costs.`,
        },
        {
          label: 'Mid-range',
          icon: '✈️',
          perDay: '$50-$130',
          accommodation: 'Comfortable boutique hotels, homestays, or well-rated 3-star stays',
          food: 'A mix of local institutions, cafes, and one nicer dinner',
          transport: 'App cabs, private taxis for day trips, or pre-booked local transfers',
          activities: 'Guides, ticketed attractions, short experiences, and curated day trips',
          tip: `Book stays near ${firstArea} in peak season for easier sightseeing.`,
        },
        {
          label: 'Luxury',
          icon: '👑',
          perDay: '$180-$500+',
          accommodation: 'Premium resorts, heritage hotels, villas, or high-end boutique stays',
          food: 'Best restaurants, private dining, and specialist local food experiences',
          transport: 'Private car with driver, airport transfers, and custom excursions',
          activities: 'Private guides, premium experiences, spa time, and flexible day trips',
          tip: `Use ${city.name} as a slow base rather than rushing through every sight.`,
        },
      ],
    },
    thingsToDo: (city.thingsToDo ?? spots.slice(0, 5).map((spot, index) => ({
      name: spot,
      description: `${spot} is one of the essential experiences in ${city.name}. Build your day around it, then leave time for nearby food, viewpoints, and slower local exploring.`,
      icon: ['📍', '🏛️', '🌄', '🍽️', '🚶'][index] ?? '📍',
      duration: index === 0 ? '2-3 hours' : '1-2 hours',
      category: 'Iconic',
      idealTime: undefined as TimeOfDay[] | undefined,
    }))).map((thing) => ({
      ...thing,
      category: inferThingCategory(thing.name, thing.description, thing.category),
      idealTime: inferActivityTime(thing.name, thing.description, thing.idealTime),
    })),
    hotels: city.hotels ?? [
      {
        name: `Central ${city.name} Boutique Stay`,
        description: `A practical base near ${firstArea}, useful for first-time visitors who want short transfers and easy access to food.`,
        priceRange: '$45-$120/night',
        type: 'Boutique Hotel',
        highlight: 'Best balance of location and comfort',
      },
      {
        name: `${city.name} Homestay`,
        description: 'A more local stay option with personal hosting, regional food, and better advice for nearby sights.',
        priceRange: '$20-$70/night',
        type: 'Homestay',
        highlight: 'Local hospitality and quieter atmosphere',
      },
      {
        name: `${city.name} Premium Retreat`,
        description: 'For travellers who want stronger service, better views, and a slower pace between sightseeing days.',
        priceRange: '$120-$350/night',
        type: 'Premium Resort or Heritage Stay',
        highlight: 'More space, views, and curated service',
      },
    ],
    restaurants: city.restaurants ?? [
      {
        name: `${city.name} Local Food Trail`,
        description: `Start with simple local restaurants around ${firstArea}; the best meals are usually regional staples rather than generic tourist menus.`,
        cuisine: 'Regional Indian',
        priceRange: '$3-$12/person',
        mustTry: 'Regional thali or local breakfast',
      },
      {
        name: `${city.name} Cafe Stop`,
        description: 'A relaxed break between sightseeing stops, useful for planning the next leg and escaping midday heat or rain.',
        cuisine: 'Cafe and snacks',
        priceRange: '$4-$15/person',
        mustTry: 'Tea, coffee, bakery items, or local snacks',
      },
      {
        name: `${city.name} Special Dinner`,
        description: 'Choose one dinner with a view, heritage setting, or standout regional kitchen to anchor the trip.',
        cuisine: 'Regional / Contemporary Indian',
        priceRange: '$12-$40/person',
        mustTry: 'House speciality',
      },
    ],
    gettingAround: city.gettingAround ?? [
      `Base yourself near ${firstArea} if you only have 1-2 days.`,
      'Use autos or app cabs for short hops where available; agree prices before starting if rides are not metered.',
      'Hire a local driver for spread-out sights or day trips.',
      'Start outdoor sightseeing early for better light, lower heat, and fewer crowds.',
      'Keep cash for small entries, parking, local snacks, and places without reliable card payments.',
    ],
    proTips: city.proTips ?? [
      `Prioritise ${mainSpot} early in the day before crowds build.`,
      `Pair ${secondarySpot} with nearby food stops instead of crossing the city repeatedly.`,
      'Check weekly closures and festival dates before locking the itinerary.',
      'Carry a light layer, sun protection, and water; Indian travel days often run longer than expected.',
      'Book peak-season accommodation ahead, especially around long weekends and school holidays.',
    ],
    offbeatPlaces: city.offbeatPlaces ?? [
      {
        name: `${city.name} Backstreets`,
        description: `Walk the quieter lanes around ${firstArea} for a better feel of everyday life beyond the headline sights.`,
        why: 'It adds texture to the trip and helps the destination feel less checklist-driven.',
        icon: '🚶',
        type: 'Slow Walk',
        tip: 'Go in the early morning or late afternoon when the light is softer.',
      },
      {
        name: `${thirdSpot} Detour`,
        description: `Use ${thirdSpot} as a lower-pressure stop between bigger attractions.`,
        why: 'Smaller stops often become the most memorable part of an India trip.',
        icon: '✨',
        type: 'Hidden Stop',
        tip: 'Ask your host or driver for the quietest time to visit.',
      },
    ],
    neighbourhoods: city.neighbourhoods ?? [
      {
        name: firstArea,
        description: `${firstArea} is the easiest base for a first visit to ${city.name}, with access to the main sights and practical transport.`,
        bestFor: ['First-time visitors', 'Short stays', 'Sightseeing'],
        vibe: city.vibes[0] ?? 'Central',
        priceRange: '$$',
        highlights: spots.slice(0, 3),
        notFor: 'Travellers who want a very quiet stay away from the main visitor circuit',
      },
      {
        name: 'Quieter Local Base',
        description: `A calmer stay outside the busiest core works well if you have extra time in ${city.name}.`,
        bestFor: ['Slow travellers', 'Couples', 'Repeat visitors'],
        vibe: 'Relaxed',
        priceRange: '$$',
        highlights: spots.slice(3, 6),
        notFor: 'Travellers trying to cover everything in one day',
      },
    ],
    gettingThere: city.gettingThere ?? {
      summary: `${city.name} is best reached through the nearest major railhead or airport, then completed by road transfer if needed.`,
      airports: [
        {
          name: `Nearest airport or rail hub for ${city.name}`,
          code: 'N/A',
          note: 'Check the most convenient hub based on your starting city.',
          distanceFromCity: 'Varies by route',
          transferTime: 'Plan buffer time for Indian road conditions',
          transferOptions: ['Private taxi', 'State bus', 'Train plus local transfer'],
        },
      ],
      topRoutes: [
        { from: 'Delhi', flag: '🇮🇳', duration: 'Varies', airlines: 'Flight, train, or road depending on destination' },
        { from: 'Mumbai', flag: '🇮🇳', duration: 'Varies', airlines: 'Flight or rail connections where available' },
        { from: 'Bengaluru', flag: '🇮🇳', duration: 'Varies', airlines: 'Flight or rail connections where available' },
      ],
      bestTimeToBuyTip: 'For peak season and long weekends, book transport and stays 4-8 weeks ahead.',
      bookingTip: 'Confirm final-mile transfers in advance; the last 30-80 km can take longer than maps suggest.',
    },
  };
}
