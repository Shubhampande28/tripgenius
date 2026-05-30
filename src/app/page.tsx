'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ArrowRight, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SafeImage from '@/components/SafeImage';
import { allCities } from '@/lib/cities';
import { getCityImageUrl } from '@/lib/cityImages';
import { AnimateList, AnimateItem } from '@/components/AnimateList';
import type { City } from '@/lib/types';

function CityCard({ city }: { city: City }) {
  return (
    <Link href={`/cities/${city.slug}`}
      className="group relative block rounded-2xl overflow-hidden h-56 sm:h-64">
      <SafeImage
        src={getCityImageUrl(city.slug, 'card') ?? city.image}
        alt={`${city.name} travel guide`}
        city={city.slug} accentColor={city.accentColor} fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="absolute top-3 left-3 text-xl drop-shadow-lg">{city.flag}</div>
      <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-[10px] font-semibold opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-300">
        Explore <ArrowRight size={9} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3.5">
        <p className="text-[9px] font-bold uppercase tracking-wider text-white/45 mb-0.5">{city.country}</p>
        <h3 className="font-heading text-lg font-bold text-white group-hover:text-accent transition-colors duration-200 leading-tight">
          {city.name}
        </h3>
        <p className="text-[11px] text-white/55 mt-0.5 italic line-clamp-1">{city.tagline}</p>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
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

  return (
    <>
      <Navbar />
      <main className="bg-dark min-h-screen">

        {/* ── Hero ── */}
        <div className="relative border-b border-border bg-surface overflow-hidden pt-28 pb-12">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-accent/7 blur-3xl" />
            <div className="absolute top-8 right-1/3 w-[280px] h-[280px] rounded-full bg-teal/4 blur-3xl" />
          </div>

          <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <h1 className="font-heading text-5xl sm:text-6xl font-semibold text-accent leading-tight tracking-tight">
                Explore the World
              </h1>
              <p className="mt-3 text-muted text-base">
                Honest guides for every destination.
              </p>
            </motion.div>

            {/* Search with live dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-7"
            >
              <div ref={searchRef} className="relative max-w-sm mx-auto">
                <Search size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted z-10" />
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
                  className="w-full pl-11 pr-4 py-3.5 bg-elevated border border-border rounded-2xl text-sm text-primary-text placeholder:text-muted/50 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-all"
                />

                {/* Dropdown */}
                {showDropdown && query.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-elevated border border-border rounded-2xl shadow-2xl z-50 overflow-hidden text-left">
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
          </div>
        </div>

        {/* ── City cards grid ── */}
        <div ref={resultsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted whitespace-nowrap">
              All Destinations
              {query && <span className="text-primary-text ml-2">· {filtered.length} {filtered.length === 1 ? 'result' : 'results'}</span>}
            </p>
            <div className="flex-1 h-px bg-border" />
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">🌍</p>
              <p className="text-muted text-sm">No cities found for &ldquo;{query}&rdquo;</p>
            </div>
          ) : query ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((city) => <CityCard key={city.slug} city={city} />)}
            </div>
          ) : (
            <AnimateList stagger={0.04}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((city) => (
                <AnimateItem key={city.slug} hover>
                  <CityCard city={city} />
                </AnimateItem>
              ))}
            </AnimateList>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
