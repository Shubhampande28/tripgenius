import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight, Tag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Schema from '@/components/Schema';
import { getAllNews, NewsCategory } from '@/lib/news';

const BASE = 'https://www.tripgenius.in';

export const metadata: Metadata = {
  title: 'Travel News for Indian Travellers — Visas, Airlines & Advisories',
  description: 'Fresh travel news that affects your trip: visa changes for Indian passport holders, airline routes, destination rules and advisories. Updated regularly.',
  alternates: { canonical: `${BASE}/news` },
  openGraph: {
    title: 'Travel News for Indian Travellers | TripGenius',
    description: 'Visa changes, airline routes, destination rules and advisories — the travel news that actually affects your trip planning.',
    url: `${BASE}/news`,
    type: 'website',
  },
};

const CATEGORY_COLORS: Record<NewsCategory, string> = {
  Visas:        'bg-blue-500/15 text-blue-500 border-blue-500/25',
  Airlines:     'bg-purple-500/15 text-purple-500 border-purple-500/25',
  Destinations: 'bg-teal/15 text-teal border-teal/25',
  Advisories:   'bg-orange-500/15 text-orange-500 border-orange-500/25',
  Deals:        'bg-green-500/15 text-green-500 border-green-500/25',
  Policy:       'bg-indigo-500/15 text-indigo-500 border-indigo-500/25',
};

function CategoryBadge({ category }: { category: NewsCategory }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[category]}`}>
      <Tag size={8} /> {category}
    </span>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function NewsPage() {
  const articles = getAllNews();
  const [featured, ...rest] = articles;

  const listSchema = articles.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: articles.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE}/news/${a.slug}`,
      name: a.title,
    })),
  } : null;

  return (
    <>
      <Schema data={listSchema} />
      <Navbar />
      <main className="min-h-screen">

        {/* Header */}
        <div className="pt-24 pb-10 border-b border-border">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-3">Travel News</p>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-primary-text mb-3">
              News That Affects Your Trip
            </h1>
            <p className="text-muted text-base">
              Visa changes, airline routes, destination rules and advisories — for Indian travellers, without the noise.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {articles.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-4xl mb-3">📰</p>
              <p className="text-muted">No news yet — check back soon.</p>
            </div>
          ) : (
            <>
              {/* Featured — the latest story */}
              {featured && (
                <div className="mb-10">
                  <Link href={`/news/${featured.slug}`}
                    className="group grid grid-cols-1 md:grid-cols-2 gap-0 bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/30 card-lift">
                    <div className="relative h-64 md:h-auto min-h-[260px]">
                      <Image
                        src={`https://images.unsplash.com/${featured.coverPhoto}?auto=format&fit=crop&w=800&q=80`}
                        alt={featured.title} fill
                        className="object-cover card-img"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent text-white">
                          Latest
                        </span>
                      </div>
                    </div>
                    <div className="p-6 sm:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3">
                        <CategoryBadge category={featured.category} />
                        <time dateTime={featured.date} className="text-xs text-muted">{formatDate(featured.date)}</time>
                      </div>
                      <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary-text mt-3 mb-3 leading-snug group-hover:text-accent transition-colors">
                        {featured.title}
                      </h2>
                      <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-3">{featured.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted">
                        <span className="flex items-center gap-1"><Clock size={11} /> {featured.readTime} min read</span>
                      </div>
                      <div className="mt-5 flex items-center gap-1.5 text-accent text-sm font-semibold">
                        Read story <ArrowRight size={14} />
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Remaining stories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map(article => (
                  <Link key={article.slug} href={`/news/${article.slug}`}
                    className="group flex flex-col bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/30 card-lift">
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={`https://images.unsplash.com/${article.coverPhoto}?auto=format&fit=crop&w=600&q=80`}
                        alt={article.title} fill
                        className="object-cover card-img"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <CategoryBadge category={article.category} />
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 p-4">
                      <time dateTime={article.date} className="text-[10px] text-muted mb-1.5">{formatDate(article.date)}</time>
                      <h2 className="font-heading text-base font-bold text-primary-text mb-2 leading-snug group-hover:text-accent transition-colors line-clamp-2">
                        {article.title}
                      </h2>
                      <p className="text-muted text-xs leading-relaxed mb-3 line-clamp-2 flex-1">{article.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted">
                        <span className="flex items-center gap-1"><Clock size={11} /> {article.readTime} min read</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Cross-link to evergreen guides */}
          <div className="mt-14 text-center">
            <p className="text-sm text-muted">
              Looking for evergreen planning advice?{' '}
              <Link href="/blog" className="text-accent font-semibold hover:underline">Read our travel guides →</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
