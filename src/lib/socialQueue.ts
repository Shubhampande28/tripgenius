// Deterministic daily social-posting queue. Given a day index, returns the
// pins to post that day — no database needed: the same date always yields the
// same items, so the cron is stateless and safe to retry.
//
// Rotation: cycles through all indexable cities × the four pin styles, so
// every city eventually gets a Season Card, Checklist, Collage and a seasonal
// Month Cover, each linking to its canonical page.

import { allCities, isIndexableCity } from '@/lib/cities';
import type { City } from '@/lib/types';

const BASE = 'https://www.tripgenius.in';
const MONTHS = ['january','february','march','april','may','june','july','august','september','october','november','december'];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export interface QueueItem {
  citySlug: string;
  cityName: string;
  style: 'season' | 'things' | 'collage' | 'cover';
  title: string;
  description: string;
  /** Destination the pin/post links to (canonical page for this pin type). */
  link: string;
  /** Public image URL (the pin generator). */
  imageUrl: string;
  /** Same design rendered at 4:5 for Instagram (its API rejects 2:3). */
  igImageUrl: string;
  igCaption: string;
}

const STYLES: QueueItem['style'][] = ['season', 'things', 'collage', 'cover'];

function buildItem(city: City, style: QueueItem['style'], now: Date): QueueItem {
  const year = now.getFullYear();
  // Seasonal cover pins promote NEXT month — that's when people plan.
  const nextMonth = MONTHS[(now.getMonth() + 1) % 12];
  const M = cap(nextMonth);
  const name = city.name;
  const slug = city.slug;

  const igCaptionBase = `${name}, ${city.country} ${city.flag}\n${city.tagline}\n\nFull free travel guide → link in bio (tripgenius.in)\n\n#travel #${slug.replace(/-/g, '')} #${city.country.replace(/[^a-z]/gi, '').toLowerCase()} #travelguide #wanderlust #travelgram`;

  switch (style) {
    case 'season':
      return {
        citySlug: slug, cityName: name, style,
        title: `Best Time to Visit ${name} (${year}) — Month by Month`,
        description: `${city.tagline}. See which months are best, good or worth avoiding in ${name} — plus daily budget and visa info. Free month-by-month guide on TripGenius.`,
        link: `${BASE}/best-time-to-visit/${slug}`,
        imageUrl: `${BASE}/api/og/pin/${slug}`,
        igImageUrl: `${BASE}/api/og/pin/${slug}?size=ig`,
        igCaption: igCaptionBase,
      };
    case 'things':
      return {
        citySlug: slug, cityName: name, style,
        title: `Top Things to Do in ${name} (${year} Guide)`,
        description: `The experiences actually worth your time in ${name} — from the icons to the local favourites. See the full list with tips, timings and a map on TripGenius, free.`,
        link: `${BASE}/cities/${slug}`,
        imageUrl: `${BASE}/api/og/pin/${slug}?style=things`,
        igImageUrl: `${BASE}/api/og/pin/${slug}?style=things&size=ig`,
        igCaption: igCaptionBase,
      };
    case 'collage':
      return {
        citySlug: slug, cityName: name, style,
        title: `${name} Travel Guide ${year}: What to See, Costs & Tips`,
        description: `${city.tagline}. Everything for your ${name} trip in one free guide — things to do, where to stay, daily budgets and local tips.`,
        link: `${BASE}/cities/${slug}`,
        imageUrl: `${BASE}/api/og/pin/${slug}?style=collage`,
        igImageUrl: `${BASE}/api/og/pin/${slug}?style=collage&size=ig`,
        igCaption: igCaptionBase,
      };
    case 'cover':
      return {
        citySlug: slug, cityName: name, style,
        title: `${name} in ${M} (${year}): Weather, Crowds & Costs`,
        description: `Planning ${name} in ${M}? Here's the weather, temperatures, crowd levels and prices to expect — and whether it's the right month for your trip. Free guide on TripGenius.`,
        link: `${BASE}/visit/${slug}/${nextMonth}`,
        imageUrl: `${BASE}/api/og/pin/${slug}?month=${nextMonth}`,
        igImageUrl: `${BASE}/api/og/pin/${slug}?month=${nextMonth}&size=ig`,
        igCaption: igCaptionBase,
      };
  }
}

/** Days since Unix epoch, UTC — the queue's clock. */
export function dayIndexFor(date: Date): number {
  return Math.floor(date.getTime() / 86_400_000);
}

export function buildDailyQueue(date: Date, count: number): QueueItem[] {
  const cities = allCities.filter(isIndexableCity);
  if (cities.length === 0) return [];
  const day = dayIndexFor(date);
  const items: QueueItem[] = [];
  for (let i = 0; i < count; i++) {
    const n = day * count + i;
    const city = cities[n % cities.length];
    const style = STYLES[Math.floor(n / cities.length) % STYLES.length];
    items.push(buildItem(city, style, date));
  }
  return items;
}
