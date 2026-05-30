'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Wallet } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { allCities } from '@/lib/cities';
import { getCityImageUrl } from '@/lib/cityImages';
import { AnimateList, AnimateItem } from '@/components/AnimateList';

const FEATURED_SLUGS = ['bali', 'paris', 'tokyo', 'dubai'];

const REGION_TABS = ['All', 'India', 'International'] as const;
type Region = typeof REGION_TABS[number];

const vibeColors: Record<string, string> = {
  Spiritual:   'bg-gold/15 text-gold border-gold/20',
  Romantic:    'bg-pink-500/15 text-pink-400 border-pink-400/20',
  Adventure:   'bg-accent/15 text-accent border-accent/20',
  Cultural:    'bg-purple-500/15 text-purple-400 border-purple-400/20',
  Foodie:      'bg-orange-500/15 text-orange-400 border-orange-400/20',
  Luxury:      'bg-gold/15 text-gold border-gold/20',
  Beach:       'bg-teal/15 text-teal border-teal/20',
  Bohemian:    'bg-pink-500/15 text-pink-400 border-pink-400/20',
  Modern:      'bg-blue-500/15 text-blue-400 border-blue-400/20',
  Nature:      'bg-green-500/15 text-green-400 border-green-400/20',
};

function getRegion(country: string): Region {
  if (country === 'India') return 'India';
  return 'International';
}

export default function CitiesPage() {
  const [query, setQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState<Region>('All');

  const featured = useMemo(
    () => allCities.filter((c) => FEATURED_SLUGS.includes(c.slug)),
    []
  );

  const filtered = useMemo(() => {
    return allCities.filter((city) => {
      const matchesQuery =
        query.length === 0 ||
        city.name.toLowerCase().includes(query.toLowerCase()) ||
        city.country.toLowerCase().includes(query.toLowerCase());
      const matchesRegion =
        activeRegion === 'All' || getRegion(city.country) === activeRegion;
      return matchesQuery && matchesRegion;
    });
  }, [query, activeRegion]);

  const showFeatured = query.length === 0 && activeRegion === 'All';

  return (
    <>
      <Navbar />
      <main className="bg-dark min-h-screen">

        {/* ── Hero ── */}
        <div className="relative overflow-hidden border-b border-border bg-surface pt-28 pb-14">
          {/* Dual radial glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-accent/8 blur-3xl" />
            <div className="absolute top-10 right-1/4 w-[300px] h-[300px] rounded-full bg-teal/5 blur-3xl" />
          </div>

          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-4">
                Destination Guides
              </p>
              <h1 className="font-heading text-5xl sm:text-6xl font-semibold text-primary-text leading-[1.1] tracking-tight">
                Every City.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-gold">One Honest Guide.</span>
              </h1>
              <p className="mt-5 text-muted text-base max-w-md mx-auto leading-relaxed">
                From ancient temples to rooftop beach clubs — guides written for real travellers, not algorithms.
              </p>
            </motion.div>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-8 relative max-w-md mx-auto"
            >
              <Search size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a city or country…"
                className="w-full pl-11 pr-4 py-3.5 bg-elevated border border-border rounded-2xl text-sm text-primary-text placeholder:text-muted/50 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-all"
              />
            </motion.div>

            {/* Region tabs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.28 }}
              className="mt-4 flex justify-center gap-2 flex-wrap"
            >
              {REGION_TABS.map((region) => (
                <button
                  key={region}
                  onClick={() => setActiveRegion(region)}
                  className={`px-5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                    activeRegion === region
                      ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20'
                      : 'bg-transparent border-border text-muted hover:border-accent/40 hover:text-primary-text'
                  }`}
                >
                  {region}
                </button>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* ── Featured destinations ── */}
          {showFeatured && featured.length > 0 && (
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Popular Destinations</p>
                <div className="flex-1 h-px bg-gradient-to-r from-accent/30 to-transparent" />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {featured.map((city, i) => (
                  <motion.div
                    key={city.slug}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link href={`/cities/${city.slug}`} className="group relative block rounded-2xl overflow-hidden h-64 sm:h-72">
                      <SafeImage
                        src={getCityImageUrl(city.slug, 'card') ?? city.image}
                        alt={`${city.name} travel guide`}
                        city={city.slug}
                        accentColor={city.accentColor}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-107"
                      />
                      {/* Cinematic overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                      {/* Flag */}
                      <div className="absolute top-3.5 left-3.5 text-xl drop-shadow-lg">{city.flag}</div>
                      {/* Hover arrow pill */}
                      <div className="absolute top-3.5 right-3.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-[10px] font-semibold opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                        Explore <ArrowRight size={10} />
                      </div>
                      {/* City info */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-[10px] font-medium text-white/55 mb-0.5 uppercase tracking-wider">{city.country}</p>
                        <h3 className="font-heading text-xl font-bold text-white group-hover:text-accent transition-colors duration-200">
                          {city.name}
                        </h3>
                        <p className="text-xs text-white/60 mt-1 line-clamp-1 italic">{city.tagline}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* ── All cities grid ── */}
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">🌍</p>
              <p className="text-muted text-sm">No cities found for &ldquo;{query}&rdquo;</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                  {showFeatured ? 'All Destinations' : `${filtered.length} ${filtered.length === 1 ? 'city' : 'cities'}${activeRegion !== 'All' ? ` · ${activeRegion}` : ''}${query ? ` matching "${query}"` : ''}`}
                </p>
                <div className="flex-1 h-px bg-border" />
              </div>

              <AnimateList stagger={0.04} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((city) => (
                  <AnimateItem key={city.slug} hover>
                    <Link
                      href={`/cities/${city.slug}`}
                      className="group block rounded-2xl overflow-hidden border border-border bg-surface hover:border-accent/30 transition-all duration-300 h-full"
                    >
                      {/* Image with overlaid name */}
                      <div className="relative h-52 overflow-hidden">
                        <SafeImage
                          src={getCityImageUrl(city.slug, 'card') ?? city.image}
                          alt={`${city.name} travel guide`}
                          city={city.slug}
                          accentColor={city.accentColor}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                        {/* Flag */}
                        <div className="absolute top-3 left-3 text-lg drop-shadow">{city.flag}</div>
                        {/* Hover arrow */}
                        <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/35 backdrop-blur-sm border border-white/15 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                          <ArrowRight size={12} className="text-white" />
                        </div>
                        {/* City name on image */}
                        <div className="absolute bottom-0 left-0 right-0 p-3.5">
                          <p className="text-[9px] font-semibold uppercase tracking-wider text-white/50 mb-0.5">{city.country}</p>
                          <h3 className="font-heading text-[17px] font-bold text-white group-hover:text-accent transition-colors duration-200 leading-tight">
                            {city.name}
                          </h3>
                        </div>
                      </div>

                      {/* Bottom strip */}
                      <div className="px-3.5 py-2.5 flex items-center gap-1.5 border-t border-border/50">
                        {city.vibes.slice(0, 2).map((v) => (
                          <span
                            key={v}
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${vibeColors[v] || 'bg-elevated text-muted border-border'}`}
                          >
                            {v}
                          </span>
                        ))}
                        <div className="ml-auto flex items-center gap-1 text-[10px] text-muted">
                          <Wallet size={9} />
                          <span>{city.stats.budget.split('/')[0]}/day</span>
                        </div>
                      </div>
                    </Link>
                  </AnimateItem>
                ))}
              </AnimateList>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
