// Pinterest pin factory — queue builder.
// Reads the site's own data layer (countries + itineraries + authored month
// pages) and produces queue.json: one entry per pinnable page, in priority
// order. publish.ts consumes one pending entry per run.
//
// Usage: npx tsx automation/pinterest/build-queue.ts
// Re-running preserves the status/postedAt of entries that already exist.

import fs from 'node:fs';
import path from 'node:path';
import { countries } from '@/data/countries';
import {
  ITINERARY_DURATIONS,
  buildItineraryDays,
  estimateTripCost,
  getItinerarySlug,
} from '@/lib/itineraries';
import { getCityBySlug, authoredMonthCitySlugs } from '@/lib/cities';
import { getCityImageUrl } from '@/lib/cityImages';

const BASE = 'https://www.tripgenius.in';
const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const QUEUE_FILE = path.join(DIR, 'queue.json');

// GSC-impression priority order (July 2026 baseline) — these itineraries earn
// the most impressions, so their pins go out first.
const PRIORITY_ITINERARIES = [
  'brazil-5-days', 'argentina-5-days', 'brazil-3-days', 'argentina-7-days',
  'india-3-days', 'argentina-3-days', 'brazil-7-days', 'south-africa-5-days',
  'south-africa-3-days', 'canada-5-days', 'canada-3-days', 'spain-3-days',
  'peru-5-days', 'mauritius-3-days',
];

export interface QueueEntry {
  slug: string;                    // page slug (itinerary slug or "city/month")
  url: string;
  type: 'itinerary' | 'visit';
  country?: string;
  city?: string;
  days?: number;
  month?: string;
  headline: string;
  subline: string;
  costINR?: number;
  imageSource: string;             // absolute URL of the destination photo
  status: 'pending' | 'posted';
  postedAt: string | null;
}

function absoluteImage(src: string | null | undefined, fallback: string): string {
  const img = src ?? fallback;
  return img.startsWith('/') ? `${BASE}${img}` : img;
}

function itineraryEntry(countrySlug: string, duration: number): QueueEntry | null {
  const country = countries.find((c) => c.slug === countrySlug);
  if (!country) return null;
  const days = buildItineraryDays(countrySlug, duration as (typeof ITINERARY_DURATIONS)[number]);
  if (days.length === 0) return null;
  const cost = estimateTripCost(days);
  const firstCity = days[0].city;
  const slug = getItinerarySlug(countrySlug, duration);
  return {
    slug,
    url: `${BASE}/itinerary/${slug}`,
    type: 'itinerary',
    country: country.name,
    days: duration,
    headline: `${country.name} in ${duration} Days`,
    subline: cost
      ? `Day-by-day plan + costs from ₹${cost.inrMin.toLocaleString('en-IN')}`
      : 'Day-by-day plan with real costs in ₹',
    costINR: cost?.inrMin,
    imageSource: absoluteImage(getCityImageUrl(firstCity.slug, 'hero'), firstCity.heroImage),
    status: 'pending',
    postedAt: null,
  };
}

function visitEntry(citySlug: string): QueueEntry | null {
  const city = getCityBySlug(citySlug);
  if (!city?.monthByMonth) return null;
  const month = city.monthByMonth.bestMonths[0];
  if (!month) return null;
  const monthSlug = month.toLowerCase();
  return {
    slug: `${citySlug}/${monthSlug}`,
    url: `${BASE}/visit/${citySlug}/${monthSlug}`,
    type: 'visit',
    city: city.name,
    month,
    headline: `${city.name} in ${month}`,
    subline: 'Weather, crowds & costs — is it worth it?',
    imageSource: absoluteImage(getCityImageUrl(citySlug, 'hero'), city.heroImage),
    status: 'pending',
    postedAt: null,
  };
}

function main() {
  const entries: QueueEntry[] = [];
  const seen = new Set<string>();
  const push = (e: QueueEntry | null) => {
    if (e && !seen.has(e.slug)) {
      seen.add(e.slug);
      entries.push(e);
    }
  };

  // 1. GSC-priority itineraries
  for (const slug of PRIORITY_ITINERARIES) {
    const m = slug.match(/^(.+)-(\d+)-days$/);
    if (m) push(itineraryEntry(m[1], Number(m[2])));
  }
  // 2. Remaining itineraries
  for (const country of countries) {
    for (const d of ITINERARY_DURATIONS) push(itineraryEntry(country.slug, d));
  }
  // 3. Authored month pages (best month per city)
  for (const citySlug of authoredMonthCitySlugs) push(visitEntry(citySlug));

  // Preserve posted status across rebuilds.
  if (fs.existsSync(QUEUE_FILE)) {
    const old: QueueEntry[] = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf-8'));
    const oldBySlug = new Map(old.map((e) => [e.slug, e]));
    for (const e of entries) {
      const prev = oldBySlug.get(e.slug);
      if (prev?.status === 'posted') {
        e.status = 'posted';
        e.postedAt = prev.postedAt;
      }
    }
  }

  fs.writeFileSync(QUEUE_FILE, JSON.stringify(entries, null, 2));
  const pending = entries.filter((e) => e.status === 'pending').length;
  console.log(`queue.json: ${entries.length} entries (${pending} pending)`);
  console.log(`Next up: ${entries.find((e) => e.status === 'pending')?.slug}`);
}

main();
