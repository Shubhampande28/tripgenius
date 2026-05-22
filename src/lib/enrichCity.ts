import { City, MonthInfo, MonthRating } from './types';
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
    thingsToDo: city.thingsToDo ?? spots.slice(0, 5).map((spot, index) => ({
      name: spot,
      description: `${spot} is one of the essential experiences in ${city.name}. Build your day around it, then leave time for nearby food, viewpoints, and slower local exploring.`,
      icon: ['📍', '🏛️', '🌄', '🍽️', '🚶'][index] ?? '📍',
      duration: index === 0 ? '2-3 hours' : '1-2 hours',
      category: city.vibes[index % city.vibes.length] ?? 'Essential',
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
