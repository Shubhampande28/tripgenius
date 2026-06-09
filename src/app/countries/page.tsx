import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { countries, CountryData } from '@/data/countries';

const BASE = 'https://www.tripgenius.in';

export const metadata: Metadata = {
  title: 'Travel Guides by Country — Best Places to Visit Worldwide | TripGenius',
  description: 'Explore travel guides for 40+ countries. Visa tips for Indians, best time to visit, top cities, budgets, and local tips — all in one place.',
  keywords: [
    'countries to visit', 'travel guides by country', 'best countries to visit',
    'international travel guide', 'travel tips by country', 'visa for indians',
    'best time to visit countries', 'places to visit worldwide',
  ],
  alternates: { canonical: `${BASE}/countries` },
  openGraph: {
    title: 'Travel Guides by Country | TripGenius',
    description: 'Visa info, best time to visit, top cities, and local tips for 40+ countries.',
    url: `${BASE}/countries`,
    type: 'website',
  },
};

const CONTINENT_ORDER = ['Asia', 'Europe', 'Africa', 'Americas'];

export default function CountriesIndexPage() {
  const byContinent = CONTINENT_ORDER.reduce<Record<string, CountryData[]>>((acc, c) => {
    acc[c] = countries.filter((country) => country.continent === c);
    return acc;
  }, {});

  // catch any continent values not in CONTINENT_ORDER
  const remaining = countries.filter((c) => !CONTINENT_ORDER.includes(c.continent));
  if (remaining.length > 0) {
    byContinent['Other'] = remaining;
  }

  const totalCount = countries.length;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Countries', item: `${BASE}/countries` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Navbar />
      <main className="min-h-screen pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-muted mb-6">
            <Link href="/" className="hover:text-accent">Home</Link>
            <span>/</span>
            <span>Countries</span>
          </nav>

          {/* Header */}
          <div className="mb-10">
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-primary-text mb-3">
              Travel Guides by Country
            </h1>
            <p className="text-muted text-base max-w-2xl">
              In-depth guides for {totalCount} countries — visa requirements for Indians, best time to visit,
              top cities, daily budgets, and honest local tips.
            </p>
          </div>

          {/* Continents */}
          {Object.entries(byContinent).map(([continent, continentCountries]) => {
            if (continentCountries.length === 0) return null;
            return (
              <section key={continent} className="mb-12">
                <h2 className="font-heading text-xl font-semibold text-primary-text mb-4 flex items-center gap-3">
                  {continent}
                  <span className="text-xs font-normal text-muted bg-surface border border-border px-2 py-0.5 rounded-full">
                    {continentCountries.length} {continentCountries.length === 1 ? 'country' : 'countries'}
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {continentCountries.map((country) => (
                    <Link
                      key={country.slug}
                      href={`/countries/${country.slug}`}
                      className="group bg-surface border border-border hover:border-accent/40 rounded-2xl p-5 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{country.flag}</span>
                        <div>
                          <h3 className="font-semibold text-primary-text group-hover:text-accent transition-colors">
                            {country.name}
                          </h3>
                          <p className="text-xs text-muted">{country.capital}</p>
                        </div>
                      </div>
                      <div className="space-y-1.5 text-xs text-muted">
                        <div className="flex items-center justify-between">
                          <span>Best time</span>
                          <span className="text-primary-text font-medium">{country.bestTime}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Visa for Indians</span>
                          <span className={`font-medium ${country.visaForIndians.toLowerCase().includes('no visa') || country.visaForIndians.toLowerCase().includes('visa-free') ? 'text-teal' : 'text-primary-text'}`}>
                            {country.visaForIndians}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Currency</span>
                          <span className="text-primary-text font-medium">{country.currency}</span>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-accent font-medium group-hover:underline">
                        Explore {country.cities.length} {country.cities.length === 1 ? 'city' : 'cities'} →
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}

        </div>
      </main>
      <Footer />
    </>
  );
}
