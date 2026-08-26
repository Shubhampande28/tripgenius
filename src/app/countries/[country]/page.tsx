import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Schema from '@/components/Schema';
import Flag from '@/components/Flag';
import CountryCard from '@/components/country/CountryCard';
import CountryDestinationsGrid from '@/components/country/CountryDestinationsGrid';
import {
  ChevronRight, ArrowRight, MapPin, Globe, Calendar,
  BookOpen, Plane, ChevronDown, Clock,
} from 'lucide-react';
import { countries, getCountryBySlug, type CountryData } from '@/data/countries';
import { getCityBySlug } from '@/lib/cities';
import { getCityImageUrl } from '@/lib/cityImages';
import { allPosts, isIndexablePost } from '@/lib/blog';
import { ITINERARY_DURATIONS, ITINERARY_COMING_SOON, getItinerarySlug, buildItineraryDays, buildRouteOverview, type ItineraryDuration } from '@/lib/itineraries';

const BASE  = 'https://www.tripgenius.in';
const YEAR  = new Date().getFullYear();

const INDIA_FEATURED_DESTINATIONS = [
  'varanasi', 'kedarnath', 'badrinath', 'ayodhya',
  'rishikesh', 'haridwar', 'katra-vaishno-devi', 'amritsar',
  'delhi', 'agra', 'jaipur', 'goa',
];

// ── static helpers ──────────────────────────────────────────────────────────
const FLIGHT_FROM_INDIA: Record<string, string> = {
  india: 'Domestic', thailand: '~4 hrs', japan: '~7–8 hrs',
  indonesia: '~5–6 hrs', singapore: '~4–5 hrs', uae: '~3–4 hrs',
  vietnam: '~4–5 hrs', 'sri-lanka': '~2 hrs', nepal: '~1–2 hrs',
  georgia: '~5–6 hrs', morocco: '~9–10 hrs', france: '~8–9 hrs',
  italy: '~9–10 hrs', malaysia: '~4–5 hrs', maldives: '~3–4 hrs',
};

// Continent-based fallback so the "From India" stat never shows a bare "—"
// for the 34 countries FLIGHT_FROM_INDIA doesn't have an exact figure for.
const CONTINENT_FLIGHT_ESTIMATE: Record<string, string> = {
  Asia: '~4–8 hrs',
  Europe: '~8–10 hrs',
  Africa: '~9–11 hrs',
  Americas: '~16–20 hrs',
  Oceania: '~12–14 hrs',
};

function estimateFlightTime(country: CountryData): string {
  return CONTINENT_FLIGHT_ESTIMATE[country.continent] ?? '~6–12 hrs';
}

const MONTH_ABR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
type Rating = 'excellent' | 'good' | 'average' | 'avoid';

function ratingBar(r: Rating) {
  const h = r === 'excellent' ? 52 : r === 'good' ? 40 : r === 'average' ? 26 : 14;
  const bg = r === 'excellent' ? 'bg-emerald-500' : r === 'good' ? 'bg-teal-400' : r === 'average' ? 'bg-amber-400' : 'bg-muted/25';
  return { h, bg };
}

function visaInfo(visa: string) {
  const v = visa.toLowerCase();
  if (v.includes('no visa') || v.includes('visa free') || v.includes('visa exempt') || v.includes('not required'))
    return { badge: 'Visa Free',         pill: 'bg-emerald-500/12 text-emerald-400 border-emerald-500/25' };
  if (v.includes('e-visa') || v.includes('evisa'))
    return { badge: 'e-Visa',            pill: 'bg-blue-500/12 text-blue-400 border-blue-500/25' };
  if (v.includes('on arrival'))
    return { badge: 'Visa on Arrival',   pill: 'bg-amber-500/12 text-amber-400 border-amber-500/25' };
  return   { badge: 'Visa Required',     pill: 'bg-rose-500/12 text-rose-400 border-rose-500/25' };
}

// ── metadata ────────────────────────────────────────────────────────────────
type Props = { params: Promise<{ country: string }> };

export async function generateStaticParams() {
  return countries.map((c) => ({ country: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country: slug } = await params;
  const country = getCountryBySlug(slug);
  if (!country) return { title: 'Not Found' };
  // No "| TripGenius" here — the root layout's title template appends it.
  const title = `${country.name} Travel Guide ${YEAR} — Cities, Itineraries & Tips`;
  const description = `Plan your ${country.name} trip: city guides, visa info for Indians (${country.visaForIndians}), best time ${country.bestTime}, day-by-day itineraries and honest local tips — all free.`;
  return {
    title, description,
    alternates: { canonical: `${BASE}/countries/${slug}` },
    openGraph: { title, description, url: `${BASE}/countries/${slug}`, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

// ── page ────────────────────────────────────────────────────────────────────
export default async function CountryPage({ params }: Props) {
  const { country: slug } = await params;
  const country = getCountryBySlug(slug);
  if (!country) notFound();

  const citiesData = country.cities
    .map((s) => getCityBySlug(s))
    .filter((c): c is NonNullable<ReturnType<typeof getCityBySlug>> => c !== undefined);

  const featuredPriority = slug === 'india' ? INDIA_FEATURED_DESTINATIONS : [];
  const priorityIndex = new Map(featuredPriority.map((citySlug, index) => [citySlug, index]));
  const rankedCities = featuredPriority.length > 0
    ? [...citiesData].sort((a, b) =>
        (priorityIndex.get(a.slug) ?? Number.MAX_SAFE_INTEGER) -
        (priorityIndex.get(b.slug) ?? Number.MAX_SAFE_INTEGER))
    : citiesData;
  // The Destinations section (CountryDestinationsGrid) now handles grouping
  // by region (India) and capping/expanding flat lists — displayCities is
  // still used for the ItemList schema, which should list every city.
  const displayCities = rankedCities;

  // Trip planner — ready-made 3/5/7 day itineraries for this country. Skips
  // any duration in ITINERARY_COMING_SOON — those pages are noindexed
  // maintenance stubs (not enough real content to fill the advertised
  // duration honestly), so they must not be surfaced here as if they were
  // normal, complete itineraries.
  type ItineraryOption = { duration: ItineraryDuration; route: ReturnType<typeof buildRouteOverview> };
  const itineraryOptions = ITINERARY_DURATIONS
    .map((duration): ItineraryOption | null => {
      if (ITINERARY_COMING_SOON[getItinerarySlug(slug, duration)]) return null;
      const days = buildItineraryDays(slug, duration);
      return days.length > 0 ? { duration, route: buildRouteOverview(days) } : null;
    })
    .filter((o): o is ItineraryOption => o !== null);

  const relatedCountries = countries
    .filter((c) => c.continent === country.continent && c.slug !== slug)
    .slice(0, 4);

  const countryCitySlugs = new Set(country.cities);
  const countryCityNames = new Set(citiesData.map((c) => c.name.toLowerCase()));
  const blogLinks = allPosts
    .filter((p) =>
      isIndexablePost(p) && (
        (p.citySlug && countryCitySlugs.has(p.citySlug)) ||
        p.tags.some((t) => t.toLowerCase() === country.name.toLowerCase() || countryCityNames.has(t.toLowerCase()))
      ),
    )
    .slice(0, 6);

  // Experiences — pull top thingsToDo from all cities
  const allExperiences = citiesData
    .flatMap((c) => (c.thingsToDo ?? []).slice(0, 3).map((t) => ({ ...t, cityName: c.name, citySlug: c.slug })))
    .slice(0, 6);

  // Budget — flagship/priority city (rankedCities order) that has it
  const budgetCity  = rankedCities.find((c) => c.budgetBreakdown);
  const budgetTiers = budgetCity?.budgetBreakdown?.tiers ?? null;

  // Monthly calendar — flagship/priority city with full 12-month data
  const monthCity = rankedCities.find((c) => !c.monthByMonthSynthetic && c.monthByMonth?.months?.length === 12);
  const monthData = monthCity?.monthByMonth?.months ?? null;

  // Hero image — flagship/priority city's hero photo
  const heroBg = rankedCities[0] ? getCityImageUrl(rankedCities[0].slug, 'hero') : null;

  const visa = visaInfo(country.visaForIndians);
  const flightHrs = FLIGHT_FROM_INDIA[slug] ?? estimateFlightTime(country);

  // ── structured data ────────────────────────────────────────────────────────
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',      item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Countries', item: `${BASE}/countries` },
      { '@type': 'ListItem', position: 3, name: `${country.name} Travel Guide`, item: `${BASE}/countries/${slug}` },
    ],
  };
  // ItemList of top cities — matches the visible "Best Places to Visit" grid.
  // (One ItemList per page: this replaced the old itinerary ItemList so the
  // page never emits duplicate schema types.)
  const citiesListSchema = displayCities.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best Places to Visit in ${country.name}`,
    numberOfItems: displayCities.length,
    itemListElement: displayCities.map((city, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: city.name,
      url: `${BASE}/cities/${city.slug}`,
    })),
  } : null;

  const faqs = [
    { q: `How many days do I need in ${country.name}?`,
      a: `5–7 days is ideal to cover the main highlights without rushing. If you have 10–14 days, you can explore regional destinations at a relaxed pace and go deeper into local culture.` },
    { q: `What is the best time to visit ${country.name}?`,
      a: `${country.bestTime} is the recommended window — expect the most favourable weather, lower chances of disruption, and ideal conditions for outdoor sightseeing and activities.` },
    { q: `Do Indian passport holders need a visa for ${country.name}?`,
      a: `${country.visaForIndians}. Always verify current entry requirements on the official embassy or government website before booking flights.` },
    { q: `What currency is used in ${country.name}?`,
      a: `${country.name} uses the ${country.currency}. Carry some local cash for markets, street food, and smaller vendors — card acceptance varies outside major cities.` },
    { q: `Is ${country.name} safe for Indian tourists?`,
      a: `${country.name} is generally well-regarded for safety among international travellers. Exercise standard travel precautions, stay aware of your surroundings in tourist areas, and keep digital copies of important documents.` },
    { q: `What language is spoken in ${country.name}?`,
      a: `The primary language is ${country.language}. In major tourist areas and hotels, English is widely understood. Learning a few local phrases is always appreciated by locals.` },
  ];

  // FAQPage schema mirrors the visible FAQ accordion exactly — Google requires
  // FAQ markup to match on-page content.
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <>
      <Schema data={breadcrumbSchema} />
      <Schema data={faqSchema} />
      <Schema data={citiesListSchema} />
      <Navbar />
      <main className="min-h-screen bg-dark">

        {/* ══ HERO ═══════════════════════════════════════════════════════════ */}
        <div className="relative flex flex-col" style={{ minHeight: '72vh' }}>
          {/* Background */}
          {heroBg ? (
            <Image
              src={heroBg}
              alt={`${country.name} travel guide`}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-elevated to-dark" />
          )}
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/85" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

          {/* Breadcrumb */}
          <div className="relative z-10 pt-[132px] px-4 sm:px-8 max-w-7xl mx-auto w-full">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-1.5 text-xs text-white/50 flex-wrap">
                <li><Link href="/" className="hover:text-white/90 transition-colors">Home</Link></li>
                <li aria-hidden><ChevronRight size={11} /></li>
                <li><Link href="/countries" className="hover:text-white/90 transition-colors">Countries</Link></li>
                <li aria-hidden><ChevronRight size={11} /></li>
                <li className="text-white/80 font-medium">{country.name}</li>
              </ol>
            </nav>
          </div>

          {/* Hero content */}
          <div className="relative z-10 mt-auto pb-14 px-4 sm:px-8 max-w-7xl mx-auto w-full">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/50 mb-3">
              {country.continent} · {citiesData.length} {citiesData.length === 1 ? 'destination' : 'destinations'}
            </p>
            <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-bold text-white mb-4 leading-none tracking-tight flex items-center gap-4">
              <Flag emoji={country.flag} className="rounded-lg" />
              {country.name}
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-2xl leading-relaxed mb-8">
              {country.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#destinations" className="btn btn-primary">
                Explore Cities <ArrowRight size={14} />
              </a>
              {itineraryOptions.length > 0 && (
                <a href="#trip-planner"
                  className="btn bg-white/10 backdrop-blur-sm text-white hover:bg-white/18 border border-white/20">
                  Plan a Trip
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ══ AT A GLANCE BAR ════════════════════════════════════════════════ */}
        <div className="bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="flex overflow-x-auto divide-x divide-border scrollbar-hide marquee-mask">
              {([
                { icon: <Plane size={13} className="text-accent" />,     label: 'From India',  value: flightHrs },
                { icon: <span className="text-sm leading-none">🛂</span>, label: 'Visa',        value: visa.badge,            extra: visa.pill },
                { icon: <Globe size={13} className="text-accent" />,      label: 'Language',    value: country.language },
                { icon: <span className="text-sm leading-none">💰</span>, label: 'Currency',    value: country.currency },
                { icon: <MapPin size={13} className="text-accent" />,     label: 'Capital',     value: country.capital },
                { icon: <Calendar size={13} className="text-accent" />,   label: 'Best Time',   value: country.bestTime },
              ] as { icon: React.ReactNode; label: string; value: string; extra?: string }[]).map((s) => (
                <div key={s.label} className="flex items-center gap-3 px-4 sm:px-5 py-4 flex-shrink-0">
                  <span className="flex-shrink-0">{s.icon}</span>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-muted leading-none mb-1">
                      {s.label}
                    </p>
                    {s.extra ? (
                      <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full border ${s.extra}`}>
                        {s.value}
                      </span>
                    ) : (
                      <p className="text-xs font-semibold text-primary-text whitespace-nowrap">{s.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ BODY ═══════════════════════════════════════════════════════════ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-20">

          {/* ── VISA GUIDE ───────────────────────────────────────────────── */}
          <section>
            <SectionHeader
              label="visa & entry"
              heading="Entry Requirements for Indians"
              sub="What Indian passport holders need to know before booking"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Visa status card */}
              <div className="glass-card glass-hover rounded-2xl p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-elevated flex items-center justify-center flex-shrink-0 text-2xl">
                  🛂
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted mb-1">Visa status</p>
                  <span className={`inline-block text-sm font-bold px-3 py-1 rounded-full border mb-3 ${visa.pill}`}>
                    {visa.badge}
                  </span>
                  <p className="text-sm text-muted leading-relaxed">{country.visaForIndians}</p>
                  <Link
                    href="/blog/visa-free-countries-indian-passport-2026"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                  >
                    Full list: visa-free countries for Indian passports →
                  </Link>
                </div>
              </div>
              {/* Practical tips card */}
              <div className="glass-card glass-hover rounded-2xl p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3">Practical tips</p>
                <ul className="space-y-2.5">
                  {[
                    'Always carry a digital copy of your passport and visa',
                    'Check the official embassy website for the latest requirements before booking',
                    'Book return flights before applying for visa',
                    'Keep proof of sufficient funds (bank statements)',
                  ].map((tip) => (
                    <li key={tip} className="flex gap-2.5 text-xs text-muted leading-relaxed">
                      <span className="text-accent mt-0.5 flex-shrink-0">›</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ── TOP EXPERIENCES ──────────────────────────────────────────── */}
          {allExperiences.length >= 3 && (
            <section>
              <SectionHeader
                label="top experiences"
                heading={`What to Do in ${country.name}`}
                sub="Iconic activities and unmissable experiences across all destinations"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allExperiences.map((exp) => (
                  <Link
                    key={`${exp.citySlug}-${exp.name}`}
                    href={`/cities/${exp.citySlug}`}
                    className="group flex flex-col bg-surface border border-border rounded-2xl p-5 hover:border-accent/35 card-lift transition-all duration-200 hover:shadow-lg hover:shadow-black/10"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="text-3xl leading-none">{exp.icon}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-elevated border border-border text-muted flex-shrink-0">
                        {exp.cityName}
                      </span>
                    </div>
                    <h3 className="font-heading text-base font-bold text-primary-text group-hover:text-accent transition-colors mb-1.5 leading-snug">
                      {exp.name}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed line-clamp-3 mb-auto">
                      {exp.description}
                    </p>
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                      <Clock className="w-3 h-3 text-accent flex-shrink-0" />
                      <span className="text-[11px] text-muted">{exp.duration}</span>
                      <span className="ml-auto text-[10px] font-semibold text-accent/70 px-2 py-0.5 rounded-full bg-accent/8 border border-accent/15">
                        {exp.category}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── DESTINATIONS ─────────────────────────────────────────────── */}
          <section id="destinations">
            <CountryDestinationsGrid country={country} cities={rankedCities} countrySlug={slug} />
          </section>

          {/* ── TRIP PLANNER ─────────────────────────────────────────────── */}
          {itineraryOptions.length > 0 && (
            <section id="trip-planner">
              <SectionHeader
                label="trip planner"
                heading={`How Many Days Do You Need in ${country.name}?`}
                sub="Pick a trip length and get a ready-made day-by-day route — where to go, what to see, and how it all connects"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {itineraryOptions.map(({ duration, route }) => (
                  <Link
                    key={duration}
                    href={`/itinerary/${getItinerarySlug(country.slug, duration)}`}
                    className="group relative flex flex-col bg-surface border border-border hover:border-accent/40 rounded-2xl p-6 overflow-hidden card-lift"
                  >
                    <span className="absolute -right-3 -top-5 font-heading text-8xl font-bold text-accent/8 group-hover:text-accent/15 transition-colors leading-none select-none">
                      {duration}
                    </span>
                    <span className="relative inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 w-fit mb-4">
                      <Calendar className="w-3 h-3" /> {duration}-Day Trip
                    </span>
                    <h3 className="relative font-heading text-2xl font-bold text-primary-text group-hover:text-accent transition-colors mb-2 leading-snug">
                      {duration} Days in {country.name}
                    </h3>
                    <p className="relative text-sm text-muted leading-relaxed mb-6">
                      {route.map((r) => r.city.name).join(' → ')}
                    </p>
                    <div className="relative mt-auto flex items-center gap-1.5 text-sm font-semibold text-accent group-hover:gap-2.5 transition-all">
                      See the full itinerary <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── TRAVEL GUIDES ────────────────────────────────────────────── */}
          <section id="guides">
              <div className="flex items-end justify-between mb-8">
                <SectionHeader
                  label="travel guides"
                  heading={`${country.name} Travel Guides`}
                  sub="In-depth city guides, budget breakdowns, and first-hand tips for your trip"
                  noMargin
                />
                <Link href="/blog"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline flex-shrink-0 ml-4">
                  All guides <ArrowRight size={12} />
                </Link>
              </div>

              {blogLinks.length > 0 ? (
                <div className="space-y-4">
                  {blogLinks.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex bg-surface border border-border hover:border-accent/40 rounded-2xl overflow-hidden card-lift"
                  >
                    {/* Image */}
                    <div className="relative w-36 sm:w-56 lg:w-64 flex-shrink-0 overflow-hidden" style={{ minHeight: '148px' }}>
                      <Image
                        src={`https://images.unsplash.com/${post.coverPhoto}?auto=format&fit=crop&w=600&q=75`}
                        alt={post.title}
                        fill
                        sizes="(max-width:640px) 144px, (max-width:1024px) 224px, 256px"
                        className="object-cover card-img"
                      />
                    </div>
                    {/* Content */}
                    <div className="flex flex-col flex-1 p-4 sm:p-6 min-w-0">
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag}
                            className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-heading text-base sm:text-lg font-bold text-primary-text group-hover:text-accent transition-colors leading-snug mb-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-auto hidden sm:block">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 border-t border-border">
                        <span className="text-[11px] text-muted flex items-center gap-1.5">
                          <BookOpen className="w-3 h-3" /> {post.readTime} min read
                        </span>
                        <span className="text-xs font-semibold text-accent flex items-center gap-1 group-hover:gap-1.5 transition-all">
                          Read guide <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Link
                    href={`/cities/${displayCities[0].slug}`}
                    className="group rounded-2xl border border-border bg-surface p-5 hover:border-accent/40 card-lift"
                  >
                    <MapPin size={18} className="text-accent mb-4" />
                    <h3 className="font-heading text-base font-bold text-primary-text group-hover:text-accent">
                      {displayCities[0].name} City Guide
                    </h3>
                    <p className="text-xs text-muted leading-relaxed mt-2">
                      Start with the essential destination guide for {country.name}.
                    </p>
                  </Link>
                  <Link
                    href={`/best-time-to-visit/${displayCities[0].slug}`}
                    className="group rounded-2xl border border-border bg-surface p-5 hover:border-accent/40 card-lift"
                  >
                    <Calendar size={18} className="text-accent mb-4" />
                    <h3 className="font-heading text-base font-bold text-primary-text group-hover:text-accent">
                      When to Visit
                    </h3>
                    <p className="text-xs text-muted leading-relaxed mt-2">
                      Compare seasons and plan around {country.bestTime}.
                    </p>
                  </Link>
                  <Link
                    href={`/itinerary/${getItinerarySlug(country.slug, itineraryOptions[1]?.duration ?? itineraryOptions[0].duration)}`}
                    className="group rounded-2xl border border-border bg-surface p-5 hover:border-accent/40 card-lift"
                  >
                    <BookOpen size={18} className="text-accent mb-4" />
                    <h3 className="font-heading text-base font-bold text-primary-text group-hover:text-accent">
                      Ready-Made Itinerary
                    </h3>
                    <p className="text-xs text-muted leading-relaxed mt-2">
                      Follow a practical day-by-day route through {country.name}.
                    </p>
                  </Link>
                </div>
              )}
            </section>

          {/* ── BUDGET BREAKDOWN ─────────────────────────────────────────── */}
          {budgetTiers && budgetTiers.length > 0 && (
            <section>
              <SectionHeader
                label="budget guide"
                heading={`How Much Does ${country.name} Cost?`}
                sub="Daily budget estimates — accommodation, food, transport, and activities"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {budgetTiers.map((tier, i) => (
                  <div key={tier.label}
                    className={i === 1
                      ? 'glass-card glass-hover rounded-2xl p-6'
                      : 'rounded-2xl p-6 border bg-surface border-border'}>
                    <div className="flex items-center gap-2.5 mb-4">
                      <span className="text-2xl">{tier.icon}</span>
                      <div>
                        <p className="font-heading text-base font-bold text-primary-text">{tier.label}</p>
                        <p className={`text-lg font-bold ${i === 1 ? 'text-accent' : 'text-primary-text'}`}>
                          {tier.perDay}<span className="text-xs font-normal text-muted">/day</span>
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2.5 text-xs mb-4">
                      {([
                        ['🛏️ Hotel',      tier.accommodation],
                        ['🍜 Food',        tier.food],
                        ['🚌 Transport',   tier.transport],
                        ['🎟️ Activities',  tier.activities],
                      ] as [string, string][]).map(([label, val]) => (
                        <div key={label}>
                          <p className="text-[10px] font-bold text-muted uppercase tracking-wide mb-0.5">{label}</p>
                          <p className="text-primary-text leading-snug">{val}</p>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border pt-3">
                      <p className="text-[11px] text-muted leading-relaxed italic">{tier.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
              {budgetCity?.budgetBreakdown?.disclaimer && (
                <p className="text-xs text-muted mt-3 text-center">{budgetCity.budgetBreakdown.disclaimer}</p>
              )}
            </section>
          )}

          {/* ── WHEN TO GO ───────────────────────────────────────────────── */}
          <section>
            <SectionHeader
              label="seasonal guide"
              heading={`Best Time to Visit ${country.name}`}
              sub="Month-by-month weather, crowd levels, and highlights"
            />
            {monthData ? (
              <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
                {/* Month bars */}
                <div className="flex items-end gap-1.5 sm:gap-2 mb-3" style={{ height: '72px' }}>
                  {monthData.map((m, i) => {
                    const { h, bg } = ratingBar(m.rating as Rating);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-0 group/month relative">
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/month:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap bg-dark border border-border rounded-lg px-3 py-2 text-[10px] text-primary-text shadow-xl">
                          <p className="font-bold mb-0.5">{m.month}</p>
                          <p className="text-muted">{m.temp} · {m.weather.slice(0, 28)}</p>
                        </div>
                        <div
                          className={`w-full rounded-t-md transition-all duration-150 group-hover/month:brightness-110 cursor-default ${bg}`}
                          style={{ height: `${h}px` }}
                        />
                      </div>
                    );
                  })}
                </div>
                {/* Month labels */}
                <div className="flex gap-1.5 sm:gap-2 mb-5">
                  {MONTH_ABR.map((m) => (
                    <div key={m} className="flex-1 text-center text-[9px] sm:text-[10px] font-medium text-muted">
                      {m}
                    </div>
                  ))}
                </div>
                {/* Legend */}
                <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
                  {([
                    ['bg-emerald-500', 'Peak season'],
                    ['bg-teal-400',    'Shoulder season'],
                    ['bg-amber-400',   'Average'],
                    ['bg-muted/25',    'Off-season'],
                  ] as [string, string][]).map(([color, label]) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <div className={`w-3 h-3 rounded-sm flex-shrink-0 ${color}`} />
                      <span className="text-xs text-muted">{label}</span>
                    </div>
                  ))}
                </div>
                {/* Best months highlight */}
                {monthCity?.monthByMonth?.bestMonths && (
                  <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2">
                    <span className="text-xs font-bold text-emerald-400 mr-1">Best months:</span>
                    {monthCity.monthByMonth.bestMonths.map((m) => (
                      <span key={m} className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {m}
                      </span>
                    ))}
                  </div>
                )}
                {monthCity?.monthByMonth?.summary && (
                  <p className="text-sm text-muted leading-relaxed mt-4 pt-4 border-t border-border">
                    {monthCity.monthByMonth.summary}
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-emerald-500/6 border border-emerald-500/18 rounded-2xl p-7 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/12 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <p className="font-heading text-xl font-bold text-primary-text mb-1">{country.bestTime}</p>
                  <p className="text-sm text-muted leading-relaxed max-w-xl">
                    This window offers the most pleasant temperatures, lower rainfall, and the best conditions for outdoor sightseeing and exploration across {country.name}.
                  </p>
                </div>
              </div>
            )}
          </section>


          {/* ── FAQ ──────────────────────────────────────────────────────── */}
          <section id="faq">
            <SectionHeader
              label="common questions"
              heading={`${country.name} Travel FAQ`}
              sub="Answers to what Indian travellers ask most"
            />
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <details key={i}
                  className="group border border-border rounded-2xl bg-surface overflow-hidden hover:border-accent/25 transition-colors">
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none text-primary-text font-medium text-sm hover:text-accent transition-colors select-none">
                    <span>{faq.q}</span>
                    <ChevronDown size={16} className="flex-shrink-0 text-muted transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <div className="px-5 pb-4 border-t border-border pt-3">
                    <p className="text-sm text-muted leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* ── RELATED COUNTRIES ────────────────────────────────────────── */}
          {relatedCountries.length > 0 && (
            <section className="pb-4">
              <SectionHeader
                label="keep exploring"
                heading={`More Destinations in ${country.continent}`}
              />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedCountries.map((rc) => (
                  <CountryCard key={rc.slug} country={rc} variant="compact" />
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

// ── Section header component (local) ────────────────────────────────────────
function SectionHeader({
  label, heading, sub, noMargin,
}: {
  label: string; heading: string; sub?: string; noMargin?: boolean;
}) {
  return (
    <div className={noMargin ? '' : 'mb-8'}>
      <p
        className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent mb-2"
        dangerouslySetInnerHTML={{ __html: label }}
      />
      <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary-text leading-tight">
        {heading}
      </h2>
      {sub && <p className="text-sm text-muted mt-1.5">{sub}</p>}
    </div>
  );
}
