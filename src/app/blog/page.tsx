'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PostCard from '@/components/blog/PostCard';
import { allPosts, isIndexablePost, BlogCategory } from '@/lib/blog';

// Only promote substantial guides. Thin posts stay reachable by direct URL but
// are kept out of the listing and internal linking (and are noindex) until they
// are expanded or consolidated, so the blog reads as a quality-first library.
const publishedPosts = allPosts.filter(isIndexablePost);

const TABS: { label: string; value: BlogCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: '🇮🇳 India', value: 'India' },
  { label: '🌏 Asia', value: 'Asia' },
  { label: '🌍 Europe', value: 'Europe' },
  { label: '✈️ Planning', value: 'Planning' },
  { label: '💰 Budget', value: 'Budget' },
  { label: '💡 Tips', value: 'Tips' },
];

// A small hand-picked set of our strongest, most complete guides — mirrors
// CountriesExplorer.tsx's FEATURED Set pattern. The old behaviour picked
// `filtered[0]` (whatever sorted first), which was an accidental, unstable
// "featured" post. Prefer one of these when present in the current filtered
// list; otherwise fall back to filtered[0] so a tab/search with no featured
// match never breaks.
const FEATURED_SLUGS = new Set([
  'thailand-travel-guide-2025',
  'japan-first-time-travel-tips-2025',
  'dubai-travel-guide-2025',
  'paris-travel-guide-2025',
  'italy-travel-guide-2025',
  'bali-vs-thailand-indian-travellers',
  'goa-vs-kerala',
  'visa-free-countries-indian-passport-2026',
  'sri-lanka-travel-guide-2025',
  'santorini-travel-guide',
]);

const PAGE_SIZE = 24;

export default function BlogPage() {
  const [activeTab, setActiveTab] = useState<BlogCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Honour ?tag= links (e.g. from the detail page's tag chips) by pre-filling
  // the search box on mount. Read on mount rather than useSearchParams to
  // keep this statically prerenderable, same pattern as cities/page.tsx's ?q=.
  useEffect(() => {
    const tag = new URLSearchParams(window.location.search).get('tag');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (tag) setSearchQuery(tag);
  }, []);

  const filtered = useMemo(() => {
    let posts = publishedPosts;
    if (activeTab !== 'all') posts = posts.filter(p => p.category === activeTab);
    if (searchQuery.trim().length >= 2) {
      const q = searchQuery.toLowerCase();
      posts = posts.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return posts;
  }, [activeTab, searchQuery]);

  const featured = useMemo(() => {
    return filtered.find(p => FEATURED_SLUGS.has(p.slug)) ?? filtered[0];
  }, [filtered]);

  const rest = useMemo(() => filtered.filter(p => p.slug !== featured?.slug), [filtered, featured]);
  const visibleRest = rest.slice(0, visibleCount);
  const categoryCount = useMemo(() => new Set(publishedPosts.map(p => p.category)).size, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">

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
                Travel Blog
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl font-bold text-primary-text mb-3">
                Travel Guides &amp; Tips
              </h1>
              <p className="text-muted text-base sm:text-lg max-w-lg mx-auto mb-8 leading-relaxed">
                Honest travel guides — itineraries, budgets, tips and real advice, written for Indian travellers.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {[
                  { icon: '📝', label: `${publishedPosts.length} Guides` },
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
                  placeholder="Search guides…"
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
            Showing <span className="font-semibold text-primary-text">{filtered.length}</span> guides
            {activeTab !== 'all' && ` in ${activeTab}`}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-4xl mb-3">📝</p>
              <p className="text-muted">No guides found. Try a different search.</p>
            </div>
          ) : (
            <>
              {/* Featured post */}
              {featured && (
                <div className="mb-10">
                  <PostCard post={featured} variant="featured" priority />
                </div>
              )}

              {/* All other posts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {visibleRest.map(post => (
                  <PostCard key={post.slug} post={post} variant="grid" />
                ))}
              </div>

              {rest.length > visibleCount && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                    className="btn btn-secondary"
                  >
                    Show more guides
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
