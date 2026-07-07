// Programmatic comparison pages — "Goa vs Bali", "Manali vs Shimla"
// These rank FAST because barely any sites target them specifically

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Schema from '@/components/Schema';
import { getCityBySlug } from '@/lib/cities';
import { getCountrySlugForCity } from '@/lib/getCountrySlug';
import { allPosts } from '@/lib/blog';
import { COMPARISONS, comparisonSlug } from '@/lib/comparisons';
import Flag from '@/components/Flag';

const BASE = 'https://www.tripgenius.in';


export function generateStaticParams() {
  return COMPARISONS.map(([a, b]) => ({ slug: comparisonSlug(a, b) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const parts = slug.match(/^(.+)-vs-(.+)$/);
  if (!parts) return {};

  const city1 = getCityBySlug(parts[1]);
  const city2 = getCityBySlug(parts[2]);
  if (!city1 || !city2) return {};

  const title = `${city1.name} vs ${city2.name} — Which is Better for Your Trip? (${new Date().getFullYear()})`;
  const desc = `${city1.name} vs ${city2.name}: complete comparison of costs, best time to visit, things to do, and which destination is right for you. Honest guide with no fluff.`;

  return {
    title,
    description: desc,
    alternates: { canonical: `${BASE}/compare/${slug}` },
    openGraph: { title, description: desc, url: `${BASE}/compare/${slug}`, type: 'article' },
    robots: { index: true, follow: true },
  };
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const parts = slug.match(/^(.+)-vs-(.+)$/);
  if (!parts) notFound();

  const city1 = getCityBySlug(parts[1]);
  const city2 = getCityBySlug(parts[2]);
  if (!city1 || !city2) notFound();

  const year = new Date().getFullYear();
  const narrativeGuide = allPosts.find(post => post.slug === slug);

  const pageUrl = `${BASE}/compare/${slug}`;
  const pageTitle = `${city1.name} vs ${city2.name}: Which is Better? (${year})`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pageTitle,
    description: `${city1.name} vs ${city2.name}: complete comparison of costs, best time to visit, things to do, and which destination is right for you.`,
    url: pageUrl,
    image: [city1.heroImage, city2.heroImage].filter(Boolean),
    // Comparison pages are data-driven; when a narrative guide exists for the
    // same pair, inherit its publication dates so the two stay consistent.
    datePublished: narrativeGuide?.date ?? '2025-06-01',
    dateModified: narrativeGuide?.updated ?? narrativeGuide?.date ?? '2026-05-01',
    author: { '@type': 'Organization', name: 'TripGenius Editorial Team', url: `${BASE}/about` },
    publisher: {
      '@type': 'Organization', name: 'TripGenius', url: BASE,
      logo: { '@type': 'ImageObject', url: `${BASE}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Destinations', item: `${BASE}/destinations` },
      { '@type': 'ListItem', position: 3, name: `${city1.name} vs ${city2.name}`, item: pageUrl },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `${city1.name} vs ${city2.name}: which is cheaper?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${city1.name} costs around ${city1.stats.budget} while ${city2.name} costs around ${city2.stats.budget}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is ${city1.name} better than ${city2.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Both are excellent destinations. ${city1.name} is best for ${city1.vibes?.join(', ')} while ${city2.name} is ideal for ${city2.vibes?.join(', ')}. Your choice depends on what experience you're looking for.`,
        },
      },
    ],
  };

  const COMPARE_ROWS = [
    { label: 'Best Time to Visit', v1: city1.stats.bestTime, v2: city2.stats.bestTime },
    { label: 'Daily Budget', v1: city1.stats.budget, v2: city2.stats.budget },
    { label: 'Currency', v1: city1.stats.currency, v2: city2.stats.currency },
    { label: 'Language', v1: city1.stats.language, v2: city2.stats.language },
    { label: 'Vibe', v1: city1.vibes?.join(', ') ?? '—', v2: city2.vibes?.join(', ') ?? '—' },
    { label: 'Country', v1: city1.country, v2: city2.country },
  ];

  return (
    <>
      <Schema data={articleSchema} />
      <Schema data={breadcrumbSchema} />
      <Schema data={faqSchema} />
      <Navbar />
      <main className="min-h-screen pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* Breadcrumb — mirrors the BreadcrumbList JSON-LD */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted mb-6">
            <Link href="/" className="hover:text-accent">Home</Link>
            <span aria-hidden>/</span>
            <Link href="/destinations" className="hover:text-accent">Destinations</Link>
            <span aria-hidden>/</span>
            <span className="text-primary-text font-medium">{city1.name} vs {city2.name}</span>
          </nav>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-primary-text mb-4">
            {city1.name} vs {city2.name}: Which is Better? ({year})
          </h1>
          <p className="text-muted mb-8 text-base leading-relaxed">
            Can&apos;t decide between {city1.name} and {city2.name}? We compare both destinations
            honestly — costs, best time, things to do, and which one suits your travel style.
            {narrativeGuide ? (
              <>
                {' '}For a deeper narrative breakdown, read our{' '}
                <Link href={`/blog/${narrativeGuide.slug}`} className="text-accent font-medium hover:underline">
                  {narrativeGuide.title}
                </Link>.
              </>
            ) : null}
          </p>

          {/* Side-by-side header */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[city1, city2].map(city => (
              <div key={city.slug} className="bg-surface border border-border rounded-2xl p-5 text-center">
                <div className="text-4xl mb-2"><Flag emoji={city.flag} /></div>
                <h2 className="font-heading text-xl font-bold text-primary-text">{city.name}</h2>
                <p className="text-sm text-muted italic">{city.tagline}</p>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary-text mb-4">
              Quick Comparison
            </h2>
            <div className="rounded-2xl border border-border overflow-hidden">
              <div className="grid grid-cols-3 bg-elevated px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted">
                <span>Factor</span>
                <span className="text-center"><Flag emoji={city1.flag} /> {city1.name}</span>
                <span className="text-center"><Flag emoji={city2.flag} /> {city2.name}</span>
              </div>
              {COMPARE_ROWS.map((row, i) => (
                <div key={row.label} className={`grid grid-cols-3 px-4 py-3 border-t border-border ${i % 2 === 0 ? 'bg-surface' : ''}`}>
                  <span className="text-sm text-muted font-medium">{row.label}</span>
                  <span className="text-sm text-primary-text text-center">{row.v1}</span>
                  <span className="text-sm text-primary-text text-center">{row.v2}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Choose your city section */}
          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary-text mb-4">
              Which Should You Choose?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[city1, city2].map(city => {
                const countryHub = getCountrySlugForCity(city.slug);
                return (
                  <div key={city.slug} className="bg-surface border border-border rounded-2xl p-5">
                    <h3 className="font-semibold text-primary-text mb-2">
                      Choose <Flag emoji={city.flag} /> {city.name} if you want:
                    </h3>
                    <ul className="space-y-2">
                      {city.vibes?.map(v => (
                        <li key={v} className="flex items-center gap-2 text-sm text-muted">
                          <span className="text-teal">✓</span> {v} experiences
                        </li>
                      ))}
                      <li className="flex items-center gap-2 text-sm text-muted">
                        <span className="text-teal">✓</span> Budget: {city.stats.budget}
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted">
                        <span className="text-teal">✓</span> Best in {city.stats.bestTime}
                      </li>
                    </ul>
                    <div className="mt-4 flex flex-col gap-1.5">
                      <Link href={`/cities/${city.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
                        Read full {city.name} guide →
                      </Link>
                      {countryHub && (
                        <Link href={`/countries/${countryHub}`}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-accent transition-colors">
                          Explore all of {city.country} →
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Other comparisons */}
          <section>
            <h2 className="font-heading text-xl font-semibold text-primary-text mb-4">
              More Comparisons
            </h2>
            <div className="flex flex-wrap gap-2">
              {COMPARISONS
                .filter(([a, b]) => !(a === parts[1] && b === parts[2]))
                .slice(0, 10)
                .map(([a, b]) => {
                  const c1 = getCityBySlug(a);
                  const c2 = getCityBySlug(b);
                  if (!c1 || !c2) return null;
                  const hrefSlug = comparisonSlug(a, b);
                  return (
                    <Link key={hrefSlug} href={`/compare/${hrefSlug}`}
                      className="text-sm px-3 py-1.5 rounded-full border border-border hover:border-accent/40 text-muted hover:text-accent transition-colors">
                      <Flag emoji={c1.flag} /> {c1.name} vs <Flag emoji={c2.flag} /> {c2.name}
                    </Link>
                  );
                })}
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
