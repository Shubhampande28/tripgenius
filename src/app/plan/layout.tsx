import type { Metadata } from 'next';

const BASE = 'https://www.tripgenius.in';

export const metadata: Metadata = {
  title: 'AI Trip Planner — Build Your Itinerary',
  description:
    'Plan your perfect trip with TripGenius AI. Enter your destination, travel dates, and budget to get a personalised day-by-day itinerary for India, Asia, Europe and beyond.',
  keywords: [
    'AI trip planner', 'itinerary planner', 'trip planning tool',
    'travel itinerary generator', 'India trip planner', 'personalised travel plan',
    'day by day itinerary', 'TripGenius planner',
  ],
  alternates: { canonical: `${BASE}/plan` },
  openGraph: {
    title: 'AI Trip Planner — Build Your Itinerary | TripGenius',
    description:
      'Get a personalised day-by-day travel itinerary in seconds. Enter your destination, dates, and budget — TripGenius AI handles the rest.',
    url: `${BASE}/plan`,
    siteName: 'TripGenius',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Trip Planner — Build Your Itinerary | TripGenius',
    description:
      'Get a personalised day-by-day travel itinerary in seconds. Enter your destination, dates, and budget.',
  },
};

export default function PlanLayout({ children }: { children: React.ReactNode }) {
  return children;
}
