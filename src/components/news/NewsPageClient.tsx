'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search } from 'lucide-react';
import NewsCard from '@/components/news/NewsCard';
import type { NewsArticle, NewsCategory } from '@/lib/news';

const TABS: { label: string; value: NewsCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: '🛂 Visas', value: 'Visas' },
  { label: '✈️ Airlines', value: 'Airlines' },
  { label: '🗺️ Destinations', value: 'Destinations' },
  { label: '⚠️ Advisories', value: 'Advisories' },
  { label: '💸 Deals', value: 'Deals' },
  { label: '📜 Policy', value: 'Policy' },
];

const PAGE_SIZE = 24;

export default function NewsPageClient({ articles: allArticles }: { articles: NewsArticle[] }) {
  const [activeTab, setActiveTab] = useState<NewsCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const tag = new URLSearchParams(window.location.search).get('tag');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (tag) setSearchQuery(tag);
  }, []);

  const filtered = useMemo(() => {
    let articles = allArticles;
    if (activeTab !== 'all') articles = articles.filter(a => a.category === activeTab);
    if (searchQuery.trim().length >= 2) {
      const q = searchQuery.toLowerCase();
      articles = articles.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return articles;
  }, [allArticles, activeTab, searchQuery]);

  const [featured, ...rest] = filtered;
  const visibleRest = rest.slice(0, visibleCount);
  const categoryCount = useMemo(() => new Set(allArticles.map(a => a.category)).size, [allArticles]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-4">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-3xl mb-10 border border-border bg-gradient-to-br from-accent/15 via-surface to-elevated px-6 sm:px-12 py-12 text-center">
        <div className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-teal/10 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative z-10"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full mb-4">
            Travel News
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-primary-text mb-3">
            News That Affects Your Trip
          </h1>
          <p className="text-muted text-base sm:text-lg max-w-lg mx-auto mb-8 leading-relaxed">
            Visa changes, airline routes, destination rules and advisories — for Indian travellers, without the noise.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              { icon: '📰', label: `${allArticles.length} Stories` },
              { icon: '🗂️', label: `${categoryCount} Categories` },
            ].map((s) => (
              <span key={s.label}
                className="flex items-center gap-1.5 text-sm font-medium text-primary-text bg-elevated/80 backdrop-blur-sm border border-border rounded-full px-4 py-1.5">
                {s.icon} {s.label}
              </span>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-sm mx-auto">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search news…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-sm text-primary-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </motion.div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-8 scrollbar-hide">
        {TABS.map(tab => (
          <button key={tab.value} onClick={() => { setActiveTab(tab.value); setVisibleCount(PAGE_SIZE); }}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.value
                ? 'bg-accent text-white shadow-sm'
                : 'bg-surface border border-border text-muted hover:text-primary-text hover:border-accent/30'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-muted mb-6">
        Showing <span className="font-semibold text-primary-text">{filtered.length}</span> stories
        {activeTab !== 'all' && ` in ${activeTab}`}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-4xl mb-3">📰</p>
          <p className="text-muted">
            {allArticles.length === 0 ? 'No news yet — check back soon.' : 'No stories found. Try a different search.'}
          </p>
        </div>
      ) : (
        <>
          {/* Featured — the latest story */}
          {featured && (
            <div className="mb-10">
              <NewsCard article={featured} variant="featured" priority />
            </div>
          )}

          {/* Remaining stories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleRest.map(article => (
              <NewsCard key={article.slug} article={article} variant="grid" />
            ))}
          </div>

          {rest.length > visibleCount && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                className="btn btn-secondary"
              >
                Show more stories
              </button>
            </div>
          )}
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
  );
}
