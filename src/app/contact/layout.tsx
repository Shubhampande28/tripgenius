import type { Metadata } from 'next';

const BASE = 'https://www.tripgenius.in';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the TripGenius team. Report a guide correction, suggest a new city, ask a question, or reach out for partnerships and press enquiries.',
  alternates: { canonical: `${BASE}/contact` },
  openGraph: {
    title: 'Contact Us | TripGenius',
    description:
      'Get in touch with TripGenius — report corrections, suggest cities, or ask questions about our free travel guides.',
    url: `${BASE}/contact`,
    siteName: 'TripGenius',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contact Us | TripGenius',
    description: 'Get in touch with TripGenius — report corrections, suggest cities, or ask questions.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
