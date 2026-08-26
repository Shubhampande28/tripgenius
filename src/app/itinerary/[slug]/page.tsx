import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Schema from '@/components/Schema';
import { ChevronRight, ChevronDown, ArrowRight, Clock, Wallet, Globe, MapPin, Calendar } from 'lucide-react';
import { getCountryBySlug } from '@/data/countries';
import {
  getAllItinerarySlugs,
  parseItinerarySlug,
  buildItineraryDays,
  buildRouteOverview,
  buildCityActivityPool,
  getItinerarySlug,
  ITINERARY_DURATIONS,
  ITINERARY_FLEXIBLE_PLANS,
  ITINERARY_COMING_SOON,
  estimateTripCost,
  buildItineraryTitle,
  buildItineraryDescription,
  fmtINR,
  fmtUSD,
  type ItineraryDay,
  type ItineraryFlexiblePlan,
} from '@/lib/itineraries';
import { getCityImageUrl } from '@/lib/cityImages';
import { allPosts, isIndexablePost } from '@/lib/blog';

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

  // Genuinely thin data gap, too large a share of the page to caption
  // honestly (see ITINERARY_COMING_SOON above) — noindex until real content
  // exists to support the claimed duration.
  const comingSoon = ITINERARY_COMING_SOON[slug];
  if (comingSoon) {
    return {
      title: { absolute: `${country.name} ${parsed.duration}-Day Itinerary — Coming Soon | TripGenius` },
      description: `We don't yet have enough real, distinct places authored for ${country.name} to responsibly fill a full ${parsed.duration}-day itinerary. Check back soon, or see our shorter ${country.name} itinerary that's live today.`,
      robots: { index: false, follow: false },
      alternates: { canonical: `${BASE}/itinerary/${slug}` },
    };
  }

  const route = buildRouteOverview(buildItineraryDays(parsed.countrySlug, parsed.duration));
  // CTR formula: "{Country} {N}-Day Itinerary: {Stop1}, {Stop2} & Budget ({Year})",
  // ≤60 chars. `absolute` bypasses the "%s | TripGenius" layout template — the
  // suffix wastes SERP characters at our authority level.
  const title = buildItineraryTitle(country.name, parsed.duration, route, YEAR);
  const desc = buildItineraryDescription(country.name, parsed.duration, route);

  return {
    title: { absolute: title },
    description: desc,
    alternates: { canonical: `${BASE}/itinerary/${slug}` },
    openGraph: {
      title,
      description: desc,
      url: `${BASE}/itinerary/${slug}`,
      type: 'article',
    },
  };
}

// 40–60-word FAQ answers assembled only from itinerary data. Rendered both as
// the visible FAQ section and as FAQPage JSON-LD (they must match — schema may
// never contain content that isn't on the page).
function buildItineraryFaqs(
  countryName: string,
  duration: number,
  route: { city: { name: string }; startDay: number; endDay: number }[],
  days: ItineraryDay[],
  bestTime: string,
  flexiblePlan?: ItineraryFlexiblePlan,
) {
  const names = route.map((r) => r.city.name);
  const routeWithDays = route
    .map((r) => `${r.city.name} (${r.startDay === r.endDay ? `Day ${r.startDay}` : `Days ${r.startDay}–${r.endDay}`})`)
    .join(', then ');
  const cost = estimateTripCost(days);
  const costLine = cost
    ? `roughly ${fmtINR(cost.inrMin)}–${fmtINR(cost.inrMax)} (about ${fmtUSD(cost.usdMin)}–${fmtUSD(cost.usdMax)}) per person`
    : `a budget in the range of ${days[0].city.stats.budget} per person per day`;
  const single = names.length === 1;

  // These pages don't have enough distinct authored content to make every
  // day a packed sightseeing day — flexiblePlan names exactly which days are
  // captioned as rest/optional-add-on days on the visible page (and in the
  // schema below), so the FAQ text has to say the same thing rather than
  // implying all `duration` days are equally full.
  const flexCount = flexiblePlan?.days.length ?? 0;
  const solidDays = flexiblePlan?.solidDays;
  const flexNote = flexiblePlan
    ? ` ${flexCount} of those ${duration} days ${flexCount === 1 ? 'is' : 'are'} left flexible for rest or an optional add-on rather than packed sightseeing — see the day-by-day plan below for exactly which.`
    : '';

  return [
    {
      q: `How many days do you need in ${countryName}?`,
      a: `Most first-time visitors need 5–7 days in ${countryName} to see the highlights at a comfortable pace. This ${duration}-day plan covers ${names.join(', ')}${single ? ' in depth' : ''}.${flexNote} With more time, slow the pace or add day trips; with less, focus on ${names[0]} and skip the longer transfers.`,
    },
    {
      q: `How much does a ${duration}-day ${countryName} trip cost from India?`,
      a: `Budget ${costLine} for ${duration} days on the ground in ${countryName} — covering accommodation, food, local transport and activities at a budget-to-mid-range level. International flights and visa fees are extra. Travelling in ${bestTime} (peak season) sits at the higher end of that range.`,
    },
    {
      q: `What is the best route for ${duration} days in ${countryName}?`,
      a: single
        ? (flexiblePlan
          ? `With ${duration} days, base yourself in ${names[0]} the whole time: ${routeWithDays}. ${solidDays} of those days are structured sightseeing, each built around a different side of the city; the rest are left flexible for rest, a slower pace, or an optional day trip — the day-by-day plan below marks exactly which.`
          : `With ${duration} days, base yourself in ${names[0]} the whole time: ${routeWithDays}. Staying in one base cuts out transfer days, so each day goes to sights, food and neighbourhoods instead of transit — the day-by-day plan below structures every day around a different side of the city.`)
        : (flexiblePlan
          ? `The most efficient ${duration}-day route is ${routeWithDays}. This order keeps travel legs short and one-directional, so you never backtrack. Each stop gets as many packed sightseeing days as it has real content for — ${solidDays} in total — with ${flexCount} further day${flexCount === 1 ? '' : 's'} left flexible for rest or an optional add-on; the day-by-day plan below marks exactly which.`
          : `The most efficient ${duration}-day route is ${routeWithDays}. This order keeps travel legs short and one-directional, so you never backtrack. Each stop's day count matches how much there genuinely is to see — the day-by-day plan below breaks down exactly what to do in each.`),
    },
    {
      q: `Is ${duration} days enough for ${countryName}?`,
      a: flexiblePlan
        ? `Yes — ${duration} days is enough for a relaxed first visit to ${countryName}: ${solidDays} focused sightseeing days across ${names.join(', ')}, plus ${flexCount} flexible day${flexCount === 1 ? '' : 's'} for rest or an optional add-on so nothing feels rushed. The best months for this route are ${bestTime}.`
        : duration >= 7
          ? `Yes — ${duration} days is enough for a complete first visit to ${countryName}, comfortably covering ${names.join(', ')} with time to explore each. You'd only need longer for regional deep-dives or a slower pace. The best months for this route are ${bestTime}.`
          : `${duration} days is enough for a focused first look at ${countryName} — this plan covers ${names.join(', ')} without feeling rushed. For the full experience, the 7-day version adds more depth. The best months to do this route are ${bestTime}.`,
    },
  ];
}

export default async function ItineraryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const parsed = parseItinerarySlug(slug);
  if (!parsed) notFound();

  const country = getCountryBySlug(parsed.countrySlug);
  if (!country) notFound();

  // Genuinely thin data gap, noindexed — see ITINERARY_COMING_SOON.
  const comingSoon = ITINERARY_COMING_SOON[slug];
  if (comingSoon) {
    const redirect = parseItinerarySlug(comingSoon.redirectSlug);
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-dark flex items-center justify-center px-4 py-24">
          <div className="max-w-xl text-center space-y-6">
            <div className="text-5xl mb-2 select-none">{country.flag}</div>
            <h1 className="font-heading text-3xl font-bold text-primary-text">
              {country.name} {parsed.duration}-Day Itinerary — Coming Soon
            </h1>
            <p className="text-muted leading-relaxed">
              We don&apos;t yet have enough real, distinct places authored for {country.name} to
              responsibly fill a full {parsed.duration}-day, day-by-day plan without repeating
              ourselves or leaving days empty. Rather than publish a thin itinerary, we&apos;re
              holding this page back until there&apos;s genuine content to fill it.
            </p>
            {redirect && (
              <p className="text-muted leading-relaxed">
                In the meantime, our{' '}
                <Link href={`/itinerary/${comingSoon.redirectSlug}`} className="text-accent font-semibold hover:underline">
                  {redirect.duration}-Day {country.name} Itinerary
                </Link>{' '}
                covers exactly what we can vouch for today.
              </p>
            )}
            <div>
              <Link href={`/countries/${country.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
                {country.name} Travel Guide <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const days = buildItineraryDays(parsed.countrySlug, parsed.duration);
  if (days.length === 0) notFound();

  const route = buildRouteOverview(days);
  const flexiblePlan = ITINERARY_FLEXIBLE_PLANS[slug];
  const flexibleDayMap = new Map(flexiblePlan?.days.map((d) => [d.day, d]) ?? []);

  const countryCitySlugs = new Set(country.cities);
  const relatedPosts = allPosts
    .filter((p) =>
      isIndexablePost(p) && (
        (p.citySlug && countryCitySlugs.has(p.citySlug)) ||
        p.tags.some((t) => t.toLowerCase() === country.name.toLowerCase())
      ),
    )
    .slice(0, 3);

  const otherDurations = ITINERARY_DURATIONS.filter((d) => d !== parsed.duration);

  const pageUrl = `${BASE}/itinerary/${slug}`;
  const cost = estimateTripCost(days);
  const faqs = buildItineraryFaqs(country.name, parsed.duration, route, days, country.bestTime, flexiblePlan);
  const suits =
    parsed.duration === 3 ? 'ideal for a long weekend or a first taste' :
    parsed.duration === 5 ? 'the sweet spot for a comfortable first visit' :
    'a complete first-timer experience';

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
    headline: `${country.name} Itinerary: ${parsed.duration} Days (${YEAR})`,
    description: buildItineraryDescription(country.name, parsed.duration, route),
    url: pageUrl,
    publisher: { '@type': 'Organization', name: 'TripGenius', url: BASE },
  };

  // Day-by-day ItemList — each day anchors to its card (#day-N) below.
  const dayListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${country.name} ${parsed.duration}-Day Itinerary`,
    numberOfItems: parsed.duration,
    itemListElement: days.map((d) => ({
      '@type': 'ListItem',
      position: d.day,
      name: `Day ${d.day}: ${flexibleDayMap.get(d.day)?.label ?? d.theme ?? d.city.name}`,
      url: `${pageUrl}#day-${d.day}`,
    })),
  };

  // FAQPage mirrors the visible FAQ section at the bottom of the page.
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
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
      itemListElement: days.map((d) => {
        const flex = flexibleDayMap.get(d.day);
        return {
          '@type': 'ListItem',
          position: d.day,
          item: flex
            ? {
              '@type': 'TouristAttraction',
              name: flex.label,
              description: flex.suggestion,
              url: `${BASE}/cities/${d.city.slug}`,
            }
            : {
              '@type': 'TouristAttraction',
              name: d.theme ?? d.city.name,
              description: d.city.tagline,
              url: `${BASE}/cities/${d.city.slug}`,
            },
        };
      }),
    },
    provider: { '@type': 'Organization', name: 'TripGenius', url: BASE },
  };

  return (
    <>
      <Schema data={breadcrumbSchema} />
      <Schema data={articleSchema} />
      <Schema data={touristTripSchema} />
      <Schema data={dayListSchema} />
      <Schema data={faqSchema} />
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
              {country.name} Itinerary: {parsed.duration} Days ({YEAR})
            </h1>

            {/* Answer-first summary box — server-rendered, quotable by AI
                search engines; every value comes from itinerary data. */}
            <div className="max-w-2xl mb-6 p-5 rounded-2xl bg-elevated border border-accent/20 space-y-2.5">
              <p className="text-sm text-primary-text leading-relaxed">
                <span className="font-semibold">This {parsed.duration}-day {country.name} itinerary covers {route.map((r) => r.city.name).join(', ')}</span> — {suits}, day by day with honest costs.
              </p>
              <p className="text-sm text-muted leading-relaxed">
                <Wallet size={13} className="inline text-accent mr-1.5 -mt-0.5" />
                Estimated cost:{' '}
                {cost ? (
                  <span className="font-semibold text-primary-text">
                    {fmtINR(cost.inrMin)}–{fmtINR(cost.inrMax)} (≈ {fmtUSD(cost.usdMin)}–{fmtUSD(cost.usdMax)}) per person
                  </span>
                ) : (
                  <span className="font-semibold text-primary-text">{days[0].city.stats.budget} per person</span>
                )}{' '}
                for {parsed.duration} days, excluding international flights.
              </p>
              <p className="text-sm text-muted leading-relaxed">
                <Calendar size={13} className="inline text-accent mr-1.5 -mt-0.5" />
                Best months for this route: <span className="font-semibold text-primary-text">{country.bestTime}</span>
              </p>
              {flexiblePlan && (
                <p className="text-sm text-muted leading-relaxed">
                  <MapPin size={13} className="inline text-accent mr-1.5 -mt-0.5" />
                  {flexiblePlan.solidDays} of these are packed sightseeing days
                  {' '}— the other {flexiblePlan.days.length === 1 ? 'day is' : `${flexiblePlan.days.length} days are`} left
                  {' '}flexible for rest or an optional add-on (marked below).
                </p>
              )}
            </div>

            <p className="text-muted text-base sm:text-lg max-w-2xl mb-8 leading-relaxed">
              {route.length === 1
                ? `A ${parsed.duration}-day plan for ${route[0].city.name} — designed for Indian travellers with honest costs, visa tips, and a day-by-day pace that's ${suits}.`
                : `A day-by-day itinerary covering the best of ${country.name} — designed for Indian travellers with honest costs, visa tips, and the right cities in the right order.`}
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
                // Pool merges thingsToDo with any unused-but-real areas.spots
                // data so cities with more authored content than thingsToDo
                // alone suggests (e.g. Hong Kong, Singapore) fill every day —
                // see buildCityActivityPool.
                const activities = buildCityActivityPool(d.city).slice(
                  d.activityIndex * 3,
                  d.activityIndex * 3 + 3,
                );
                // Genuinely thin-data days are captioned as flexible/rest/
                // transfer days instead of a content day with <2 activities
                // — see ITINERARY_FLEXIBLE_PLANS. Must stay in sync with the
                // FAQ text and JSON-LD above, which describe the same days.
                const flex = flexibleDayMap.get(d.day);

                return (
                  <div key={d.day} id={`day-${d.day}`}
                    className="bg-surface border border-border rounded-2xl overflow-hidden flex flex-col sm:flex-row scroll-mt-24">

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
                                {flex ? flex.label : (d.theme ?? d.city.name)}
                              </h3>
                            </div>
                            {(flex || d.theme) && (
                              <p className="text-xs text-muted ml-7">{d.city.name}</p>
                            )}
                          </div>
                          <Link href={`/cities/${d.city.slug}`}
                            className="flex-shrink-0 text-xs font-semibold text-accent hover:underline flex items-center gap-1">
                            Full guide <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>

                        {flex ? (
                          <p className="text-sm text-muted leading-relaxed">{flex.suggestion}</p>
                        ) : (
                          <>
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
                          </>
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

          {/* ── FAQ — mirrors the FAQPage JSON-LD exactly ────────────── */}
          <section id="faq">
            <h2 className="font-heading text-xl font-semibold text-primary-text mb-5">
              {country.name} Itinerary FAQ
            </h2>
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
