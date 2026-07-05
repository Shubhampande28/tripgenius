import type { Metadata } from 'next';

const BASE = 'https://www.tripgenius.in';

export const metadata: Metadata = {
  title: 'City Travel Guides — 70+ Destinations',
  description:
    'Browse free travel guides for 70+ cities across India, Asia, Europe and the Americas. Discover the best time to visit, things to do, budget tips, and local insights for every destination.',
  alternates: { canonical: `${BASE}/cities` },
  openGraph: {
    title: 'City Travel Guides — 70+ Destinations | TripGenius',
    description:
      'Free travel guides for 70+ cities worldwide. Find the best time to visit, things to do, and local tips for India, Asia, Europe and beyond.',
    url: `${BASE}/cities`,
    siteName: 'TripGenius',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'City Travel Guides — 70+ Destinations | TripGenius',
    description:
      'Free travel guides for 70+ cities worldwide. Find the best time to visit, things to do, and local tips.',
  },
};

export default function CitiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
