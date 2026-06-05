import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChevronRight, Clock, Wallet, MapPin, ArrowRight, Globe } from 'lucide-react';
import { countries, getCountryBySlug } from '@/data/countries';
import { getCityBySlug } from '@/lib/cities';

const BASE = 'https://www.tripgenius.in';
const YEAR = new Date().getFullYear();

type Props = { params: Promise<{ country: string }> };

export async function generateStaticParams() {
  return countries.map((c) => ({ country: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country: slug } = await params;
  const country = getCountryBySlug(slug);
  if (!country) return { title: 'Not Found' };

  const cityCount = country.cities.length;
  const title = `${country.name} Travel Guide ${YEAR} — All Cities & Destinations | TripGenius`;
  const description =
    `${country.description} Explore ${cityCount} destinations with free guides covering things to do, best time to visit, budget, and local tips.`;

  return {
    title,
    description,
    keywords: [
      `${country.name.toLowerCase()} travel guide`,
      `places to visit in ${country.name.toLowerCase()}`,
      `${country.name.toLowerCase()} destinations`,
      `${country.name.toLowerCase()} travel tips`,
      `${country.capital.toLowerCase()} travel guide`,
      `visit ${country.name.toLowerCase()}`,
      `${country.name.toLowerCase()} tourism`,
      `${country.name.toLowerCase()} trip planner`,
      `${country.name.toLowerCase()} travel ${YEAR}`,
    ],
    alternates: { canonical: `${BASE}/countries/${slug}` },
    openGraph: {
      title,
      description,
      url: `${BASE}/countries/${slug}`,
      type: 'website',
      images: [{ url: `/opengraph-image`, width: 1200, height: 630, alt: `${country.name} travel guide — TripGenius` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function CountryPage({ params }: Props) {
  const { country: slug } = await params;
  const country = getCountryBySlug(slug);
  if (!country) notFound();

  const citiesData = country.cities
    .map((s) => getCityBySlug(s))
    .filter((c): c is NonNullable<ReturnType<typeof getCityBySlug>> => c !== undefined);

  const relatedCountries = countries
    .filter((c) => c.continent === country.continent && c.slug !== slug)
    .slice(0, 4);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: country.continent },
      { '@type': 'ListItem', position: 3, name: `${country.name} Travel Guide`, item: `${BASE}/countries/${slug}` },
    ],
  };

  const destinationSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: `${country.name} Travel Guide`,
    description: country.description,
    url: `${BASE}/countries/${slug}`,
    touristType: ['Family', 'Adventure', 'Cultural', 'Luxury'],
    publisher: { '@type': 'Organization', name: 'TripGenius', url: BASE },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationSchema) }} />
      <Navbar />
      <main className="min-h-screen bg-dark">

        {/* ── Breadcrumb ── */}
        <div className="border-b border-border bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-1.5 text-xs text-muted flex-wrap">
                <li>
                  <Link href="/" className="hover:text-primary-text transition-colors">Home</Link>
                </li>
                <li aria-hidden><ChevronRight size={12} /></li>
                <li><span>{country.continent}</span></li>
                <li aria-hidden><ChevronRight size={12} /></li>
                <li><span className="text-primary-text font-medium">{country.name}</span></li>
              </ol>
            </nav>
          </div>
        </div>

        {/* ── Hero ── */}
        <div className="relative overflow-hidden bg-surface border-b border-border py-16 sm:py-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(220,38,38,0.08),transparent)]" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="text-7xl sm:text-8xl mb-6 select-none" role="img" aria-label={country.name}>
              {country.flag}
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-text mb-5">
              {country.name} Travel Guide
            </h1>
            <p className="text-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
              {country.description}
            </p>

            {/* Stat pills */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-elevated border border-border text-xs font-medium text-muted">
                <Clock size={12} className="text-accent flex-shrink-0" />
                Best time: <span className="text-primary-text font-semibold">{country.bestTime}</span>
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-elevated border border-border text-xs font-medium text-muted">
                <span className="text-accent text-sm">🛂</span>
                Visa for Indians: <span className="text-primary-text font-semibold">{country.visaForIndians}</span>
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-elevated border border-border text-xs font-medium text-muted">
                <MapPin size={12} className="text-accent flex-shrink-0" />
                Capital: <span className="text-primary-text font-semibold">{country.capital}</span>
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-elevated border border-border text-xs font-medium text-muted">
                <Globe size={12} className="text-accent flex-shrink-0" />
                <span className="text-primary-text font-semibold">{country.continent}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

          {/* ── City Grid ── */}
          <section>
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">
                {citiesData.length} {citiesData.length === 1 ? 'destination' : 'destinations'}
              </p>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary-text mb-2">
                Destinations in {country.name}
              </h2>
              <p className="text-muted text-sm">
                Free travel guides — things to do, where to stay, best time &amp; local tips
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {citiesData.map((city) => (
                <Link
                  key={city.slug}
                  href={`/cities/${city.slug}`}
                  className="group block bg-surface border border-border rounded-2xl p-5 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-primary-text group-hover:text-accent transition-colors leading-tight">
                        {city.name}
                      </h3>
                      <p className="text-xs text-muted mt-0.5">{city.flag} {city.country}</p>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-200 mt-1 flex-shrink-0"
                    />
                  </div>

                  <p className="text-xs text-muted/80 leading-relaxed mb-4 line-clamp-2">
                    {city.tagline}
                  </p>

                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted">
                      <Clock size={10} className="text-accent" />
                      {city.stats.bestTime}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted">
                      <Wallet size={10} className="text-accent" />
                      {city.stats.budget}
                    </span>
                    {city.thingsToDo?.length ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted">
                        <MapPin size={10} className="text-accent" />
                        {city.thingsToDo.length} things to do
                      </span>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {city.vibes.slice(0, 3).map((vibe) => (
                      <span
                        key={vibe}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-elevated border border-border text-muted"
                      >
                        {vibe}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Regions (India only) ── */}
          {country.regions && country.regions.length > 0 && (
            <section>
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Explore by region</p>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary-text mb-2">
                  Browse by Region
                </h2>
                <p className="text-muted text-sm">
                  {country.name}&apos;s regions each have their own character, climate, and cuisine
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {country.regions.map((region) => {
                  const regionCities = region.cities
                    .map((s) => getCityBySlug(s))
                    .filter((c): c is NonNullable<ReturnType<typeof getCityBySlug>> => c !== undefined);

                  return (
                    <div key={region.slug} className="bg-surface border border-border rounded-2xl p-5">
                      <Link
                        href={`/countries/${slug}/${region.slug}`}
                        className="font-heading text-base font-semibold text-primary-text hover:text-accent transition-colors block mb-4"
                      >
                        {region.name} →
                      </Link>
                      <div className="flex flex-wrap gap-2">
                        {regionCities.map((city) => (
                          <Link
                            key={city.slug}
                            href={`/cities/${city.slug}`}
                            className="text-xs px-3 py-1 rounded-full bg-elevated border border-border text-muted hover:text-accent hover:border-accent/40 transition-colors"
                          >
                            {city.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── Related Countries ── */}
          {relatedCountries.length > 0 && (
            <section className="pb-4">
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">keep exploring</p>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary-text">
                  More Destinations in {country.continent}
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedCountries.map((rc) => (
                  <Link
                    key={rc.slug}
                    href={`/countries/${rc.slug}`}
                    className="group block bg-surface border border-border rounded-xl p-5 hover:border-accent/40 hover:shadow-md hover:shadow-accent/5 transition-all duration-200 text-center"
                  >
                    <div className="text-4xl mb-3 select-none">{rc.flag}</div>
                    <div className="font-semibold text-sm text-primary-text group-hover:text-accent transition-colors">
                      {rc.name}
                    </div>
                    <div className="text-xs text-muted mt-1">
                      {rc.cities.length} {rc.cities.length === 1 ? 'city' : 'cities'}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
