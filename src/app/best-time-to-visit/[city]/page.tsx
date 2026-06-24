// Programmatic SEO: "best time to visit [city]" — low competition, high intent
// Targets: "best time to visit bali", "when to visit manali", "bali weather guide"

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCityBySlug, getAllCitySlugs, hasAuthoredMonths } from '@/lib/cities';

const BASE = 'https://www.tripgenius.in';

export function generateStaticParams() {
  return getAllCitySlugs().map(slug => ({ city: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return {};

  const title = `Best Time to Visit ${city.name} ${new Date().getFullYear()} — Month by Month Guide`;
  const desc = `When is the best time to visit ${city.name}? Complete month-by-month weather guide. Best months: ${city.stats.bestTime}. Includes crowd levels, prices, and what to expect each month.`;

  return {
    title,
    description: desc,
    keywords: [
      `best time to visit ${city.name}`,
      `when to visit ${city.name}`,
      `${city.name} weather`,
      `${city.name} best season`,
      `${city.name} travel season`,
      `${city.name} weather by month`,
      `${city.name} peak season`,
      `${city.name} off season`,
    ],
    alternates: { canonical: `${BASE}/best-time-to-visit/${slug}` },
    ...((city.stub || !city.monthByMonth) && { robots: { index: false, follow: false } }),
    openGraph: {
      title, description: desc,
      url: `${BASE}/best-time-to-visit/${slug}`,
      type: 'article',
    },
  };
}

const MONTH_INFO: Record<string, string> = {
  Jan:'January', Feb:'February', Mar:'March', Apr:'April',
  May:'May', Jun:'June', Jul:'July', Aug:'August',
  Sep:'September', Oct:'October', Nov:'November', Dec:'December',
};

const RATING_COLOR = {
  excellent: { bg: 'bg-teal/15', text: 'text-teal', border: 'border-teal/30', label: 'Best' },
  good:      { bg: 'bg-blue-500/15', text: 'text-blue-500', border: 'border-blue-500/30', label: 'Good' },
  average:   { bg: 'bg-gold/15', text: 'text-gold', border: 'border-gold/30', label: 'Okay' },
  avoid:     { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30', label: 'Avoid' },
};

export default async function BestTimePage({ params }: { params: Promise<{ city: string }> }) {
  const { city: slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) notFound();

  const mbm = city.monthByMonth;
  const year = new Date().getFullYear();

  // JSON-LD for featured snippet
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the best time to visit ${city.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: mbm
            ? `The best time to visit ${city.name} is ${mbm.bestMonths.join(', ')}. ${mbm.summary}`
            : `The best time to visit ${city.name} is ${city.stats.bestTime}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What months should I avoid visiting ${city.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: mbm?.avoidMonths?.length
            ? `Avoid visiting ${city.name} in ${mbm.avoidMonths.join(' and ')} due to unfavourable weather conditions.`
            : `Check the month-by-month breakdown for the latest travel conditions in ${city.name}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is ${city.name} worth visiting in monsoon?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${city.name} during monsoon has lower prices and fewer tourists. However, outdoor activities may be limited. Check the month-by-month guide for specific conditions.`,
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar />
      <main className="min-h-screen pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-muted mb-6">
            <Link href="/" className="hover:text-accent">Home</Link>
            <span>/</span>
            <Link href="/destinations" className="hover:text-accent">Destinations</Link>
            <span>/</span>
            <Link href={`/cities/${slug}`} className="hover:text-accent">{city.name}</Link>
            <span>/</span>
            <span>Best Time to Visit</span>
          </nav>

          {/* Header — optimised for featured snippet */}
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-accent mb-2 block">
              {city.flag} {city.country} Travel Guide
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-primary-text mb-4">
              Best Time to Visit {city.name} ({year})
            </h1>

            {/* Direct answer box — targets featured snippet */}
            <div className="bg-teal/10 border border-teal/25 rounded-2xl p-5 mb-6">
              <p className="text-sm font-bold text-teal uppercase tracking-wider mb-2">Quick Answer</p>
              <p className="text-base text-primary-text leading-relaxed">
                {mbm
                  ? `The best time to visit ${city.name} is ${mbm.bestMonths.join(', ')}. ${mbm.summary}`
                  : `The best time to visit ${city.name} is ${city.stats.bestTime}.`}
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { label: 'Best Months', value: city.stats.bestTime },
                { label: 'Daily Budget', value: city.stats.budget },
                { label: 'Currency', value: city.stats.currency },
                { label: 'Language', value: city.stats.language },
              ].map(s => (
                <div key={s.label} className="bg-surface border border-border rounded-xl p-3">
                  <p className="text-xs text-muted mb-1">{s.label}</p>
                  <p className="text-sm font-semibold text-primary-text">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Month-by-month table — big SEO value */}
          {mbm && (
            <section className="mb-10">
              <h2 className="font-heading text-2xl font-semibold text-primary-text mb-4">
                {city.name} Weather by Month
              </h2>
              <div className="space-y-2">
                {mbm.months.map(m => {
                  const c = RATING_COLOR[m.rating] ?? RATING_COLOR.average;
                  const linkable = hasAuthoredMonths(slug);
                  const fullMonth = (MONTH_INFO[m.short] ?? m.month).toLowerCase();
                  const rowInner = (
                    <>
                      <div className="w-10 flex-shrink-0">
                        <p className="text-sm font-bold text-primary-text">{m.short}</p>
                      </div>
                      <div className={`text-xs font-bold px-2 py-0.5 rounded-full border ${c.bg} ${c.border} ${c.text} flex-shrink-0`}>
                        {c.label}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-primary-text">{m.weather}</p>
                        {m.highlight && <p className="text-xs text-muted mt-0.5">{m.highlight}</p>}
                      </div>
                      <div className="text-sm font-semibold text-primary-text flex-shrink-0">{m.temp}</div>
                    </>
                  );
                  return linkable ? (
                    <Link
                      key={m.month}
                      href={`/visit/${slug}/${fullMonth}`}
                      className={`flex items-center gap-4 p-4 rounded-xl border ${c.bg} ${c.border} hover:brightness-110 transition`}
                      aria-label={`${city.name} in ${MONTH_INFO[m.short] ?? m.month}`}
                    >
                      {rowInner}
                    </Link>
                  ) : (
                    <div key={m.month} className={`flex items-center gap-4 p-4 rounded-xl border ${c.bg} ${c.border}`}>
                      {rowInner}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* FAQ section */}
          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary-text mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: `Is ${city.name} good for a honeymoon?`,
                  a: `${city.name} is an excellent honeymoon destination. The best time for couples is ${city.stats.bestTime} when the weather is ideal. Expect to budget around ${city.stats.budget} per day for a comfortable stay.`,
                },
                {
                  q: `Can I visit ${city.name} on a budget?`,
                  a: `Yes, ${city.name} can be visited on a budget. Average daily costs are ${city.stats.budget}. Budget travellers can find affordable accommodation and food while still experiencing the best the city has to offer.`,
                },
                {
                  q: `How many days should I spend in ${city.name}?`,
                  a: `We recommend 3-5 days in ${city.name} to see the main attractions. A week gives you time to explore at a relaxed pace and discover hidden gems beyond the tourist trail.`,
                },
              ].map((faq, i) => (
                <div key={i} className="bg-surface border border-border rounded-xl p-5">
                  <h3 className="font-semibold text-primary-text mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA to full guide */}
          <div className="bg-accent/10 border border-accent/25 rounded-2xl p-6 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Full Travel Guide</p>
            <h3 className="font-heading text-2xl font-semibold text-primary-text mb-2">
              Ready to plan your {city.name} trip?
            </h3>
            <p className="text-sm text-muted mb-4">
              Things to do, where to stay, hidden gems and insider tips — all free.
            </p>
            <Link href={`/cities/${slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 transition-colors">
              Read the Full {city.name} Guide →
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
