import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CountriesExplorer from '@/components/CountriesExplorer';
import Schema from '@/components/Schema';
import { countries } from '@/data/countries';

const BASE = 'https://www.tripgenius.in';

export const metadata: Metadata = {
  title: 'Travel Guides by Country — Best Places to Visit Worldwide | TripGenius',
  description: 'Explore honest travel guides for 49 countries. Visa requirements for Indians, best time to visit, top cities, daily budgets and local tips — all in one place.',
  alternates: { canonical: `${BASE}/countries` },
  openGraph: {
    title: 'Travel Guides by Country | TripGenius',
    description: 'Honest guides for 49 countries — visa info, best time to visit, top cities, and real budgets.',
    url: `${BASE}/countries`,
    type: 'website',
  },
};

export default function CountriesIndexPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',      item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Countries', item: `${BASE}/countries` },
    ],
  };

  return (
    <>
      <Schema data={breadcrumbSchema} />
      <Navbar />
      <main className="min-h-screen pt-20 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-muted mb-6 pt-4">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <span>Countries</span>
          </nav>

          <CountriesExplorer countries={countries} />

        </div>
      </main>
      <Footer />
    </>
  );
}
