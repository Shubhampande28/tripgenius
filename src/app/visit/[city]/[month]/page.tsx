// Programmatic SEO: "[city] in [month]" — high-volume, high-intent seasonal
// queries (e.g. "Bali in December", "Goa in November"). Gated to cities with
// hand-authored month-by-month data so every page is substantial, never thin.

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SafeImage from '@/components/SafeImage';
import Schema from '@/components/Schema';
import { getCityBySlug, authoredMonthCitySlugs, hasAuthoredMonths, isIndexableMonthPage } from '@/lib/cities';
import { getCityImageUrl } from '@/lib/cityImages';
import type { MonthInfo, MonthRating } from '@/lib/types';
import Flag from '@/components/Flag';

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

// ── Decision-first SERP metadata ─────────────────────────────────────────────
// These pages rank but lose clicks to Google's SERP weather widget. The widget
// answers "what's the weather" — the snippet must promise what it can't:
// "is it worth going?". Everything below is derived from the month's data.

const isMonsoonMonth = (city: { country: string }, m: MonthInfo) =>
  city.country === 'India' && /monsoon|heavy rain|torrential|rainy|rainiest|downpour/i.test(`${m.weather} ${m.highlight}`);

function buildVisitTitle(cityName: string, M: string, year: number, monsoon: boolean): string {
  const candidates = monsoon
    ? [
        `${cityName} in ${M}: Monsoon Reality, Crowds & Costs`,
        `${cityName} in ${M}: Monsoon Reality & Costs`,
        `${cityName} in ${M} (${year})`,
      ]
    : [
        `${cityName} in ${M} ${year}: Worth It? Weather, Crowds & Costs`,
        `${cityName} in ${M}: Worth Visiting? Weather & Costs`,
        `${cityName} in ${M}: Worth It? Weather & Costs`,
        `${cityName} in ${M} (${year})`,
      ];
  return candidates.find((t) => t.length <= 60) ?? candidates[candidates.length - 1];
}

const VERDICT_PHRASE: Record<MonthInfo['rating'], (monsoon: boolean) => string> = {
  excellent: () => 'one of the best months to go',
  good:      () => 'a solid time to visit',
  average:   () => 'a shoulder-season trade-off',
  avoid:     (monsoon) => (monsoon ? 'skip unless you love rain' : 'better months exist'),
};

/** Approx daily budget in INR from the city's budget string; null if unparseable. */
function dailyBudgetINR(budget: string): { min: number; max: number } | null {
  const RATES: Record<string, number> = {
    USD: 86, INR: 1, EUR: 93, GBP: 109, AUD: 56, CAD: 63, CHF: 96, NZD: 51,
    AED: 23.4, JPY: 0.57, KRW: 0.062, THB: 2.4, IDR: 0.0052, VND: 0.0034,
    PHP: 1.48, MYR: 18, LKR: 0.28, NPR: 0.64, BTN: 1.02, EGP: 1.7, MAD: 8.6,
    JOD: 121, ZAR: 4.6,
  };
  const m = budget.replace(/,/g, '').match(/^(₹|\$|[A-Z]{3})\s?(\d+(?:\.\d+)?)\s?[–-]\s?(?:₹|\$)?(\d+(?:\.\d+)?)/);
  if (!m) return null;
  const rate = RATES[m[1] === '$' ? 'USD' : m[1] === '₹' ? 'INR' : m[1]];
  if (!rate) return null;
  const round = (n: number) => Math.round(n / 100) * 100;
  return { min: round(parseFloat(m[2]) * rate), max: round(parseFloat(m[3]) * rate) };
}

function buildVisitDescription(cityName: string, M: string, m: MonthInfo, budget: string, monsoon: boolean): string {
  const phrase = VERDICT_PHRASE[m.rating](monsoon);
  const inr = dailyBudgetINR(budget);
  const cost = inr ? `daily costs around ₹${inr.min.toLocaleString('en-IN')}+` : `daily costs around ${budget.replace('/day', '')}`;
  const candidates = [
    `Honest take on ${cityName} in ${M}: ${phrase}. Expect ${m.temp} weather, ${m.crowds.toLowerCase()} crowds, and ${cost}. Full month guide inside.`,
    `Honest take on ${cityName} in ${M}: ${phrase}. Expect ${m.crowds.toLowerCase()} crowds and ${cost}. Full month guide inside.`,
    `Honest take on ${cityName} in ${M}: ${phrase}. Full month guide inside.`,
  ];
  return candidates.find((d) => d.length <= 155) ?? candidates[candidates.length - 1];
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
  const monsoon = isMonsoonMonth(city, m);
  const title = buildVisitTitle(city.name, M, year, monsoon);
  const desc = buildVisitDescription(city.name, M, m, city.stats.budget, monsoon);

  return {
    title: { absolute: title },
    description: desc,
    alternates: { canonical: `${BASE}/visit/${slug}/${month.toLowerCase()}` },
    // Only fires for cities without authored month data (the route is gated to
    // authored cities, so in practice never) — noindex,follow as a safety net.
    ...(!isIndexableMonthPage(city, idx) && { robots: { index: false, follow: true } }),
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

  const monsoon = isMonsoonMonth(city, m);
  const inr = dailyBudgetINR(city.stats.budget);
  const budgetLabel = inr
    ? `₹${inr.min.toLocaleString('en-IN')}–₹${inr.max.toLocaleString('en-IN')}/day`
    : city.stats.budget;

  // Verdict mapping: excellent/good → Go, average → Go with caveats,
  // avoid → Better months exist. Crowds mapped to Low/Medium/High.
  const verdictLabel =
    m.rating === 'excellent' || m.rating === 'good' ? 'Go' :
    m.rating === 'average' ? 'Go with caveats' : 'Better months exist';
  const crowdLevel = m.crowds === 'Moderate' ? 'Medium' : m.crowds === 'Peak' ? 'High' : m.crowds;

  // "Better month?" — first best-month with a live page, skipped when this
  // month IS a best month (nothing better to suggest).
  const bestMonthSlug = isBest ? null : mbm.bestMonths
    .map((b) => b.toLowerCase())
    .find((b) => (MONTHS as readonly string[]).includes(b)) ?? null;

  const faqs = [
    { q: `Is ${M} a good time to visit ${city.name}?`, a: verdict(city.name, M, m) },
    { q: `Is ${city.name} expensive in ${M}?`, a: `${M} is a ${m.price.toLowerCase()}-price month in ${city.name}, with ${m.crowds.toLowerCase()} crowds and daily costs around ${budgetLabel} per person. The best-value strategy: ${isBest ? 'book accommodation early — this is peak demand' : 'take advantage of off-peak rates on stays and activities'}.` },
    { q: `What should I pack for ${city.name} in ${M}?`, a: `Pack for temperatures around ${m.temp}. ${m.rating === 'avoid' || monsoon ? 'Bring rain protection and a flexible plan in case weather disrupts outdoor activities.' : 'Light layers work well, with something warmer for evenings.'} ${m.highlight}` },
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
      <Schema data={faqSchema} />
      <Schema data={breadcrumbSchema} />
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

          {/* Header — H1 + verdict render before any image, so the decision is
              in the first paint even on a slow phone (GA4 shows 2s exits). */}
          <span className="text-xs font-bold uppercase tracking-widest text-accent mb-2 block">{M} Travel Guide</span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-primary-text mb-4">
            {city.name} in {M} ({year})
          </h1>

          {/* Above-the-fold verdict card — the decision Google's weather widget
              can't make. Fully server-rendered, no loaders, all from month data. */}
          <div className={`rounded-2xl p-5 mb-6 border ${color.bg} ${color.border}`}>
            <p className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${color.text}`}>
              Verdict: {verdictLabel}
            </p>
            <p className="text-base text-primary-text leading-relaxed mb-4">{verdict(city.name, M, m)}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-sm">
              <div className="bg-dark/20 rounded-xl px-3.5 py-2.5">
                <p className="text-[11px] text-muted uppercase tracking-wide mb-0.5">Weather</p>
                <p className="font-semibold text-primary-text leading-snug">{m.temp} · {m.weather}</p>
              </div>
              <div className="bg-dark/20 rounded-xl px-3.5 py-2.5">
                <p className="text-[11px] text-muted uppercase tracking-wide mb-0.5">Crowds</p>
                <p className="font-semibold text-primary-text leading-snug">{crowdLevel}</p>
              </div>
              <div className="bg-dark/20 rounded-xl px-3.5 py-2.5">
                <p className="text-[11px] text-muted uppercase tracking-wide mb-0.5">Daily budget</p>
                <p className="font-semibold text-primary-text leading-snug">{budgetLabel}</p>
              </div>
            </div>

            {bestMonthSlug && (
              <Link
                href={`/visit/${slug}/${bestMonthSlug}`}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
              >
                Better month? See {city.name} in {cap(bestMonthSlug)} →
              </Link>
            )}
          </div>

          {/* Hero image — below the verdict, lazy (not the LCP element) */}
          <div className="relative h-44 sm:h-56 rounded-2xl overflow-hidden mb-8">
            <SafeImage src={heroImg} alt={`${city.name} in ${M}`} city={slug} accentColor={city.accentColor} fill sizes="(max-width:768px) 100vw, 896px" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-5">
              <span className="text-xs font-bold uppercase tracking-widest text-white/70"><Flag emoji={city.flag} /> {city.country}</span>
            </div>
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
