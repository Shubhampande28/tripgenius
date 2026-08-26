import type { Metadata } from 'next';
import { REAL_CITY_COUNT } from '@/lib/siteStats';

const BASE = 'https://www.tripgenius.in';

export const metadata: Metadata = {
  title: `City Travel Guides — ${REAL_CITY_COUNT} Destinations`,
  description:
    `Browse free travel guides for ${REAL_CITY_COUNT} cities across India, Asia, Europe and the Americas. Discover the best time to visit, things to do, budget tips, and local insights for every destination.`,
  alternates: { canonical: `${BASE}/cities` },
  openGraph: {
    title: `City Travel Guides — ${REAL_CITY_COUNT} Destinations | TripGenius`,
    description:
      `Free travel guides for ${REAL_CITY_COUNT} cities worldwide. Find the best time to visit, things to do, and local tips for India, Asia, Europe and beyond.`,
    url: `${BASE}/cities`,
    siteName: 'TripGenius',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `City Travel Guides — ${REAL_CITY_COUNT} Destinations | TripGenius`,
    description:
      `Free travel guides for ${REAL_CITY_COUNT} cities worldwide. Find the best time to visit, things to do, and local tips.`,
  },
};

export default function CitiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
