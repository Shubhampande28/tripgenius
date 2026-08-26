import { countries } from '@/data/countries';
import { getCityBySlug } from '@/lib/cities';
import {
  buildItineraryDays,
  buildCityActivityPool,
  getItinerarySlug,
  ITINERARY_DURATIONS,
  ITINERARY_FLEXIBLE_PLANS,
  ITINERARY_COMING_SOON,
} from '@/lib/itineraries';

let genuineBugs = 0;
let flexHandled = 0;
let comingSoonSkipped = 0;

for (const country of countries) {
  for (const duration of ITINERARY_DURATIONS) {
    const slug = getItinerarySlug(country.slug, duration);

    if (ITINERARY_COMING_SOON[slug]) {
      comingSoonSkipped++;
      continue; // page renders a maintenance state, no day cards at all
    }

    const days = buildItineraryDays(country.slug, duration);
    if (days.length === 0) continue;

    const flexPlan = ITINERARY_FLEXIBLE_PLANS[slug];
    const flexDays = new Set(flexPlan?.days.map((d) => d.day) ?? []);

    for (const d of days) {
      if (flexDays.has(d.day)) { flexHandled++; continue; } // intentionally recaptioned, not a bug
      const activities = buildCityActivityPool(d.city).slice(d.activityIndex * 3, d.activityIndex * 3 + 3);
      if (activities.length < 2) {
        genuineBugs++;
        console.log(`REMAINING GAP: ${slug} day ${d.day} — ${d.city.name}: ${activities.length} activities`);
      }
    }
  }
}

console.log(`\nComing-soon pages (noindexed, day cards not rendered): ${comingSoonSkipped}`);
console.log(`Days intentionally recaptioned as flexible: ${flexHandled}`);
console.log(`Remaining unaddressed thin days: ${genuineBugs}`);
