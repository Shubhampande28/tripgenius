import type { Metadata } from 'next';

const BASE = 'https://www.tripgenius.in';

export const metadata: Metadata = {
  title: 'Travel Blog — Tips, Guides & Inspiration',
  description:
    'Read travel articles, budget breakdowns, packing guides, and destination inspiration. Practical tips for India, Asia, Europe and more from the TripGenius travel blog.',
  keywords: [
    'travel blog', 'travel tips', 'India travel blog', 'budget travel tips',
    'travel inspiration', 'packing guide', 'Asia travel blog', 'Europe travel tips',
    'travel planning advice', 'TripGenius blog',
  ],
  alternates: { canonical: `${BASE}/blog` },
  openGraph: {
    title: 'Travel Blog — Tips, Guides & Inspiration | TripGenius',
    description:
      'Practical travel articles, budget tips, and destination inspiration for India, Asia, Europe and more.',
    url: `${BASE}/blog`,
    siteName: 'TripGenius',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travel Blog — Tips, Guides & Inspiration | TripGenius',
    description:
      'Practical travel articles, budget tips, and destination inspiration for India, Asia, Europe and more.',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
