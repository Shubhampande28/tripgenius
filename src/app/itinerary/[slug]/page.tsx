import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChevronRight, ArrowRight, Clock, Wallet, Globe, MapPin, Calendar } from 'lucide-react';
import { getCountryBySlug } from '@/data/countries';
import {
  getAllItinerarySlugs,
  parseItinerarySlug,
  buildItineraryDays,
  buildRouteOverview,
  getItinerarySlug,
  ITINERARY_DURATIONS,
} from '@/lib/itineraries';
import { getCityImageUrl } from '@/lib/cityImages';
import { allPosts } from '@/lib/blog';

const BASE = 'https://www.tripgenius.in';
const YEAR = new Date().getFullYear();

export function generateStaticParams() {
  return getAllItinerarySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseItinerarySlug(slug);
  if (!parsed) return { title: 'Not Found' };

  const country = getCountryBySlug(parsed.countrySlug);
  if (!country) return { title: 'Not Found' };

  const title = `${parsed.duration} Days in ${country.name} — The Perfect Itinerary (${YEAR})`;
  const desc = `Planning a ${parsed.duration}-day trip to ${country.name}? Our day-by-day itinerary covers the best cities, top things to do, budget tips, and visa info for Indian travellers.`;

  return {
    title,
    description: desc,
    keywords: [
      `${country.name.toLowerCase()} itinerary ${parsed.duration} days`,
      `${parsed.duration} days in ${country.name.toLowerCase()}`,
      `${country.name.toLowerCase()} ${parsed.duration} day trip`,
      `${country.name.toLowerCase()} travel itinerary`,
      `${country.name.toLowerCase()} trip plan`,
      `${country.name.toLowerCase()} travel guide indians`,
    ],
    alternates: { canonical: `${BASE}/itinerary/${slug}` },
    openGraph: {
      title,
      description: desc,
      url: `${BASE}/itinerary/${slug}`,
      type: 'article',
    },
  };
}

export default async function ItineraryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const parsed = parseItinerarySlug(slug);
  if (!parsed) notFound();

  const country = getCountryBySlug(parsed.countrySlug);
  if (!country) notFound();

  const days = buildItineraryDays(parsed.countrySlug, parsed.duration);
  if (days.length === 0) notFound();

  const route = buildRouteOverview(days);

  const countryCitySlugs = new Set(country.cities);
  const relatedPosts = allPosts
    .filter((p) =>
      (p.citySlug && countryCitySlugs.has(p.citySlug)) ||
      p.tags.some((t) => t.toLowerCase() === country.name.toLowerCase()),
    )
    .slice(0, 3);

  const otherDurations = ITINERARY_DURATIONS.filter((d) => d !== parsed.duration);

  // JSON-LD
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',      item: BASE },
      { '@type': 'ListItem', position: 2, name: country.name, item: `${BASE}/countries/${country.slug}` },
      { '@type': 'ListItem', position: 3, name: `${parsed.duration}-Day Itinerary`, item: `${BASE}/itinerary/${slug}` },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${parsed.duration} Days in ${country.name} — The Perfect Itinerary`,
    description: `Day-by-day ${parsed.duration}-day itinerary for ${country.name}`,
    url: `${BASE}/itinerary/${slug}`,
    publisher: { '@type': 'Organization', name: 'TripGenius', url: BASE },
  };

  const touristTripSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: `${parsed.duration} Days in ${country.name}`,
    description: `Day-by-day ${parsed.duration}-day itinerary for ${country.name} covering ${route.map((r) => r.city.name).join(', ')}, designed for Indian travellers.`,
    url: `${BASE}/itinerary/${slug}`,
    touristType: 'Indian travellers',
    itinerary: {
      '@type': 'ItemList',
      itemListElement: days.map((d) => ({
        '@type': 'ListItem',
        position: d.day,
        item: {
          '@type': 'TouristAttraction',
          name: d.theme ?? d.city.name,
          description: d.city.tagline,
          url: `${BASE}/cities/${d.city.slug}`,
        },
      })),
    },
    provider: { '@type': 'Organization', name: 'TripGenius', url: BASE },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(touristTripSchema) }} />
      <Navbar />
      <main className="min-h-screen bg-dark">

        {/* ── Breadcrumb ──────────────────────────────────────────── */}
        <div className="border-b border-border bg-surface">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
            <nav>
              <ol className="flex items-center gap-1.5 text-xs text-muted flex-wrap">
                <li><Link href="/" className="hover:text-primary-text transition-colors">Home</Link></li>
                <li aria-hidden><ChevronRight size={12} /></li>
                <li><Link href="/countries" className="hover:text-primary-text transition-colors">Countries</Link></li>
                <li aria-hidden><ChevronRight size={12} /></li>
                <li><Link href={`/countries/${country.slug}`} className="hover:text-primary-text transition-colors">{country.name}</Link></li>
                <li aria-hidden><ChevronRight size={12} /></li>
                <li><span className="text-primary-text font-medium">{parsed.duration}-Day Itinerary</span></li>
              </ol>
            </nav>
          </div>
        </div>

        {/* ── Hero ────────────────────────────────────────────────── */}
        <div className="bg-surface border-b border-border py-12 sm:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-5xl mb-4 select-none">{country.flag}</div>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-text mb-3">
              {parsed.duration} Days in {country.name}
            </h1>
            <p className="text-muted text-base sm:text-lg max-w-2xl mb-8 leading-relaxed">
              A day-by-day itinerary covering the best of {country.name} — designed for Indian travellers with honest costs, visa tips, and the right cities in the right order.
            </p>

            {/* Quick stat bar */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: <Calendar size={13} className="text-accent" />, label: `${parsed.duration} days` },
                { icon: <Clock size={13} className="text-accent" />,    label: country.bestTime },
                { icon: <Globe size={13} className="text-accent" />,    label: country.visaForIndians },
                { icon: <Wallet size={13} className="text-accent" />,   label: country.currency },
              ].map((s) => (
                <span key={s.label}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-elevated border border-border text-xs font-medium text-muted">
                  {s.icon} <span className="text-primary-text">{s.label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-14">

          {/* ── Route Overview ──────────────────────────────────────── */}
          <section>
            <h2 className="font-heading text-xl font-semibold text-primary-text mb-5">
              Your Route at a Glance
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {route.map((stop, i) => (
                <div key={stop.city.slug} className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-4 py-2.5">
                    <span className="text-xl">{stop.city.flag}</span>
                    <div>
                      <p className="text-sm font-semibold text-primary-text leading-tight">{stop.city.name}</p>
                      <p className="text-[10px] text-muted">
                        {stop.startDay === stop.endDay
                          ? `Day ${stop.startDay}`
                          : `Days ${stop.startDay}–${stop.endDay}`}
                      </p>
                    </div>
                  </div>
                  {i < route.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-muted flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── Day-by-Day ──────────────────────────────────────────── */}
          <section>
            <h2 className="font-heading text-xl font-semibold text-primary-text mb-6">
              Day-by-Day Itinerary
            </h2>

            <div className="space-y-6">
              {days.map((d) => {
                const imgSrc = getCityImageUrl(d.city.slug, 'card');
                const activities = d.city.thingsToDo?.slice(
                  d.activityIndex * 3,
                  d.activityIndex * 3 + 3,
                ) ?? [];

                return (
                  <div key={d.day}
                    className="bg-surface border border-border rounded-2xl overflow-hidden flex flex-col sm:flex-row">

                    {/* Day number sidebar */}
                    <div className="bg-accent/10 border-b sm:border-b-0 sm:border-r border-accent/20 flex sm:flex-col items-center justify-center gap-3 sm:gap-1 px-5 py-4 sm:py-6 sm:w-20 flex-shrink-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Day</p>
                      <p className="font-heading text-2xl sm:text-3xl font-bold text-accent leading-none">{d.day}</p>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col sm:flex-row min-w-0">
                      {/* City image */}
                      <div className="relative sm:w-48 sm:flex-shrink-0 flex-shrink-0 overflow-hidden"
                        style={{ aspectRatio: '16/9' }}>
                        {imgSrc ? (
                          <Image
                            src={imgSrc}
                            alt={`${d.city.name} — Day ${d.day}`}
                            fill
                            sizes="(max-width:640px) 100vw, 192px"
                            className="object-cover"
                          />
                        ) : (
                          <div
                            className="absolute inset-0"
                            style={{ background: `linear-gradient(135deg, ${d.city.accentColor ?? '#dc2626'}33, ${d.city.accentColor ?? '#dc2626'}88)` }}
                          />
                        )}
                      </div>

                      {/* Text */}
                      <div className="flex-1 p-5 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-lg">{d.city.flag}</span>
                              <h3 className="font-heading text-lg font-bold text-primary-text">
                                {d.theme ?? d.city.name}
                              </h3>
                            </div>
                            {d.theme && (
                              <p className="text-xs text-muted ml-7">{d.city.name}</p>
                            )}
                          </div>
                          <Link href={`/cities/${d.city.slug}`}
                            className="flex-shrink-0 text-xs font-semibold text-accent hover:underline flex items-center gap-1">
                            Full guide <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>

                        <p className="text-sm text-muted leading-relaxed mb-4">{d.city.tagline}</p>

                        {activities.length > 0 && (
                          <div className="space-y-1.5">
                            {activities.map((act) => (
                              <div key={act.name} className="flex items-start gap-2 text-xs">
                                <span className="text-accent mt-0.5 flex-shrink-0">✓</span>
                                <span className="text-muted">
                                  <span className="font-medium text-primary-text">{act.name}</span>
                                  {act.description && ` — ${act.description.slice(0, 80)}${act.description.length > 80 ? '…' : ''}`}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-3 mt-4 pt-3 border-t border-border text-xs text-muted">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-accent" /> {d.city.stats.bestTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Wallet className="w-3 h-3 text-accent" /> {d.city.stats.budget}/day
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Other Durations ─────────────────────────────────────── */}
          <section>
            <h2 className="font-heading text-xl font-semibold text-primary-text mb-5">
              More {country.name} Itineraries
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otherDurations.map((dur) => (
                <Link key={dur}
                  href={`/itinerary/${getItinerarySlug(country.slug, dur)}`}
                  className="group flex items-center justify-between gap-4 bg-surface border border-border hover:border-accent/40 rounded-2xl p-5 transition-all hover:-translate-y-px hover:shadow-md">
                  <div>
                    <p className="font-semibold text-primary-text group-hover:text-accent transition-colors">
                      {dur} Days in {country.name}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {dur === 3 ? 'Perfect long weekend' : dur === 5 ? 'Comfortable first visit' : 'Complete experience'}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent flex-shrink-0 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
              <Link href={`/countries/${country.slug}`}
                className="group flex items-center justify-between gap-4 bg-elevated border border-border hover:border-accent/40 rounded-2xl p-5 transition-all hover:-translate-y-px hover:shadow-md">
                <div>
                  <p className="font-semibold text-primary-text group-hover:text-accent transition-colors">
                    {country.name} Travel Guide
                  </p>
                  <p className="text-xs text-muted mt-0.5">All destinations, cities &amp; tips</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent flex-shrink-0 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </section>

          {/* ── Related Blog Posts ───────────────────────────────────── */}
          {relatedPosts.length > 0 && (
            <section>
              <h2 className="font-heading text-xl font-semibold text-primary-text mb-5">
                Deeper Reading
              </h2>
              <div className="space-y-3">
                {relatedPosts.map((post) => (
                  <Link key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex items-center justify-between gap-4 bg-surface border border-border hover:border-accent/40 rounded-xl p-4 transition-all">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-primary-text group-hover:text-accent transition-colors truncate">
                        {post.title}
                      </p>
                      <p className="text-xs text-muted mt-0.5">{post.readTime} min read</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent flex-shrink-0" />
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
