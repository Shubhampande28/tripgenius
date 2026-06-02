'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ArrowRight, MapPin, Globe, BookOpen, Star, Mail, TrendingUp, ChevronDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SafeImage from '@/components/SafeImage';
import { allCities } from '@/lib/cities';
import { getCityImageUrl } from '@/lib/cityImages';
import { AnimateList, AnimateItem } from '@/components/AnimateList';
import type { City } from '@/lib/types';

const HOME_FAQS = [
  {
    q: 'Are TripGenius travel guides really free?',
    a: 'Yes — every guide on TripGenius is completely free to read, with no paywalls or subscription fees. We are funded by advertising and affiliate links, which means you never pay for the content.',
  },
  {
    q: 'How often are the travel guides updated?',
    a: 'We review and update our guides regularly — particularly when visa requirements, entry conditions, or major travel advisories change. Every guide shows a "last updated" date. For critical information like visa requirements, we always recommend cross-checking with official government sources before you travel.',
  },
  {
    q: 'What is the best travel destination for first-time international travellers from India?',
    a: 'Thailand (Bangkok and Phuket) and Bali, Indonesia are the most popular first international destinations for Indian travellers. Both offer visa on arrival, affordable prices, warm weather, excellent food, and well-developed tourist infrastructure. Dubai is also a popular first international trip with easy visa access for Indians and world-class facilities.',
  },
  {
    q: 'Which is the best time to travel internationally from India?',
    a: 'October to March is the best window for most international destinations — it avoids India\'s summer heat, aligns with dry seasons in Southeast Asia, and catches Europe\'s shoulder season (cheaper than July-August). December-January is peak season globally, so book flights and accommodation well in advance if travelling then.',
  },
  {
    q: 'How do I plan a trip on a budget?',
    a: 'The biggest savings come from: (1) Booking flights 6-8 weeks ahead and being flexible on travel dates, (2) Choosing accommodation slightly outside the tourist centre, (3) Eating where locals eat rather than tourist-facing restaurants, (4) Using public transport instead of taxis, (5) Visiting free attractions — most cities have world-class free museums, parks, and viewpoints. Our city guides include a full budget breakdown for each destination.',
  },
  {
    q: 'Do I need travel insurance?',
    a: 'Travel insurance is strongly recommended for any international trip. A good policy covers trip cancellation, medical emergencies abroad (which can be extremely expensive without coverage), lost baggage, and flight delays. In some countries like the Schengen Area, travel insurance is a visa requirement. Compare policies on comparison sites and ensure your policy covers any adventure activities you plan to do.',
  },
];

const HOME_FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: HOME_FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};
const POPULAR_CHIPS = ['Bali', 'Paris', 'Tokyo', 'Goa', 'Bangkok', 'Dubai', 'Singapore', 'Jaipur'];

const STATS = [
  { icon: Globe, value: '160+', label: 'Destinations' },
  { icon: BookOpen, value: '100%', label: 'Free Guides' },
  { icon: Star, value: 'Honest', label: 'No Paid Bias' },
  { icon: TrendingUp, value: '2025', label: 'Always Updated' },
];

// Featured cities shown as large editorial cards
const FEATURED_SLUGS = ['bali', 'paris', 'tokyo', 'goa', 'delhi', 'dubai'];

// Region-based browsing — instead of dumping 160 cities in one flat grid
const REGIONS = [
  { label: 'All', value: 'all' },
  { label: '🇮🇳 India', value: 'India' },
  { label: '🌏 Asia', value: 'Asia' },
  { label: '🌍 Europe', value: 'Europe' },
  { label: '🌎 Americas', value: 'Americas' },
];

// Premium city card — shows best time + things to do count + vibe
// Referenced: Airbnb card anatomy, Google Travel destination cards
function CityCard({ city, featured = false }: { city: City; featured?: boolean }) {
  const thingsCount = city.thingsToDo?.length ?? 0;
  const firstVibe = city.vibes?.[0];

  return (
    <Link
      href={`/cities/${city.slug}`}
      className={`group relative block rounded-2xl overflow-hidden ${
        featured ? 'h-80 sm:h-96' : 'h-56 sm:h-64'
      }`}
    >
      <SafeImage
        src={getCityImageUrl(city.slug, 'card') ?? city.image}
        alt={`${city.name}, ${city.country} travel guide — things to do, best time to visit`}
        city={city.slug} accentColor={city.accentColor} fill
        sizes={featured
          ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
          : '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Gradient — stronger at bottom for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/10" />

      {/* Top: vibe tag */}
      {firstVibe && (
        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/80">
            {firstVibe}
          </span>
        </div>
      )}

      {/* Top right: things to do count */}
      {thingsCount > 0 && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-accent text-white">
            {thingsCount} things to do
          </span>
        </div>
      )}

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        {/* Best time badge — KEY info users want */}
        {city.stats?.bestTime && (
          <div className="flex items-center gap-1 mb-2">
            <span className="text-[10px] text-white/60">Best:</span>
            <span className="text-[10px] font-semibold text-accent">{city.stats.bestTime}</span>
          </div>
        )}

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-0.5">
              {city.flag} {city.country}
            </p>
            <h3 className={`font-heading font-bold text-white group-hover:text-accent transition-colors duration-200 leading-tight ${
              featured ? 'text-2xl' : 'text-lg'
            }`}>
              {city.name}
            </h3>
            {featured && (
              <p className="text-[11px] text-white/55 mt-1 italic line-clamp-1">{city.tagline}</p>
            )}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-300 flex-shrink-0">
            <span className="text-xs text-white/70 font-medium">Explore</span>
            <ArrowRight size={12} className="text-accent" />
          </div>
        </div>
      </div>
    </Link>
  );
}

// Region-based city browser — replaces flat grid dump
function RegionBrowser() {
  const [activeRegion, setActiveRegion] = useState<string>('all');

  const regionCities = useMemo(() => {
    if (activeRegion === 'all') return allCities.filter(c => !c.stub).slice(0, 24);
    if (activeRegion === 'India') return allCities.filter(c => c.country === 'India' && !c.stub);
    if (activeRegion === 'Asia') return allCities.filter(c =>
      ['Indonesia','Thailand','Japan','Singapore','South Korea','Vietnam','Malaysia','Philippines','China','Hong Kong','Taiwan','Maldives','Nepal','Sri Lanka'].includes(c.country) && !c.stub
    );
    if (activeRegion === 'Europe') return allCities.filter(c =>
      ['France','Italy','Spain','United Kingdom','Netherlands','Czech Republic','Portugal','Greece','Hungary','Germany','Austria','Switzerland','Sweden','Norway'].includes(c.country) && !c.stub
    );
    if (activeRegion === 'Americas') return allCities.filter(c =>
      ['United States','Brazil','Argentina','Mexico','Peru','Colombia','Canada'].includes(c.country) && !c.stub
    );
    return allCities.filter(c => !c.stub).slice(0, 24);
  }, [activeRegion]);

  return (
    <div>
      {/* Section header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted mb-1">Browse by Region</p>
          <h2 className="font-heading text-2xl font-semibold text-primary-text">All destinations</h2>
        </div>
        <Link href="/destinations" className="text-sm text-accent hover:underline flex items-center gap-1 hidden sm:flex">
          Full list <ArrowRight size={12} />
        </Link>
      </div>

      {/* Region tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {REGIONS.map(r => (
          <button
            key={r.value}
            onClick={() => setActiveRegion(r.value)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeRegion === r.value
                ? 'bg-accent text-white'
                : 'bg-surface border border-border text-muted hover:border-accent/40 hover:text-primary-text'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* City grid */}
      <AnimateList stagger={0.03} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {regionCities.map(city => (
          <AnimateItem key={city.slug} hover>
            <CityCard city={city} />
          </AnimateItem>
        ))}
      </AnimateList>

      {regionCities.length === 0 && (
        <p className="text-muted text-center py-12">No cities found in this region yet.</p>
      )}

      <div className="mt-8 text-center">
        <Link href="/destinations"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border hover:border-accent/40 text-sm font-medium text-muted hover:text-accent transition-all">
          View all 160+ destinations <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [email, setEmail] = useState('');
  const [subState, setSubState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const filtered = useMemo(() => {
    if (!query) return allCities;
    const q = query.toLowerCase();
    return allCities.filter(
      (c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
    );
  }, [query]);

  const dropdownItems = useMemo(() => filtered.slice(0, 8), [filtered]);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubState('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSubState(res.ok ? 'done' : 'error');
    } catch {
      setSubState('error');
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">

        {/* ── Hero ── */}
        <div className="hero-bg relative overflow-hidden pt-28 pb-20">
          <div className="hero-glow pointer-events-none absolute inset-0">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full bg-accent/8 blur-3xl" />
            <div className="absolute top-8 right-1/4 w-[350px] h-[350px] rounded-full bg-blue-500/6 blur-3xl" />
            <div className="absolute top-20 left-1/4 w-[250px] h-[250px] rounded-full bg-teal/5 blur-3xl" />
          </div>
          <div className="hero-bottom-fade pointer-events-none absolute bottom-0 left-0 right-0 h-24" />

          <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              {/* Trust signal — above the fold, before the headline */}
              <div className="flex items-center justify-center gap-2 mb-5">
                <div className="flex -space-x-1.5">
                  {['🇮🇳','🌏','🌍','🌎'].map(f => (
                    <span key={f} className="text-base w-7 h-7 rounded-full border-2 border-white/20 bg-black/20 flex items-center justify-center">{f}</span>
                  ))}
                </div>
                <span className="hero-popular-label text-xs font-medium">
                  Trusted by 50,000+ travelers
                </span>
              </div>

              {/* H1 — keyword-rich, not decorative */}
              <h1 className="font-heading text-5xl sm:text-6xl font-semibold leading-tight tracking-tight">
                <span className="hero-title">Free Travel Guides for </span>
                <span className="text-accent">India & the World</span>
              </h1>
              <p className="hero-subtitle mt-3 text-base max-w-lg mx-auto">
                160+ destinations. Best time to visit, things to do, budget breakdown, and hidden gems — all free.
              </p>
            </motion.div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-7"
            >
              <div ref={searchRef} className="relative max-w-sm mx-auto">
                <Search size={15} className="hero-search-icon pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 z-10" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowDropdown(true);
                    if (e.target.value) {
                      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                    }
                  }}
                  onFocus={() => { if (query) setShowDropdown(true); }}
                  placeholder="Search a city or country…"
                  className="hero-search w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                />
                {showDropdown && query.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-elevated border border-border rounded-2xl z-50 overflow-hidden text-left shadow-xl">
                    {dropdownItems.length > 0 ? (
                      <>
                        {dropdownItems.map((city, i) => (
                          <Link key={city.slug} href={`/cities/${city.slug}`}
                            onClick={() => { setQuery(''); setShowDropdown(false); }}
                            className={`flex items-center gap-3 px-4 py-3 hover:bg-surface transition-colors ${i < dropdownItems.length - 1 ? 'border-b border-border/40' : ''}`}>
                            <span className="text-xl flex-shrink-0">{city.flag}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-primary-text">{city.name}</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <MapPin size={9} className="text-muted" />
                                <p className="text-xs text-muted">{city.country}</p>
                              </div>
                            </div>
                            <ArrowRight size={12} className="text-muted/50 flex-shrink-0" />
                          </Link>
                        ))}
                        {filtered.length > 8 && (
                          <div className="px-4 py-2.5 text-center text-xs text-muted border-t border-border/40">
                            {filtered.length - 8} more results below ↓
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="px-4 py-6 text-center text-muted text-sm">
                        No cities found for &ldquo;{query}&rdquo;
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Popular chips */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-5 flex flex-wrap justify-center gap-2"
            >
              <span className="hero-popular-label text-xs self-center">Popular:</span>
              {POPULAR_CHIPS.map((name) => {
                const city = allCities.find(c => c.name === name);
                if (!city) return null;
                return (
                  <Link key={name} href={`/cities/${city.slug}`}
                    className="hero-chip flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all duration-200">
                    <span>{city.flag}</span>
                    <span>{name}</span>
                  </Link>
                );
              })}
            </motion.div>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="mt-8 flex justify-center gap-6 sm:gap-10"
            >
              {STATS.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex flex-col items-center gap-0.5">
                  <Icon size={14} className="text-accent/70" />
                  <p className="hero-stat-val font-heading text-base font-bold">{value}</p>
                  <p className="hero-stat-label text-[10px] uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── Destinations ── */}
        <div ref={resultsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Search results */}
          {query ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted whitespace-nowrap">
                  {filtered.length} {filtered.length === 1 ? 'result' : 'results'} for &ldquo;{query}&rdquo;
                </p>
                <div className="flex-1 h-px bg-border" />
              </div>
              {filtered.length === 0 ? (
                <div className="text-center py-24">
                  <p className="text-5xl mb-4">🌍</p>
                  <p className="text-muted text-sm">No cities found for &ldquo;{query}&rdquo;</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filtered.map((city) => <CityCard key={city.slug} city={city} />)}
                </div>
              )}
            </>
          ) : (
            <>
              {/* ── Featured destinations (editorial, not a dump) ── */}
              <div className="mb-12">
                <div className="flex items-end justify-between mb-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Editor&apos;s Picks</p>
                    <h2 className="font-heading text-2xl font-semibold text-primary-text">Top destinations right now</h2>
                  </div>
                  <Link href="/destinations" className="text-sm text-accent hover:underline flex items-center gap-1">
                    View all <ArrowRight size={12} />
                  </Link>
                </div>

                {/* 2-column editorial grid: 1 large + 2 stacked on desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {FEATURED_SLUGS.slice(0, 6).map((slug, i) => {
                    const city = allCities.find(c => c.slug === slug);
                    if (!city) return null;
                    return (
                      <AnimateItem key={slug} hover>
                        <CityCard city={city} featured={i === 0} />
                      </AnimateItem>
                    );
                  })}
                </div>
              </div>

              {/* ── Region tabs ── */}
              <RegionBrowser />
            </>
          )}
        </div>

        {/* ── FAQ Section ── */}
        <div className="border-t border-border">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_FAQ_SCHEMA) }}
          />
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
            <div className="text-center mb-10">
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">FAQ</p>
              <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-primary-text">
                Common travel questions
              </h2>
              <p className="mt-2 text-muted text-sm">Everything you need to plan a great trip.</p>
            </div>
            <div className="space-y-3">
              {HOME_FAQS.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={i} className={`border rounded-xl overflow-hidden transition-colors duration-200 ${isOpen ? 'border-accent/30 bg-elevated' : 'border-border'}`}>
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="font-semibold text-primary-text text-sm leading-snug">{faq.q}</span>
                      <ChevronDown size={16} className={`flex-shrink-0 text-muted transition-transform duration-300 mt-0.5 ${isOpen ? 'rotate-180 text-accent' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 border-t border-border/50">
                        <p className="text-sm text-muted leading-relaxed pt-4">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Newsletter CTA ── */}
        <div className="border-t border-border">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-4">
                <Mail size={12} /> Free Travel Tips
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-primary-text">
                Travel smarter, not harder
              </h2>
              <p className="mt-3 text-muted text-sm max-w-md mx-auto">
                Get curated city guides, hidden gems, and money-saving tips delivered to your inbox. No spam — ever.
              </p>

              {subState === 'done' ? (
                <div className="mt-8 flex items-center justify-center gap-2 text-teal font-medium">
                  <span className="text-xl">✓</span> You&apos;re in! Check your inbox.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 px-4 py-3 bg-elevated border border-border rounded-xl text-sm text-primary-text placeholder:text-muted/50 focus:outline-none focus:border-accent/60 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={subState === 'loading'}
                    className="px-5 py-3 bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-60 whitespace-nowrap"
                  >
                    {subState === 'loading' ? 'Subscribing…' : 'Get Free Tips'}
                  </button>
                </form>
              )}
              {subState === 'error' && (
                <p className="mt-3 text-red-400 text-xs">Something went wrong. Please try again.</p>
              )}
              <p className="mt-3 text-muted/50 text-xs">Join thousands of travellers. Unsubscribe anytime.</p>
            </motion.div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
