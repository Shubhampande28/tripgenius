// Programmatic SEO: "[city] in [month]" — high-volume, high-intent seasonal
// queries (e.g. "Bali in December", "Goa in November"). Gated to cities with
// hand-authored month-by-month data so every page is substantial, never thin.

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SafeImage from '@/components/SafeImage';
import { getCityBySlug, authoredMonthCitySlugs, hasAuthoredMonths, isIndexableMonthPage } from '@/lib/cities';
import { getCityImageUrl } from '@/lib/cityImages';
import type { MonthInfo, MonthRating } from '@/lib/types';

const BASE = 'https://www.tripgenius.in';

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
] as const;

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const monthIndex = (m: string) => MONTHS.indexOf(m.toLowerCase() as (typeof MONTHS)[number]);

const RATING_COLOR: Record<MonthRating, { bg: string; text: string; border: string; label: string }> = {
  excellent: { bg: 'bg-teal/15',     text: 'text-teal',     border: 'border-teal/30',     label: 'Excellent time to visit' },
  good:      { bg: 'bg-blue-500/15', text: 'text-blue-500', border: 'border-blue-500/30', label: 'Good time to visit' },
  average:   { bg: 'bg-gold/15',     text: 'text-gold',     border: 'border-gold/30',     label: 'An okay time to visit' },
  avoid:     { bg: 'bg-red-500/15',  text: 'text-red-400',  border: 'border-red-500/30',  label: 'Not the ideal time' },
};

function verdict(city: string, month: string, m: MonthInfo): string {
  switch (m.rating) {
    case 'excellent': return `Yes — ${month} is one of the best times to visit ${city}. ${m.weather}, with temperatures around ${m.temp}.`;
    case 'good':      return `${month} is a good time to visit ${city} — ${m.weather.toLowerCase()}, with temperatures around ${m.temp}. Expect ${m.crowds.toLowerCase()} crowds.`;
    case 'average':   return `${month} is an okay time to visit ${city}, with some trade-offs. ${m.weather}, temperatures around ${m.temp}. The upside: ${m.price.toLowerCase()} prices and ${m.crowds.toLowerCase()} crowds.`;
    case 'avoid':     return `${month} is generally not the best time to visit ${city}. ${m.weather}, temperatures around ${m.temp}. If your dates are fixed, you'll get ${m.price.toLowerCase()} prices and ${m.crowds.toLowerCase()} crowds.`;
  }
}

// Only the pre-generated [city]/[month] combinations exist — any other path
// 404s, so we never serve arbitrary or thin month pages on demand.
export const dynamicParams = false;

export function generateStaticParams() {
  return authoredMonthCitySlugs.flatMap((city) =>
    MONTHS.map((month) => ({ city, month })),
  );
}

export async function generateMetadata(
  { params }: { params: Promise<{ city: string; month: string }> },
): Promise<Metadata> {
  const { city: slug, month } = await params;
  const city = getCityBySlug(slug);
  const idx = monthIndex(month);
  if (!city || idx < 0 || !hasAuthoredMonths(slug) || !city.monthByMonth) return {};

  const M = cap(month);
  const m = city.monthByMonth.months[idx];
  const year = new Date().getFullYear();
  const title = `${city.name} in ${M} (${year}): Weather, Crowds & Things to Do`;
  const desc = `Visiting ${city.name} in ${M}? ${m.weather}, temperatures around ${m.temp}, ${m.crowds.toLowerCase()} crowds and ${m.price.toLowerCase()} prices. Here's what to expect and what to do.`;

  return {
    title,
    description: desc,
    alternates: { canonical: `${BASE}/visit/${slug}/${month.toLowerCase()}` },
    // Low-intent "average"-rated months on non-flagship cities are noindexed to
    // avoid indexing near-duplicate seasonal pages at scale; the page stays
    // reachable and the /best-time-to-visit guide covers every month.
    ...(!isIndexableMonthPage(city, idx) && { robots: { index: false, follow: false } }),
    openGraph: {
      title, description: desc, type: 'article',
      url: `${BASE}/visit/${slug}/${month.toLowerCase()}`,
      images: [{ url: `/cities/${slug}/opengraph-image`, width: 1200, height: 630, alt: `${city.name} in ${M}` }],
    },
  };
}

export default async function CityInMonthPage(
  { params }: { params: Promise<{ city: string; month: string }> },
) {
  const { city: slug, month } = await params;
  const city = getCityBySlug(slug);
  const idx = monthIndex(month);
  if (!city || idx < 0 || !hasAuthoredMonths(slug) || !city.monthByMonth) notFound();

  const mbm = city.monthByMonth;
  const m = mbm.months[idx];
  const M = cap(month);
  const year = new Date().getFullYear();
  const color = RATING_COLOR[m.rating];
  const isBest = mbm.bestMonths.some((b) => b.toLowerCase().startsWith(month.slice(0, 3)));
  const isAvoid = mbm.avoidMonths.some((b) => b.toLowerCase().startsWith(month.slice(0, 3)));
  const things = (city.thingsToDo ?? []).slice(0, 6);
  const heroImg = getCityImageUrl(slug, 'hero') ?? city.heroImage;

  const faqs = [
    { q: `Is ${M} a good time to visit ${city.name}?`, a: verdict(city.name, M, m) },
    { q: `What is the weather like in ${city.name} in ${M}?`, a: `In ${M}, ${city.name} sees ${m.weather.toLowerCase()} with temperatures around ${m.temp}. ${m.highlight}` },
    { q: `Is ${city.name} crowded and expensive in ${M}?`, a: `${M} brings ${m.crowds.toLowerCase()} crowds and ${m.price.toLowerCase()} prices in ${city.name}. The best months overall are ${mbm.bestMonths.join(', ')}, so ${isBest ? 'expect peak demand — book early' : 'you may find better value than peak season'}.` },
    { q: `What should I pack for ${city.name} in ${M}?`, a: `Pack for temperatures around ${m.temp}. ${m.rating === 'avoid' ? 'Bring rain protection and a flexible plan in case weather disrupts outdoor activities.' : 'Light layers work well, with something warmer for evenings.'}` },
  ];

  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: city.name, item: `${BASE}/cities/${slug}` },
      { '@type': 'ListItem', position: 3, name: `Best Time to Visit`, item: `${BASE}/best-time-to-visit/${slug}` },
      { '@type': 'ListItem', position: 4, name: `${city.name} in ${M}`, item: `${BASE}/visit/${slug}/${month.toLowerCase()}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Navbar />
      <main className="min-h-screen pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center gap-2 text-xs text-muted mb-6">
            <Link href="/" className="hover:text-accent">Home</Link><span>/</span>
            <Link href={`/cities/${slug}`} className="hover:text-accent">{city.name}</Link><span>/</span>
            <Link href={`/best-time-to-visit/${slug}`} className="hover:text-accent">Best Time to Visit</Link><span>/</span>
            <span className="text-primary-text">{M}</span>
          </nav>

          {/* Hero image */}
          <div className="relative h-44 sm:h-56 rounded-2xl overflow-hidden mb-8">
            <SafeImage src={heroImg} alt={`${city.name} in ${M}`} city={slug} accentColor={city.accentColor} fill sizes="(max-width:768px) 100vw, 896px" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-5">
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">{city.flag} {city.country}</span>
            </div>
          </div>

          {/* Header */}
          <span className="text-xs font-bold uppercase tracking-widest text-accent mb-2 block">{M} Travel Guide</span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-primary-text mb-4">
            {city.name} in {M} ({year})
          </h1>

          {/* Verdict / quick answer */}
          <div className={`rounded-2xl p-5 mb-6 border ${color.bg} ${color.border}`}>
            <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${color.text}`}>{color.label}</p>
            <p className="text-base text-primary-text leading-relaxed">{verdict(city.name, M, m)}</p>
          </div>

          {/* Month stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Temperature', value: m.temp },
              { label: 'Weather', value: m.weather },
              { label: 'Crowds', value: m.crowds },
              { label: 'Prices', value: m.price },
            ].map((s) => (
              <div key={s.label} className="bg-surface border border-border rounded-xl p-3">
                <p className="text-xs text-muted mb-1">{s.label}</p>
                <p className="text-sm font-semibold text-primary-text leading-snug">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Context vs best time */}
          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary-text mb-3">
              {M} vs the best time to visit {city.name}
            </h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              The best months to visit {city.name} are <strong className="text-primary-text">{mbm.bestMonths.join(', ')}</strong>
              {mbm.avoidMonths.length > 0 && <> and the months to avoid are <strong className="text-primary-text">{mbm.avoidMonths.join(', ')}</strong></>}.
              {' '}{isBest
                ? `${M} falls within the peak window, so book accommodation and flights early.`
                : isAvoid
                  ? `${M} is one of the trickier months — plan flexible, indoor-friendly activities.`
                  : `${M} sits outside peak season, which often means better value and thinner crowds.`}
            </p>
            <Link href={`/best-time-to-visit/${slug}`} className="text-sm font-semibold text-accent hover:underline inline-flex items-center gap-1">
              See the full month-by-month guide →
            </Link>
          </section>

          {/* What to do */}
          {things.length > 0 && (
            <section className="mb-10">
              <h2 className="font-heading text-2xl font-semibold text-primary-text mb-4">
                Things to do in {city.name} in {M}
              </h2>
              <div className="space-y-2">
                {things.map((t, i) => (
                  <div key={i} className="flex gap-3 p-4 bg-surface border border-border rounded-xl">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/15 text-accent text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                    <div>
                      <p className="text-sm font-semibold text-primary-text">{t.name}</p>
                      {t.description && <p className="text-xs text-muted mt-0.5 leading-relaxed line-clamp-2">{t.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary-text mb-4">
              {city.name} in {M} — FAQs
            </h2>
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <div key={i} className="bg-surface border border-border rounded-xl p-5">
                  <h3 className="font-semibold text-primary-text mb-2 text-sm">{f.q}</h3>
                  <p className="text-sm text-muted leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-accent/10 border border-accent/25 rounded-2xl p-6 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Full Travel Guide</p>
            <h3 className="font-heading text-2xl font-semibold text-primary-text mb-2">
              Planning a {city.name} trip in {M}?
            </h3>
            <p className="text-sm text-muted mb-4">Things to do, where to stay, budgets and local tips — all free.</p>
            <Link href={`/cities/${slug}`} className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 transition-colors">
              Read the Full {city.name} Guide →
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
