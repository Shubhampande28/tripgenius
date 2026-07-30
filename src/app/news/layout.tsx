import type { Metadata } from 'next';

const BASE = 'https://www.tripgenius.in';

export const metadata: Metadata = {
  title: 'Travel News for Indian Travellers — Visas, Airlines & Advisories',
  description: 'Fresh travel news that affects your trip: visa changes for Indian passport holders, airline routes, destination rules and advisories. Updated regularly.',
  alternates: { canonical: `${BASE}/news` },
  openGraph: {
    title: 'Travel News for Indian Travellers | TripGenius',
    description: 'Visa changes, airline routes, destination rules and advisories — the travel news that actually affects your trip planning.',
    url: `${BASE}/news`,
    type: 'website',
  },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
