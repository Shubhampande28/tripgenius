'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight, Tag, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { allPosts, BlogCategory } from '@/lib/blog';

const CATEGORY_COLORS: Record<BlogCategory, string> = {
  Planning:  'bg-blue-500/15 text-blue-500 border-blue-500/25',
  Budget:    'bg-teal/15 text-teal border-teal/25',
  India:     'bg-orange-500/15 text-orange-500 border-orange-500/25',
  Asia:      'bg-purple-500/15 text-purple-500 border-purple-500/25',
  Europe:    'bg-indigo-500/15 text-indigo-500 border-indigo-500/25',
  Tips:      'bg-accent/15 text-accent border-accent/25',
};

const TABS: { label: string; value: BlogCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: '🇮🇳 India', value: 'India' },
  { label: '🌏 Asia', value: 'Asia' },
  { label: '🌍 Europe', value: 'Europe' },
  { label: '✈️ Planning', value: 'Planning' },
  { label: '💰 Budget', value: 'Budget' },
  { label: '💡 Tips', value: 'Tips' },
];

function CategoryBadge({ category }: { category: BlogCategory }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[category]}`}>
      <Tag size={8} /> {category}
    </span>
  );
}

// No dates — travel guides don't expire, dates make them feel stale
function PostMeta({ readTime }: { date: string; readTime: number }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted">
      <span className="flex items-center gap-1"><Clock size={11} /> {readTime} min read</span>
      <span className="w-1 h-1 rounded-full bg-border" />
      <span className="text-accent font-medium">Free Guide</span>
    </div>
  );
}

export default function BlogPage() {
  const [activeTab, setActiveTab] = useState<BlogCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    let posts = allPosts;
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

  const [featured, ...rest] = filtered;

  return (
    <>
      <Navbar />
      <main className="min-h-screen">

        {/* Header */}
        <div className="pt-24 pb-10 border-b border-border">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-3">Travel Blog</p>
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-primary-text mb-3">
              Travel Guides & Tips
            </h1>
            <p className="text-muted text-base mb-6">
              {allPosts.length} free travel guides — itineraries, budgets, tips and honest advice.
            </p>

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
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-8" style={{ scrollbarWidth: 'none' }}>
            {TABS.map(tab => (
              <button key={tab.value} onClick={() => setActiveTab(tab.value)}
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
              {/* Featured post — first result */}
              {featured && (
                <div className="mb-10">
                  <Link href={`/blog/${featured.slug}`}
                    className="group grid grid-cols-1 md:grid-cols-2 gap-0 bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/30 hover:shadow-lg transition-all">
                    <div className="relative h-64 md:h-auto min-h-[260px]">
                      <Image
                        src={`https://images.unsplash.com/${featured.coverPhoto}?auto=format&fit=crop&w=800&q=80`}
                        alt={featured.title} fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                    </div>
                    <div className="p-6 sm:p-8 flex flex-col justify-center">
                      <CategoryBadge category={featured.category} />
                      <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary-text mt-3 mb-3 leading-snug group-hover:text-accent transition-colors">
                        {featured.title}
                      </h2>
                      <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-3">{featured.excerpt}</p>
                      <PostMeta date={featured.date} readTime={featured.readTime} />
                      <div className="mt-5 flex items-center gap-1.5 text-accent text-sm font-semibold">
                        Read guide <ArrowRight size={14} />
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* All other posts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map(post => (
                  <Link key={post.slug} href={`/blog/${post.slug}`}
                    className="group flex flex-col bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/30 hover:shadow-md transition-all">
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={`https://images.unsplash.com/${post.coverPhoto}?auto=format&fit=crop&w=600&q=80`}
                        alt={post.title} fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <CategoryBadge category={post.category} />
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 p-4">
                      <h2 className="font-heading text-base font-bold text-primary-text mb-2 leading-snug group-hover:text-accent transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-muted text-xs leading-relaxed mb-3 line-clamp-2 flex-1">{post.excerpt}</p>
                      <PostMeta date={post.date} readTime={post.readTime} />
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
