import { countries } from '@/data/countries';
import { getCityBySlug } from '@/lib/cities';
import {
  buildItineraryDays,
  buildCityActivityPool,
  getItinerarySlug,
  ITINERARY_DURATIONS,
} from '@/lib/itineraries';

interface Row {
  slug: string;
  countryName: string;
  duration: number;
  numCities: number;
  totalDays: number;
  thinDays: { day: number; city: string; count: number; activityIndex: number; thingsToDoLen: number }[];
}

const rows: Row[] = [];

for (const country of countries) {
  for (const duration of ITINERARY_DURATIONS) {
    const days = buildItineraryDays(country.slug, duration);
    if (days.length === 0) continue; // notFound() case — not a live page

    const citiesData = country.cities
      .map((s) => getCityBySlug(s))
      .filter((c): c is NonNullable<typeof c> => c !== undefined && !c.stub);

    const thinDays: Row['thinDays'] = [];
    for (const d of days) {
      const activities = buildCityActivityPool(d.city).slice(d.activityIndex * 3, d.activityIndex * 3 + 3);
      if (activities.length < 2) {
        thinDays.push({
          day: d.day,
          city: d.city.name,
          count: activities.length,
          activityIndex: d.activityIndex,
          thingsToDoLen: d.city.thingsToDo?.length ?? 0,
        });
      }
    }

    if (thinDays.length > 0) {
      rows.push({
        slug: getItinerarySlug(country.slug, duration),
        countryName: country.name,
        duration,
        numCities: citiesData.length,
        totalDays: days.length,
        thinDays,
      });
    }
  }
}

rows.sort((a, b) => b.thinDays.length - a.thinDays.length);

console.log(`Total broken itinerary pages: ${rows.length}\n`);
for (const r of rows) {
  console.log(`## ${r.slug}  (${r.countryName}, ${r.duration} days, ${r.numCities} cities, ${r.thinDays.length}/${r.totalDays} thin days)`);
  for (const t of r.thinDays) {
    console.log(`   Day ${t.day} — ${t.city}: ${t.count} activities rendered (activityIndex=${t.activityIndex}, city has ${t.thingsToDoLen} thingsToDo total)`);
  }
}
