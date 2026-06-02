'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Mail, ChevronDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SafeImage from '@/components/SafeImage';
import { allCities } from '@/lib/cities';
import { getCityImageUrl } from '@/lib/cityImages';
import { allPosts } from '@/lib/blog';
import type { City } from '@/lib/types';

// ── Search autocomplete ────────────────────────────────────────────
// Generates suggestions: city + "Itinerary", "Things To Do", "Budget Guide"
function getSearchSuggestions(q: string) {
  if (!q || q.length < 2) return [];
  const lower = q.toLowerCase();
  const matched = allCities
    .filter(c => !c.stub && (
      c.name.toLowerCase().startsWith(lower) ||
      c.country.toLowerCase().startsWith(lower) ||
      c.name.toLowerCase().includes(lower)
    ))
    .slice(0, 4);

  const suggestions: { label: string; sub: string; href: string; city: City }[] = [];
  matched.forEach(city => {
    suggestions.push(
      { label: city.name,                           sub: city.country,         href: `/cities/${city.slug}`,                    city },
      { label: `${city.name} Things To Do`,         sub: 'Experiences & tours', href: `/cities/${city.slug}#things-to-do`,       city },
      { label: `${city.name} Itinerary`,            sub: 'Day-by-day plan',    href: `/cities/${city.slug}`,                    city },
      { label: `${city.name} Budget Guide`,         sub: 'Costs & tips',       href: `/cities/${city.slug}#budget`,             city },
    );
  });
  return suggestions.slice(0, 8);
}

// Highlight matching text in suggestion label
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-accent font-semibold">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

// ── Featured Destinations ──────────────────────────────────────────
const FEATURED_SLUGS = ['bali', 'paris', 'tokyo', 'goa', 'dubai', 'jaipur', 'bangkok', 'maldives'];

// ── Compare pairs ──────────────────────────────────────────────────
const COMPARE_PAIRS = [
  { a: 'goa', b: 'bali',     labelA: 'Goa',     labelB: 'Bali',     flagA: '🇮🇳', flagB: '🇮🇩' },
  { a: 'manali', b: 'shimla', labelA: 'Manali',  labelB: 'Shimla',   flagA: '🇮🇳', flagB: '🇮🇳' },
  { a: 'goa', b: 'kerala',   labelA: 'Goa',     labelB: 'Kerala',   flagA: '🇮🇳', flagB: '🇮🇳' },
];

// ── Home FAQ ───────────────────────────────────────────────────────
const HOME_FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type':'Question', name:'Are TripGenius travel guides really free?', acceptedAnswer:{ '@type':'Answer', text:'Yes — every guide on TripGenius is completely free to read, with no paywalls or subscription fees.' } },
    { '@type':'Question', name:'How often are the travel guides updated?', acceptedAnswer:{ '@type':'Answer', text:'We review and update our guides regularly. Every guide shows a last updated date.' } },
  ],
};

export default function HomePage() {
  const router = useRouter();

  // Search state
  const [query, setQuery]             = useState('');
  const [showDrop, setShowDrop]       = useState(false);
  const [activeIdx, setActiveIdx]     = useState(-1);
  const searchRef                     = useRef<HTMLDivElement>(null);
  const inputRef                      = useRef<HTMLInputElement>(null);

  // Newsletter
  const [email, setEmail]             = useState('');
  const [subState, setSubState]       = useState<'idle'|'loading'|'done'|'error'>('idle');

  // FAQ
  const [openFaq, setOpenFaq]         = useState<number|null>(null);

  const suggestions = useMemo(() => getSearchSuggestions(query), [query]);
  const featuredCities = useMemo(() => FEATURED_SLUGS.map(s => allCities.find(c => c.slug === s)).filter(Boolean) as City[], []);
  const guidePosts = useMemo(() => allPosts.slice(0, 3), []);

  // Close dropdown on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDrop(false);
        setActiveIdx(-1);
      }
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  // Keyboard navigation in dropdown
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showDrop || suggestions.length === 0) {
      if (e.key === 'Enter' && query.trim()) {
        // Only navigate if user presses Enter with no dropdown open
        const first = getSearchSuggestions(query)[0];
        if (first) router.push(first.href);
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0 && suggestions[activeIdx]) {
        router.push(suggestions[activeIdx].href);
        setShowDrop(false);
        setQuery('');
      }
    } else if (e.key === 'Escape') {
      setShowDrop(false);
      setActiveIdx(-1);
    }
  }, [showDrop, suggestions, activeIdx, query, router]);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubState('loading');
    try {
      const res = await fetch('/api/subscribe', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email }) });
      setSubState(res.ok ? 'done' : 'error');
    } catch { setSubState('error'); }
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_FAQ_SCHEMA) }} />
      <Navbar />
      <main className="min-h-screen">

        {/* ── HERO — full photo background, always white text ── */}
        <section className="relative min-h-[80vh] flex items-center justify-center text-center overflow-hidden">

          {/* Background photo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Dark overlay with slight red tint for brand feel */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-black/70" />

          {/* Content — always white on photo bg */}
          <div className="relative z-10 max-w-[900px] mx-auto px-4 sm:px-6 pt-24 pb-16">
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.55 }}>

              {/* Trust strip */}
              <div className="flex items-center justify-center gap-6 mb-6 flex-wrap">
                {[
                  { n: '160+', label: 'Destinations' },
                  { n: '54',   label: 'Free Guides' },
                  { n: '0',    label: 'Sponsored Posts' },
                  { n: '100%', label: 'Free Forever' },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-1.5">
                    <span className="text-base font-bold text-accent">{s.n}</span>
                    <span className="text-xs text-white/65">{s.label}</span>
                  </div>
                ))}
              </div>

              <h1 className="font-heading text-5xl sm:text-6xl font-bold text-white leading-tight tracking-tight mb-4">
                Your Free Guide to<br />
                <span className="text-accent">Every Destination</span>
              </h1>
              <p className="text-lg text-white/75 max-w-lg mx-auto mb-8 leading-relaxed">
                Honest travel guides for 160+ cities — things to do, best time, budgets and local tips. Always free.
              </p>

              {/* ── AUTOCOMPLETE SEARCH ── */}
              <div ref={searchRef} className="relative max-w-2xl mx-auto">
                <div className="relative">
                  <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={e => {
                      setQuery(e.target.value);
                      setShowDrop(e.target.value.length >= 2);
                      setActiveIdx(-1);
                    }}
                    onFocus={() => { if (query.length >= 2) setShowDrop(true); }}
                    onKeyDown={handleKeyDown}
                    placeholder="Search a destination…"
                    autoComplete="off"
                    className="w-full pl-12 pr-5 py-4 rounded-2xl text-base bg-white border-0 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all text-gray-800 placeholder:text-gray-400"
                    style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.25)' }}
                  />
                </div>

                {/* Dropdown */}
                {showDrop && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity:0, y:8 }}
                    animate={{ opacity:1, y:0 }}
                    exit={{ opacity:0, y:8 }}
                    transition={{ duration:0.15 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-2xl shadow-xl overflow-hidden z-50 text-left"
                    style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}
                  >
                    {suggestions.map((s, i) => (
                      <button
                        key={`${s.href}-${i}`}
                        onMouseDown={() => { router.push(s.href); setShowDrop(false); setQuery(''); }}
                        onMouseEnter={() => setActiveIdx(i)}
                        className={`w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors ${
                          i === activeIdx ? 'bg-accent/8' : 'hover:bg-surface'
                        } ${i > 0 ? 'border-t border-border/40' : ''}`}
                      >
                        <span className="text-lg flex-shrink-0">{s.city.flag}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-primary-text">
                            <Highlight text={s.label} query={query} />
                          </p>
                          <p className="text-xs text-muted">{s.sub}</p>
                        </div>
                        <ArrowRight size={13} className="text-muted/50 flex-shrink-0" />
                      </button>
                    ))}
                    <div className="px-5 py-2.5 border-t border-border/40 bg-surface">
                      <p className="text-xs text-muted">↑↓ Navigate · Enter to select · Esc to close</p>
                    </div>
                  </motion.div>
                )}

                {/* Trending chips — visible before user types */}
                {!query && (
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    <span className="text-xs text-white/50 self-center">Trending:</span>
                    {['Bali', 'Goa in Monsoon', 'Manali Road Trip', 'Udaipur Honeymoon', 'Ladakh', 'Europe Budget'].map(t => {
                      const city = allCities.find(c => c.name === t.split(' ')[0]);
                      return (
                        <Link key={t}
                          href={city ? `/cities/${city.slug}` : '/destinations'}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-white/25 hover:border-white/60 bg-white/10 backdrop-blur-sm transition-all text-white/80 hover:text-white hover:bg-white/20">
                          {city?.flag} {t}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── TOP PICKS ── (white bg content starts here) */}
        <section className="py-14">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-8">

            {/* Section header — "View all" on right */}
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Top Picks</p>
                <h2 className="font-heading text-3xl font-bold text-primary-text">Popular Destinations</h2>
                <p className="text-muted text-sm mt-1">Hand-picked places travellers love most right now</p>
              </div>
              <Link href="/destinations"
                className="text-sm font-medium text-accent hover:underline inline-flex items-center gap-1 flex-shrink-0 pb-1">
                View all destinations <ArrowRight size={13} />
              </Link>
            </div>

            {/* Destination card grid — image + name + supporting info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {featuredCities.map(city => (
                <Link
                  key={city.slug}
                  href={`/cities/${city.slug}`}
                  className="group relative block overflow-hidden rounded-[20px] bg-surface"
                  style={{ aspectRatio: '4/5' }}
                >
                  {/* Destination image */}
                  <SafeImage
                    src={getCityImageUrl(city.slug, 'card') ?? city.image}
                    alt={`${city.name} travel guide`}
                    city={city.slug}
                    accentColor={city.accentColor}
                    fill
                    sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gradient overlay — readable bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Bottom content — name + supporting info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white/60 text-[10px] font-semibold uppercase tracking-wider mb-0.5">
                      {city.flag} {city.country}
                    </p>
                    <h3 className="font-heading text-xl font-bold text-white leading-tight mb-1">
                      {city.name}
                    </h3>
                    {/* Supporting info — best time */}
                    {city.stats?.bestTime && (
                      <p className="text-white/65 text-xs">
                        Best: <span className="text-accent font-semibold">{city.stats.bestTime}</span>
                      </p>
                    )}
                  </div>

                  {/* Hover pill */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-white bg-accent rounded-full px-2.5 py-1">
                      Explore <ArrowRight size={9} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>


          </div>
        </section>

        {/* ── FEATURED TRAVEL GUIDES ── */}
        <section className="py-14 bg-surface">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Learn & Plan</p>
                <h2 className="font-heading text-3xl font-bold text-primary-text">Featured Travel Guides</h2>
              </div>
              <Link href="/blog" className="text-sm font-medium text-accent hover:underline flex items-center gap-1">
                All guides <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {guidePosts.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`}
                  className="group bg-white border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-accent/20 transition-all duration-300 flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://images.unsplash.com/${post.coverPhoto}?auto=format&fit=crop&w=600&h=400&q=80`}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent/90 text-white">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-semibold text-primary-text text-base leading-snug mb-2 group-hover:text-accent transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-2 flex-1">{post.excerpt}</p>
                    <div className="flex items-center gap-1 text-accent text-sm font-semibold">
                      Read More <ArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Compare moved to /compare page — not on homepage */}

        {/* ── NEWSLETTER ── subtle, not a neon billboard ── */}
        <section className="py-14 border-t border-border">
          <div className="max-w-xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-4">
              <Mail size={12} /> Free Weekly Guide
            </div>
            <h2 className="font-heading text-3xl font-bold text-primary-text mb-2">Travel smarter, not harder</h2>
            <p className="text-muted text-sm mb-6 max-w-sm mx-auto">Get the best destination guides, hidden gems and money-saving tips. No spam, ever.</p>
            {subState === 'done' ? (
              <p className="text-accent font-semibold">✓ You&apos;re in! Check your inbox.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" required
                  className="flex-1 px-4 py-3 rounded-xl text-sm border border-border bg-white text-primary-text focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40"
                />
                <button type="submit" disabled={subState === 'loading'}
                  className="px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition-colors flex items-center gap-2 justify-center flex-shrink-0">
                  {subState === 'loading' ? 'Subscribing…' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-14 bg-surface">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">FAQ</p>
              <h2 className="font-heading text-3xl font-bold text-primary-text">Common Travel Questions</h2>
            </div>
            <div className="space-y-3">
              {[
                { q:'Are TripGenius guides really free?', a:'Yes — every guide is completely free to read, with no paywalls or subscriptions. We\'re funded by affiliate links at no cost to you.' },
                { q:'How often are guides updated?', a:'We review guides regularly, especially when visa requirements or major conditions change. Each guide shows its last updated date.' },
                { q:'Best first international trip from India?', a:'Thailand and Bali are the most popular — visa on arrival, affordable, warm weather, excellent food. Dubai is also a top choice for easy visa access.' },
                { q:'Best time to travel internationally from India?', a:'October to March — avoids Indian summer heat, aligns with dry seasons in Southeast Asia, and catches Europe\'s shoulder season.' },
              ].map((faq, i) => (
                <div key={i} className={`border rounded-xl overflow-hidden transition-colors ${openFaq === i ? 'border-accent/30 bg-white' : 'border-border bg-white'}`}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left" aria-expanded={openFaq === i}>
                    <span className="font-semibold text-primary-text text-sm leading-snug">{faq.q}</span>
                    <ChevronDown size={15} className={`flex-shrink-0 text-muted transition-transform mt-0.5 ${openFaq === i ? 'rotate-180 text-accent' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 border-t border-border/50">
                      <p className="text-sm text-muted leading-relaxed pt-4">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
