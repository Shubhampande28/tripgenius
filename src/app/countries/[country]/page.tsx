import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SafeImage from '@/components/SafeImage';
import ItineraryTabs from '@/components/ItineraryTabs';
import type { ItineraryPlan } from '@/components/ItineraryTabs';
import { ChevronRight, Clock, Wallet, MapPin, ArrowRight, Globe, Calendar, BookOpen } from 'lucide-react';
import { countries, getCountryBySlug } from '@/data/countries';
import { getCityBySlug } from '@/lib/cities';
import { getCityImageUrl } from '@/lib/cityImages';
import { allPosts } from '@/lib/blog';

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
  const title = `${country.name} Travel Guide ${YEAR} — Top Cities, Itineraries & Tips | TripGenius`;
  const description =
    `Plan your ${country.name} trip: ${cityCount} destination guides, ${country.bestTime} is the best time to visit, visa info for Indians (${country.visaForIndians}), day-by-day itineraries, and honest local tips — all free.`;

  return {
    title,
    description,
    keywords: [
      `${country.name.toLowerCase()} travel guide`,
      `places to visit in ${country.name.toLowerCase()}`,
      `${country.name.toLowerCase()} itinerary`,
      `${country.name.toLowerCase()} trip plan`,
      `${country.name.toLowerCase()} travel tips`,
      `best time to visit ${country.name.toLowerCase()}`,
      `${country.name.toLowerCase()} visa for indians`,
      `${country.name.toLowerCase()} tourism`,
      `${country.name.toLowerCase()} travel ${YEAR}`,
    ],
    alternates: { canonical: `${BASE}/countries/${slug}` },
    openGraph: {
      title,
      description,
      url: `${BASE}/countries/${slug}`,
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

const SINGLE_CITY_THEMES = [
  'Arrival & First Impressions',
  'Deep Dive — Main Attractions',
  'Hidden Gems & Local Life',
  'Day Trip & Adventure',
  'Culture & Cuisine Immersion',
  'Relaxation & Shopping',
  'Last Morning & Departure',
];

// ── Helper: build itinerary plans from city list ──────────────────────────
function buildItineraries(
  citiesData: NonNullable<ReturnType<typeof getCityBySlug>>[],
  countryName: string,
): ItineraryPlan[] {
  const nonStub = citiesData.filter((c) => !c.stub);
  if (nonStub.length === 0) return [];

  const isSingleCity = nonStub.length === 1;
  const PLANS: [number, string, string][] = [
    [3, '3 Days', 'Perfect weekend getaway'],
    [5, '5 Days', 'Comfortable first visit'],
    [7, '7 Days', `Complete ${countryName} experience`],
  ];

  return PLANS.map(([duration, label, subtitle]) => ({
    duration,
    label,
    subtitle,
    days: Array.from({ length: duration }, (_, i) => {
      const city = nonStub[i] ?? nonStub[nonStub.length - 1];
      return {
        day: i + 1,
        citySlug: city.slug,
        cityName: city.name,
        cityFlag: city.flag,
        cityTagline: city.tagline,
        theme: isSingleCity ? (SINGLE_CITY_THEMES[i] ?? null) : null,
      };
    }),
  }));
}

// ── Main page ──────────────────────────────────────────────────────────────
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

  const countryCitySlugs  = new Set(country.cities);
  const countryCityNames  = new Set(citiesData.map((c) => c.name.toLowerCase()));

  const blogLinks = allPosts
    .filter((post) =>
      (post.citySlug && countryCitySlugs.has(post.citySlug)) ||
      post.tags.some(
        (tag) =>
          tag.toLowerCase() === country.name.toLowerCase() ||
          countryCityNames.has(tag.toLowerCase()),
      ),
    )
    .slice(0, 6);

  const itineraryPlans = buildItineraries(citiesData, country.name);

  // ── Structured data ──────────────────────────────────────────────────────
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',      item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Countries', item: `${BASE}/countries` },
      { '@type': 'ListItem', position: 3, name: `${country.name} Travel Guide`, item: `${BASE}/countries/${slug}` },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How many days do I need in ${country.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `We recommend at least 5–7 days in ${country.name} to cover the highlights. If you have more time, 10–14 days lets you explore regional destinations at a relaxed pace.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the best time to visit ${country.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The best time to visit ${country.name} is ${country.bestTime}. This period offers the most pleasant weather for sightseeing and outdoor activities.`,
        },
      },
      {
        '@type': 'Question',
        name: `Do Indian passport holders need a visa for ${country.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${country.visaForIndians}. Always check the latest entry requirements before booking your trip.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the currency in ${country.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The currency in ${country.name} is the ${country.currency}. It is advisable to carry some local currency for small purchases, markets, and taxis.`,
        },
      },
    ],
  };

  const destinationSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: `${country.name}`,
    description: country.description,
    url: `${BASE}/countries/${slug}`,
    touristType: ['Family', 'Adventure', 'Cultural', 'Luxury'],
    publisher: { '@type': 'Organization', name: 'TripGenius', url: BASE },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(destinationSchema) }} />
      <Navbar />
      <main className="min-h-screen bg-dark">

        {/* ── Breadcrumb ──────────────────────────────────────────────── */}
        <div className="border-b border-border bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-1.5 text-xs text-muted flex-wrap">
                <li><Link href="/" className="hover:text-primary-text transition-colors">Home</Link></li>
                <li aria-hidden><ChevronRight size={12} /></li>
                <li><Link href="/countries" className="hover:text-primary-text transition-colors">Countries</Link></li>
                <li aria-hidden><ChevronRight size={12} /></li>
                <li><span className="text-primary-text font-medium">{country.name}</span></li>
              </ol>
            </nav>
          </div>
        </div>

        {/* ── Hero ────────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-surface border-b border-border py-14 sm:py-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(var(--color-accent-rgb,220,38,38),0.08),transparent)]" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="text-7xl sm:text-8xl mb-5 select-none" role="img" aria-label={country.name}>
              {country.flag}
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-text mb-4">
              {country.name}
            </h1>
            <p className="text-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              {country.description}
            </p>

            {/* Quick stats bar */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { icon: <Calendar size={12} className="text-accent flex-shrink-0" />, label: 'Best time', value: country.bestTime },
                { icon: <span className="text-accent text-sm flex-shrink-0">🛂</span>, label: 'Visa', value: country.visaForIndians },
                { icon: <MapPin size={12} className="text-accent flex-shrink-0" />, label: 'Capital', value: country.capital },
                { icon: <Globe size={12} className="text-accent flex-shrink-0" />, label: 'Currency', value: country.currency },
              ].map((s) => (
                <span key={s.label}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-elevated border border-border text-xs font-medium text-muted">
                  {s.icon}
                  {s.label}: <span className="text-primary-text font-semibold ml-0.5">{s.value}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Body ────────────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">

          {/* ══ 1. TOP DESTINATIONS — image cards ═══════════════════════ */}
          <section>
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">
                {citiesData.length} {citiesData.length === 1 ? 'destination' : 'destinations'}
              </p>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary-text mb-2">
                Best Places to Visit in {country.name}
              </h2>
              <p className="text-muted text-sm">
                Curated city guides — things to do, best time to go, budgets &amp; honest local tips
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {citiesData.map((city) => {
                const imgId = getCityImageUrl(city.slug, 'card');
                const imgSrc = imgId
                  ? `https://images.unsplash.com/${imgId}?auto=format&fit=crop&w=800&q=75`
                  : null;

                return (
                  <Link
                    key={city.slug}
                    href={`/cities/${city.slug}`}
                    className="group relative block overflow-hidden rounded-2xl border border-border hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
                    style={{ aspectRatio: '4/3' }}
                  >
                    {/* Image layer */}
                    {imgSrc ? (
                      <SafeImage
                        src={imgSrc}
                        alt={`${city.name} travel guide — ${city.tagline}`}
                        city={city.slug}
                        accentColor={city.accentColor}
                        fill
                        sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      // Fallback gradient if no image
                      <div
                        className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                        style={{ background: `linear-gradient(135deg, ${city.accentColor ?? '#dc2626'}22, ${city.accentColor ?? '#dc2626'}55)` }}
                      />
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white/55 text-[10px] font-semibold uppercase tracking-wider mb-0.5">
                        {city.flag} {city.country}
                      </p>
                      <h3 className="font-heading text-xl font-bold text-white mb-1 leading-tight">
                        {city.name}
                      </h3>
                      <p className="text-white/65 text-xs leading-snug mb-3 line-clamp-1">
                        {city.tagline}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1.5">
                          {city.vibes.slice(0, 2).map((vibe) => (
                            <span key={vibe}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm text-white/80 border border-white/15">
                              {vibe}
                            </span>
                          ))}
                        </div>
                        <span className="flex items-center gap-1 text-xs font-semibold text-white/90 group-hover:gap-1.5 transition-all">
                          Explore <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>

                    {/* Best time chip — top right */}
                    <div className="absolute top-3 right-3">
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white/80">
                        <Clock className="w-2.5 h-2.5" /> {city.stats.bestTime}
                      </span>
                    </div>

                    {/* Things to do chip — top left (only if data available) */}
                    {city.thingsToDo && city.thingsToDo.length > 0 && (
                      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white/80">
                          {city.thingsToDo.length} things to do
                        </span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ══ 2. ITINERARIES ══════════════════════════════════════════ */}
          {itineraryPlans.length > 0 && (
            <section>
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">trip planning</p>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary-text mb-2">
                  {country.name} Itineraries
                </h2>
                <p className="text-muted text-sm">
                  Day-by-day suggested routes — choose how long you have and we&apos;ll show you the best path
                </p>
              </div>

              <ItineraryTabs plans={itineraryPlans} countryName={country.name} />
            </section>
          )}

          {/* ══ 3. TRAVEL STORIES & BLOG ════════════════════════════════ */}
          {blogLinks.length > 0 && (
            <section>
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">travel stories</p>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary-text mb-2">
                  Guides &amp; Stories from {country.name}
                </h2>
                <p className="text-muted text-sm">
                  Detailed planning guides, itineraries, and real trip reports
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {blogLinks.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col bg-surface border border-border hover:border-accent/40 rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10"
                  >
                    {/* Cover image */}
                    <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                      <Image
                        src={`https://images.unsplash.com/${post.coverPhoto}?auto=format&fit=crop&w=800&q=70`}
                        alt={post.title}
                        fill
                        sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag}
                            className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-semibold text-primary-text group-hover:text-accent transition-colors text-sm leading-snug mb-2 flex-1">
                        {post.title}
                      </h3>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                        <span className="text-[11px] text-muted flex items-center gap-1">
                          <BookOpen className="w-3 h-3" /> {post.readTime} min read
                        </span>
                        <span className="text-xs font-semibold text-accent flex items-center gap-1 group-hover:gap-1.5 transition-all">
                          Read <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline">
                  View all travel guides <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          )}

          {/* ══ 4. BROWSE BY REGION (India, etc.) ══════════════════════ */}
          {country.regions && country.regions.length > 0 && (
            <section>
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">explore by region</p>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary-text mb-2">
                  Browse by Region
                </h2>
                <p className="text-muted text-sm">
                  {country.name}&apos;s regions each have their own character, climate and cuisine
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {country.regions.map((region) => {
                  const regionCities = region.cities
                    .map((s) => getCityBySlug(s))
                    .filter((c): c is NonNullable<ReturnType<typeof getCityBySlug>> => c !== undefined);

                  return (
                    <div key={region.slug} className="bg-surface border border-border rounded-2xl p-5">
                      <h3 className="font-heading text-base font-semibold text-primary-text hover:text-accent transition-colors mb-4">
                        {region.name}
                      </h3>
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

          {/* ══ 5. WHEN TO VISIT ════════════════════════════════════════ */}
          <section>
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">seasonal guide</p>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary-text mb-2">
                Best Time to Visit {country.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Best time highlight card */}
              <div className="bg-teal/5 border border-teal/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-teal/15 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-teal" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-teal">Recommended window</p>
                    <p className="font-heading text-xl font-bold text-primary-text">{country.bestTime}</p>
                  </div>
                </div>
                <p className="text-sm text-muted leading-relaxed">
                  {country.bestTime} offers the most favourable weather conditions across {country.name}.
                  Expect pleasant temperatures, lower rainfall, and ideal conditions for outdoor sightseeing.
                </p>
              </div>

              {/* Best-time links per city */}
              {citiesData.filter((c) => !c.stub && c.monthByMonth).length > 0 && (
                <div className="bg-surface border border-border rounded-2xl p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Month-by-month guides</p>
                  <div className="flex flex-wrap gap-2">
                    {citiesData
                      .filter((c) => !c.stub && c.monthByMonth)
                      .slice(0, 12)
                      .map((city) => (
                        <Link
                          key={city.slug}
                          href={`/best-time-to-visit/${city.slug}`}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-elevated border border-border text-muted hover:text-accent hover:border-accent/40 transition-colors"
                        >
                          <span>{city.flag}</span> {city.name}
                        </Link>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ══ 6. FAQ ══════════════════════════════════════════════════ */}
          <section>
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">common questions</p>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary-text mb-2">
                {country.name} Travel FAQ
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  q: `How many days do I need in ${country.name}?`,
                  a: `We recommend at least 5–7 days to cover the highlights. If possible, 10–14 days lets you explore regional destinations at a relaxed pace without rushing between cities.`,
                },
                {
                  q: `What is the best time to visit ${country.name}?`,
                  a: `${country.bestTime} is generally the best window. You'll get the most pleasant weather, fewer disruptions, and ideal conditions for outdoor activities and sightseeing.`,
                },
                {
                  q: `Do Indians need a visa for ${country.name}?`,
                  a: `${country.visaForIndians}. Always verify the current entry requirements on the official embassy website before booking your flights.`,
                },
                {
                  q: `What currency is used in ${country.name}?`,
                  a: `${country.name} uses the ${country.currency}. We recommend carrying some local cash for markets, smaller restaurants, and taxis, as card acceptance can vary outside major cities.`,
                },
              ].map((faq) => (
                <div key={faq.q} className="bg-surface border border-border rounded-2xl p-5">
                  <h3 className="font-semibold text-primary-text text-sm mb-2">{faq.q}</h3>
                  <p className="text-xs text-muted leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ══ 7. RELATED COUNTRIES ════════════════════════════════════ */}
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
                    className="group block bg-surface border border-border rounded-2xl p-5 hover:border-accent/40 hover:shadow-md hover:shadow-accent/5 transition-all duration-200 text-center"
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
