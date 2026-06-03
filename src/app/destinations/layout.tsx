import type { Metadata } from 'next';

const BASE = 'https://www.tripgenius.in';

export const metadata: Metadata = {
  title: 'Explore Travel Destinations — India, Asia & Beyond',
  description:
    'Discover travel destinations across India, Asia, Europe and the Americas. Filter by region and explore free guides covering things to do, best seasons, budgets, and insider tips.',
  keywords: [
    'travel destinations', 'best travel destinations', 'India destinations',
    'Asia destinations', 'Europe destinations to visit', 'places to travel in India',
    'international travel destinations', 'TripGenius destinations',
  ],
  alternates: { canonical: `${BASE}/destinations` },
  openGraph: {
    title: 'Explore Travel Destinations — India, Asia & Beyond | TripGenius',
    description:
      'Discover travel destinations across India, Asia, Europe and the Americas with free guides covering things to do, best seasons, and local tips.',
    url: `${BASE}/destinations`,
    siteName: 'TripGenius',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore Travel Destinations — India, Asia & Beyond | TripGenius',
    description:
      'Discover travel destinations across India, Asia, Europe and the Americas with free travel guides.',
  },
};

export default function DestinationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
