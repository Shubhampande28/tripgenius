import type { Metadata } from 'next';
import HomeClient from '@/components/home/HomeClient';

// Server shell for the homepage: owns metadata and structured data so they are
// server-rendered, while the interactive page (search, shuffle grid, newsletter,
// FAQ accordion) lives in the HomeClient client component.

const BASE = 'https://www.tripgenius.in';

export const metadata: Metadata = {
  title: 'TripGenius — Free Travel Guides for India & the World',
  description:
    'Free, in-depth travel guides: best time to visit, month-by-month weather, things to do, budgets and honest local tips for 70+ destinations across India, Asia, Europe and beyond.',
  alternates: { canonical: BASE },
};

const HOME_FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Are TripGenius travel guides really free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — every guide on TripGenius is completely free to read, with no paywalls or subscription fees.' } },
    { '@type': 'Question', name: 'How often are the travel guides updated?', acceptedAnswer: { '@type': 'Answer', text: 'We review and update our guides regularly. Every guide shows a last updated date.' } },
  ],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_FAQ_SCHEMA) }} />
      <HomeClient />
    </>
  );
}
