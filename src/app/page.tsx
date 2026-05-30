'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, ArrowRight, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SafeImage from '@/components/SafeImage';
import { allCities } from '@/lib/cities';
import { getCityImageUrl } from '@/lib/cityImages';
import { AnimateList, AnimateItem } from '@/components/AnimateList';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
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
      <main style={{ background: '#07090f' }} className="min-h-screen">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden" style={{ height: '75vh', minHeight: 520 }}>

          <Image
            src="/globe.png"
            alt="Explore the world"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />

          {/* Top darkening so navbar reads */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-transparent" />
          {/* Bottom blend into card section */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07090f] via-[#07090f]/45 to-transparent" />
          {/* Side vignette to frame globe */}
          <div className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 75% 100% at 50% 50%, transparent 38%, rgba(7,9,15,0.72) 100%)' }} />

          {/* Centred content */}
          <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-2xl"
            >
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55 mb-4">
                Destination Guides
              </p>

              <h1
                className="font-heading font-bold leading-none tracking-tight drop-shadow-2xl"
                style={{ fontSize: 'clamp(3rem, 9vw, 6.5rem)' }}
              >
                <span className="text-white">Explore the </span>
                <span className="text-accent">World</span>
              </h1>

              <p className="mt-4 text-white/60 text-base drop-shadow-lg">
                Honest guides for every destination.
              </p>

              {/* ── Search with live dropdown ── */}
              <div ref={searchRef} className="relative mt-7 w-full max-w-lg mx-auto">
                <Search size={15}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50 z-10" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
                  onFocus={() => { if (query) setShowDropdown(true); }}
                  placeholder="Search a city or country…"
                  className="w-full pl-11 pr-4 py-4 bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/10 transition-all"
                />

                {/* Dropdown results */}
                {showDropdown && query.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-elevated border border-border rounded-2xl shadow-2xl z-50 overflow-hidden">
                    {dropdownItems.length > 0 ? (
                      <>
                        {dropdownItems.map((city, i) => (
                          <Link
                            key={city.slug}
                            href={`/cities/${city.slug}`}
                            onClick={() => { setQuery(''); setShowDropdown(false); }}
                            className={`flex items-center gap-3 px-4 py-3 hover:bg-surface transition-colors text-left ${
                              i < dropdownItems.length - 1 ? 'border-b border-border/40' : ''
                            }`}
                          >
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
                          <div className="px-4 py-2.5 text-center text-xs text-muted border-t border-border/40 bg-surface/50">
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
        </section>

        {/* ── Cities grid ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">

          <div className="flex items-center gap-3 mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted whitespace-nowrap">
              All Destinations
              {query && (
                <span className="text-primary-text ml-2">
                  · {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
                </span>
              )}
            </p>
            <div className="flex-1 h-px bg-border" />
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">🌍</p>
              <p className="text-muted text-sm">No cities found for &ldquo;{query}&rdquo;</p>
            </div>
          ) : (
            <AnimateList stagger={0.04}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((city) => (
                <AnimateItem key={city.slug} hover>
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
                </AnimateItem>
              ))}
            </AnimateList>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
